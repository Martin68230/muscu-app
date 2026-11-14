// D22 : génère src/images/gv-table.ts (TEXTE seulement : identifiants et noms de fichiers, aucune image) à partir de
// knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv. Seules les lignes « validé » (revue du coach) sont gardées.
// Usage : node tools/gen-gv-table.mjs   (--check : échoue si le fichier n'est pas à jour)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// La table n'a pas de variante pour la traction ; les notes du coach disent supination / pronation.
export const VARIANTE_FORCEE = { '1326': 'traction-barre-supination', '0652': 'traction-barre-pronation' };
export function build() {
  const rows = readFileSync(resolve(root, 'knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv'), 'utf8').replace(/\r/g, '').split('\n').filter(Boolean).map((l) => l.split('\t'));
  const [h, ...r] = rows; const c = (n) => h.indexOf(n);
  const out = r.filter((x) => x[c('statut')] === 'validé').map((x) => ({ id: x[c('hasan_id')], gif: x[c('gif')], fiche: x[c('notre_id')], variante: VARIANTE_FORCEE[x[c('hasan_id')]] ?? x[c('notre_variante')] }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const lignes = out.map((o) => `  { id: '${o.id}', gif: '${o.gif}', fiche: '${o.fiche}', variante: '${o.variante}' },`);
  return `// GÉNÉRÉ par tools/gen-gv-table.mjs : ne pas modifier à la main. Texte seulement (aucune image dans le dépôt).\n// Seules les correspondances « validé » (revue du coach) figurent ici : le reste n'a pas d'image.\nexport interface GvEntry { id: string; gif: string; fiche: string; variante: string }\nexport const GV_TABLE: GvEntry[] = [\n${lignes.join('\n')}\n];\n`;
}
const f = resolve(root, 'src/images/gv-table.ts');
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--check')) { if (readFileSync(f, 'utf8') !== build()) { console.error('gv-table.ts périmé : node tools/gen-gv-table.mjs'); process.exit(1); } }
  else writeFileSync(f, build());
}
