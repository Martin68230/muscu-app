import { INJURY_ZONES, SPORT_EFFORTS, SPORT_FEELINGS, SPORT_KEYS, SPORT_SIGNS, type TableName } from './model';

// Validation des fichiers importés (export JSON, et plus tard réponse d'une IA) :
// on refuse tout enregistrement dont un champ attendu manque ou a le mauvais type.

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';
type Spec = Record<string, FieldType | `${FieldType}?`>; // « ? » = peut valoir null

const SYNC: Spec = {
  id: 'string',
  ownerId: 'string',
  createdAt: 'string',
  updatedAt: 'string',
  rev: 'number',
  deletedAt: 'string?',
  syncedAt: 'string?',
};

export const SPECS: Record<TableName, Spec> = {
  profile: {
    displayName: 'string',
    adultConfirmedAt: 'string?',
    healthDisclaimerAcceptedAt: 'string?',
    level: 'string?',
    daysPerWeek: 'number?',
    blockedWeekdays: 'array',
    sessionDurationMin: 'number?',
    sports: 'array',
    heightCm: 'number?',
    aiEnabled: 'boolean',
    place: 'string?',
    pregnancy: 'string?',
    profileCompletedAt: 'string?',
    progressionLog: 'array?',
    reprise: 'object?',
    gagnerDuTemps: 'boolean?',
    seanceCardio: 'boolean?',
    salleAccess: 'boolean?',
    exterieur: 'boolean?',
    neckScreen: 'string?',
    sportPlan: 'array?',
    catchUpLog: 'array?',
  },
  equipment: {
    preset: 'string',
    tags: 'array',
    disabledImplicit: 'array',
    dumbbellWeightsKg: 'array',
    kettlebellWeightsKg: 'array',
    dumbbellKind: 'string?',
    platesKg: 'array',
    other: 'string',
  },
  goals: { goalKey: 'string', rank: 'number' },
  injuries: { zone: 'string', side: 'string?', level: 'number', note: 'string', active: 'boolean', afterShock: 'boolean?' },
  programs: {
    templateKey: 'string?',
    name: 'string',
    split: 'string',
    startDate: 'string',
    weeks: 'number',
    active: 'boolean',
    days: 'array',
    inputsHash: 'string?',
    generatorVersion: 'string?',
    explanation: 'array?',
    messages: 'array?',
    durationMin: 'number?',
    family: 'string?',
    missedAnswers: 'object?',
    lightDays: 'array?',
    cardioOption: 'object?',
  },
  sessions: {
    programId: 'string?',
    programDayIndex: 'number?',
    plannedDate: 'string',
    status: 'string',
    startedAt: 'string?',
    endedAt: 'string?',
    note: 'string',
    cursor: 'object?',
    restEndsAt: 'number?',
    restTotalMs: 'number?',
    restKind: 'string?',
    phase: 'string?',
    skippedExercises: 'array?',
    painExercises: 'array?',
    loadsKg: 'object?',
    plan: 'object?',
    lastActionAt: 'string?',
    endReason: 'string?',
    echelonSwitches: 'object?',
    calibDecided: 'array?',
    calibDrops: 'array?',
    summary: 'object?',
    decidedAt: 'string?',
    originDate: 'string?',
    postponedTo: 'string?',
    dejaDecalee: 'boolean?',
    created: 'object?',
    imported: 'boolean?',
  },
  sets: {
    sessionId: 'string',
    movementId: 'string',
    variantId: 'string',
    exerciseIndex: 'number',
    setIndex: 'number',
    targetRepsMin: 'number?',
    targetRepsMax: 'number?',
    reps: 'number?',
    loadKg: 'number?',
    rir: 'number?',
    pain: 'boolean',
    comment: 'string',
    completedAt: 'string?',
    targetRir: 'number?',
    isCalibration: 'boolean',
    isWarmup: 'boolean',
    echelon: 'number?',
    bandResistance: 'string?',
    holdSec: 'number?',
    side: 'string?',
    capped: 'boolean',
    painZone: 'string?',
    restTakenSec: 'number?',
    felt: 'number?',
  },
  bodyWeights: { date: 'string', kg: 'number' },
  meals: { date: 'string', time: 'string?', label: 'string', items: 'array' },
  supplements: {
    name: 'string',
    doseAmount: 'number?',
    doseUnit: 'string',
    frequency: 'string',
    startDate: 'string?',
    endDate: 'string?',
  },
  shares: { dataType: 'string', friendId: 'string?', enabled: 'boolean' },
  signalements: { ficheId: 'string', variantId: 'string?', choice: 'string', text: 'string' },
  sportSessions: {
    sport: 'string',
    name: 'string?',
    startedAt: 'string',
    durationMin: 'number',
    effort: 'string',
    match: 'boolean?',
    jumps: 'boolean?',
    overhead: 'boolean?',
    feelings: 'array',
    painZone: 'string?',
    signs: 'array?',
    note: 'string?',
  },
};

/** Champs ajoutés après coup : peuvent manquer dans une ancienne sauvegarde. */
const MAY_BE_MISSING: Partial<Record<TableName, string[]>> = {
  profile: ['place', 'pregnancy', 'profileCompletedAt', 'progressionLog', 'reprise', 'gagnerDuTemps', 'seanceCardio', 'salleAccess', 'exterieur', 'neckScreen', 'sportPlan', 'catchUpLog'],
  programs: ['inputsHash', 'generatorVersion', 'explanation', 'messages', 'durationMin', 'family', 'missedAnswers', 'lightDays', 'cardioOption'],
  sessions: ['cursor', 'restEndsAt', 'restTotalMs', 'restKind', 'phase', 'skippedExercises', 'painExercises', 'loadsKg', 'plan', 'lastActionAt', 'endReason', 'echelonSwitches', 'calibDecided', 'calibDrops', 'summary', 'decidedAt', 'originDate', 'postponedTo', 'dejaDecalee', 'created', 'imported'],
  sets: ['targetRir', 'isCalibration', 'isWarmup', 'echelon', 'bandResistance', 'holdSec', 'side', 'capped', 'painZone', 'restTakenSec', 'felt'],
  injuries: ['afterShock'],
  equipment: ['dumbbellKind', 'platesKg', 'other'],
  sportSessions: ['name', 'match', 'jumps', 'overhead', 'painZone', 'signs', 'note'],
};

/** Valeurs permises des champs qui pilotent la sécurité (un import ne doit pas en introduire d'inconnues). */
const ENUMS: Partial<Record<TableName, Record<string, string[]>>> = {
  profile: { place: ['maison', 'salle'], pregnancy: ['non', 'enceinte', 'post_partum'], neckScreen: ['non', 'oui', 'refus'], level: ['debutant', 'intermediaire', 'avance'] },
  sessions: {
    status: ['prevue', 'en_cours', 'faite', 'reportee', 'sautee'],
    endReason: ['terminee', 'abandon', 'symptome', 'renonce', 'pas_bien'],
  },
  sportSessions: { sport: [...SPORT_KEYS], effort: [...SPORT_EFFORTS], painZone: [...INJURY_ZONES] },
  injuries: { zone: ['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'] },
};

function typeOf(v: unknown): FieldType | 'null' | 'other' {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'number') return Number.isFinite(v) ? 'number' : 'other';
  if (t === 'string' || t === 'boolean' || t === 'object') return t;
  return 'other';
}

/** Retourne la liste des problèmes (vide = valide). */
export function validateRow(table: TableName, row: unknown): string[] {
  if (typeOf(row) !== 'object') return [`${table} : enregistrement qui n'est pas un objet`];
  const r = row as Record<string, unknown>;
  const errors: string[] = [];
  for (const [field, spec] of Object.entries({ ...SYNC, ...SPECS[table] })) {
    const nullable = spec.endsWith('?');
    const expected = spec.replace('?', '') as FieldType;
    if (r[field] === undefined && MAY_BE_MISSING[table]?.includes(field)) continue;
    const actual = typeOf(r[field]);
    if (actual === expected || (nullable && actual === 'null')) continue;
    errors.push(`${table}/${String(r.id ?? '?')} : champ « ${field} » attendu ${spec}, reçu ${actual}`);
  }
  for (const [field, allowed] of Object.entries(ENUMS[table] ?? {})) {
    const v = r[field];
    if (typeof v === 'string' && !allowed.includes(v)) errors.push(`${table}/${String(r.id ?? '?')} : champ « ${field} » valeur inconnue « ${v} »`);
  }
  // F6 : repos pris plausible ; décisions de progression d'un type connu (un import ne doit pas en introduire d'inconnues).
  if (table === 'sets' && typeof r.restTakenSec === 'number' && (r.restTakenSec < 0 || r.restTakenSec > 3600)) {
    errors.push(`${table}/${String(r.id ?? '?')} : champ « restTakenSec » hors limites`);
  }
  if (table === 'profile' && Array.isArray(r.progressionLog)) {
    const kinds = ['montee', 'descente', 'refus', 'niveau', 'annule', 'adapt_accepte', 'adapt_plus_tard', 'adapt_applique', 'adapt_annule'];
    const bad = r.progressionLog.some((e) => typeOf(e) !== 'object' || !kinds.includes(String((e as Record<string, unknown>).type)));
    if (bad) errors.push(`${table}/${String(r.id ?? '?')} : champ « progressionLog » contient une décision inconnue`);
  }
  // Séance manquée (SM-D1 à SM-D4) : dates au format AAAA-MM-JJ, réponses et état de reprise d'un type connu.
  if (table === 'sessions') {
    for (const f of ['originDate', 'postponedTo']) {
      if (r[f] !== undefined && r[f] !== null && !isDay(r[f])) errors.push(`${table}/${String(r.id ?? '?')} : champ « ${f} » date invalide`);
    }
  }
  // D28 : séance créée à la demande ; heavyLegs et impact booléens, contacts 0 à 120, request objet (sinon l'import est refusé).
  if (table === 'sessions' && r.created !== undefined && r.created !== null) {
    const c = r.created as Record<string, unknown>;
    const ok = typeOf(c) === 'object' && typeof c.heavyLegs === 'boolean' && typeof c.impact === 'boolean'
      && typeof c.contacts === 'number' && Number.isFinite(c.contacts) && c.contacts >= 0 && c.contacts <= 120 && typeOf(c.request) === 'object';
    if (!ok) errors.push(`${table}/${String(r.id ?? '?')} : champ « created » invalide`);
  }
  if (table === 'programs' && typeOf(r.missedAnswers) === 'object') {
    const answers = ['decaler', 'quand_je_peux', 'sauter'];
    const bad = Object.entries(r.missedAnswers as Record<string, unknown>).some(
      ([k, v]) => !isDay(k) || typeOf(v) !== 'object' || !answers.includes(String((v as Record<string, unknown>).reponse)) || typeof (v as Record<string, unknown>).at !== 'string',
    );
    if (bad) errors.push(`${table}/${String(r.id ?? '?')} : champ « missedAnswers » contient une réponse inconnue`);
  }
  if (table === 'profile' && typeOf(r.reprise) === 'object') errors.push(...repriseErrors(r.reprise as Record<string, unknown>, `${table}/${String(r.id ?? '?')}`));
  if (typeof r.updatedAt === 'string' && Number.isNaN(Date.parse(r.updatedAt))) {
    errors.push(`${table}/${String(r.id)} : date de modification invalide`);
  }
  errors.push(...deepErrors(table, r));
  return errors;
}

// Constat 1 de l'audit : contenu des tableaux / objets, textes et nombres bornés (un fichier reçu ne doit pas faire planter l'app).
export const MAX_IMPORT_BYTES = 20 * 1024 * 1024;
export const MAX_ROWS_PER_TABLE = 50000;
const MAX_TEXT = 2000;
const MAX_ARRAY = 2000;
const MAX_KEYS = 500;
const MAX_DEPTH = 10;
const MAX_ABS = 1e9;

/** Bornes générales : profondeur, longueur des textes, taille des tableaux, nombres raisonnables, clés dangereuses. */
function walk(v: unknown, path: string, depth: number, out: string[]): void {
  if (out.length >= 5) return;
  if (depth > MAX_DEPTH) return void out.push(`${path} : imbrication trop profonde`);
  if (typeof v === 'string') {
    if (v.length > MAX_TEXT) out.push(`${path} : texte trop long`);
  } else if (typeof v === 'number') {
    if (!Number.isFinite(v) || Math.abs(v) > MAX_ABS) out.push(`${path} : nombre hors limites`);
  } else if (Array.isArray(v)) {
    if (v.length > MAX_ARRAY) return void out.push(`${path} : liste trop longue`);
    v.forEach((x, i) => walk(x, `${path}[${i}]`, depth + 1, out));
  } else if (v !== null && typeof v === 'object') {
    const keys = Object.keys(v as object);
    if (keys.length > MAX_KEYS) return void out.push(`${path} : trop de champs`);
    for (const k of keys) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') out.push(`${path} : champ interdit « ${k} »`);
      else walk((v as Record<string, unknown>)[k], `${path}.${k}`, depth + 1, out);
    }
  } else if (v !== undefined && v !== null && typeof v !== 'boolean') out.push(`${path} : type de valeur non permis`);
}

const isObj = (v: unknown): v is Record<string, unknown> => typeOf(v) === 'object';
const num = (v: unknown, min: number, max: number): boolean => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

function dayErrors(d: unknown, where: string, out: string[]): void {
  if (!isObj(d)) return void out.push(`${where} : jour de programme invalide`);
  if (!Array.isArray(d.exercises) || d.exercises.length > 60) return void out.push(`${where} : liste d'exercices invalide`);
  d.exercises.forEach((e, i) => {
    if (!isObj(e)) return void out.push(`${where}.exercises[${i}] : exercice invalide`);
    for (const f of ['sets', 'repsMin', 'repsMax', 'restSec', 'holdSec']) {
      if (e[f] !== undefined && e[f] !== null && !num(e[f], 0, 10000)) out.push(`${where}.exercises[${i}] : « ${f} » hors limites`);
    }
    if (e.startLoadKg !== undefined && e.startLoadKg !== null && !num(e.startLoadKg, 0, 1000)) out.push(`${where}.exercises[${i}] : « startLoadKg » hors limites`);
  });
}

function deepErrors(table: TableName, r: Record<string, unknown>): string[] {
  const where = `${table}/${String(r.id ?? '?')}`;
  const out: string[] = [];
  walk(r, where, 0, out);
  if (table === 'programs' && Array.isArray(r.days)) {
    if (r.days.length > 100) out.push(`${where} : trop de jours`);
    else r.days.forEach((d, i) => dayErrors(d, `${where}.days[${i}]`, out));
  }
  if (table === 'sessions') {
    if (r.plan !== undefined && r.plan !== null) dayErrors(r.plan, `${where}.plan`, out);
    if (isObj(r.loadsKg)) {
      for (const [k, v] of Object.entries(r.loadsKg)) if (v !== null && !num(v, 0, 1000)) out.push(`${where} : charge « ${k} » hors limites (0 à 1000 kg)`);
    }
    if (typeof r.note === 'string' && r.note.length > MAX_TEXT) out.push(`${where} : note trop longue`);
  }
  if (table === 'meals' && Array.isArray(r.items)) {
    r.items.forEach((it, i) => {
      if (!isObj(it) || typeof it.foodCode !== 'string' || !num(it.grams, 0, 100000)) out.push(`${where}.items[${i}] : aliment invalide`);
    });
  }
  if (table === 'sets') {
    if (r.loadKg != null && !num(r.loadKg, 0, 1000)) out.push(`${where} : charge hors limites (0 à 1000 kg)`);
    for (const f of ['reps', 'targetRepsMin', 'targetRepsMax', 'holdSec', 'exerciseIndex', 'setIndex']) {
      if (r[f] != null && !num(r[f], 0, 10000)) out.push(`${where} : « ${f} » hors limites`);
    }
    if (r.rir != null && !num(r.rir, -1, 10)) out.push(`${where} : « rir » hors limites`);
  }
  if (table === 'sportSessions') out.push(...sportSessionErrors(r, where));
  if (table === 'profile' && r.sportPlan !== undefined && r.sportPlan !== null) out.push(...sportPlanErrors(r.sportPlan, where));
  if (table === 'profile' && r.catchUpLog !== undefined && r.catchUpLog !== null) out.push(...catchUpLogErrors(r.catchUpLog, where));
  if (table === 'bodyWeights' && !num(r.kg, 1, 1000)) out.push(`${where} : poids hors limites`);
  if (table === 'profile' && r.heightCm != null && !num(r.heightCm, 30, 300)) out.push(`${where} : taille hors limites`);
  if (table === 'injuries' && typeof r.level === 'number' && !num(r.level, 0, 5)) out.push(`${where} : niveau hors limites`);
  return out;
}

/** Ne garde que les champs connus de la table (les champs inconnus d'un fichier importé sont écartés). */
export function sanitizeRow(table: TableName, row: Record<string, unknown>): Record<string, unknown> {
  const known = new Set([...Object.keys(SYNC), ...Object.keys(SPECS[table])]);
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) if (known.has(k)) out[k] = row[k];
  return out;
}

/** Séance de sport (saisie-sport-v1.md §1.4) : durée 5 à 240, date lisible entre 2000 et 2100, listes fermées, textes bornés. */
function sportSessionErrors(r: Record<string, unknown>, where: string): string[] {
  const out: string[] = [];
  const bad = (f: string) => out.push(`${where} : champ « ${f} » invalide`);
  if (!num(r.durationMin, 5, 240)) bad('durationMin');
  const t = typeof r.startedAt === 'string' ? Date.parse(r.startedAt) : NaN;
  if (!Number.isFinite(t) || t < Date.UTC(2000, 0, 1) || t > Date.UTC(2100, 0, 1)) bad('startedAt');
  const closed = (v: unknown, allowed: readonly string[], max: number) => v === undefined || (Array.isArray(v) && v.length <= max && v.every((x) => typeof x === 'string' && allowed.includes(x)) && new Set(v).size === v.length);
  if (!closed(r.feelings, SPORT_FEELINGS, SPORT_FEELINGS.length) || r.feelings === undefined) bad('feelings');
  if (!closed(r.signs, SPORT_SIGNS, SPORT_SIGNS.length)) bad('signs');
  if (r.name != null && (typeof r.name !== 'string' || r.name.length > 40)) bad('name');
  if (r.note != null && (typeof r.note !== 'string' || r.note.length > 200)) bad('note');
  return out;
}

/** Journal du rattrapage : 120 lignes au plus, champs connus seulement, date AAAA-MM-JJ, zone et exercice courts (aucun texte libre). */
function catchUpLogErrors(log: unknown, where: string): string[] {
  const bad = (f: string) => [`${where} : champ « catchUpLog${f} » invalide`];
  if (!Array.isArray(log) || log.length > 120) return bad('');
  const known = ['week', 'zone', 'movementId', 'cause'];
  const causes = ['protection', 'plafond', 'materiel', 'manquee', 'sport'];
  const id = (x: unknown) => typeof x === 'string' && /^[a-z0-9_-]{1,80}$/.test(x);
  const out: string[] = [];
  log.forEach((e, i) => {
    if (!isObj(e) || Object.keys(e).some((k) => !known.includes(k)) || !(isDay(e.week) || (typeof e.week === 'string' && /^c\d{5}$/.test(e.week))) || !id(e.zone)) return void out.push(...bad(`[${i}]`));
    if (e.movementId != null && !id(e.movementId)) out.push(...bad(`[${i}].movementId`));
    if (e.cause != null && !causes.includes(String(e.cause))) out.push(...bad(`[${i}].cause`));
  });
  return out;
}

/** Sports déclarés : 3 au plus, entrées connues seulement (aucun champ inconnu), nombres et jours bornés. */
function sportPlanErrors(plan: unknown, where: string): string[] {
  const bad = (f: string) => [`${where} : champ « sportPlan${f} » invalide`];
  if (!Array.isArray(plan) || plan.length > 3) return bad('');
  const known = ['sport', 'name', 'perWeek', 'weekdays', 'matchWeekday', 'jumps', 'overhead', 'habitualEffort'];
  const out: string[] = [];
  plan.forEach((e, i) => {
    if (!isObj(e) || Object.keys(e).some((k) => !known.includes(k)) || !SPORT_KEYS.includes(e.sport as never)) return void out.push(...bad(`[${i}]`));
    if (e.name != null && (typeof e.name !== 'string' || e.name.length > 40)) out.push(...bad(`[${i}].name`));
    if (e.perWeek != null && !(Number.isInteger(e.perWeek) && num(e.perWeek, 0, 7))) out.push(...bad(`[${i}].perWeek`));
    if (e.weekdays != null && !(Array.isArray(e.weekdays) && e.weekdays.length <= 7 && e.weekdays.every((d) => Number.isInteger(d) && num(d, 0, 6)) && new Set(e.weekdays).size === e.weekdays.length)) out.push(...bad(`[${i}].weekdays`));
    if (e.matchWeekday != null && !(Number.isInteger(e.matchWeekday) && num(e.matchWeekday, 0, 6))) out.push(...bad(`[${i}].matchWeekday`));
    for (const f of ['jumps', 'overhead']) if (e[f] != null && typeof e[f] !== 'boolean') out.push(...bad(`[${i}].${f}`));
    if (e.habitualEffort != null && e.habitualEffort !== 'tres_dur') out.push(...bad(`[${i}].habitualEffort`));
  });
  return out;
}

const isDay = (v: unknown): boolean => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** État de reprise (SM-D4) : chaque champ présent doit avoir le bon type et une valeur permise (palier 0-4, plancher 0 ou 2). */
function repriseErrors(rp: Record<string, unknown>, where: string): string[] {
  const out: string[] = [];
  const bad = (f: string) => out.push(`${where} : champ « reprise.${f} » invalide`);
  if (rp.palier !== undefined && ![0, 1, 2, 3, 4].includes(rp.palier as number)) bad('palier');
  if (rp.palierMin !== undefined && ![0, 2].includes(rp.palierMin as number)) bad('palierMin');
  if (rp.valables !== undefined && !(Number.isInteger(rp.valables) && (rp.valables as number) >= 0)) bad('valables');
  for (const f of ['actif', 'securiteALire', 'apresMalaise', 'msgVu']) if (rp[f] !== undefined && typeof rp[f] !== 'boolean') bad(f);
  for (const f of ['depuis', 'conseilVuLe']) if (!(rp[f] === null || rp[f] === undefined || isDay(rp[f]))) bad(f);
  for (const f of ['refKg', 'descenteKg']) {
    const v = rp[f];
    if (v === undefined) continue;
    if (typeOf(v) !== 'object' || Object.values(v as Record<string, unknown>).some((x) => typeOf(x) !== 'number' || (x as number) < 0)) bad(f);
  }
  return out;
}
