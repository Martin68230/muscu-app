// Couverture des fiches : node tools/couverture.mjs
// Tableau profil de matériel (A à F) x grand schéma : nombre de MOUVEMENTS (fiches) au statut `verifie`,
// puis, entre parenthèses, ceux au statut `controle_relecteur`. Cases avec moins de 3 `verifie` signalées « !! ».
//
// Règle de rattachement à un profil (equipment-taxonomy.md §4, tags de knowledge/materiel-tags.json) :
// un mouvement compte pour un profil s'il a AU MOINS UNE variante dont TOUS les tags sont dans l'ensemble du profil.
//   A : tags « implicite » + objets du quotidien (sac_a_dos, bidons_ou_sacs, box_ou_step)
//   B : A + elastique
//   C : A + halteres
//   D : A + halteres + elastique + barre_traction
//   E : D + tout le matériel « maison » (banc, kettlebell, roue_abdos, swiss_ball, etc.)
//   F : tous les tags (salle complète)
// Les profils sont cumulatifs en pratique (F contient E...), mais B et C sont deux branches distinctes.
// Schémas : `anti_rotation` et `rotation` sont regroupés dans « rotation/anti-rotation ».
// Fiches lues : knowledge/exercices/** hors ecartees/ (même liste que check:fiches).
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFiches, parseFiche, parseFrontmatter, loadTags } from './validate-fiches.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(process.argv[2] ?? join(root, 'knowledge', 'exercices'));
const tagsJson = JSON.parse(readFileSync(join(root, 'knowledge', 'materiel-tags.json'), 'utf8'));
const byGroup = (g) => tagsJson.tags.filter((t) => t.groupe === g).map((t) => t.id);
const A = new Set([...byGroup('implicite'), 'sac_a_dos', 'bidons_ou_sacs', 'box_ou_step']);
const withA = (...x) => new Set([...A, ...x]);
const D = withA('halteres', 'elastique', 'barre_traction');
const PROFILS = {
  A: A,
  B: withA('elastique'),
  C: withA('halteres'),
  D,
  E: new Set([...D, ...byGroup('maison')]),
  F: new Set(tagsJson.tags.map((t) => t.id)),
};
const LIBELLES = { A: 'A poids du corps', B: 'B + élastiques', C: 'C + haltères', D: 'D + haltères/élast./barre', E: 'E + matériel maison', F: 'F salle complète' };
const SCHEMAS = [
  ['squat', ['squat']], ['charnière', ['charniere']], ['fente', ['fente']], ['poussée H', ['poussee_h']], ['poussée V', ['poussee_v']],
  ['tirage H', ['tirage_h']], ['tirage V', ['tirage_v']], ['gainage', ['gainage']], ['porté', ['porte']],
  ['rot./anti-rot.', ['rotation', 'anti_rotation']], ['saut', ['saut']], ['mobilité', ['mobilite']], ['cardio', ['cardio']],
];

const count = {}; // count[profil][colonne] = { v, c }
for (const p of Object.keys(PROFILS)) { count[p] = {}; for (const [n] of SCHEMAS) count[p][n] = { v: 0, c: 0 }; }
let total = 0;
for (const name of listFiches(dir)) {
  const text = readFileSync(join(dir, name), 'utf8');
  const fm = parseFrontmatter(text.replace(/\r\n/g, '\n').split('\n')).data;
  if (fm.statut !== 'verifie' && fm.statut !== 'controle_relecteur') continue;
  const col = SCHEMAS.find(([, l]) => l.includes(fm.schema))?.[0];
  if (!col) continue;
  total++;
  const { fiche } = parseFiche(text, name);
  for (const [p, set] of Object.entries(PROFILS)) {
    if (fiche.variants.some((v) => v.tags.length && v.tags.every((t) => set.has(t)))) count[p][col][fm.statut === 'verifie' ? 'v' : 'c']++;
  }
}

const w0 = 26; const w = 11;
const pad = (s, n) => String(s).padEnd(n);
console.log('Mouvements « verifie » (controle_relecteur) par profil de matériel x grand schéma. !! = moins de 3 verifie.\n');
console.log(pad('Profil', w0) + SCHEMAS.map(([n]) => pad(n, w)).join(''));
const faibles = [];
for (const p of Object.keys(PROFILS)) {
  let line = pad(LIBELLES[p], w0);
  for (const [n] of SCHEMAS) {
    const { v, c } = count[p][n];
    const low = v < 3;
    if (low) faibles.push(`${p} x ${n} (${v})`);
    line += pad(`${v} (${c})${low ? ' !!' : ''}`, w);
  }
  console.log(line);
}
console.log(`\n${total} fiche(s) verifie ou controle_relecteur prises en compte ; ${faibles.length} case(s) sous 3 sur ${Object.keys(PROFILS).length * SCHEMAS.length}.`);
if (faibles.length) console.log('Cases < 3 : ' + faibles.join(', '));
