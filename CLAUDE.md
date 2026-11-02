# CLAUDE.md: Schama Interiors website

Rebuild of **schamainteriors.es** (Jana Schama's interior design studio; WordPress + Elementor + TranslatePress) in
Astro, on the Alture marketing-site stack (`astro-marketing-site` skill). Local only so far: not deployed, no git repo.

Read `docs/BRAND.md` and `docs/STATUS.md` next (new copy awaiting approval, typo fixes, open questions).

## Commands
```
npm run dev        # dev server
npm run build      # must pass
npm run preview    # serves dist on http://127.0.0.1:4418
npm run format / check:format
npm run media      # scrape/orig -> public/media + src/data/media.json
```

## Structure
- `src/pages/**` route files only pass `lang`; EN at the root, ES under `/es/`, URLs as on the old site.
- `src/templates/*.astro` one template per page, all languages. Home sections in `src/components/home/NN-*.astro`.
- `src/components/ui/`: `Frame` (revealing photo frame with inner parallax), `Photo` (srcset from media.json), `Lines`
  (word mask reveal), `Lit` (scroll-lit words), `Swash` (drawn flourish), `Marquee`, `Price` (count-up), `Band` (closing
  band), `ProjectCard`.
- `src/i18n/*.json` texts `{ en, es }`; `src/data/projects.ts` the 7 projects (titles, photos, alt texts).
- `src/styles/site.css` tokens and reveal states; `src/scripts/site.ts` the motion engine (one scroll loop).
- `scrape/` raw download of the old site (git-ignored): `rendered.txt` is the readable content dump.

## Decisions
- Purely static, no `@astrojs/node`: the old site has no contact form, so the skill's `/api/contact` is left out.
- Home keeps the old idea (menu rows swap the photo on hover, same 5 photos) and adds sections built from existing copy.
- No cookie banner: no cookies, analytics or third-party requests on the new site.
- Hidden reveal states exist only under `html.js` and `prefers-reduced-motion: no-preference`.

## Gotchas
- `clip-path` cannot animate to `none`: revealed elements rest on an explicit end shape (`inset(0)`, `circle(...)`).
- Scroll-linked elements set `transform` directly and carry a short CSS transition, so wheel steps glide.
- Pinned gallery: at 1440 the capture's `clippedText` lists cards scrolled off to the side of `.hs-sticky`. That is the
  gallery working (the track moves through a clipped window), not a cut glyph; check it in the screenshots.
- Other local projects use ports nearby: `astro preview` silently moves on if a port is taken. Check the page title.
