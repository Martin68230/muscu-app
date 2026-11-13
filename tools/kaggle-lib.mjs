// Module partage D24 : lecteur CSV en flux, liaison Kaggle -> muscles (regles de nom + jeu Hasan), classement des seances.
// Base Kaggle 600K : NON SOURCEE (ODbL), donnees non fiables, lecture en flux seulement, agregats uniquement.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function* rows(stream) {
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

export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\b(\w{4,})s\b/g, '$1');
export const EQ = { barbell: 'barbell', dumbbell: 'dumbbell', cable: 'cable', 'ez bar': 'ez barbell', kettlebell: 'kettlebell', band: 'band', 'smith machine': 'smith', bodyweight: '', weighted: 'weighted', machine: 'lever' };
export const reorder = (n) => { const m = /^(.*?)\s*\(([a-z ]+)\)\s*$/.exec(n); return m && m[2] in EQ ? `${EQ[m[2]]} ${m[1]}`.trim() : n; };
export const stripEq = (n) => n.replace(/^(barbell|dumbbell|cable|ez barbell|kettlebell|band|smith|weighted|lever|body weight|assisted|olympic barbell|resistance band)\s+/, '');

export function chargerHasan(hasanDir) {
  const hasan = JSON.parse(readFileSync(join(hasanDir, "exercises.json"), "utf8"));
  const byName = new Map(); const byBase = new Map();
  for (const h of hasan) { const k = norm(h.name); if (!byName.has(k)) byName.set(k, h); const b = stripEq(k); if (!byBase.has(b)) byBase.set(b, h); }
  return { byName, byBase };
}
export const T = { abs: 'abdominaux', quads: 'quadriceps', lats: 'grand_dorsal', calves: 'mollets', pectorals: 'pectoraux', glutes: 'fessiers', hamstrings: 'ischios', adductors: 'adducteurs', triceps: 'triceps', spine: 'erecteurs_rachis', 'upper back': 'trapezes', biceps: 'biceps', forearms: 'avant_bras', traps: 'trapezes', 'serratus anterior': 'dentele_anterieur', abductors: 'moyen_fessier', 'levator scapulae': 'trapezes', 'cardiovascular system': null };
export const S = { 'hip flexors': 'flechisseurs_hanche', 'lower back': 'erecteurs_rachis', obliques: 'obliques', hamstrings: 'ischios', glutes: 'fessiers', biceps: 'biceps', rhomboids: 'rhomboides', forearms: 'avant_bras', triceps: 'triceps', core: 'abdominaux', abdominals: 'abdominaux', 'lower abs': 'abdominaux', quadriceps: 'quadriceps', calves: 'mollets', soleus: 'mollets', chest: 'pectoraux', 'upper chest': 'pectoraux', 'rear deltoids': 'deltoides_posterieurs', traps: 'trapezes', trapezius: 'trapezes', 'upper back': 'trapezes', deltoids: 'deltoides_anterieurs', 'rotator cuff': 'coiffe_des_rotateurs', 'latissimus dorsi': 'grand_dorsal', lats: 'grand_dorsal', groin: 'adducteurs', 'inner thighs': 'adducteurs', shins: 'tibial_anterieur', 'grip muscles': 'avant_bras', 'wrist flexors': 'avant_bras', 'wrist extensors': 'avant_bras', back: 'grand_dorsal' };
export function deltoid(name) { return /rear|reverse|face pull|pull apart/.test(name) ? 'deltoides_posterieurs' : /lateral|side raise|upright|y raise/.test(name) ? 'deltoides_lateraux' : 'deltoides_anterieurs'; }
export function musclesOf(h, nm) {
  let main = h.target === 'delts' ? deltoid(nm) : T[h.target];
  const sec = new Set();
  for (const s of h.secondary_muscles ?? []) { const m = s === 'shoulders' ? deltoid(nm) : S[s]; if (m && m !== main) sec.add(m); }
  return { main: main ?? null, sec: [...sec] };
}

// Règles de nom (écrites par nous) appliquées AVANT Hasan : les étiquettes de Hasan sont parfois étranges (squat -> fessiers, leg press -> fessiers)
// et plusieurs exercices fréquents de la base n'y existent pas (lat pulldown, leg curl, face pull, dips...). Ordre = priorité. Borne basse assumée.
export const OV = [
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
export function override(nm) {
  for (const [re, main, sec] of OV) if (re.test(nm)) return main === 'AUCUN' ? { main: null, sec: [], cardio: true } : { main, sec };
  return null;
}
export const GROUP = {
  push: new Set(['pectoraux', 'deltoides_anterieurs', 'deltoides_lateraux', 'triceps']),
  pull: new Set(['grand_dorsal', 'trapezes', 'rhomboides', 'biceps', 'deltoides_posterieurs', 'avant_bras']),
  legs: new Set(['quadriceps', 'ischios', 'fessiers', 'moyen_fessier', 'mollets', 'adducteurs', 'flechisseurs_hanche', 'tibial_anterieur']),
};
export const grpOf = (m) => (GROUP.push.has(m) ? 'push' : GROUP.pull.has(m) ? 'pull' : GROUP.legs.has(m) ? 'legs' : 'tronc_autres');
export const COMPOUND = /press|squat|deadlift|row|pull ?up|chin ?up|dip|lunge|pulldown|pull down|thrust|clean|snatch|push ?up|step up|good morning|split squat/;
export const ISO = /\bfly|flye|raise|curl|extension|kickback|push ?down|shrug|crunch|calf|face pull|pec deck|abduction|adduction/;
export const role = (nm) => (ISO.test(nm) && !/press/.test(nm) ? 'isolation' : COMPOUND.test(nm) ? 'polyarticulaire' : 'autre');

export const inc = (m, k, n = 1) => { m[k] = (m[k] ?? 0) + n; };
export const quant = (arr) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))]; return { n: a.length, p25: q(0.25), median: q(0.5), p75: q(0.75), p90: q(0.9) }; };
export const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

// Lie une ligne : { nm, nl, m } (m = { main, sec, cardio? } ou null)
export function lier(raw, hasanIdx) {
  const nm = norm(reorder(raw.toLowerCase()));
  const h = hasanIdx.byName.get(nm) ?? hasanIdx.byBase.get(stripEq(nm));
  const nl = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const ov = override(nl);
  return { nm, nl, ov: !!ov, m: ov ?? (h ? musclesOf(h, nm) : null) };
}

// Classe une seance (lignes { m, sets }) : retourne { type, liees, tot } ou null (meme regle que kaggle-muscles.mjs)
export function classer(s) {
  const liees = s.filter((x) => x.m && x.m.main && x.sets !== null && x.sets > 0 && x.sets <= 12);
  if (liees.length < 3) return null;
  const part = { push: 0, pull: 0, legs: 0, tronc_autres: 0 }; let tot = 0;
  for (const x of liees) { part[grpOf(x.m.main)] += x.sets; tot += x.sets; }
  const P = part.push / tot, Q = part.pull / tot, Lg = part.legs / tot;
  let type;
  if (Lg >= 0.6) type = "jambes";
  else if (Lg < 0.15) type = P >= 0.6 ? "poussee" : Q >= 0.6 ? "tirage" : P >= 0.25 && Q >= 0.25 ? "haut" : null;
  else type = P >= 0.15 && Q >= 0.15 ? "corps_entier" : Lg >= 0.4 ? "bas" : null;
  return type ? { type, liees, tot } : null;
}
