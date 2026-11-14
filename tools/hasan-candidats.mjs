// D22 (élargissement) : pour chaque VARIANTE de nos fiches, liste les exercices du jeu les plus proches (nom, matériel, muscle) afin que le coach tranche.
// Texte seulement, aucune image. Usage : node tools/hasan-candidats.mjs <dossier-données> <dossier-sortie> [taille-lot]
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { MUSCLES, EQUIP, tokens, translate } from './hasan-lib.mjs';
const [dir, out, lot = '30'] = process.argv.slice(2);
if (!dir || !out) { console.error('Usage : node tools/hasan-candidats.mjs <données> <sortie> [lot]'); process.exit(2); }
const data = JSON.parse(readFileSync(join(dir, 'exercises.json'), 'utf8'));
const fiches = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (!/ecartees/.test(p)) walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(t)?.[1] ?? '';
    const g = (k) => (new RegExp(`^${k}:\s*(.*)$`, 'm').exec(fm)?.[1] ?? '').trim();
    const id = g('id'); if (!id) continue;
    const variants = [];
    for (const l of t.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && c[1] !== 'id variante' && /^[0-9]+$/.test(c[3])) variants.push({ id: c[1], nom: c[2], tags: c[5], inst: c[6] }); }
    fiches.push({ id, nom: g('nom'), schema: g('schema'), muscles: g('muscles_principaux'), variants });
  }
})('knowledge/exercices');
const dice = (a, b) => { if (!a.length || !b.length) return 0; const B = new Set(b); return (2 * a.filter((x) => B.has(x)).length) / (a.length + b.length); };
const H = data.map((h) => ({ h, tok: tokens(translate(h.name)), tokRaw: tokens(h.name.replace(/\(.*?\)/g, '')) }));
fiches.sort((a, b) => a.id.localeCompare(b.id));
mkdirSync(out, { recursive: true });
const blocks = fiches.map((f) => {
  const mus = f.muscles.replace(/[[\]]/g, '').split(',').map((x) => x.trim());
  const lines = [`## ${f.id} — ${f.nom} (schéma ${f.schema}; muscles ${mus.join(', ')})`];
  const pool = new Map();
  for (const v of f.variants.length ? f.variants : [{ id: '', nom: f.nom, tags: '', inst: '' }]) {
    const vt = tokens(`${v.nom} ${f.nom}`);
    const scored = H.map((x) => ({ x, s: Math.max(dice(x.tok, tokens(v.nom)), dice(x.tokRaw, tokens(v.nom)), 0.8 * dice(x.tok, vt)) + ((MUSCLES[x.h.target] ?? []).some((m) => mus.includes(m)) ? 0.15 : 0) }))
      .filter((z) => z.s >= 0.4).sort((a, b) => b.s - a.s).slice(0, 6);
    lines.push(`- variante ${v.id || '(fiche)'} : ${v.nom} [matériel : ${v.tags || 'aucun'}]${v.inst ? ` — ${v.inst}` : ''}`);
    for (const z of scored) lines.push(`    ${z.x.h.id} | ${z.x.h.name} | ${z.x.h.equipment} | cible ${z.x.h.target}`);
    if (!scored.length) lines.push('    (aucun candidat proche par le nom)');
  }
  return lines.join('\n');
});
const n = Number(lot);
for (let i = 0; i * n < blocks.length; i++) writeFileSync(join(out, `lot-${String(i + 1).padStart(2, '0')}.md`), `# Candidats D22 — lot ${i + 1}\n\n${blocks.slice(i * n, (i + 1) * n).join('\n\n')}\n`);
console.log(`${fiches.length} fiches, ${fiches.reduce((a, f) => a + f.variants.length, 0)} variantes, ${Math.ceil(blocks.length / n)} lots`);
