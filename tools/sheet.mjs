// Contact sheet of the raw downloads, to look at them before deciding the crops.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const dir = process.argv[2], out = process.argv[3], only = process.argv[4] ? new RegExp(process.argv[4]) : /./;
const files = readdirSync(dir).filter((f) => only.test(f)).sort();
const W = 260, H = 200, C = 6;
const comps = [];
for (let i = 0; i < files.length; i++) {
  const m = await sharp(`${dir}/${files[i]}`).metadata();
  const img = await sharp(`${dir}/${files[i]}`).flatten({ background: '#9a9' }).resize(W, H - 34, { fit: 'contain', background: '#222' }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="34"><rect width="100%" height="100%" fill="#000"/><text x="3" y="13" font-size="10.5" fill="#fff" font-family="Arial">${files[i].slice(8, 50).replace(/&/g, '')}</text><text x="3" y="28" font-size="10.5" fill="#fc0" font-family="Arial">${m.width}x${m.height}</text></svg>`);
  const x = (i % C) * W, y = Math.floor(i / C) * H;
  comps.push({ input: img, left: x, top: y }, { input: label, left: x, top: y + H - 34 });
}
await sharp({ create: { width: C * W, height: Math.ceil(files.length / C) * H, channels: 3, background: '#111' } }).composite(comps).jpeg({ quality: 78 }).toFile(out);
console.log(files.length);
