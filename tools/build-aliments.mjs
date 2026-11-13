// Génère public/data/aliments.json (≈ 250 ingrédients) à partir de la table Ciqual 2025 (hors dépôt) et de knowledge/aliments/ingredients.json.
// Usage : node tools/build-aliments.mjs "<dossier ciqual>"    (par défaut ../donnees-externes/ciqual-2025)
//
// Sécurité : les XML Ciqual sont des données NON FIABLES. Aucune bibliothèque XML (pas d'entités, pas de DTD) : lecture ligne à ligne,
// extraction des seules balises attendues, valeurs converties en nombres bornés. Rien du fichier n'est exécuté ni évalué.
// Source : Ciqual (ANSES), Licence Ouverte 2.0, DOI 10.57745/RDMHWY. Mention obligatoire dans l'app (page crédits).
// Les macros de chaque ingrédient viennent UNIQUEMENT de Ciqual ; les allergènes viennent de ingredients.json (étiquetage humain).

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.resolve(process.argv[2] ?? process.env.CIQUAL_DIR ?? path.join(ROOT, '..', 'donnees-externes', 'ciqual-2025'));
const INGR = path.join(ROOT, 'knowledge', 'aliments', 'ingredients.json');
const OUT = path.join(ROOT, 'public', 'data', 'aliments.json');

// Constantes Ciqual retenues (const.xml) : g ou kcal pour 100 g.
const CONST = { 328: 'kcal', 333: 'kcalJones', 25003: 'prot', 25000: 'protJones', 31000: 'gluc', 32000: 'sucres', 40000: 'lip', 40302: 'ags', 34100: 'fibres', 10004: 'sel' };
const ALLERGENS = ['gluten', 'crustaces', 'oeufs', 'poissons', 'arachides', 'soja', 'lait', 'fruits_a_coque', 'celeri', 'moutarde', 'sesame', 'sulfites', 'lupin', 'mollusques'];
const STATUTS = ['valide', 'a_verifier', 'inconnu'];

function fail(msg) {
  console.error('ERREUR build-aliments : ' + msg);
  process.exit(1);
}

const ENT = { '&apos;': "'", '&amp;': '&', '&quot;': '"', '&lt;': '<', '&gt;': '>' };
const decode = (s) => s.replace(/&(apos|amp|quot|lt|gt);/g, (m) => ENT[m]);

const tag = (line, name) => {
  const m = line.match(new RegExp(`<${name}>\\s*([^<]*?)\\s*</${name}>`));
  return m ? decode(m[1]) : null;
};

/** « 12,5 » -> 12.5 ; « < 0,5 » -> 0 (borne haute inconnue : traité comme 0, marqué) ; « traces » -> 0 ; « - » ou vide -> null. */
function parseTeneur(raw) {
  if (raw == null) return { v: null };
  const s = raw.trim().replace(',', '.');
  if (s === '' || s === '-') return { v: null };
  if (/^traces?$/i.test(s)) return { v: 0, approx: true };
  if (s.startsWith('<')) return { v: 0, approx: true };
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > 10000) return { v: null };
  return { v: n };
}

if (!fs.existsSync(INGR)) fail(`liste d'ingrédients absente : ${INGR}`);
const list = JSON.parse(fs.readFileSync(INGR, 'utf8'));
const items = Array.isArray(list) ? list : list.ingredients;
if (!Array.isArray(items) || !items.length) fail('ingredients.json vide ou mal formé');

const wanted = new Map();
const errors = [];
for (const it of items) {
  const code = String(it.code ?? '');
  if (!/^\d{1,6}$/.test(code)) errors.push(`code invalide : ${code}`);
  if (wanted.has(code)) errors.push(`code en double : ${code}`);
  if (!Array.isArray(it.allergenes) || it.allergenes.some((a) => !ALLERGENS.includes(a))) errors.push(`${code} : allergènes invalides`);
  if (!STATUTS.includes(it.statut_allergenes)) errors.push(`${code} : statut d'allergènes invalide`);
  wanted.set(code, it);
}
if (errors.length) fail(errors.slice(0, 10).join(' ; '));

for (const f of ['alim.xml', 'compo.xml']) if (!fs.existsSync(path.join(DIR, f))) fail(`fichier absent : ${path.join(DIR, f)}`);

// 1) noms Ciqual (contrôle de cohérence avec le code retenu)
const names = new Map();
{
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(DIR, 'alim.xml'), 'utf8'), crlfDelay: Infinity });
  let cur = null;
  for await (const line of rl) {
    const c = tag(line, 'alim_code');
    if (c !== null) cur = c;
    const n = tag(line, 'alim_nom_fr');
    if (n !== null && cur !== null && wanted.has(cur)) names.set(cur, n);
  }
}
for (const code of wanted.keys()) if (!names.has(code)) errors.push(`code Ciqual introuvable : ${code}`);
if (errors.length) fail(errors.slice(0, 10).join(' ; '));

// 2) composition (fichier volumineux : lecture en flux)
const macros = new Map([...wanted.keys()].map((c) => [c, {}]));
{
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(DIR, 'compo.xml'), 'utf8'), crlfDelay: Infinity });
  let code = null;
  let konst = null;
  for await (const line of rl) {
    const a = tag(line, 'alim_code');
    if (a !== null) { code = a; konst = null; continue; }
    const k = tag(line, 'const_code');
    if (k !== null) { konst = k; continue; }
    const t = tag(line, 'teneur');
    if (t !== null && code !== null && konst !== null && macros.has(code) && CONST[konst]) {
      const p = parseTeneur(t);
      if (p.v !== null) macros.get(code)[CONST[konst]] = p.v;
    }
  }
}

const out = [];
for (const [code, it] of wanted) {
  const m = macros.get(code);
  const prot = m.prot ?? m.protJones;
  const kcal = m.kcal ?? m.kcalJones;
  for (const [label, v] of [['kcal', kcal], ['protéines', prot], ['glucides', m.gluc], ['lipides', m.lip]]) {
    if (v === undefined) errors.push(`${code} (${names.get(code)}) : ${label} absent dans Ciqual`);
  }
  out.push({
    code,
    nom: it.nom,
    nomCiqual: names.get(code),
    famille: it.famille,
    rayon: it.rayon,
    allergenes: it.allergenes,
    statutAllergenes: it.statut_allergenes,
    regimesIncompatibles: it.regimes_incompatibles ?? [],
    unite: it.unite_achat ?? null,
    conditionnementG: it.conditionnement_g ?? null,
    gardeManger: !!it.garde_manger,
    perissable: !!it.perissable,
    // pour 100 g, cru ou tel que vendu (voir nomCiqual)
    kcal, prot, gluc: m.gluc, lip: m.lip,
    fibres: m.fibres ?? null, sucres: m.sucres ?? null, ags: m.ags ?? null, sel: m.sel ?? null,
  });
}
if (errors.length) fail(errors.slice(0, 15).join(' ; '));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify({ source: 'Ciqual 2025 (ANSES), Licence Ouverte 2.0, DOI 10.57745/RDMHWY', generePar: 'tools/build-aliments.mjs', aliments: out }) + '\n',
);
console.log(`aliments.json : ${out.length} ingrédients, ${(fs.statSync(OUT).size / 1024).toFixed(0)} Ko`);
