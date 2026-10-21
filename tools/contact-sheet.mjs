// Planche de captures : node tools/contact-sheet.mjs <projet> <sortie.png>
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [project, out] = process.argv.slice(2);
const dir = `screenshots/${project}`;
const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const imgs = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).resize({ width: 390 }).toBuffer({ resolveWithObject: true })));
const gap = 16, w = 390, h = Math.max(...imgs.map((i) => i.info.height));
const sheet = sharp({ create: { width: imgs.length * (w + gap) + gap, height: h + 2 * gap, channels: 3, background: '#808080' } });
await sheet.composite(imgs.map((i, k) => ({ input: i.data, left: gap + k * (w + gap), top: gap }))).png().toFile(out);
console.log(out, files.join(', '));
