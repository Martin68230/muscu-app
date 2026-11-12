// D17 étape 1 : relie les exercices Everkinetic (CC BY-SA 4.0, dépôt lu HORS du dépôt, aucune exécution, aucun réseau) à NOS fiches.
// Usage : node tools/everkinetic-correspondance.mjs <dossier-everkinetic/repo> [--ecrire]
// Lit : <dossier>/dist/exercises.json et <dossier>/dist/svg/*.svg (taille seulement) ; public/data/fiches.json (généré par `npm run fiches`).
// Sans --ecrire : affiche les agrégats. Avec --ecrire : remplace le bloc AUTO de docs/D17-correspondance.md.
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('Usage : node tools/everkinetic-correspondance.mjs <dossier-everkinetic/repo> [--ecrire]'); process.exit(2); }
const ecrire = args.includes('--ecrire');

const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\b(\w{4,})s\b/g, '$1');
const tokens = (s) => norm(s).split(' ').filter((w) => w && !['with', 'the', 'a', 'of'].includes(w)).sort().join(' ');
// Mots d'équipement ou de position : ignorés pour la confiance « moyenne » (jamais pour « haute »)
const EQ = new Set(['barbell', 'dumbbell', 'cable', 'kettlebell', 'band', 'machine', 'smith', 'ez', 'bar', 'body', 'weight', 'lever', 'with', 'on', 'the', 'a', 'and', 'of', 'to']);
const core = (s) => norm(s).split(' ').filter((w) => w && !EQ.has(w)).sort().join(' ');

const ek = JSON.parse(readFileSync(join(dir, 'dist', 'exercises.json'), 'utf8'));
const fiches = JSON.parse(readFileSync('public/data/fiches.json', 'utf8')).fiches;

const poids = (e) => (e.svg || []).reduce((n, f) => {
  const p = join(dir, 'dist', f);
  return n + (existsSync(p) ? statSync(p).size : 0);
}, 0);

const parNom = new Map(); // forme normalisée -> [{ fiche, via }]
const parTokens = new Map();
const parCore = new Map();
const add = (m, k, v) => { if (!k) return; if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
for (const f of fiches) {
  for (const n of [f.nom, ...(f.alias || [])]) {
    add(parNom, norm(n), { f, via: n });
    add(parTokens, tokens(n), { f, via: n });
    add(parCore, core(n), { f, via: n });
  }
}

// Compatibilité matériel : un nom identique ne suffit pas (« leg extension » machine ≠ élastique).
const EQMAP = { body: ['poids_du_corps'], barbell: ['barre', 'rack', 'disques', 'barre_ez'], 'bar': ['barre', 'barre_ez'], dumbbell: ['halteres'], dumbbells: ['halteres'], cable: ['poulie', 'ancrage_porte'], machine: ['machine'], 'smith machine': ['machine'], 'exercise band': ['elastique', 'mini_bande', 'ancrage_porte'], bench: ['banc', 'banc_inclinable'], 'flat bench': ['banc'], 'bench: incline': ['banc_inclinable'], 'bench: decline': ['banc'], 'swiss ball': ['swiss_ball'], 'exercise ball': ['swiss_ball'], 'stability ball': ['swiss_ball'], 'stability Ball': ['swiss_ball'], 'bosu ball': ['bosu'], 'medicine ball': ['medecine_ball'], 'weight plate': ['disques'], towel: ['serviette'], 'pull-up bar': ['barre_traction'], 'parallel bars': ['barre_traction'] };
const tagsDe = (f) => new Set(f.variantes.flatMap((v) => v.tags));
const materielOk = (e, f) => { const t = tagsDe(f); const eq = (e.equipment || []).filter((q) => q in EQMAP); return eq.length > 0 && eq.every((q) => EQMAP[q].some((x) => t.has(x)) || q === 'bench' || q === 'flat bench'); };
const lignes = [];
for (const e of ek) {
  const t = e.title;
  let conf = 'aucune'; let hits = parNom.get(norm(t));
  if (hits) conf = 'haute';
  else if ((hits = parTokens.get(tokens(t)))) conf = 'haute';
  else if ((hits = parCore.get(core(t))) && core(t).length >= 4) conf = 'moyenne';
  else hits = null;
  if (conf === 'haute') { hits = hits.filter((h) => materielOk(e, h.f)); if (!hits.length) { conf = 'moyenne'; hits = parNom.get(norm(t)) || parTokens.get(tokens(t)); } }
  const ids = hits ? [...new Set(hits.map((h) => h.f.id))] : [];
  lignes.push({ e, conf, ids, via: hits ? hits[0].via : '', poids: poids(e), nsvg: (e.svg || []).length });
}

const haute = lignes.filter((l) => l.conf === 'haute');
const moy = lignes.filter((l) => l.conf === 'moyenne');
const fichesHaute = new Set(haute.flatMap((l) => l.ids));
const fichesMoy = new Set(moy.flatMap((l) => l.ids));
const typeFiche = (f) => { const t = new Set((f.images || []).map((i) => i.type)); return t.has('photo') ? 'photo' : t.has('illustration') ? 'illustration' : 'aucune'; };
const parType = { photo: 0, illustration: 0, aucune: 0 };
for (const f of fiches) parType[typeFiche(f)]++;
const ficheById = new Map(fiches.map((f) => [f.id, f]));
const sansPhotoCouvertes = [...fichesHaute].filter((id) => typeFiche(ficheById.get(id)) !== 'photo').length;
const sansPhotoCouvertesM = [...new Set([...fichesHaute, ...fichesMoy])].filter((id) => typeFiche(ficheById.get(id)) !== 'photo').length;
const mo = (n) => (n / 1048576).toFixed(2);
const ko = (n) => Math.round(n / 1024);
const poidsHaute = haute.reduce((n, l) => n + l.poids, 0);
const sansSvg = ek.filter((e) => !(e.svg || []).length).length;

const out = [];
out.push('<!-- AUTO:DEBUT (généré par tools/everkinetic-correspondance.mjs --ecrire ; ne pas modifier à la main) -->');
out.push('### Agrégats');
out.push('');
out.push(`- Exercices Everkinetic (dist/exercises.json) : ${ek.length} ; sans SVG : ${sansSvg} ; avec SVG : ${ek.length - sansSvg}.`);
out.push(`- Nos fiches : ${fiches.length} ; image principale actuelle : photo ${parType.photo}, illustration maison seule ${parType.illustration}, aucune ${parType.aucune}.`);
out.push(`- Correspondances de confiance haute : ${haute.length} exercices Everkinetic -> ${fichesHaute.size} fiches ; moyenne (à valider à la main, jamais utilisées telles quelles) : ${moy.length} -> ${fichesMoy.size} fiches.`);
out.push(`- Fiches de confiance haute SANS photo (illustration maison ou rien) qui gagneraient un dessin : ${sansPhotoCouvertes} (${sansPhotoCouvertesM} en comptant la confiance moyenne).`);
out.push(`- Poids brut des SVG des correspondances de confiance haute : ${mo(poidsHaute)} Mo (${haute.reduce((n, l) => n + l.nsvg, 0)} fichiers), avant optimisation.`);
out.push('');
out.push('### Correspondances de confiance haute');
out.push('');
out.push('| id de fiche | nom Everkinetic (id) | via | auteur | SVG | poids (Ko) | image actuelle |');
out.push('|---|---|---|---|---|---|---|');
for (const l of haute.sort((a, b) => a.ids[0].localeCompare(b.ids[0]))) {
  out.push(`| ${l.ids.join(', ')} | ${l.e.title} (${l.e.id}) | ${l.via} | Greg Priday (Everkinetic) | ${l.nsvg} | ${ko(l.poids)} | ${typeFiche(ficheById.get(l.ids[0]))} |`);
}
out.push('');
out.push('### Confiance moyenne (extraits, à trier à la main)');
out.push('');
out.push('| id de fiche | nom Everkinetic (id) | via |');
out.push('|---|---|---|');
for (const l of moy.sort((a, b) => a.ids[0].localeCompare(b.ids[0])).slice(0, 80)) out.push(`| ${l.ids.join(', ')} | ${l.e.title} (${l.e.id}) | ${l.via} |`);
out.push('<!-- AUTO:FIN -->');
const bloc = out.join('\n');

if (!ecrire) { console.log(bloc.split('\n').slice(0, 12).join('\n')); process.exit(0); }
const cible = 'docs/D17-correspondance.md';
let txt = existsSync(cible) ? readFileSync(cible, 'utf8') : '# D17 : correspondance Everkinetic -> nos fiches\n\n<!-- AUTO:DEBUT -->\n<!-- AUTO:FIN -->\n';
const re = /<!-- AUTO:DEBUT[\s\S]*?<!-- AUTO:FIN -->/;
txt = re.test(txt) ? txt.replace(re, () => bloc) : `${txt}\n${bloc}\n`;
writeFileSync(cible, txt);
console.log(`écrit ${cible} : ${haute.length} haute, ${moy.length} moyenne`);
