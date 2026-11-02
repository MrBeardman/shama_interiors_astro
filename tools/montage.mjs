// Review helper: tile screenshots into one sheet. node tools/montage.mjs out.jpg cols width file...
import sharp from 'sharp';

const [out, cols, w, ...files] = process.argv.slice(2);
const C = +cols;
const W = +w;
const first = await sharp(files[0]).metadata();
const H = Math.round((W * first.height) / first.width);
const comps = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(f).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer(),
    left: (i % C) * (W + 6),
    top: Math.floor(i / C) * (H + 6),
  })),
);
await sharp({ create: { width: C * (W + 6), height: Math.ceil(files.length / C) * (H + 6), channels: 3, background: '#e11' } })
  .composite(comps)
  .jpeg({ quality: 80 })
  .toFile(out);
