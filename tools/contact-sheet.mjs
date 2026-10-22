// Planche de captures : node tools/contact-sheet.mjs <projet> <sortie.png> [colonnes] [largeur]
// Lit screenshots/<projet>/*.png. Sans « colonnes » : une seule rangée (comportement d'origine).
// Avec « colonnes » : grille (utile pour relire beaucoup d'images, ex. les illustrations : node tools/contact-sheet.mjs illustrations planche-illustrations.png 3 560).
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [project, out, colsArg, widthArg] = process.argv.slice(2);
const dir = `screenshots/${project}`;
const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const w = Number(widthArg) || 390;
const imgs = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).resize({ width: w }).toBuffer({ resolveWithObject: true })));
const gap = 16;
const cols = Number(colsArg) || imgs.length;
const rows = Math.ceil(imgs.length / cols);
const h = Math.max(...imgs.map((i) => i.info.height));
const sheet = sharp({ create: { width: cols * (w + gap) + gap, height: rows * (h + gap) + gap, channels: 3, background: '#808080' } });
await sheet.composite(imgs.map((i, k) => ({ input: i.data, left: gap + (k % cols) * (w + gap), top: gap + Math.floor(k / cols) * (h + gap) }))).png().toFile(out);
console.log(out, files.length, 'images');
