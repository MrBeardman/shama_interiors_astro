/**
 * Motion engine and shared behaviour for every page.
 * Without JS everything is visible (hidden states are scoped to html.js). With reduced motion nothing is hidden and
 * nothing is scroll-linked (see the media queries in site.css). Scroll-linked values set `transform` directly on the
 * moving element and that element carries a short CSS transition, so wheel steps glide instead of snapping.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const updates: (() => void)[] = [];

(window as unknown as { __si: number }).__si = 1;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const loadNow = (img: HTMLImageElement) => {
  img.loading = 'eager';
  return img.decode().catch(() => undefined);
};

/* 0. Photos load ahead of time. Chrome never starts native lazy loading for a fully clipped image, so hidden frames
      would only begin downloading once their wipe had started. The gallery sits in a clipped track: load it after the page. */
function initPreload() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
      }),
    { rootMargin: '1400px 0px' },
  );
  $$('.fr:not([data-hs] .fr)').forEach((fr) => io.observe(fr));
  const gallery = () => $$<HTMLImageElement>('[data-hs] img').forEach((img) => (img.loading = 'eager'));
  if (document.readyState === 'complete') gallery();
  else addEventListener('load', gallery, { once: true });
}

/* 1. Reveals. Top rootMargin is huge so anything already scrolled past counts as seen (anchor jumps, long jumps). */
function initReveal() {
  const els = $$('[data-rv]');
  const done = (el: HTMLElement) => el.removeAttribute('data-rv');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      el.classList.add('in');
      done(el);
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        // A photo reveal waits for its decoded photo (briefly), so a frame never wipes open empty.
        const img = el.dataset.rv === 'clip' || el.dataset.rv === 'iris' ? el.querySelector('img') : null;
        const ready = img ? Promise.race([loadNow(img), wait(900)]) : Promise.resolve();
        void ready.then(() => {
          el.classList.add('in');
          // The attribute goes once played, so reveal transitions no longer override an element's own (hover etc.).
          window.setTimeout(() => done(el), 2600);
        });
      }),
    { rootMargin: '100000px 0px -8% 0px', threshold: 0.04 },
  );
  els.forEach((el) => io.observe(el));
}

/* 2. Header: veil once scrolled, hides going down, returns going up. Drawer on small screens. */
function initHeader() {
  const hd = document.querySelector<HTMLElement>('[data-header]');
  if (!hd) return;
  let last = scrollY;
  updates.push(() => {
    const y = scrollY;
    hd.classList.toggle('is-scrolled', y > 12);
    if (Math.abs(y - last) < 5) return;
    hd.classList.toggle(
      'is-hidden',
      y > last && y > 420 && !document.documentElement.classList.contains('drawer-open'),
    );
    last = y;
  });
  const burger = hd.querySelector<HTMLButtonElement>('[data-burger]');
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  if (!burger || !drawer) return;
  const set = (open: boolean) => {
    document.documentElement.classList.toggle('drawer-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', (open ? burger.dataset.close : burger.dataset.open) ?? '');
    drawer.inert = !open;
  };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      set(false);
      burger.focus();
    }
  });
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && set(false));
}

/* 3. Home hero: pointing at or focusing a row brings its photo forward (the old site's idea). Touch keeps the first. */
function initHero() {
  const rows = $$('[data-hero-row]');
  const imgs = $$('[data-hero-img]');
  if (!rows.length) return;
  const show = (i: number) => imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
  rows.forEach((row, i) => {
    if (fine) row.addEventListener('pointerenter', () => show(i));
    row.addEventListener('focus', () => show(i));
  });
}

/* 4. Parallax inside a frame: the photo is overscanned 8 % and drifts within it, never showing an edge. */
function initParallax() {
  if (reduce) return;
  const items = $$('[data-par]').filter((el) => !el.closest('[data-hs]'));
  updates.push(() => {
    const vh = innerHeight;
    for (const el of items) {
      const box = (el.parentElement as HTMLElement).getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) continue;
      const t = clamp((box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2), -1, 1);
      el.style.transform = `translate3d(0,${(-t * box.height * 0.075).toFixed(1)}px,0)`;
    }
  });
}

/* 5. Pinned gallery: vertical scroll drives the track sideways. Falls back to a plain grid (see site.css). */
function initGallery() {
  const sec = document.querySelector<HTMLElement>('[data-hs]');
  if (!sec || reduce) return;
  const track = sec.querySelector<HTMLElement>('[data-hs-track]')!;
  const bar = sec.querySelector<HTMLElement>('[data-hs-bar]')!;
  const pars = $$('[data-par]', sec);
  const mq = matchMedia('(min-width: 1000px) and (min-height: 600px)');
  let dist = 0;
  const layout = () => {
    sec.classList.toggle('is-pinned', mq.matches);
    if (!mq.matches) {
      sec.style.height = '';
      track.style.transform = '';
      pars.forEach((p) => (p.style.transform = ''));
      return;
    }
    dist = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.height = `${innerHeight + dist}px`;
  };
  layout();
  addEventListener('resize', layout);
  mq.addEventListener('change', layout);
  updates.push(() => {
    if (!mq.matches) return;
    const r = sec.getBoundingClientRect();
    if (r.bottom < -100 || r.top > innerHeight + 100) return;
    const p = clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight));
    track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    for (const el of pars) {
      const b = (el.parentElement as HTMLElement).getBoundingClientRect();
      const t = clamp((b.left + b.width / 2 - innerWidth / 2) / (innerWidth / 2 + b.width / 2), -1, 1);
      el.style.transform = `translate3d(${(-t * b.width * 0.07).toFixed(1)}px,0,0)`;
    }
  });
  // Keyboard: a focused card off to the side would stay hidden in the clipped track, so scroll the page to it.
  track.addEventListener('focusin', (e) => {
    if (!mq.matches) return;
    const card = (e.target as HTMLElement).closest<HTMLElement>('a');
    if (!card) return;
    const x = card.offsetLeft + card.offsetWidth / 2 - innerWidth / 2;
    scrollTo({
      top: scrollY + sec.getBoundingClientRect().top + clamp(x / Math.max(1, dist)) * (sec.offsetHeight - innerHeight),
    });
  });
}

/* 6. Words light up as a paragraph scrolls through. */
function initLit() {
  for (const box of $$('[data-lit]')) {
    const words = $$('.lw', box);
    if (reduce) {
      words.forEach((w) => w.classList.add('on'));
      continue;
    }
    let lit = 0;
    updates.push(() => {
      const r = box.getBoundingClientRect();
      const vh = innerHeight;
      const n = Math.round(clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3)) * words.length);
      if (n === lit) return;
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      lit = n;
    });
  }
}

/* 7. Timeline: the line draws with scroll, each dot fills as the line reaches it. */
function initTimeline() {
  for (const tl of $$('[data-tl]')) {
    const line = tl.querySelector<HTMLElement>('[data-tl-line]')!;
    const steps = $$('[data-tl-step]', tl);
    if (reduce) {
      steps.forEach((s) => s.classList.add('on'));
      continue;
    }
    updates.push(() => {
      const r = tl.getBoundingClientRect();
      const p = clamp((innerHeight * 0.62 - r.top) / r.height);
      line.style.transform = `scaleY(${p.toFixed(4)})`;
      steps.forEach((s) => s.classList.toggle('on', s.offsetTop / tl.offsetHeight <= p + 0.001));
    });
  }
}

/* 8. Stacked cards: each card settles back a little as the next one slides over it (desktop). */
function initStack() {
  const cards = $$('[data-stack]');
  if (!cards.length || reduce) return;
  const mq = matchMedia('(min-width: 1000px) and (min-height: 700px)');
  updates.push(() => {
    cards.forEach((card, i) => {
      const inner = card.firstElementChild as HTMLElement;
      const next = cards[i + 1];
      if (!mq.matches || !next) {
        inner.style.transform = '';
        return;
      }
      const gap = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
      inner.style.transform = `scale(${(1 - 0.045 * (1 - clamp(gap / (innerHeight * 0.7)))).toFixed(4)})`;
    });
  });
}

/* 9. Closing band grows from an inset panel to edge to edge as it arrives. */
function initBand() {
  const bands = $$('[data-band]');
  if (reduce) return;
  updates.push(() => {
    for (const el of bands) {
      // Set from page load on: clip-path cannot animate from `none`, so a late first value would snap.
      const r = el.getBoundingClientRect();
      const q = 1 - clamp((innerHeight - r.top) / (innerHeight * 0.72));
      // Stays inside the page gutter, so the panel edge never reaches the text.
      const side = q * Math.min(innerWidth * 0.03, 40);
      el.style.clipPath = `inset(${(q * 44).toFixed(1)}px ${side.toFixed(1)}px round ${(q * 18).toFixed(1)}px)`;
    }
  });
}

/* 10. Count-up, once. The HTML holds the final number, so no-JS and reduced motion just show it. */
function initCount() {
  const els = $$('[data-count]');
  if (reduce || !els.length) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = Number(el.dataset.count);
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = clamp((t - t0) / 1500);
          el.textContent = String(Math.round((1 - Math.pow(1 - k, 4)) * to));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.5 },
  );
  els.forEach((el) => {
    el.textContent = '0';
    io.observe(el);
  });
}

/* 11. Marquees rest while off screen. */
function initLive() {
  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.target as HTMLElement).classList.toggle('is-paused', !e.isIntersecting)),
  );
  $$('[data-live]').forEach((el) => io.observe(el));
}

/* 12. One scroll loop for everything scroll-linked. */
function initLoop() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (bar && !reduce) {
    updates.push(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max).toFixed(4) : 0})`;
    });
  }
  let queued = false;
  const run = () => {
    queued = false;
    updates.forEach((u) => u());
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('load', queue);
  run();
}

initPreload();
initReveal();
initHeader();
initHero();
initParallax();
initGallery();
initLit();
initTimeline();
initStack();
initBand();
initCount();
initLive();
initLoop();
