// Famille tirage (session B, 25/11/2026) : les familles ECARTÉES par le coach comme « doublon de <fiche> » n'ont pas de fiche à créer,
// mais leurs GIF peuvent être reliés à la fiche existante (même geste). Ce script LISTE (sans --ecrire) ou AJOUTE (--ecrire) des lignes « proche » dans
// knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json, seulement si la fiche cible a une variante qui partage un matériel avec l'exercice du jeu.
// Usage : node tools/hasan-doublons-gif.mjs [--ecrire] [--schemas tirage_h,tirage_v] [--mains biceps,grand_dorsal,...]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strip } from './hasan-lib.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const schemas = opt('--schemas', 'tirage_h,tirage_v').split(',');
const mains = opt('--mains', 'biceps,grand_dorsal,rhomboides,trapezes,avant_bras,deltoides_posterieurs').split(',');
const hd = join(root, 'knowledge/exercices/hasan');
const tsv = (f) => { const [h, ...r] = readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t')); return r.map((c) => Object.fromEntries(h.map((k, i) => [k, c[i] ?? '']))); };
const plan = tsv(join(hd, 'plan.tsv'));
const byFam = new Map(); for (const r of plan) if (r.statut === 'retenu') (byFam.get(r.famille) ?? byFam.set(r.famille, []).get(r.famille)).push(r);
const fiches = new Map();
(function w(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) { if (!/ecartees/.test(p)) w(p); continue; } if (!e.name.endsWith('.md')) continue; const t = readFileSync(p, 'utf8').replace(/\r/g, ''); const id = /^id:\s*(.*)$/m.exec(t)?.[1]?.trim(); if (!id) continue; const nom = /^nom:\s*(.*)$/m.exec(t)?.[1]?.trim() ?? ''; const statut = /^statut:\s*(.*)$/m.exec(t)?.[1]?.split('#')[0].trim(); const variants = []; for (const l of t.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && /^[0-9]+$/.test(c[3])) variants.push({ id: c[1], tags: c[5].split(',').map((x) => x.trim()) }); } fiches.set(id, { id, nom, statut, variants }); } })(join(root, 'knowledge/exercices'));
const gv = new Set([...readFileSync(join(root, 'src/images/gv-table.ts'), 'utf8').matchAll(/id: '(\d+)'/g)].map((m) => m[1]));
const corrFile = join(root, 'knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json');
const corr = JSON.parse(readFileSync(corrFile, 'utf8'));
// Écartés à la relecture (prise ambiguë, mixte, lestée ou geste différent) : jamais reliés automatiquement.
const EXCLUS_IDS = new Set(['3019', '0627', '2987', '1317', '0140']);
const COMMUN = new Set(['poids_du_corps', 'banc', 'chaise', 'mur', 'serviette', 'disques', 'rack']);
const normNom = [...fiches.values()].map((f) => ({ f, n: ' ' + strip(f.nom).replace(/[^a-z0-9]+/g, ' ').trim() + ' ' })).sort((a, b) => b.n.length - a.n.length);
const out = [];
for (const f of readdirSync(hd).filter((x) => /^noms-fr-lot\d+\.tsv$/.test(x))) {
  for (const l of readFileSync(join(hd, f), 'utf8').split('\n').filter(Boolean).slice(1)) {
    const [famille, nomFr, raison = ''] = l.split('\t');
    if (!/^ECARTER/i.test(nomFr ?? '')) continue;
    const m = /^(\w+)\|([^|]*)\|/.exec(famille); if (!m) continue;
    if (!schemas.includes(m[1]) || !mains.includes(m[2].split('+')[0])) continue;
    const txt = (nomFr + ' ' + raison).replace(/^ECARTER\s*/i, '');
    if (!/doublon/i.test(txt) || /(?:peu s[uû]re|dangereux|derri[eè]re la nuque|mélange|incohérent|équilibre)/i.test(txt)) continue;
    const ids = [...fiches.keys()].filter((i) => new RegExp('(^|[^a-z0-9-])' + i + '($|[^a-z0-9-])').test(txt));
    const tn = ' ' + strip(txt).replace(/[^a-z0-9]+/g, ' ') + ' ';
    if (!ids.length) { const hit = normNom.find((x) => x.n.length > 8 && tn.includes(x.n)); if (hit) ids.push(hit.f.id); }
    const cibles = ids.map((i) => fiches.get(i)).filter((x) => x && ['utilisable', 'verifie'].includes(x.statut));
    if (!cibles.length) { out.push({ famille, skip: 'fiche cible introuvable : ' + txt.slice(0, 70) }); continue; }
    for (const r of byFam.get(famille) ?? []) {
      if (gv.has(r.id) || EXCLUS_IDS.has(r.id)) continue;
      if (/wrist/i.test(r.name) && !cibles.some((c) => /poignet/.test(c.id))) { out.push({ famille, id: r.id, name: r.name, skip: 'curl de poignet : pas le même geste que la cible' }); continue; }
      const tags = r.tags.split(',').filter((t) => !COMMUN.has(t));
      let best = null;
      for (const c of cibles) for (const v of c.variants) { const sc = v.tags.filter((t) => tags.includes(t)).length; if (tags.length && sc && (!best || sc > best.sc)) best = { sc, fiche: c.id, variante: v.id }; }
      if (!best) { out.push({ famille, id: r.id, name: r.name, skip: 'aucun matériel commun (' + r.tags + ') avec ' + cibles.map((c) => c.id).join(' / ') }); continue; }
      out.push({ famille, id: r.id, name: r.name, fiche: best.fiche, variante: best.variante });
    }
  }
}
const nouv = out.filter((o) => o.fiche);
for (const o of out) console.log(o.fiche ? `${o.id} ${o.name} -> ${o.fiche} / ${o.variante}` : `  (écarté) ${o.id ?? ''} ${o.name ?? o.famille} : ${o.skip}`);
console.log(nouv.length + ' lignes proposées');
if (args.includes('--ecrire')) {
  const key = (c) => c.hasan_id + '|' + c.fiche + '|' + c.variante;
  const all = new Map(corr.map((c) => [key(c), c]));
  for (const o of nouv) all.set(key({ hasan_id: o.id, fiche: o.fiche, variante: o.variante }), all.get(key({ hasan_id: o.id, fiche: o.fiche, variante: o.variante })) ?? { hasan_id: o.id, fiche: o.fiche, variante: o.variante, niveau: 'proche' });
  writeFileSync(corrFile, JSON.stringify([...all.values()]) + '\n');
}
