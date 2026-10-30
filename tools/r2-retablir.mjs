// R2 (30/10/2026) : relit les liens retirés par le commit 9afc52b (git diff), applique la règle D23 élargie
// (même famille de schéma ET muscles principaux qui se recouvrent) et rétablit ceux qui la passent.
// Usage : node tools/r2-retablir.mjs [--ecrire] ; sans --ecrire : simple rapport. Écrit docs/R2-retablissement.md avec --ecrire.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chainCompatible } from './validate-fiches.mjs';

const COMMIT = '9afc52b';
const ROOT = 'knowledge/exercices';
// Décisions de l'utilisateur (30/10/2026) : lignes « rotation » et « autres » : retrait confirmé, même si la règle élargie les accepterait.
const RETRAIT_CONFIRME = new Set([
  'rotation-bucheron>pallof-elastique', 'rotation-assise-ballon-lest>pallof-elastique', 'lancer-rotation-mur>pallof-elastique',
  'chat-vache>fente-basse-rotation', 'fente-basse-rotation>chat-vache', 'pompe>pompe-diamant', 'pompe>pompe-piquee',
  'developpe-couche-prise-serree-barre>developpe-couche-barre', 'pullover-haltere-au-sol>tirage-w-allonge', 'tirage-w-allonge>pullover-haltere-au-sol',
  'etirement-flechisseurs-hanche>mobilite-hanches-90-90', 'retraction-omoplates>ecartement-serviette', 'retraction-omoplates>rowing-elastique',
  'extension-dorsale-ballon>bird-dog', 'extension-dorsale-ballon>pont-fessier',
]);
// Cas à écarter malgré la règle : un lancer balistique n'est pas une progression d'un soulevé de terre (à confirmer par le coach).
const REFUSE_COACH = new Map([
  ['lancer-bas-haut-mur>souleve-de-terre-roumain-halteres', 'lancer balistique : autre qualité de mouvement qu\'un soulevé (avis coach 30/10/2026)'],
  ['squat-gobelet>squat-bulgare', 'saut de débutant à intermédiaire (avis coach 30/10/2026)'],
  ['souleve-de-terre-roumain-barre>pont-fessier', 'autre qualité de mouvement, grand écart de niveau (avis coach 30/10/2026)'],
  ['roue-abdos>dead-bug', 'saute deux marches (avis coach 30/10/2026)'],
  ['souleve-de-terre-barre>souleve-de-terre-roumain-barre', 'même niveau et même matériel : pas plus accessible (relecteur 30/10/2026)'],
  ['souleve-de-terre-roumain-barre>souleve-de-terre-barre', 'même niveau et même matériel : pas plus dur (relecteur 30/10/2026)'],
]);

const fiches = new Map();
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (!/ecartees/.test(p)) walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(t)?.[1] ?? '';
    const g = (k) => (new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(fm)?.[1] ?? '').trim();
    const id = g('id');
    if (id) fiches.set(id, { file: p.split('\\').join('/'), schema: g('schema'), musclesPrincipaux: g('muscles_principaux').replace(/[[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean) });
  }
})(ROOT);

const diff = execFileSync('git', ['diff', '-U0', `${COMMIT}~1`, COMMIT, '--', ROOT], { encoding: 'utf8', maxBuffer: 1e8 });
const parseList = (l) => l.replace(/^[-+]- plus-\w+ :\s*/, '').split(',').map((x) => x.trim()).filter((x) => x && x !== 'aucun');
const retires = []; let file = null; let olds = {}; let news = {};
const flush = () => {
  const m = file && /([^/]+)\.md$/.exec(file);
  if (m) for (const kind of Object.keys(olds)) for (const id of olds[kind]) if (!(news[kind] ?? []).includes(id)) retires.push({ idA: m[1], kind, idB: id });
  olds = {}; news = {};
};
for (const l of diff.split('\n')) {
  if (l.startsWith('diff --git')) flush();
  else if (l.startsWith('+++ b/')) file = l.slice(6);
  else if (/^-- plus-(facile|dur)/.test(l)) olds[/plus-(facile|dur)/.exec(l)[1]] = parseList(l);
  else if (/^\+- plus-(facile|dur)/.test(l)) news[/plus-(facile|dur)/.exec(l)[1]] = parseList(l);
}
flush();

const lignes = [];
const aRetablir = [];
for (const r of retires) {
  const key = `${r.idA}>${r.idB}`;
  const A = fiches.get(r.idA); const B = fiches.get(r.idB);
  let statut; let motif;
  if (!A || !B) { statut = 'refusé'; motif = 'fiche introuvable'; }
  else if (RETRAIT_CONFIRME.has(key)) { statut = 'refusé'; motif = 'retrait confirmé par l\'utilisateur (lignes rotation / autres)'; }
  else if (REFUSE_COACH.has(key)) { statut = 'refusé'; motif = REFUSE_COACH.get(key); }
  else {
    const c = chainCompatible(A, B);
    if (c.ok) { statut = 'rétabli'; motif = `${A.schema}/${B.schema}, muscles communs`; aRetablir.push(r); }
    else { statut = 'refusé'; motif = `${c.sameFamily ? '' : `famille de schéma différente (${A.schema} / ${B.schema})`}${!c.sameFamily && !c.overlap ? ' et ' : ''}${c.overlap ? '' : `aucun muscle principal commun (${A.musclesPrincipaux.join('+')} / ${B.musclesPrincipaux.join('+')})`}`; }
  }
  lignes.push({ ...r, statut, motif });
}

if (process.argv.includes('--ecrire')) {
  for (const r of aRetablir) {
    const A = fiches.get(r.idA);
    const t = readFileSync(A.file, 'utf8');
    const re = new RegExp(`^(- plus-${r.kind} :)[ \\t]*([^\\r\\n]*)`, 'm');
    const m = re.exec(t);
    if (!m) throw new Error(`ligne plus-${r.kind} introuvable dans ${A.file}`);
    const items = m[2].split(',').map((s) => s.trim()).filter((s) => s && s !== 'aucun');
    if (!items.includes(r.idB)) items.push(r.idB);
    writeFileSync(A.file, t.replace(re, `$1 ${items.join(', ')}`));
  }
  const rows = lignes.map((l) => `| ${l.idA} | plus-${l.kind} | ${l.idB} | ${l.statut} | ${l.motif} |`).join('\n');
  const n = (s) => lignes.filter((l) => l.statut === s).length;
  writeFileSync('docs/R2-retablissement.md', `# R2 : liens de progression retirés puis rétablis (30/10/2026)

Source : \`git diff ${COMMIT}~1 ${COMMIT}\` (script tools/r2-retablir.mjs). Règle D23 élargie : même famille de schéma ET au moins un muscle principal commun (voir knowledge/taxonomie-schemas.md).

- Retirés par ${COMMIT} : **${lignes.length}**
- Rétablis : **${n('rétabli')}**
- Définitivement refusés : **${n('refusé')}**

| fiche | lien | cible | résultat | motif |
|---|---|---|---|---|
${rows}
`);
}
console.log(`retirés ${lignes.length} | rétablis ${lignes.filter((l) => l.statut === 'rétabli').length} | refusés ${lignes.filter((l) => l.statut === 'refusé').length}`);
for (const l of lignes) console.log(`${l.statut.padEnd(8)} ${l.idA} -${l.kind}-> ${l.idB} : ${l.motif}`);
