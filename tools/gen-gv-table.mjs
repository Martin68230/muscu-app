// D22 : génère src/images/gv-table.ts (TEXTE seulement : identifiants et noms de fichiers, aucune image).
// Sources : knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv (lignes « validé » = sûr, revue du coach) et
// CORRESPONDANCE-VARIANTES-coach.tsv (élargissement : niveau sûr / proche, par variante). Fiche sans ligne = pas d'image.
// + CORRESPONDANCE-FICHES-HASAN.json (entrée simple pour le convertisseur : [{ hasan_id, fiche, variante, niveau? }]).
// Usage : node tools/gen-gv-table.mjs   (le test vérifie que le fichier est à jour)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// La table n'a pas de variante pour la traction ; les notes du coach disent supination / pronation.
export const VARIANTE_FORCEE = { '1326': 'traction-barre-supination', '0652': 'traction-barre-pronation' };
// Retraits décidés à la relecture du chef de projet : « rebonds de chevilles » = petits sauts, un GIF de montée sur pointes les contredirait.
export const EXCLUS = new Set(['rebonds-chevilles|1373']);
const lire = (f) => readFileSync(resolve(root, 'knowledge/exercices', f), 'utf8').replace(/\r/g, '').split('\n').filter(Boolean).map((l) => l.split('\t'));
export function build() {
  const [h, ...r] = lire('CORRESPONDANCE-GYMVISUAL.tsv'); const c = (n) => h.indexOf(n);
  const gifs = new Map(r.map((x) => [x[c('hasan_id')], x[c('gif')]]));
  const out = r.filter((x) => x[c('statut')] === 'validé').map((x) => ({ id: x[c('hasan_id')], fiche: x[c('notre_id')], variante: VARIANTE_FORCEE[x[c('hasan_id')]] ?? x[c('notre_variante')], niveau: 'sûr' }));
  if (existsSync(resolve(root, 'knowledge/exercices/CORRESPONDANCE-VARIANTES-coach.tsv'))) {
    const [, ...v] = lire('CORRESPONDANCE-VARIANTES-coach.tsv');
    // la revue par variante l'emporte sur l'ancienne table pour les GIF qu'elle traite
    const traites = new Set(v.flatMap((x) => x[2].split(',').map((i) => i.trim())));
    for (let i = out.length - 1; i >= 0; i--) if (traites.has(out[i].id)) out.splice(i, 1);
    for (const x of v) for (const id of x[2].split(',').map((s) => s.trim()).filter(Boolean)) out.push({ id, fiche: x[0], variante: x[1], niveau: x[3] === 'proche' ? 'proche' : 'sûr' });
  }
  // Fiches créées à partir du jeu (convertisseur hasan-vers-fiches.mjs) : correspondance par identifiant exact, sans rapprochement flou.
  const auto = resolve(root, 'knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json');
  if (existsSync(auto)) for (const x of JSON.parse(readFileSync(auto, 'utf8'))) out.push({ id: String(x.hasan_id), fiche: x.fiche, variante: x.variante, niveau: x.niveau === 'proche' ? 'proche' : 'sûr' });
  // dédoublonnage (fiche, variante, id) : le niveau « sûr » l'emporte ; ordre : sûr avant proche
  const m = new Map();
  for (const o of out) { const k = `${o.fiche}|${o.variante}|${o.id}`; if (!m.has(k) || (o.niveau === 'sûr' && m.get(k).niveau !== 'sûr')) m.set(k, o); }
  const all = [...m.values()].filter((o) => !EXCLUS.has(`${o.fiche}|${o.id}`)).sort((a, b) => a.fiche.localeCompare(b.fiche) || a.variante.localeCompare(b.variante) || (a.niveau === b.niveau ? a.id.localeCompare(b.id) : a.niveau === 'sûr' ? -1 : 1));
  const lignes = all.map((o) => `  { id: '${o.id}', gif: '${gifs.get(o.id)}', fiche: '${o.fiche}', variante: '${o.variante}', niveau: '${o.niveau}' },`);
  return `// GÉNÉRÉ par tools/gen-gv-table.mjs : ne pas modifier à la main. Texte seulement (aucune image dans le dépôt).\n// « sûr » = même mouvement, même matériel ; « proche » = même geste, autre matériel (revue du coach). Le reste n'a pas d'image.\nexport interface GvEntry { id: string; gif: string; fiche: string; variante: string; niveau: 'sûr' | 'proche' }\nexport const GV_TABLE: GvEntry[] = [\n${lignes.join('\n')}\n];\n`;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(resolve(root, 'src/images/gv-table.ts'), build());
