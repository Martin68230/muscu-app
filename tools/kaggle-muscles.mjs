// D24 c : squelettes de séance PAR MUSCLE à partir de la base Kaggle 600K (ODbL, provenance douteuse, statistiques NON SOURCÉES).
// Les CSV sont des DONNÉES NON FIABLES : lecture en flux seulement, aucune exécution, aucun envoi, aucun texte de programme recopié.
// Sortie : AGRÉGATS uniquement (comptes, médianes, parts), chacun avec le nombre de lignes / séances derrière.
// Passerelle : nom Kaggle -> nom Hasan (jeu hasaneyldrm, lecture seule) -> muscles Hasan -> nos muscles (knowledge/zones-correspondance.json).
// Usage : unzip -p archive.zip programs_detailed_boostcamp_kaggle.csv | node tools/kaggle-muscles.mjs - <dossier-hasaneyldrm> <sortie.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [input, hasanDir, out] = process.argv.slice(2);
if (input !== '-' || !hasanDir || !out) { console.error('Usage : voir l\'en-tête du script'); process.exit(2); }

async function* rows(stream) {
  let field = ''; let row = []; let q = false;
  for await (const chunk of stream) {
    const s = chunk.toString('utf8');
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) { if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; continue; }
      if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field.replace(/\r$/, '')); yield row; row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); yield row; }
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\b(\w{4,})s\b/g, '$1');
const EQ = { barbell: 'barbell', dumbbell: 'dumbbell', cable: 'cable', 'ez bar': 'ez barbell', kettlebell: 'kettlebell', band: 'band', 'smith machine': 'smith', bodyweight: '', weighted: 'weighted', machine: 'lever' };
const reorder = (n) => { const m = /^(.*?)\s*\(([a-z ]+)\)\s*$/.exec(n); return m && m[2] in EQ ? `${EQ[m[2]]} ${m[1]}`.trim() : n; };
const stripEq = (n) => n.replace(/^(barbell|dumbbell|cable|ez barbell|kettlebell|band|smith|weighted|lever|body weight|assisted|olympic barbell|resistance band)\s+/, '');

// --- Hasan -> nos muscles (clés de knowledge/zones-correspondance.json) ---
const hasan = JSON.parse(readFileSync(join(hasanDir, 'exercises.json'), 'utf8'));
const byName = new Map(); const byBase = new Map();
for (const h of hasan) { const k = norm(h.name); if (!byName.has(k)) byName.set(k, h); const b = stripEq(k); if (!byBase.has(b)) byBase.set(b, h); }
const T = { abs: 'abdominaux', quads: 'quadriceps', lats: 'grand_dorsal', calves: 'mollets', pectorals: 'pectoraux', glutes: 'fessiers', hamstrings: 'ischios', adductors: 'adducteurs', triceps: 'triceps', spine: 'erecteurs_rachis', 'upper back': 'trapezes', biceps: 'biceps', forearms: 'avant_bras', traps: 'trapezes', 'serratus anterior': 'dentele_anterieur', abductors: 'moyen_fessier', 'levator scapulae': 'trapezes', 'cardiovascular system': null };
const S = { 'hip flexors': 'flechisseurs_hanche', 'lower back': 'erecteurs_rachis', obliques: 'obliques', hamstrings: 'ischios', glutes: 'fessiers', biceps: 'biceps', rhomboids: 'rhomboides', forearms: 'avant_bras', triceps: 'triceps', core: 'abdominaux', abdominals: 'abdominaux', 'lower abs': 'abdominaux', quadriceps: 'quadriceps', calves: 'mollets', soleus: 'mollets', chest: 'pectoraux', 'upper chest': 'pectoraux', 'rear deltoids': 'deltoides_posterieurs', traps: 'trapezes', trapezius: 'trapezes', 'upper back': 'trapezes', deltoids: 'deltoides_anterieurs', 'rotator cuff': 'coiffe_des_rotateurs', 'latissimus dorsi': 'grand_dorsal', lats: 'grand_dorsal', groin: 'adducteurs', 'inner thighs': 'adducteurs', shins: 'tibial_anterieur', 'grip muscles': 'avant_bras', 'wrist flexors': 'avant_bras', 'wrist extensors': 'avant_bras', back: 'grand_dorsal' };
function deltoid(name) { return /rear|reverse|face pull|pull apart/.test(name) ? 'deltoides_posterieurs' : /lateral|side raise|upright|y raise/.test(name) ? 'deltoides_lateraux' : 'deltoides_anterieurs'; }
function musclesOf(h, nm) {
  let main = h.target === 'delts' ? deltoid(nm) : T[h.target];
  const sec = new Set();
  for (const s of h.secondary_muscles ?? []) { const m = s === 'shoulders' ? deltoid(nm) : S[s]; if (m && m !== main) sec.add(m); }
  return { main: main ?? null, sec: [...sec] };
}

// Règles de nom (écrites par nous) appliquées AVANT Hasan : les étiquettes de Hasan sont parfois étranges (squat -> fessiers, leg press -> fessiers)
// et plusieurs exercices fréquents de la base n'y existent pas (lat pulldown, leg curl, face pull, dips...). Ordre = priorité. Borne basse assumée.
const OV = [
  [/stretch|mobility|foam|warm ?up|cat cow|cardio|treadmill|jump rope|bike|^run|^walk$|^jog|swim|elliptical|ski|battle rope|test$/, 'AUCUN', []],
  [/neck/, 'cou', []],
  [/french press|overhead extension|katana|larsen|ad press/, 'triceps', []],
  [/crossover/, 'pectoraux', ['deltoides_anterieurs']],
  [/wall sit/, 'quadriceps', []],
  [/dead hang/, 'avant_bras', ['grand_dorsal']],
  [/lu raise/, 'deltoides_lateraux', ['trapezes']],
  [/wood chop/, 'obliques', ['abdominaux']],
  [/leg curl|hamstring curl|nordic/, 'ischios', ['mollets']],
  [/leg extension/, 'quadriceps', []],
  [/romanian|stiff|good morning|hip hinge|rack pull/, 'ischios', ['fessiers', 'erecteurs_rachis']],
  [/deadlift|trap bar/, 'fessiers', ['ischios', 'erecteurs_rachis', 'quadriceps']],
  [/hip thrust|glute bridge|glute kickback|donkey|cable kickback|pull through/, 'fessiers', ['ischios']],
  [/abduct/, 'moyen_fessier', []],
  [/adduct/, 'adducteurs', []],
  [/calf|tibialis/, 'mollets', []],
  [/squat|leg press|lunge|step up|sissy/, 'quadriceps', ['fessiers', 'ischios']],
  [/close grip bench|skull|tricep|triceps|pushdown|push down|kickback|jm press/, 'triceps', []],
  [/face pull|rear delt|reverse fly|reverse pec|bent over lateral|pull apart/, 'deltoides_posterieurs', ['trapezes']],
  [/lateral raise|side raise|upright row|y raise/, 'deltoides_lateraux', ['trapezes']],
  [/overhead press|shoulder press|military|arnold|push press|front raise|landmine press|handstand/, 'deltoides_anterieurs', ['triceps']],
  [/wrist curl|reverse wrist|farmer|grip|forearm/, 'avant_bras', []],
  [/curl/, 'biceps', ['avant_bras']],
  [/shrug/, 'trapezes', []],
  [/pulldown|pull down|pull up|pullup|chin up|chinup|pullover|muscle up/, 'grand_dorsal', ['biceps', 'trapezes']],
  [/row/, 'trapezes', ['grand_dorsal', 'biceps', 'deltoides_posterieurs']],
  [/russian twist|woodchop|oblique|side bend|pallof|suitcase/, 'obliques', ['abdominaux']],
  [/crunch|sit up|situp|leg raise|knee raise|plank|ab wheel|rollout|dead bug|hollow|v up|mountain climber|bird dog|ab /, 'abdominaux', ['flechisseurs_hanche']],
  [/back extension|hyperextension|superman/, 'erecteurs_rachis', ['fessiers']],
  [/fly|flye|pec deck|chest press|bench press|push up|pushup|dip|floor press|svend/, 'pectoraux', ['triceps', 'deltoides_anterieurs']],
  [/thruster|clean|snatch|swing|burpee|jump/, 'AUCUN', []],
];
function override(nm) {
  for (const [re, main, sec] of OV) if (re.test(nm)) return main === 'AUCUN' ? { main: null, sec: [], cardio: true } : { main, sec };
  return null;
}
const GROUP = {
  push: new Set(['pectoraux', 'deltoides_anterieurs', 'deltoides_lateraux', 'triceps']),
  pull: new Set(['grand_dorsal', 'trapezes', 'rhomboides', 'biceps', 'deltoides_posterieurs', 'avant_bras']),
  legs: new Set(['quadriceps', 'ischios', 'fessiers', 'moyen_fessier', 'mollets', 'adducteurs', 'flechisseurs_hanche', 'tibial_anterieur']),
};
const grpOf = (m) => (GROUP.push.has(m) ? 'push' : GROUP.pull.has(m) ? 'pull' : GROUP.legs.has(m) ? 'legs' : 'tronc_autres');
const COMPOUND = /press|squat|deadlift|row|pull ?up|chin ?up|dip|lunge|pulldown|pull down|thrust|clean|snatch|push ?up|step up|good morning|split squat/;
const ISO = /\bfly|flye|raise|curl|extension|kickback|push ?down|shrug|crunch|calf|face pull|pec deck|abduction|adduction/;
const role = (nm) => (ISO.test(nm) && !/press/.test(nm) ? 'isolation' : COMPOUND.test(nm) ? 'polyarticulaire' : 'autre');

const inc = (m, k, n = 1) => { m[k] = (m[k] ?? 0) + n; };
const quant = (arr) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))]; return { n: a.length, p25: q(0.25), median: q(0.5), p75: q(0.75), p90: q(0.9) }; };
const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

let head = null; const col = {};
let parRegle = 0; let lignes = 0; let reliees = 0; let lignesCardioMobilite = 0;
const freqNon = {}; const freqOui = {};
const sessions = new Map(); // titre|jour -> lignes de la semaine 1
const wk = new Map(); // titre|jour -> {1:Set,2:Set}
const repsRole = { polyarticulaire: {}, isolation: {}, autre: {} }; const setsRole = { polyarticulaire: [], isolation: [], autre: [] };

for await (const r of rows(process.stdin)) {
  if (!head) { head = r; head.forEach((h, i) => { col[h] = i; }); continue; }
  if (r.length < head.length - 1) continue;
  lignes++;
  const raw = r[col.exercise_name] ?? ''; const wkn = +r[col.week]; const day = r[col.day];
  const key = `${r[col.title]}|${day}`;
  const nm = norm(reorder(raw.toLowerCase()));
  if (/stretch|mobility|foam|warm ?up|ankle|wrist circle|cat cow|rotation/.test(nm) || /run|bike|row machine|treadmill|jump rope|cardio|swim|walk/.test(nm) && !/barbell|dumbbell|cable/.test(nm)) lignesCardioMobilite++;
  const h = byName.get(nm) ?? byBase.get(stripEq(nm));
  const nl = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const ov = override(nl); const m = ov ?? (h ? musclesOf(h, nm) : null);
  if (wkn === 1 || wkn === 2) {
    let w = wk.get(key); if (!w) { w = { 1: new Set(), 2: new Set() }; wk.set(key, w); } w[wkn].add(nm);
  }
  if (m && m.main) { reliees++; inc(freqOui, raw); if (ov) parRegle++; } else inc(freqNon, raw);
  if (wkn !== 1) continue;
  const sets = parseFloat(r[col.sets]); const reps = parseFloat(r[col.reps]);
  let s = sessions.get(key); if (!s) { s = []; sessions.set(key, s); }
  s.push({ nm, nl, m, sets: Number.isFinite(sets) ? sets : null, reps: Number.isFinite(reps) ? reps : null });
}

// --- classement des séances par contenu (le titre n'est lisible que pour 17 % des programmes) ---
const TYPES = ['poussee', 'tirage', 'jambes', 'haut', 'bas', 'corps_entier'];
const agg = {}; for (const t of TYPES) agg[t] = { seances: 0, nbLignes: [], nbLiees: [], setsTotal: [], setsParEx: [], parMuscle: {}, principaux: {}, secondaires: {}, compoParPos: {}, premiereIso: [], reps: { polyarticulaire: {}, isolation: {} }, setsRole: { polyarticulaire: [], isolation: [] } };
let nonClassees = 0; let seancesLues = 0;
for (const [, s] of sessions) {
  seancesLues++;
  const liees = s.filter((x) => x.m && x.m.main && x.sets !== null && x.sets > 0 && x.sets <= 12);
  if (liees.length < 3) { nonClassees++; continue; }
  const part = { push: 0, pull: 0, legs: 0, tronc_autres: 0 }; let tot = 0;
  for (const x of liees) { const g = grpOf(x.m.main); part[g] += x.sets; tot += x.sets; }
  const P = part.push / tot, Q = part.pull / tot, L = part.legs / tot;
  let type;
  if (L >= 0.6) type = 'jambes';
  else if (L < 0.15) type = P >= 0.6 ? 'poussee' : Q >= 0.6 ? 'tirage' : P >= 0.25 && Q >= 0.25 ? 'haut' : null;
  else type = P >= 0.15 && Q >= 0.15 ? 'corps_entier' : L >= 0.4 ? 'bas' : null;
  if (!type) { nonClassees++; continue; }
  const a = agg[type]; a.seances++; a.nbLignes.push(s.length); a.nbLiees.push(liees.length);
  a.setsTotal.push(tot);
  let first = null;
  liees.forEach((x, i) => {
    const { main, sec } = x.m; const ro = role(x.nl);
    a.setsParEx.push(x.sets);
    inc(a.parMuscle, main, x.sets); inc(a.principaux, main); for (const m of sec) inc(a.secondaires, m);
    const pos = Math.min(i + 1, 6); (a.compoParPos[pos] ??= { n: 0, poly: 0, iso: 0 }); a.compoParPos[pos].n++; if (ro === 'polyarticulaire') a.compoParPos[pos].poly++; if (ro === 'isolation') a.compoParPos[pos].iso++;
    if (ro === 'isolation' && first === null) first = i + 1;
    if (ro !== 'autre') { a.setsRole[ro].push(x.sets); if (x.reps !== null && x.reps > 0 && x.reps <= 50) { const b = x.reps <= 5 ? '1-5' : x.reps <= 8 ? '6-8' : x.reps <= 12 ? '9-12' : x.reps <= 15 ? '13-15' : '16+'; inc(a.reps[ro], b); } }
  });
  if (first !== null) a.premiereIso.push(first);
}

const res = { source: 'Kaggle 600K (ODbL) — statistiques NON SOURCÉES, biais salle / bodybuilding, étiquettes multiples, aucun suivi de résultats', lignes, partLignesReliees: round(reliees / lignes, 3), partLignesReliees_parRegleDeNom: round(parRegle / lignes, 3), partCardioMobiliteMotsCles: round(lignesCardioMobilite / lignes, 3), seancesSemaine1Lues: seancesLues, seancesNonClassees: nonClassees, types: {} };
for (const t of TYPES) {
  const a = agg[t]; if (!a.seances) continue;
  const tot = Object.values(a.parMuscle).reduce((x, y) => x + y, 0);
  res.types[t] = {
    seances: a.seances, exercicesReliesParSeance: quant(a.nbLiees), lignesParSeance: quant(a.nbLignes), seriesParSeance: quant(a.setsTotal), seriesParExercice: quant(a.setsParEx),
    partSeriesParMuscle: Object.fromEntries(Object.entries(a.parMuscle).sort((x, y) => y[1] - x[1]).map(([m, v]) => [m, round(v / tot, 3)])),
    muscleCibleDansPartDesSeances: Object.fromEntries(Object.entries(a.principaux).sort((x, y) => y[1] - x[1]).slice(0, 14).map(([m, v]) => [m, round(v / a.seances, 2)])),
    muscleSecondaireParSeance: Object.fromEntries(Object.entries(a.secondaires).sort((x, y) => y[1] - x[1]).slice(0, 8).map(([m, v]) => [m, round(v / a.seances, 2)])),
    ordre: Object.fromEntries(Object.entries(a.compoParPos).map(([p, v]) => [p, { lignes: v.n, partPolyarticulaire: round(v.poly / v.n, 2), partIsolation: round(v.iso / v.n, 2) }])),
    rangPremiereIsolation: quant(a.premiereIso),
    repsPolyarticulaire: a.reps.polyarticulaire, repsIsolation: a.reps.isolation,
    seriesParExPoly: quant(a.setsRole.polyarticulaire), seriesParExIso: quant(a.setsRole.isolation),
  };
}
// variété : part des exercices de la semaine 1 retrouvés à la semaine 2 (même programme, même jour)
let n1 = 0, rep = 0, pairs = 0;
for (const [, w] of wk) { if (w[1].size && w[2].size) { pairs++; n1 += w[1].size; for (const e of w[1]) if (w[2].has(e)) rep++; } }
res.variete = { joursComparesSemaine1Et2: pairs, partExercicesIdentiquesSemaine2: round(rep / n1, 3) };
res.frequentsSansMuscle = Object.entries(freqNon).sort((a, b) => b[1] - a[1]).slice(0, 40);
res.partDesLignesDesTop150SansMuscle = (() => { const t = Object.entries({ ...freqNon, ...freqOui }).sort((a, b) => b[1] - a[1]).slice(0, 150); const set = new Set(Object.keys(freqNon)); const sum = t.reduce((a, [, n]) => a + n, 0); const no = t.filter(([k]) => set.has(k) && !freqOui[k]).reduce((a, [, n]) => a + n, 0); return round(no / sum, 3); })();
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ lignes, reliees: res.partLignesReliees, seances: seancesLues, nonClassees, types: Object.fromEntries(Object.entries(res.types).map(([k, v]) => [k, v.seances])), variete: res.variete }));
