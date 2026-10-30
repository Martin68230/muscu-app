// D24 b : quels exercices FRÉQUENTS de la base Kaggle n'ont pas d'équivalent dans nos fiches ? (agrégats seulement, aucun programme recopié)
// Passerelle : nom Kaggle -> nom Hasan (jeu hasaneyldrm, lu en lecture seule) -> notre fiche via CORRESPONDANCE-GYMVISUAL.tsv.
// Usage : node tools/kaggle-couverture.mjs <stats-detailed.json> <dossier-hasaneyldrm>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [statsPath, hasanDir] = process.argv.slice(2);
if (!statsPath || !hasanDir) { console.error('Usage : node tools/kaggle-couverture.mjs <stats-detailed.json> <dossier-hasaneyldrm>'); process.exit(2); }
const stats = JSON.parse(readFileSync(statsPath, 'utf8'));
const hasan = JSON.parse(readFileSync(join(hasanDir, 'exercises.json'), 'utf8'));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\b(\w{4,})s\b/g, '$1');
// « bench press (barbell) » -> « barbell bench press » (convention de Hasan)
const EQ = { barbell: 'barbell', dumbbell: 'dumbbell', cable: 'cable', 'ez bar': 'ez barbell', kettlebell: 'kettlebell', band: 'band', 'smith machine': 'smith', bodyweight: '', weighted: 'weighted', machine: 'lever' };
const reorder = (n) => { const m = /^(.*?)\s*\(([a-z ]+)\)\s*$/.exec(n); return m && m[2] in EQ ? `${EQ[m[2]]} ${m[1]}`.trim() : n; };
const hasanByName = new Map(hasan.map((h) => [norm(h.name), h]));
const tsv = readFileSync('knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv', 'utf8').replace(/\r/g, '').split('\n').filter(Boolean).map((l) => l.split('\t'));
const head = tsv[0]; const ix = (n) => head.indexOf(n);
const ours = new Map(tsv.slice(1).filter((r) => r[ix('statut')] !== 'sans équivalent').map((r) => [r[ix('hasan_id')], r[ix('notre_id')]]));

let totalFreq = 0; let covered = 0; let inHasan = 0; const missing = [];
for (const [name, n] of stats.exercices_les_plus_frequents) {
  totalFreq += n;
  const h = hasanByName.get(norm(reorder(name)));
  if (h) inHasan += n;
  if (h && ours.has(h.id)) covered += n; else missing.push({ name, n, hasan: h ? h.name : null });
}
console.log(`Top ${stats.exercices_les_plus_frequents.length} exercices Kaggle : ${totalFreq} lignes ; reconnus chez Hasan ${(100 * inHasan / totalFreq).toFixed(0)} % ; avec une de NOS fiches (correspondance non « sans équivalent ») ${(100 * covered / totalFreq).toFixed(0)} %.`);
console.log('Fréquents SANS équivalent chez nous (nom Kaggle · lignes · nom Hasan si reconnu) :');
for (const m of missing.slice(0, 60)) console.log(`- ${m.name} · ${m.n}${m.hasan ? ` · Hasan « ${m.hasan} »` : ' · hors Hasan'}`);
