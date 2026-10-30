// D24 b : statistiques LOCALES sur la base Kaggle « 600K Fitness Exercise & Workout Program Dataset » (ODbL, provenance douteuse : programmes d'utilisateurs).
// Les fichiers CSV sont des DONNÉES NON FIABLES : ce script ne fait que les lire en flux (aucune exécution, aucun envoi, aucun texte de programme recopié).
// Il n'imprime que des AGRÉGATS (comptes, médianes, parts). Les statistiques sont NON SOURCÉES (provenance inconnue).
// Usage : node tools/kaggle-stats.mjs summary <program_summary.csv> <sortie.json>
//         unzip -p archive.zip programs_detailed_boostcamp_kaggle.csv | node tools/kaggle-stats.mjs detailed - <sortie.json>
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';

const [mode, input, out] = process.argv.slice(2);
if (!['summary', 'detailed'].includes(mode) || !input || !out) { console.error('Usage : voir l\'en-tête du script'); process.exit(2); }

// --- lecteur CSV en flux (guillemets, retours à la ligne dans les champs) ---
async function* rows(stream) {
  let field = ''; let row = []; let q = false; let prevQuote = false;
  for await (const chunk of stream) {
    const s = chunk.toString('utf8');
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) {
        if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c;
        continue;
      }
      if (c === '"') { q = true; prevQuote = true; }
      else if (c === ',') { row.push(field); field = ''; prevQuote = false; }
      else if (c === '\n') { row.push(field.replace(/\r$/, '')); yield row; row = []; field = ''; prevQuote = false; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); yield row; }
}
const stream = input === '-' ? process.stdin : createReadStream(input);

const inc = (m, k, n = 1) => { m[k] = (m[k] ?? 0) + n; };
const parseList = (s) => (s ?? '').replace(/^\[|\]$/g, '').split(',').map((x) => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
const quant = (arr) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))]; return { n: a.length, p10: q(0.1), p25: q(0.25), median: q(0.5), p75: q(0.75), p90: q(0.9) }; };
const top = (m, n = 15) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
const num = (x) => { const v = parseFloat(x); return Number.isFinite(v) ? v : null; };

const result = { mode, source: 'Kaggle 600K (ODbL) — provenance inconnue, statistiques NON SOURCÉES' };

if (mode === 'summary') {
  let head = null; const col = {}; let n = 0;
  const level = {}; const goal = {}; const equip = {};
  const length = []; const time = []; const nex = [];
  const days = {}; const split = {}; let daysFound = 0;
  const muscleSets = {}; const muscleN = {}; let withBlock = 0;
  const kw = { cardio: 0, mobilite: 0, deload: 0, rpe: 0 };
  for await (const r of rows(stream)) {
    if (!head) { head = r; head.forEach((h, i) => { col[h] = i; }); continue; }
    if (r.length < head.length - 1) continue;
    n++;
    for (const l of parseList(r[col.level])) inc(level, l);
    for (const g of parseList(r[col.goal])) inc(goal, g);
    for (const e of parseList(r[col.equipment])) inc(equip, e);
    const pl = num(r[col.program_length]); if (pl !== null) length.push(pl);
    const tw = num(r[col.time_per_workout]); if (tw !== null) time.push(tw);
    const te = num(r[col.total_exercises]); if (te !== null) nex.push(te);
    const title = r[col.title] ?? ''; const desc = r[col.description] ?? ''; const text = `${title}\n${desc}`;
    // jours par semaine : « 4 day », « 4-day », « 4 days a week » dans le titre d'abord, puis dans la description
    const dm = /(\d)\s*[- ]?\s*(day|days|x)\b/i.exec(title) || /(\d)\s*[- ]?\s*days?\s*(a|per|\/)\s*(week|wk)/i.exec(text) || /(\d)\s*[- ]?\s*day\b/i.exec(desc);
    if (dm && +dm[1] >= 1 && +dm[1] <= 7) { inc(days, dm[1]); daysFound++; }
    const lt = text.toLowerCase();
    if (/full[- ]?body/.test(lt)) inc(split, 'corps entier'); if (/upper[\s/-]*lower/.test(lt)) inc(split, 'haut / bas');
    if (/\bppl\b|push[\s/-]*pull[\s/-]*legs/.test(lt)) inc(split, 'push / pull / legs'); if (/bro split/.test(lt)) inc(split, 'split par muscle (bro)');
    if (/cardio/.test(lt)) kw.cardio++; if (/mobility|stretch/.test(lt)) kw.mobilite++; if (/deload/.test(lt)) kw.deload++; if (/\brpe\b|\brir\b/.test(lt)) kw.rpe++;
    // blocs « Muscle Groups | Sets Per Week » : lignes « Nom - N » (seulement les nombres sont lus)
    const bi = desc.search(/sets\s*per\s*week/i);
    if (bi >= 0) {
      let found = false;
      for (const line of desc.slice(bi).split('\n').slice(1, 25)) {
        const m = /^\s*([A-Za-z ]{3,25}?)\s*[-:]\s*(\d{1,2})\s*$/.exec(line);
        if (m) { inc(muscleSets, m[1].trim().toLowerCase(), +m[2]); inc(muscleN, m[1].trim().toLowerCase()); found = true; }
      }
      if (found) withBlock++;
    }
  }
  Object.assign(result, { programmes: n, niveaux: top(level, 10), objectifs: top(goal, 15), materiel: top(equip, 12), semaines: quant(length), minutes_par_seance: quant(time), exercices_total_programme: quant(nex),
    jours_par_semaine_deduits: { trouves: daysFound, part: +(daysFound / n).toFixed(2), repartition: top(days, 7) }, splits_cites: top(split, 6), mots_cles_part: Object.fromEntries(Object.entries(kw).map(([k, v]) => [k, +(v / n).toFixed(3)])),
    series_par_semaine_par_muscle: { programmes_avec_bloc: withBlock, moyenne: Object.fromEntries(top(muscleN, 20).map(([m, c]) => [m, { programmes: c, moyenne: +(muscleSets[m] / c).toFixed(1) }])) } });
} else {
  let head = null; const col = {};
  let nrows = 0; const progs = new Set(); const firstWeek = {}; // titre -> Set de jours de la 1re semaine
  const perGoal = {}; // objectif -> { combos, sets[], repsBuckets, timed }
  const names = {}; const perWorkout = {}; // titre|w|d -> nb exercices
  const goalKey = (g) => g;
  const cardioRe = /\b(run|running|jog|treadmill|bike|cycling|row(?:ing)? machine|erg|jump rope|skipping|elliptical|stair|sprint|swim|walk|hiit|burpee|jumping jack|mountain climber)\b/i;
  const mobRe = /(stretch|mobility|foam roll|dorsiflexion|hip opener|cat[- ]cow|world'?s greatest|yoga|warm[- ]?up)/i;
  let cardioRows = 0; let mobRows = 0; let timedRows = 0;
  for await (const r of rows(stream)) {
    if (!head) { head = r; head.forEach((h, i) => { col[h] = i; }); continue; }
    if (r.length < head.length - 1) continue;
    nrows++;
    const title = r[col.title]; progs.add(title);
    const goals = parseList(r[col.goal]); const week = num(r[col.week]); const day = num(r[col.day]);
    if (week === 1 && day !== null) (firstWeek[title] ??= new Set()).add(day);
    const name = (r[col.exercise_name] ?? '').trim().toLowerCase(); if (name) inc(names, name);
    if (cardioRe.test(name)) cardioRows++; if (mobRe.test(name)) mobRows++;
    const sets = num(r[col.sets]); const reps = num(r[col.reps]);
    const wk = `${title}|${week}|${day}`; inc(perWorkout, wk);
    const timed = reps !== null && reps < 0; if (timed) timedRows++;
    for (const g of goals.slice(0, 3)) {
      const G = (perGoal[goalKey(g)] ??= { rows: 0, combos: {}, sets: [], buckets: {} });
      G.rows++;
      if (sets !== null && sets >= 1 && sets <= 10 && reps !== null && !timed && reps >= 1 && reps <= 60) {
        inc(G.combos, `${sets}x${reps}`); G.sets.push(sets);
        inc(G.buckets, reps <= 5 ? '1-5' : reps <= 8 ? '6-8' : reps <= 12 ? '9-12' : reps <= 15 ? '13-15' : '16+');
      }
    }
  }
  const dayCounts = {}; for (const s of Object.values(firstWeek)) inc(dayCounts, Math.min(s.size, 7));
  const exPerWorkout = Object.values(perWorkout);
  const goalsOut = {};
  for (const [g, G] of Object.entries(perGoal)) {
    if (G.rows < 2000) continue;
    const tot = Object.values(G.buckets).reduce((a, b) => a + b, 0) || 1;
    goalsOut[g] = { lignes: G.rows, combinaisons_series_x_reps: top(G.combos, 8), series_mediane: quant(G.sets)?.median ?? null, repetitions_parts: Object.fromEntries(Object.entries(G.buckets).map(([k, v]) => [k, +(v / tot).toFixed(2)])) };
  }
  Object.assign(result, { lignes: nrows, programmes: progs.size, exercices_distincts: Object.keys(names).length,
    jours_semaine1_par_programme: top(dayCounts, 7), exercices_par_seance: quant(exPerWorkout), part_lignes_cardio_mots_cles: +(cardioRows / nrows).toFixed(3), part_lignes_mobilite_echauffement: +(mobRows / nrows).toFixed(3), part_lignes_a_duree: +(timedRows / nrows).toFixed(3),
    par_objectif: goalsOut, exercices_les_plus_frequents: top(names, 150) });
}
writeFileSync(out, JSON.stringify(result, null, 1));
console.log(JSON.stringify({ ...result, exercices_les_plus_frequents: undefined }, null, 1).slice(0, 6000));
