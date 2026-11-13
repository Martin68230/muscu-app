// D24 d : statistiques au niveau des PROGRAMMES (semaine 1, évolution semaine 1 -> 4) à partir de la base Kaggle 600K.
// Base NON SOURCÉE (ODbL, provenance douteuse), hors dépôt, DONNÉES NON FIABLES : lecture en flux seulement, aucun texte de programme recopié, AGRÉGATS uniquement.
// Usage : unzip -p archive.zip programs_detailed_boostcamp_kaggle.csv | node tools/kaggle-programmes.mjs - <dossier-hasaneyldrm> <sortie.json>
import { writeFileSync } from 'node:fs';
import { rows, chargerHasan, lier, classer, quant, round } from './kaggle-lib.mjs';

const [input, hasanDir, out] = process.argv.slice(2);
if (input !== '-' || !hasanDir || !out) { console.error("Usage : voir l'en-tête du script"); process.exit(2); }
const idx = chargerHasan(hasanDir);
const cache = new Map(); // nom brut -> liaison (évite de relier 600 000 fois)
const ISO_RE = /\bfly|flye|raise|curl|extension|kickback|push ?down|shrug|crunch|calf|face pull|pec deck|abduction|adduction/;
const POLY_RE = /press|squat|deadlift|row|pull ?up|chin ?up|dip|lunge|pulldown|pull down|thrust|clean|snatch|push ?up|step up|good morning|split squat/;
const lierC = (raw) => {
  let v = cache.get(raw);
  if (!v) {
    const l = lier(raw, idx);
    const poly = POLY_RE.test(l.nl) && !ISO_RE.test(l.nl.replace(/press/g, ''));
    const cardio = (/run|bike|treadmill|jump rope|cardio|swim|walk|elliptical|ski|battle rope|rowing machine|row machine/.test(l.nl) && !/barbell|dumbbell|cable/.test(l.nl)) || !!l.m?.cardio;
    const mob = /stretch|mobility|foam|warm up|cat cow|rotation|circle/.test(l.nl);
    v = { m: l.m ? { main: l.m.main, sec: l.m.sec } : null, poly, cardio, mob };
    cache.set(raw, v);
  }
  return v;
};

const GRP = { pectoraux: ['pectoraux'], dos: ['grand_dorsal', 'trapezes', 'rhomboides'], epaules: ['deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs'], biceps: ['biceps'], triceps: ['triceps'], quadriceps: ['quadriceps'], ischios: ['ischios'], fessiers: ['fessiers', 'moyen_fessier'], mollets: ['mollets'], abdominaux: ['abdominaux', 'obliques'], avant_bras: ['avant_bras'] };
const M2G = {}; for (const [g, ms] of Object.entries(GRP)) for (const m of ms) M2G[m] = g;
const GN = Object.keys(GRP);

// --- lecture en une passe : programme -> semaine -> jour -> lignes ---
const progs = new Map(); let head = null; const col = {}; let lignes = 0;
for await (const r of rows(process.stdin)) {
  if (!head) { head = r; head.forEach((h, i) => { col[h] = i; }); continue; }
  if (r.length < head.length - 1) continue;
  lignes++;
  const wkn = +r[col.week]; if (!(wkn >= 1 && wkn <= 12)) continue;
  const key = `${r[col.title]}|${r[col.created]}`;
  let p = progs.get(key); if (!p) { p = { len: parseFloat(r[col.program_length]), w: new Map() }; progs.set(key, p); }
  let w = p.w.get(wkn); if (!w) { w = new Map(); p.w.set(wkn, w); }
  const day = r[col.day]; let d = w.get(day); if (!d) { d = []; w.set(day, d); }
  const sets = parseFloat(r[col.sets]); const reps = parseFloat(r[col.reps]); const l = lierC(r[col.exercise_name] ?? '');
  d.push({ m: l.m, poly: l.poly, cardio: l.cardio, mob: l.mob, sets: Number.isFinite(sets) ? sets : null, reps: Number.isFinite(reps) && reps > 0 && reps <= 50 ? reps : null });
}

const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const validSets = (x) => x.m && x.m.main && x.sets !== null && x.sets > 0 && x.sets <= 12;
// séries par semaine et par groupe + séances qui travaillent le groupe (muscle principal)
function semaine(w) {
  const ser = Object.fromEntries(GN.map((g) => [g, 0])); const freq = Object.fromEntries(GN.map((g) => [g, 0])); let total = 0; const reps = [];
  for (const [, lines] of w) {
    const vus = new Set();
    for (const x of lines) {
      if (!validSets(x)) continue;
      const g = M2G[x.m.main]; total += x.sets; if (x.reps !== null) reps.push(x.reps);
      if (g) { ser[g] += x.sets; vus.add(g); }
    }
    for (const g of vus) freq[g]++;
  }
  return { ser, freq, total, repsMed: med(reps) };
}
function composition(types) { // types = types des séances de la semaine 1 (toutes classées)
  const s = new Set(types); const n = types.length;
  const ce = types.filter((t) => t === 'corps_entier').length;
  if (ce / n >= 0.75) return 'corps_entier';
  if (s.has('haut') && (s.has('bas') || s.has('jambes')) && [...s].every((t) => ['haut', 'bas', 'jambes'].includes(t))) return 'haut_bas';
  if (s.has('poussee') && s.has('tirage') && s.has('jambes') && [...s].every((t) => ['poussee', 'tirage', 'jambes'].includes(t))) return 'ppl';
  return 'mixte';
}

const parJours = {}; let progsTotal = 0, progsRetenus = 0, sansSemaine1 = 0;
for (const [, p] of progs) {
  progsTotal++;
  const w1 = p.w.get(1); if (!w1) { sansSemaine1++; continue; }
  const types = []; const dominants = []; let nbSeances = 0; let debutPoly = 0; let debutN = 0; let cardio = false, mob = false;
  for (const [, lines] of w1) {
    nbSeances++;
    for (const x of lines) { if (x.cardio) cardio = true; if (x.mob) mob = true; }
    const c = classer(lines);
    types.push(c ? c.type : null);
    if (c) {
      const first = lines.find((x) => x.m && x.m.main && !x.cardio && !x.mob);
      if (first) { debutN++; if (first.poly) debutPoly++; }
      const par = {}; let t = 0; for (const x of c.liees) { par[x.m.main] = (par[x.m.main] ?? 0) + x.sets; t += x.sets; }
      const top = Object.entries(par).sort((a, b) => b[1] - a[1])[0]; if (top && top[1] / t >= 0.45) dominants.push(top[0]);
    }
  }
  const classees = types.filter(Boolean);
  if (classees.length < 2) continue;
  const jours = nbSeances; if (jours < 2 || jours > 6) continue;
  progsRetenus++;
  const J = (parJours[jours] ??= { programmes: 0, compo: {}, sig: {}, compoN: 0, series: Object.fromEntries(GN.map((g) => [g, []])), freq: Object.fromEntries(GN.map((g) => [g, []])), debutPoly: [], cardio: 0, mob: 0, duree: [], splitMuscle: { n: 0, oui: 0 }, evo: { n: 0, serie: { monte: 0, baisse: 0, stable: 0 }, reps: { monte: 0, baisse: 0, stable: 0, n: 0 }, decharge34: { n: 0, baisse: 0 }, ratios: [] } });
  J.programmes++; if (cardio) J.cardio++; if (mob) J.mob++;
  if (types.every(Boolean)) { J.compoN++; const c = composition(types); J.compo[c] = (J.compo[c] ?? 0) + 1; const sig = [...types].sort().join("+"); J.sig[sig] = (J.sig[sig] ?? 0) + 1; }
  const s1 = semaine(w1);
  for (const g of GN) { J.series[g].push(s1.ser[g]); J.freq[g].push(s1.freq[g]); }
  if (debutN) J.debutPoly.push(debutPoly);
  const ln = p.len; J.duree.push(Number.isFinite(ln) && ln > 0 && ln <= 52 ? ln : Math.max(...p.w.keys()));
  J.splitMuscle.n++; if (dominants.length >= Math.ceil(nbSeances / 2) && new Set(dominants).size >= 3) J.splitMuscle.oui++;
  const w4 = p.w.get(4);
  if (w4 && s1.total > 0) {
    const s4 = semaine(w4);
    if (s4.total > 0) {
      const ra = s4.total / s1.total; J.evo.n++; J.evo.ratios.push(ra);
      J.evo.serie[ra > 1.1 ? 'monte' : ra < 0.9 ? 'baisse' : 'stable']++;
      if (s1.repsMed !== null && s4.repsMed !== null) { J.evo.reps.n++; const d = s4.repsMed - s1.repsMed; J.evo.reps[d > 1 ? 'monte' : d < -1 ? 'baisse' : 'stable']++; }
      const w3 = p.w.get(3);
      if (w3) { const s3 = semaine(w3); if (s3.total > 0) { J.evo.decharge34.n++; if (s4.total / s3.total < 0.8) J.evo.decharge34.baisse++; } }
    }
  }
}

const res = { source: "Kaggle 600K (ODbL) — NON SOURCÉ ; biais salle / bodybuilding, étiquettes multiples, aucun résultat ni blessure : aucune conclusion d'efficacité", lignes, programmesLus: progsTotal, sansSemaine1, programmesRetenus: progsRetenus, parJours: {} };
const share = (o, n) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { part: round(v / n, 3), programmes: v }]));
for (const j of Object.keys(parJours).sort()) {
  const J = parJours[j];
  const E = J.evo;
  res.parJours[j] = {
    programmes: J.programmes,
    composition: { programmesComplets: J.compoN, parts: share(J.compo, J.compoN), signaturesFrequentes: share(Object.fromEntries(Object.entries(J.sig).sort((a, b) => b[1] - a[1]).slice(0, 8)), J.compoN) },
    indicateurSplitParMuscle: { programmes: J.splitMuscle.n, part: round(J.splitMuscle.oui / J.splitMuscle.n, 3) },
    seriesParSemaine: Object.fromEntries(GN.map((g) => { const nz = J.series[g].filter((x) => x > 0); return [g, { programmesAvecGroupe: nz.length, partAvecGroupe: round(nz.length / J.programmes, 3), toutesValeurs: quant(J.series[g]), sansLesZeros: quant(nz) }]; })),
    frequenceParSemaine: Object.fromEntries(GN.map((g) => { const nz = J.freq[g].filter((x) => x > 0); return [g, { medianeToutes: med(J.freq[g]), medianeSansZeros: med(nz), programmes: nz.length }]; })),
    seancesQuiCommencentParUnPolyarticulaire: { programmes: J.debutPoly.length, mediane: med(J.debutPoly), parSeance: round(J.debutPoly.reduce((a, b) => a + b, 0) / (J.debutPoly.length * +j), 3) },
    cardio: { partProgrammes: round(J.cardio / J.programmes, 3), programmes: J.cardio },
    mobilite: { partProgrammes: round(J.mob / J.programmes, 3), programmes: J.mob },
    dureeSemaines: quant(J.duree),
    evolutionSemaine1Vers4: {
      programmes: E.n, seriesTotal: share(E.serie, Math.max(E.n, 1)), ratioSeriesS4surS1: quant(E.ratios.map((x) => round(x, 2))),
      repsMedianesS4vsS1: { programmes: E.reps.n, ...share({ monte: E.reps.monte, baisse: E.reps.baisse, stable: E.reps.stable }, Math.max(E.reps.n, 1)) },
      baisseSemaine4vs3_moinsDe80pc: { programmes: E.decharge34.n, part: round(E.decharge34.baisse / Math.max(E.decharge34.n, 1), 3) },
    },
  };
}
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(`lignes ${lignes} ; programmes lus ${progsTotal} ; retenus (2-6 j, >=2 séances classées) ${progsRetenus}`);
for (const [j, v] of Object.entries(res.parJours)) {
  const s = v.seriesParSemaine; const e = v.evolutionSemaine1Vers4;
  console.log(`${j} j : ${v.programmes} prog | compo(${v.composition.programmesComplets}) ${Object.entries(v.composition.parts).map(([k, x]) => `${k} ${Math.round(x.part * 100)}%`).join(' ')} | séries méd. ${GN.map((g) => `${g.slice(0, 4)} ${s[g].sansLesZeros?.median ?? '-'}`).join(' ')} | S4/S1 n=${e.programmes} ${Object.entries(e.seriesTotal).map(([k, x]) => `${k} ${Math.round(x.part * 100)}%`).join(' ')}`);
}
