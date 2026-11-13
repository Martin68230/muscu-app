// Outils communs des tests du générateur : fiches réelles, profils de matériel A0 et A à F (tools/couverture.mjs).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import type { InjuryZone, Level } from '../../src/data/model';
import type { Fiche, GeneratorInput, GenProgram, HistorySet } from '../../src/generator/types';
import { weekCountsSecondary } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { raisedCaps, sessionVol, weekCapFor, weekVol } from '../../src/generator/plaf';

export const FICHES: Fiche[] = JSON.parse(readFileSync('public/data/fiches.json', 'utf8')).fiches;
const TAGS: { id: string; groupe: string }[] = JSON.parse(readFileSync('knowledge/materiel-tags.json', 'utf8')).tags;
const QUOT = ['sac_a_dos', 'bidons_ou_sacs', 'box_ou_step'];
const D_TAGS = [...QUOT, 'halteres', 'elastique', 'barre_traction'];
export const PROFILES: Record<string, { tags: string[]; preset: 'perso' | 'F' }> = {
  A0: { tags: [], preset: 'perso' },
  A: { tags: QUOT, preset: 'perso' },
  B: { tags: [...QUOT, 'elastique'], preset: 'perso' },
  C: { tags: [...QUOT, 'halteres'], preset: 'perso' },
  D: { tags: D_TAGS, preset: 'perso' },
  E: { tags: [...new Set([...D_TAGS, ...TAGS.filter((t) => t.groupe === 'maison').map((t) => t.id)])], preset: 'perso' },
  F: { tags: [], preset: 'F' },
};
export const PROFILE_KEYS = Object.keys(PROFILES);
export const ZONES: InjuryZone[] = ['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'];
export const LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];

export interface MkOpts {
  profile?: string;
  place?: 'maison' | 'salle';
  days?: number | null;
  level?: Level | null;
  goal?: string | null;
  dur?: number | null;
  injuries?: [InjuryZone, 1 | 2 | 3, { afterShock?: boolean }?][];
  preg?: 'enceinte' | 'post_partum' | null;
  blocked?: number[];
  options?: GeneratorInput['options'];
  history?: HistorySet[];
  fiches?: Fiche[];
  extraTags?: string[];
  dumbbells?: number[];
}

export function mk(o: MkOpts = {}): GeneratorInput {
  const p = PROFILES[o.profile ?? 'C'];
  return {
    profile: {
      level: o.level === undefined ? 'intermediaire' : o.level,
      daysPerWeek: o.days === undefined ? 3 : o.days,
      blockedWeekdays: o.blocked ?? [],
      sessionDurationMin: o.dur === undefined ? 45 : o.dur,
      place: o.place ?? 'maison',
      pregnancy: o.preg ?? null,
    },
    equipment: {
      preset: p.preset,
      tags: [...p.tags, ...(o.extraTags ?? [])],
      disabledImplicit: [],
      dumbbellWeightsKg: o.dumbbells ?? [2, 4, 6, 8, 10],
      kettlebellWeightsKg: [8, 12],
    },
    goals: o.goal === null ? [] : [{ goalKey: o.goal ?? 'muscle', rank: 1 }],
    injuries: (o.injuries ?? []).map(([zone, level, extra]) => ({ zone, level, active: true, deletedAt: null, ...(extra ?? {}) })),
    fiches: o.fiches ?? FICHES,
    history: o.history,
    options: o.options,
  };
}

export const allEx = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises);
export const byId = (id: string) => FICHES.find((f) => f.id === id)!;
export const msgIds = (p: { messages: { id: string }[] }) => p.messages.map((m) => m.id);

// ---- Plafonds relevés (13/11/2026, avis kiné ; NON SOURCÉ comme plafonds) ----
/** Plafond hebdomadaire attendu d'un muscle pour ce profil : 24 (principal seul) pour l'intermédiaire / avancé sans protection, sinon 20 ; six groupes protégés : toujours 20. */
export const weekCapOf = (input: GeneratorInput, m: string): number => weekCapFor(buildCtx(input), m);
/**
 * Mesure du plafond hebdomadaire d'un muscle, selon le profil : séries où le muscle est principal pour un profil relevé (muscle non protégé),
 * sinon séries fractionnaires (principal 1, secondaire 0,5) comme avant, y compris pour les six groupes protégés.
 */
export function weekMeasure(input: GeneratorInput, sessions: readonly { exercises: readonly { sets: number; musclesPrincipaux: string[]; musclesSecondaires: string[] }[] }[], m: string): number {
  const relevé = raisedCaps(buildCtx(input)) && !weekCountsSecondary(m);
  return sessions.reduce((a, s) => a + (relevé ? weekVol(s as never, m) : sessionVol(s as never, m)), 0);
}
