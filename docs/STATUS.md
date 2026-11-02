# Status

All 26 old URLs (6 pages + 7 projects, EN + ES) plus a 404, live on the preview URL in CLAUDE.md. Content needs client
approval. Verify loop: PASS on 2026-11-02 (round 3).

## New copy (not on the old site, for approval)
- Home H1: "Innovative and timeless spaces" / "Espacios innovadores y atemporales" and the eyebrow under the header. Both
  are cut from the client's About text.
- Page titles and meta description (the old site had none). "Page not found" / "Página no encontrada".
- All image alt texts, EN + ES (the old site had none). Written from the photos.
- ES project titles the old site lacked or mixed up: "Azul profundo" (Deep blue sea), "Encanto azul" (moved to Blue charm,
  it sat on the wrong project), "Apartamento en la planta 20".
- ES price sentence, which was still in English on the old site: "Los precios parten de 799 € por habitación para tu
  concepto de diseño de interiores."
- Home and project pages reuse the existing CTA texts. ES closing line joins the old "Contáctanos hoy para una" + "consulta
  gratuita" into one heading.

## Typo fixes
- EN: "Deep blue see" -> "Deep blue sea" (URL kept), "furnitures" -> "furniture", "Let´s" -> "Let's".
- ES: "Hogar lejos del hoga" -> "hogar", "Diseñador jefe" -> "Diseñadora jefe", "elegantes e acogedores" -> "y acogedores",
  "Comó" -> "¿Cómo", added ¿ ¡, "Vienna, London" -> "Viena, Londres", "Home Staging previo" -> "Home staging previo". A non-breaking space keeps "o alquilando" together.

## Changed or left out on purpose
- YouTube and LinkedIn icons removed: on the old site YouTube has no link and LinkedIn points to `http://linkedin`.
- Cookie banner removed: the new site sets no cookies and loads nothing from third parties.
- "Hello world!" default post not carried over.

## Open questions for the client
- No privacy policy or legal notice exists on the old site. An EU business site needs them before going live.
- Many photos are Unsplash/Pexels stock by file name (home hero, About, How we work, Contact, Home Staging). Fine to reuse
  under those licences, but real project photos would be stronger. The 7 project galleries look like the client's own.
- Cities differ in the client's own copy: "London, Málaga, Vienna, Bratislava" vs "Costa del Sol, Vienna, London,
  Bratislava". Kept as written.
- "Cuarto de hombre" (Man cave) reads oddly in Spanish. Kept as written.
- The logo file is only 325 x 75 px, slightly soft on high-density screens. A vector logo would fix it.
- Jana's portrait is reused from the old site. Confirm it may stay, as with all reused photos.

## Before launch
- Remove `<meta name="robots" content="noindex">` from `src/layouts/Base.astro` (the demo must stay out of search results).

## Known
- Photos limited by their source file at 2x density: hero hover photos (largest 2048 px), project covers on very wide
  screens (2560 px), the portrait (1024 px).
