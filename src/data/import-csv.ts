// D19 : lecture d'un fichier CSV exporté par Hevy ou Strong. Module PUR : du texte entrant, un résultat sortant ; aucune écriture,
// aucune exécution, aucun envoi en ligne. Les séances importées ne servent QU'À L'AFFICHAGE (les charges d'une autre app ne sont pas vérifiées).

export const CSV_MAX_BYTES = 20 * 1024 * 1024;
export const CSV_MAX_ROWS = 50000;
export const CSV_MAX_TEXT = 200;
export const CSV_MAX_COLUMNS = 50;
export const MAX_FUTURE_MS = 24 * 3600 * 1000;
const LB_TO_KG = 0.45359237;

export type CsvFormat = 'hevy' | 'strong';
export type WeightUnit = 'auto' | 'kg' | 'lb';

export interface FicheRef {
  id: string;
  nom: string;
  alias: string[];
}

export interface ImportedSet {
  isWarmup: boolean;
  reps: number | null;
  loadKg: number | null;
  holdSec: number | null;
  rir: number | null;
}
export interface ImportedExercise {
  /** Nom nettoyé tel qu'il sera affiché. */
  name: string;
  /** Identifiant de la fiche reconnue, ou `import:Nom` (exercice importé, relié à aucune fiche). */
  movementId: string;
  recognized: boolean;
  sets: ImportedSet[];
}
export interface ImportedWorkout {
  title: string;
  startedAt: string;
  endedAt: string | null;
  exercises: ImportedExercise[];
}
export interface ImportPreview {
  format: CsvFormat;
  workouts: ImportedWorkout[];
  sessionCount: number;
  setCount: number;
  exerciseCount: number;
  /** Noms (nettoyés, sans doublon) des exercices non reconnus. */
  unrecognized: string[];
  /** Vrai si le fichier ne dit pas l'unité du poids (Strong, colonne « Weight » seule) : l'écran propose kg / livres. */
  unitAmbiguous: boolean;
  unit: 'kg' | 'lb';
}
export type ParseResult = { ok: true; preview: ImportPreview } | { ok: false; error: string };

class CsvError extends Error {}
const fail = (msg: string): never => {
  throw new CsvError(msg);
};

// ----- Analyse CSV en flux (guillemets, guillemets doublés, retours à la ligne dans un champ) -----

interface Cell {
  v: string;
  /** Le champ dépassait la limite de texte (il est tronqué). */
  long: boolean;
}

function detectDelimiter(text: string): string {
  // Première ligne hors guillemets.
  let inQ = false;
  const count: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  for (let i = 0; i < text.length && i < 20000; i++) {
    const c = text[i];
    if (c === '"') inQ = !inQ;
    else if (!inQ && (c === '\n' || c === '\r')) break;
    else if (!inQ && c in count) count[c]++;
  }
  return count[';'] > count[','] && count[';'] >= count['\t'] ? ';' : count['\t'] > count[','] ? '\t' : ',';
}

/** Analyse écrite ici : pas de bibliothèque. Chaque champ est tronqué à CSV_MAX_TEXT + 1 caractères (mémoire bornée). */
export function parseCsv(text: string, delimiter = detectDelimiter(text)): Cell[][] {
  const rows: Cell[][] = [];
  let row: Cell[] = [];
  let field = '';
  let long = false;
  let inQ = false;
  let started = false; // le champ en cours existe (même vide)
  const push = () => {
    if (row.length >= CSV_MAX_COLUMNS) fail(`Fichier refusé : plus de ${CSV_MAX_COLUMNS} colonnes sur une ligne.`);
    row.push({ v: field, long });
    field = '';
    long = false;
    started = false;
  };
  const endRow = () => {
    push();
    if (row.length > 1 || row[0].v !== '') {
      if (rows.length >= CSV_MAX_ROWS + 1) fail(`Fichier refusé : plus de ${CSV_MAX_ROWS.toLocaleString('fr-FR')} lignes.`);
      rows.push(row);
    }
    row = [];
  };
  const add = (c: string) => {
    if (field.length > CSV_MAX_TEXT) long = true;
    else field += c;
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          add('"');
          i++;
        } else inQ = false;
      } else add(c);
    } else if (c === '"' && !started) {
      inQ = true;
      started = true;
    } else if (c === delimiter) {
      push();
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      endRow();
    } else {
      started = true;
      add(c);
    }
  }
  if (inQ) fail('Fichier mal formé : un guillemet n’est pas refermé.');
  if (started || field !== '' || row.length) endRow();
  return rows;
}

// ----- Noms d'exercices -----

const strip = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Minuscules, sans accent, sans parenthèses (équipement), ponctuation en espaces, pluriels simples ramenés au singulier. */
export function exerciseKey(name: string): string {
  const base = strip(name.toLowerCase())
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return base
    .split(' ')
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w))
    .join(' ');
}

/** Nom affiché d'un exercice importé : espaces nettoyés, caractères de contrôle retirés, 200 caractères au plus. */
export function cleanName(name: string): string {
  // eslint-disable-next-line no-control-regex
  return name.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, CSV_MAX_TEXT);
}

export function buildMatcher(fiches: readonly FicheRef[]): (name: string) => string | null {
  const byKey = new Map<string, Set<string>>();
  for (const f of fiches) {
    for (const n of [f.nom, ...(f.alias ?? [])]) {
      const k = exerciseKey(n);
      if (!k) continue;
      if (!byKey.has(k)) byKey.set(k, new Set());
      byKey.get(k)!.add(f.id);
    }
  }
  // Une clé partagée par plusieurs fiches est ambiguë : jamais de choix au hasard.
  return (name) => {
    const ids = byKey.get(exerciseKey(name));
    return ids && ids.size === 1 ? [...ids][0] : null;
  };
}

// ----- Dates, durées, nombres -----

const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

function validDate(y: number, mo: number, d: number, h: number, mi: number, s: number): Date | null {
  if (y < 1990 || y > 2200 || mo < 0 || mo > 11 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) return null;
  const dt = new Date(y, mo, d, h, mi, s);
  return dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d ? dt : null;
}

/** « 2024-03-26 18:30:12 », « 2024-03-26T18:30:12Z », « 26 Mar 2024, 18:30 », « 26/03/2024 18:30 » (jour d'abord). Sans fuseau : heure locale. */
export function parseDateTime(raw: string): Date | null {
  const s = raw.trim();
  let m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?\s*(Z|[+-]\d{2}:?\d{2})?)?$/.exec(s);
  if (m) {
    if (m[7]) {
      const t = Date.parse(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}T${(m[4] ?? '0').padStart(2, '0')}:${m[5] ?? '00'}:${m[6] ?? '00'}${m[7] === 'Z' ? 'Z' : m[7].length === 5 ? `${m[7].slice(0, 3)}:${m[7].slice(3)}` : m[7]}`);
      return Number.isFinite(t) ? new Date(t) : null;
    }
    return validDate(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  }
  m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
  if (m) {
    const mo = MONTHS[m[2].toLowerCase()];
    return mo === undefined ? null : validDate(+m[3], mo, +m[1], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  }
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
  if (m) return validDate(+m[3], +m[2] - 1, +m[1], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  return null;
}

/** « 1h 5m », « 45m », « 1h », « 2h 30m 10s », « 1:05:00 », « 3900 » (secondes) -> secondes, ou null. */
export function parseDuration(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  let m = /^(\d+):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (m) return m[3] !== undefined ? +m[1] * 3600 + +m[2] * 60 + +m[3] : +m[1] * 60 + +m[2];
  m = /^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?:in)?)?\s*(?:(\d+)\s*s)?$/.exec(s);
  if (m && (m[1] || m[2] || m[3])) return +(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0);
  if (/^\d+$/.test(s)) return +s;
  return null;
}

/** Nombre décimal avec point ou virgule ; chaîne vide = null ; texte = NaN (refusé par l'appelant). */
function toNum(raw: string): number | null {
  const s = raw.trim().replace(',', '.');
  if (s === '') return null;
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}

// ----- Colonnes -----

const colKey = (h: string): string => strip(h.toLowerCase()).replace(/^﻿/, '').replace(/[^a-z0-9]/g, '');

interface Columns {
  format: CsvFormat;
  title: number;
  start: number;
  end: number;
  duration: number;
  exercise: number;
  setIdx: number;
  setType: number;
  weight: number;
  weightUnit: 'kg' | 'lb' | null;
  reps: number;
  seconds: number;
  rpe: number;
}

function findColumns(header: Cell[]): Columns {
  const keys = header.map((c) => colKey(c.v));
  const idx = (...names: string[]) => keys.findIndex((k) => names.includes(k));
  const exercise = idx('exercisetitle', 'exercisename', 'exercise');
  const start = idx('starttime', 'date', 'startdate');
  if (exercise < 0 || start < 0) fail('Fichier non reconnu : ce n’est pas un export Hevy ni Strong (colonnes de l’exercice ou de la date introuvables).');
  const format: CsvFormat = keys.includes('exercisetitle') || keys.includes('starttime') ? 'hevy' : 'strong';
  const wKg = idx('weightkg', 'weightkgs', 'weight(kg)');
  const wLb = idx('weightlbs', 'weightlb', 'weight(lb)', 'weight(lbs)', 'weightpounds');
  const wPlain = idx('weight');
  const weight = wKg >= 0 ? wKg : wLb >= 0 ? wLb : wPlain;
  return {
    format,
    title: idx('title', 'workoutname', 'workout'),
    start,
    end: idx('endtime', 'enddate'),
    duration: idx('duration'),
    exercise,
    setIdx: idx('setindex', 'setorder'),
    setType: idx('settype'),
    weight,
    weightUnit: wKg >= 0 ? 'kg' : wLb >= 0 ? 'lb' : null,
    reps: idx('reps', 'repetitions'),
    seconds: idx('durationseconds', 'seconds', 'time'),
    rpe: idx('rpe'),
  };
}

// ----- Lecture complète -----

export interface ParseOptions {
  fiches: readonly FicheRef[];
  now?: Date;
  /** Taille du fichier en octets (contrôlée ici aussi, l'écran la connaît avant de lire le texte). */
  byteLength?: number;
  unit?: WeightUnit;
}

export function parseWorkoutCsv(text: string, opts: ParseOptions): ParseResult {
  try {
    return { ok: true, preview: parseOrThrow(text, opts) };
  } catch (e) {
    if (e instanceof CsvError) return { ok: false, error: e.message };
    return { ok: false, error: 'Fichier illisible : il n’a pas pu être analysé.' };
  }
}

function parseOrThrow(text: string, opts: ParseOptions): ImportPreview {
  if ((opts.byteLength ?? text.length) > CSV_MAX_BYTES) fail('Fichier refusé : il est trop gros (20 Mo au maximum).');
  const now = (opts.now ?? new Date()).getTime();
  const rows = parseCsv(text.replace(/^﻿/, ''));
  if (rows.length < 2) fail('Fichier vide : aucune séance trouvée.');
  const cols = findColumns(rows[0]);
  const unitChoice = opts.unit ?? 'auto';
  const unitAmbiguous = cols.weight >= 0 && cols.weightUnit === null;
  const unit: 'kg' | 'lb' = unitChoice !== 'auto' ? unitChoice : cols.weightUnit ?? 'kg';
  const match = buildMatcher(opts.fiches);

  const cell = (r: Cell[], i: number, line: number, what: string): string => {
    if (i < 0) return '';
    const c = r[i];
    if (!c) return '';
    if (c.long || c.v.length > CSV_MAX_TEXT) fail(`Ligne ${line} : ${what} trop long (${CSV_MAX_TEXT} caractères au maximum).`);
    return c.v.trim();
  };

  const workouts = new Map<string, ImportedWorkout & { byEx: Map<string, ImportedExercise> }>();
  let setCount = 0;
  for (let n = 1; n < rows.length; n++) {
    const r = rows[n];
    const line = n + 1;
    const rawName = cell(r, cols.exercise, line, 'le nom de l’exercice');
    const setLabel = cell(r, cols.setIdx, line, 'le numéro de série');
    // Lignes sans exercice ni série (minuteur de repos de Strong, ligne vide) : ignorées.
    if (!rawName || /^rest\s*timer$/i.test(setLabel) || /^rest\s*timer$/i.test(rawName)) continue;
    const name = cleanName(rawName);
    if (!name) continue;

    const startRaw = cell(r, cols.start, line, 'la date');
    const start = parseDateTime(startRaw);
    if (!start) fail(`Ligne ${line} : date illisible (« ${startRaw.slice(0, 30)} »).`);
    if (start!.getTime() > now + MAX_FUTURE_MS) fail(`Ligne ${line} : date dans le futur.`);

    const num = (i: number, what: string, min: number, max: number): number | null => {
      const raw = cell(r, i, line, what);
      const v = toNum(raw);
      if (v !== null && (!Number.isFinite(v) || v < min || v > max)) fail(`Ligne ${line} : ${what} hors limites ou illisible (« ${raw.slice(0, 20)} »).`);
      return v;
    };
    let loadKg = num(cols.weight, 'le poids', 0, 1000 * (unit === 'lb' ? 2.2046226 : 1));
    if (loadKg !== null && unit === 'lb') loadKg = Math.round(loadKg * LB_TO_KG * 100) / 100;
    if (loadKg !== null && loadKg > 1000) fail(`Ligne ${line} : poids hors limites.`);
    const reps = num(cols.reps, 'les répétitions', 0, 1000);
    if (reps !== null && !Number.isInteger(reps)) fail(`Ligne ${line} : répétitions non entières.`);
    const secRaw = num(cols.seconds, 'la durée', 0, 24 * 3600);
    const rpe = num(cols.rpe, 'l’effort (RPE)', 0, 10);
    const typeRaw = (cols.setType >= 0 ? cell(r, cols.setType, line, 'le type de série') : setLabel).toLowerCase();
    const isWarmup = typeRaw === 'warmup' || typeRaw === 'w';
    // Série sans aucune donnée : ignorée.
    if (reps === null && loadKg === null && secRaw === null) continue;
    // Réserve estimée d'après le RPE (10 = à fond) ; jamais utilisée par la progression.
    const rir = rpe === null ? null : Math.max(0, Math.min(10, Math.round(10 - rpe)));

    const title = cleanName(cell(r, cols.title, line, 'le nom de la séance')) || 'Séance importée';
    const key = `${title}|${startRaw}`;
    let w = workouts.get(key);
    if (!w) {
      let end: Date | null = null;
      if (cols.end >= 0) {
        const e = parseDateTime(cell(r, cols.end, line, 'la date de fin'));
        if (e && e.getTime() >= start!.getTime() && e.getTime() - start!.getTime() < 24 * 3600 * 1000) end = e;
      } else if (cols.duration >= 0) {
        const d = parseDuration(cell(r, cols.duration, line, 'la durée'));
        if (d !== null && d > 0 && d < 24 * 3600) end = new Date(start!.getTime() + d * 1000);
      }
      w = { title, startedAt: start!.toISOString(), endedAt: end ? end.toISOString() : null, exercises: [], byEx: new Map() };
      workouts.set(key, w);
    }
    const ek = exerciseKey(name) || name.toLowerCase();
    let ex = w.byEx.get(ek);
    if (!ex) {
      const id = match(name);
      ex = { name, movementId: id ?? `import:${name}`, recognized: id !== null, sets: [] };
      w.byEx.set(ek, ex);
      w.exercises.push(ex);
    }
    ex.sets.push({ isWarmup, reps, loadKg, holdSec: reps === null && secRaw !== null && secRaw > 0 ? Math.round(secRaw) : null, rir });
    setCount++;
  }

  const list = [...workouts.values()].map(({ byEx: _b, ...w }) => w).filter((w) => w.exercises.length > 0);
  if (!list.length) fail('Aucune série exploitable dans ce fichier.');
  const unrecognized = new Set<string>();
  let exerciseCount = 0;
  for (const w of list) {
    for (const e of w.exercises) {
      exerciseCount++;
      if (!e.recognized) unrecognized.add(e.name);
    }
  }
  return { format: cols.format, workouts: list, sessionCount: list.length, setCount, exerciseCount, unrecognized: [...unrecognized], unitAmbiguous, unit };
}
