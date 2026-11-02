// Original downloads (scrape/orig) -> public/media/*.webp in up to three widths + src/data/media.json for <Photo>.
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'scrape/orig/';
const OUT = 'public/media/';
const J = '2025_01';
const D = '2024_12';
const photos = {
  'hero-about': `${J}_sanibell-bv-530lZQXMKGw-unsplash-scaled.jpg`,
  'hero-inspirations': `${D}_contemporary-house-interior-design-scaled.jpg`,
  'hero-how': `${J}_WhatsApp-Image-2025-01-12-at-11.56.18_d08ce65a.jpg`,
  'hero-staging': `${J}_spacejoy-x3mSC1WnWhc-unsplash-scaled.webp`,
  'hero-contact': `${J}_behnam-mohsenzadeh-Faa_P3eaaGo-unsplash-2-scaled.jpg`,
  about: `${J}_spacejoy-c0JoR_-2x3E-unsplash-scaled.jpg`,
  how: `${J}_josh-hemsley-VnYuKzrN82E-unsplash-scaled.jpg`,
  contact: `${J}_roman-bozhko-OXXsAafHDeo-unsplash-scaled.jpg`,
  'staging-selling': `${J}_r-architecture-T6d96Qrb5MY-unsplash-scaled.jpg`,
  'staging-marketing': `${J}_spacejoy-q3Qd86sfaoU-unsplash-scaled.jpg`,
  'staging-interior': `${D}_pexels-fotoaibe-1571460-scaled.jpg`,
  jana: `${J}_image2.jpeg`,
  'one-bedroom-1': `${J}_image0-scaled.webp`,
  'one-bedroom-2': `${J}_image2-scaled.webp`,
  'one-bedroom-3': `${J}_image1-scaled.webp`,
  'man-cave-1': `${J}_image6-scaled.webp`,
  'man-cave-2': `${J}_image3-scaled.webp`,
  'man-cave-3': `${J}_image4-scaled.webp`,
  'man-cave-4': `${J}_image5-scaled.webp`,
  'home-from-home-1': `${J}_image0-1-scaled.webp`,
  'home-from-home-2': `${J}_image2-1-scaled.webp`,
  'home-from-home-3': `${J}_image1-1-scaled.webp`,
  'earthy-relax-1': `${J}_imageo1-scaled.webp`,
  'earthy-relax-2': `${J}_imageo0-scaled.webp`,
  'deep-blue-see-1': `${J}_image0-2-scaled.webp`,
  'deep-blue-see-2': `${J}_image2-2-scaled.webp`,
  'deep-blue-see-3': `${J}_image1-2-scaled.webp`,
  'blue-charm-1': `${J}_image2-3-scaled.webp`,
  'blue-charm-2': `${J}_image3-1-scaled.webp`,
  'blue-charm-3': `${J}_image0-3-scaled.webp`,
  '20th-floor-apartment-1': `${J}_image1-3-scaled.webp`,
  '20th-floor-apartment-2': `${J}_image3-2-scaled.webp`,
  '20th-floor-apartment-3': `${J}_image2-4-scaled.webp`,
  '20th-floor-apartment-4': `${J}_image0-4-scaled.webp`,
};

mkdirSync(OUT, { recursive: true });
mkdirSync('src/data', { recursive: true });
const manifest = {};
for (const [name, file] of Object.entries(photos)) {
  const m = await sharp(SRC + file).metadata();
  const widths = [...new Set([...[640, 1280, 2560].filter((w) => w < m.width), Math.min(m.width, 2560)])];
  for (const w of widths) {
    await sharp(SRC + file).rotate().resize(w).webp({ quality: 74, effort: 5 }).toFile(`${OUT}${name}-${w}.webp`);
  }
  manifest[name] = { w: m.width, h: m.height, widths };
}
writeFileSync('src/data/media.json', JSON.stringify(manifest, null, 1));

// Brand marks (keep alpha)
await sharp(SRC + `${D}_image1-removebg-preview-e1735920347142.png`).webp({ lossless: true }).toFile(OUT + 'logo.webp');
await sharp(SRC + `${J}_Jana-Schama-without-tagline_black_high-res-e1735836348226.png`).trim().resize(900).webp({ quality: 90, alphaQuality: 100 }).toFile(OUT + 'signature.webp');
await sharp(SRC + `${J}_image0-e1735921624411.png`).webp({ quality: 88 }).toFile(OUT + 'bcid.webp');
await sharp(SRC + `${J}_cropped-js.jpg`).resize(512).png().toFile('public/favicon-512.png');
await sharp(SRC + photos['hero-about']).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78 }).toFile(OUT + 'og.jpg');
for (const f of ['logo.webp', 'signature.webp', 'bcid.webp']) {
  const { width, height } = await sharp(OUT + f).metadata();
  console.log(f, `${width}x${height}`);
}
console.log(Object.keys(manifest).length, 'photos');
