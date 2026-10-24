import type { TableName } from './model';

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
    summary: 'object?',
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
};

/** Champs ajoutés après coup : peuvent manquer dans une ancienne sauvegarde. */
const MAY_BE_MISSING: Partial<Record<TableName, string[]>> = {
  profile: ['place', 'pregnancy', 'profileCompletedAt', 'progressionLog'],
  programs: ['inputsHash', 'generatorVersion', 'explanation', 'messages', 'durationMin', 'family'],
  sessions: ['cursor', 'restEndsAt', 'restTotalMs', 'restKind', 'phase', 'skippedExercises', 'painExercises', 'loadsKg', 'plan', 'lastActionAt', 'endReason', 'echelonSwitches', 'calibDecided', 'summary'],
  sets: ['targetRir', 'isCalibration', 'isWarmup', 'echelon', 'bandResistance', 'holdSec', 'side', 'capped', 'painZone', 'restTakenSec'],
  injuries: ['afterShock'],
  equipment: ['dumbbellKind', 'platesKg', 'other'],
};

/** Valeurs permises des champs qui pilotent la sécurité (un import ne doit pas en introduire d'inconnues). */
const ENUMS: Partial<Record<TableName, Record<string, string[]>>> = {
  profile: { place: ['maison', 'salle'], pregnancy: ['non', 'enceinte', 'post_partum'], level: ['debutant', 'intermediaire', 'avance'] },
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
    const kinds = ['montee', 'descente', 'refus', 'niveau', 'annule'];
    const bad = r.progressionLog.some((e) => typeOf(e) !== 'object' || !kinds.includes(String((e as Record<string, unknown>).type)));
    if (bad) errors.push(`${table}/${String(r.id ?? '?')} : champ « progressionLog » contient une décision inconnue`);
  }
  if (typeof r.updatedAt === 'string' && Number.isNaN(Date.parse(r.updatedAt))) {
    errors.push(`${table}/${String(r.id)} : date de modification invalide`);
  }
  return errors;
}
