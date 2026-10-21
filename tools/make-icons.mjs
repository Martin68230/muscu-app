// Génère les icônes PNG de l'app à partir d'un dessin SVG original (haltère stylisé).
// Usage : npm run icons
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const out = 'public/icons';
mkdirSync(out, { recursive: true });

// safe : marge intérieure (les icônes « maskable » sont rognées en cercle par Android).
const svg = (safe) => {
  const s = 512;
  const k = (1 - 2 * safe) / 1;
  const t = (v) => safe * s + v * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#0f1115"/>
  <g fill="#5ee0a0">
    <rect x="${t(96)}" y="${t(176)}" width="${48 * k}" height="${160 * k}" rx="${14 * k}"/>
    <rect x="${t(152)}" y="${t(136)}" width="${48 * k}" height="${240 * k}" rx="${14 * k}"/>
    <rect x="${t(312)}" y="${t(136)}" width="${48 * k}" height="${240 * k}" rx="${14 * k}"/>
    <rect x="${t(368)}" y="${t(176)}" width="${48 * k}" height="${160 * k}" rx="${14 * k}"/>
    <rect x="${t(200)}" y="${t(236)}" width="${112 * k}" height="${40 * k}" rx="${10 * k}"/>
  </g>
</svg>`;
};

const plain = Buffer.from(svg(0));
const masked = Buffer.from(svg(0.1));

await sharp(plain).resize(192).png().toFile(`${out}/icon-192.png`);
await sharp(plain).resize(512).png().toFile(`${out}/icon-512.png`);
await sharp(masked).resize(512).png().toFile(`${out}/icon-maskable-512.png`);
await sharp(plain).resize(180).png().toFile(`${out}/apple-touch-icon.png`);
writeFileSync(`${out}/favicon.svg`, svg(0));
console.log('Icônes générées dans', out);
