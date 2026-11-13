// Compile knowledge/recettes/**/*.md en public/data/recettes.json et CONTRÔLE chaque recette (docs/nutrition-spec.md §8-§9).
// Usage : node tools/build-recettes.mjs [--check] [--all]
//   (rien)   : contrôle tout, écrit recettes.json avec les recettes publiables (statut complete_nutri ou controle_relecteur)
//   --all    : écrit aussi les brouillons (développement et tests, jamais livré)
//   --check  : contrôle seulement, n'écrit rien
// Allergènes, macros et régimes ne sont JAMAIS saisis à la main : calculés depuis public/data/aliments.json (Ciqual 2025 + étiquetage humain).
// Échec sûr : ingrédient inconnu, étiquetage `inconnu`, régime déclaré incompatible, allergène incohérent = erreur, le build s'arrête.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'knowledge', 'recettes');
const ALIMENTS = path.join(ROOT, 'public', 'data', 'aliments.json');
const OUT = path.join(ROOT, 'public', 'data', 'recettes.json');

const args = new Set(process.argv.slice(2));
const REPAS = ['petit-dej', 'dejeuner-diner', 'collation'];
const OBJECTIFS = ['perte', 'maintien', 'prise'];
const MATERIELS = ['four', 'micro-ondes', 'plaques', 'blender', 'aucun'];
const REGIMES = ['vegetarien', 'vegetalien', 'sans_porc', 'sans_lactose', 'sans_gluten'];
const COUTS = ['eco', 'normal', 'plus'];
const STATUTS = ['brouillon', 'complete_nutri', 'controle_relecteur'];
const PUBLIABLES = ['complete_nutri', 'controle_relecteur'];
const RANK = { valide: 0, a_verifier: 1, inconnu: 2 };
// Bornes d'énergie par portion (kcal) : garde-fou contre une erreur de grammes, pas une règle nutritionnelle.
const KCAL_RANGE = { 'petit-dej': [200, 900], 'dejeuner-diner': [250, 1100], collation: [60, 500] };

const errors = [];
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)} : ${msg}`);

function scalar(v) {
  const s = v.trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '') return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (/^".*"$/.test(s)) return s.slice(1, -1);
  return s;
}
function splitTop(s) {
  const out = [];
  let cur = '';
  let q = false;
  for (const ch of s) {
    if (ch === '"') q = !q;
    if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
function inlineValue(v) {
  const s = v.trim();
  if (s.startsWith('[') && s.endsWith(']')) return s.slice(1, -1).trim() === '' ? [] : splitTop(s.slice(1, -1)).map(scalar);
  if (s.startsWith('{') && s.endsWith('}')) {
    const o = {};
    for (const p of splitTop(s.slice(1, -1))) {
      const i = p.indexOf(':');
      o[p.slice(0, i).trim()] = scalar(p.slice(i + 1));
    }
    return o;
  }
  return scalar(s);
}
function parse(text, file) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { err(file, 'en-tête manquant'); return null; }
  const fm = {};
  let listKey = null;
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { fm[listKey].push(inlineValue(item[1])); continue; }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) { err(file, `ligne illisible : ${line.slice(0, 40)}`); continue; }
    if (kv[2].trim() === '') { fm[kv[1]] = []; listKey = kv[1]; } else { fm[kv[1]] = inlineValue(kv[2]); listKey = null; }
  }
  const steps = m[2].split('\n').map((l) => l.replace(/^\s*\d+[.)]\s*/, '').trim()).filter(Boolean);
  return { fm, steps };
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? listFiles(p) : d.name.endsWith('.md') && d.name !== 'README.md' ? [p] : [];
  });
}

if (!fs.existsSync(ALIMENTS)) {
  console.error('public/data/aliments.json absent : lancer tools/build-aliments.mjs');
  process.exit(1);
}
const aliments = new Map(JSON.parse(fs.readFileSync(ALIMENTS, 'utf8')).aliments.map((a) => [a.code, a]));
const ids = new Set();
const recipes = [];

for (const file of listFiles(DIR).sort()) {
  const p = parse(fs.readFileSync(file, 'utf8'), file);
  if (!p) continue;
  const f = p.fm;
  const need = (k) => { if (f[k] === undefined) err(file, `champ « ${k} » manquant`); };
  for (const k of ['id', 'nom', 'repas', 'objectifs', 'duree_prep_min', 'duree_cuisson_min', 'materiel', 'regimes', 'cout', 'portions_base', 'statut', 'ingredients']) need(k);
  if (!/^[a-z0-9-]+$/.test(String(f.id ?? ''))) err(file, 'id invalide');
  if (ids.has(f.id)) err(file, `id en double : ${f.id}`);
  ids.add(f.id);
  if (path.basename(file, '.md') !== f.id) err(file, "l'id doit être le nom du fichier");
  if (!REPAS.includes(f.repas)) err(file, `repas invalide : ${f.repas}`);
  if (path.basename(path.dirname(file)) !== f.repas) err(file, 'le dossier doit être le type de repas');
  if (!Array.isArray(f.objectifs) || !f.objectifs.length || f.objectifs.some((o) => !OBJECTIFS.includes(o))) err(file, 'objectifs invalides');
  if (!Array.isArray(f.materiel) || f.materiel.some((x) => !MATERIELS.includes(x))) err(file, 'matériel invalide');
  if (!Array.isArray(f.regimes) || f.regimes.some((x) => !REGIMES.includes(x))) err(file, 'régime invalide');
  if (!COUTS.includes(f.cout)) err(file, 'coût invalide');
  if (!STATUTS.includes(f.statut)) err(file, 'statut invalide');
  if (f.portions_base !== 1) err(file, 'portions_base doit valoir 1 (une portion)');
  if (p.steps.length < 3 || p.steps.length > 8) err(file, `3 à 8 étapes attendues (${p.steps.length})`);
  if (!Array.isArray(f.ingredients) || f.ingredients.length < 2) { err(file, 'ingrédients manquants'); continue; }

  const lines = [];
  const allergenes = new Set();
  const incompat = new Set();
  let statut = 'valide';
  const tot = { kcal: 0, prot: 0, gluc: 0, lip: 0, fibres: 0 };
  const seen = new Set();
  for (const ing of f.ingredients) {
    const code = String(ing.code);
    const a = aliments.get(code);
    if (!a) { err(file, `ingrédient inconnu de la base : ${code}`); continue; }
    if (seen.has(code)) err(file, `ingrédient en double : ${code}`);
    seen.add(code);
    if (!(ing.grammes > 0 && ing.grammes <= 2000)) err(file, `grammes invalides pour ${code}`);
    if (typeof ing.ajustable !== 'boolean') err(file, `« ajustable » manquant pour ${code}`);
    if (a.statutAllergenes === 'inconnu') err(file, `ingrédient ${code} (${a.nom}) sans étiquetage d'allergènes`);
    for (const x of a.allergenes) allergenes.add(x);
    for (const r of a.regimesIncompatibles) incompat.add(r);
    if (RANK[a.statutAllergenes] > RANK[statut]) statut = a.statutAllergenes;
    const k = ing.grammes / 100;
    tot.kcal += a.kcal * k; tot.prot += a.prot * k; tot.gluc += a.gluc * k; tot.lip += a.lip * k; tot.fibres += (a.fibres ?? 0) * k;
    lines.push({ code, nom: a.nom, grammes: ing.grammes, ajustable: !!ing.ajustable, rayon: a.rayon, famille: a.famille });
  }
  // Régimes déclarés = étiquettes déclaratives, jamais plus larges que ce que les ingrédients permettent.
  for (const r of f.regimes ?? []) if (incompat.has(r)) err(file, `régime « ${r} » déclaré mais un ingrédient est incompatible`);
  if ((f.regimes ?? []).includes('sans_lactose') && allergenes.has('lait')) err(file, 'sans_lactose mais contient du lait');
  if ((f.regimes ?? []).includes('sans_gluten') && allergenes.has('gluten')) err(file, 'sans_gluten mais contient du gluten');
  if ((f.regimes ?? []).includes('vegetalien') && !(f.regimes ?? []).includes('vegetarien')) err(file, 'végétalien implique végétarien');
  const [lo, hi] = KCAL_RANGE[f.repas] ?? [0, 5000];
  if (tot.kcal < lo || tot.kcal > hi) err(file, `énergie ${Math.round(tot.kcal)} kcal hors de [${lo}, ${hi}] pour ${f.repas}`);
  // Cohérence énergétique (Atwater simplifié) : écart > 35 % entre kcal Ciqual et 4P+4G+9L = erreur de données.
  const atw = 4 * tot.prot + 4 * tot.gluc + 9 * tot.lip;
  if (tot.kcal > 0 && Math.abs(atw - tot.kcal) / tot.kcal > 0.35) err(file, `énergie incohérente avec les macros (${Math.round(tot.kcal)} vs ${Math.round(atw)})`);

  const r1 = (x) => Math.round(x * 10) / 10;
  recipes.push({
    id: f.id, nom: f.nom, repas: f.repas, objectifs: f.objectifs, prepMin: f.duree_prep_min, cuissonMin: f.duree_cuisson_min,
    materiel: f.materiel, regimes: f.regimes, cout: f.cout, sourceGlucides: f.source_glucides ?? null, sourceProteines: f.source_proteines ?? null,
    baseReutilisable: !!f.base_reutilisable, statut: f.statut,
    allergenes: [...allergenes].sort(), statutAllergenes: statut,
    portion: { kcal: Math.round(tot.kcal), prot: r1(tot.prot), gluc: r1(tot.gluc), lip: r1(tot.lip), fibres: r1(tot.fibres) },
    ingredients: lines, etapes: p.steps,
  });
}

if (errors.length) {
  console.error(`build-recettes : ${errors.length} erreur(s)`);
  for (const e of errors.slice(0, 40)) console.error(' - ' + e);
  process.exit(1);
}
const pub = args.has('--all') ? recipes : recipes.filter((r) => PUBLIABLES.includes(r.statut));
if (!args.has('--check')) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ source: 'Recettes originales ; valeurs nutritionnelles : Ciqual 2025 (ANSES), Licence Ouverte 2.0', recettes: pub }) + '\n');
}
console.log(`recettes : ${recipes.length} contrôlée(s), 0 erreur, ${pub.length} publiable(s)${args.has('--check') ? ' (contrôle seul)' : ''}`);
