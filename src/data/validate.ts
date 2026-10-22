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
  },
  equipment: {
    preset: 'string',
    tags: 'array',
    disabledImplicit: 'array',
    dumbbellWeightsKg: 'array',
    kettlebellWeightsKg: 'array',
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
  },
  sessions: {
    programId: 'string?',
    programDayIndex: 'number?',
    plannedDate: 'string',
    status: 'string',
    startedAt: 'string?',
    endedAt: 'string?',
    note: 'string',
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
};

/** Champs ajoutés après coup : peuvent manquer dans une ancienne sauvegarde. */
const MAY_BE_MISSING: Partial<Record<TableName, string[]>> = { injuries: ['afterShock'] };

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
  if (typeof r.updatedAt === 'string' && Number.isNaN(Date.parse(r.updatedAt))) {
    errors.push(`${table}/${String(r.id)} : date de modification invalide`);
  }
  return errors;
}
