// Contexte de génération : profil normalisé, matériel disponible (V-MAT), zones actives, historique.
import type { InjuryZone, Level } from '../data/model';
import { zoneLevel } from '../data/injury-rules';
import tagsJson from '../../knowledge/materiel-tags.json';
import {
  CHARGEABLE_TAGS, DEFAULT_FAMILY, FIXED_LOAD_TAGS, DEFAULT_LEVEL, GOAL_FAMILY, GOALS_WITH_FONCTIONNEL, IMPLICIT_TAGS, NATIVE_GOALS,
  PREGNANCY, PREGNANCY_CASE_PRIORITY, UNILATERAL_MARKERS, type Family,
} from './config';
import type { Fiche, FicheVariant, GeneratorInput, HistorySet } from './types';

export const LEVELS: readonly Level[] = ['debutant', 'intermediaire', 'avance'];
export const levelIdx = (l: Level): number => LEVELS.indexOf(l);
export const ZONES: readonly InjuryZone[] = ['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'];

/** Une « zone » active : vraie zone (niveau effectif 1-3) ou ligne Grossesse (V-GROS : traitée comme une zone de plus). */
export interface ZoneEntry {
  key: InjuryZone | 'grossesse';
  level: number;
  isG: boolean;
}

export interface HistoryInfo {
  /** Dernière charge faite sans douleur (null au poids du corps). */
  lastPainFreeLoadKg: number | null;
  lastAt: string;
}

export interface Ctx {
  level: Level;
  levelI: number;
  /** Famille de la dose (P-GROS : sante si grossesse). */
  family: Family;
  /** Famille de l'objectif, avant P-GROS. */
  goalFamily: Family;
  goalKey: string | null;
  ramene: boolean;
  pregnant: boolean;
  postPartum: boolean;
  place: 'maison' | 'salle';
  available: Set<string>;
  specialiseForbidden: boolean;
  zones: ZoneEntry[];
  neckLevel: 0 | 1 | 2 | 3;
  neckShock: boolean;
  fichesById: Map<string, Fiche>;
  variantOwner: Map<string, Fiche>;
  /** Fiches admissibles pour les emplacements (V-ADM 1, 4, 5, 6 + filterByNeck). */
  history: Map<string, HistoryInfo>;
  dumbbells: number[];
  kettlebells: number[];
  habitual: Record<string, number>;
  favoris: Set<string>;
  masques: Set<string>;
  fonctionnelEnabled: boolean;
  gagnerDuTemps: boolean;
  /** Mémo de resolveFiche (dépend du contexte). */
  memo: Map<string, unknown>;
}

const ALL_TAGS: string[] = (tagsJson as { tags: { id: string }[] }).tags.map((t) => t.id);

/** V-MAT : implicites non décochés + tags cochés ; preset F non modifié = salle complète. */
export function availableTags(eq: GeneratorInput['equipment']): Set<string> {
  if (eq.preset === 'F') return new Set(ALL_TAGS);
  const implicit = IMPLICIT_TAGS.filter((t) => !eq.disabledImplicit.includes(t));
  return new Set([...implicit, ...eq.tags]);
}

export const isChargeable = (v: FicheVariant): boolean => v.tags.some((t) => CHARGEABLE_TAGS.includes(t));
/** Porte une charge, chargeable ou fixe (gilet lesté, FIXED_LOAD_TAGS) : pour les restrictions « sans charge » et la réserve. */
export const carriesLoad = (v: FicheVariant): boolean => isChargeable(v) || v.tags.some((t) => FIXED_LOAD_TAGS.includes(t));
export function isUnilateral(v: FicheVariant): boolean {
  const s = `${v.id} ${v.nom}`.toLowerCase();
  return UNILATERAL_MARKERS.some((m) => s.includes(m));
}

function buildHistory(h: HistorySet[] | undefined): Map<string, HistoryInfo> {
  const out = new Map<string, HistoryInfo>();
  const done = (h ?? []).filter((s) => s.completedAt).sort((a, b) => (a.completedAt! < b.completedAt! ? -1 : a.completedAt! > b.completedAt! ? 1 : 0));
  for (const s of done) {
    const prev = out.get(s.variantId);
    out.set(s.variantId, {
      lastAt: s.completedAt!,
      lastPainFreeLoadKg: s.pain ? (prev?.lastPainFreeLoadKg ?? null) : s.loadKg,
    });
  }
  return out;
}

export interface CtxOverrides {
  zones?: ZoneEntry[];
  pregnant?: boolean;
  extraTags?: string[];
}

export function buildCtx(input: GeneratorInput, ov: CtxOverrides = {}): Ctx {
  const p = input.profile;
  const level: Level = p.level ?? DEFAULT_LEVEL;
  const mainGoal = [...(input.goals ?? [])].sort((a, b) => a.rank - b.rank)[0]?.goalKey ?? null;
  // Objectif inconnu : famille sante (la plus douce), lecture prudente (docs/generateur-notes-dev.md).
  const goalFamily: Family = mainGoal ? (GOAL_FAMILY[mainGoal] ?? DEFAULT_FAMILY) : DEFAULT_FAMILY;
  const pregnantReal = p.pregnancy === 'enceinte' || p.pregnancy === 'post_partum';
  const pregnant = ov.pregnant ?? pregnantReal;
  const place = p.place ?? (input.equipment.preset === 'F' ? 'salle' : 'maison');
  const available = availableTags(input.equipment);
  for (const t of ov.extraTags ?? []) available.add(t);

  const injuries = (input.injuries ?? []).map((i) => ({ ...i, deletedAt: i.deletedAt ?? null, afterShock: i.afterShock ?? false }));
  let zones: ZoneEntry[] = [];
  for (const z of ZONES) {
    const l = zoneLevel(injuries, z);
    if (l > 0) zones.push({ key: z, level: l, isG: false });
  }
  let neckLevel = zoneLevel(injuries, 'cou');
  let neckShock = injuries.some((i) => i.zone === 'cou' && i.active && !i.deletedAt && i.afterShock);
  if (ov.zones) {
    zones = ov.zones.filter((z) => !z.isG);
    const cou = zones.find((z) => z.key === 'cou');
    neckLevel = (cou?.level ?? 0) as 0 | 1 | 2 | 3;
    neckShock = neckShock && !!cou;
  }
  if (pregnant) zones.push({ key: 'grossesse', level: PREGNANCY_CASE_PRIORITY, isG: true });

  const fichesById = new Map<string, Fiche>();
  const variantOwner = new Map<string, Fiche>();
  for (const f of input.fiches) {
    fichesById.set(f.id, f);
    for (const v of f.variantes) variantOwner.set(v.id, f);
  }
  const opts = input.options ?? {};
  return {
    level,
    levelI: levelIdx(level),
    family: pregnant ? PREGNANCY.family : goalFamily,
    goalFamily,
    goalKey: mainGoal,
    ramene: !!mainGoal && !NATIVE_GOALS.includes(mainGoal),
    pregnant,
    postPartum: p.pregnancy === 'post_partum',
    place,
    available,
    // Règle 23 (V-ADM 5) : jamais de matériel spécialisé à la maison ni pour un débutant.
    specialiseForbidden: place === 'maison' || level === 'debutant',
    zones,
    neckLevel,
    neckShock,
    fichesById,
    variantOwner,
    history: buildHistory(input.history),
    dumbbells: [...(input.equipment.dumbbellWeightsKg ?? [])].sort((a, b) => a - b),
    kettlebells: [...(input.equipment.kettlebellWeightsKg ?? [])].sort((a, b) => a - b),
    habitual: opts.habitualLoadsKg ?? {},
    favoris: new Set(opts.favoris ?? []),
    masques: new Set(opts.masques ?? []),
    fonctionnelEnabled: !!opts.ajouterFonctionnel || (goalFamily === 'sante' && !!mainGoal && GOALS_WITH_FONCTIONNEL.includes(mainGoal)),
    gagnerDuTemps: !!opts.gagnerDuTemps,
    memo: new Map(),
  };
}
