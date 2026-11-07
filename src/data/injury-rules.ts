import type { Injury, InjuryLevel, InjuryZone } from './model';

// Règles de sécurité de la zone « cou » : knowledge/regles-securite-communes.md §9 (C1, C2, C3, C5).
// Fonctions pures, sans accès à la base : le générateur leur passe la liste des blessures.

/** Message affiché quand la zone cou est au niveau 3 à cause d'un choc (C3). */
export const NECK_SHOCK_MESSAGE =
  "Douleur de cou après un choc : demande l'avis d'un professionnel de santé avant de reprendre ces exercices.";

/** Case du profil blessures (C3). */
export const NECK_SHOCK_LABEL = 'Mon cou me fait mal depuis un choc, une chute, un accident ou un coup du lapin';

/** Fiches dédiées au cou (schéma mobilité) : jamais un échauffement ni une mobilité générique (C2). */
export const NECK_DEDICATED_IDS: readonly string[] = [
  'rotation-douce-cou',
  'inclinaison-douce-cou',
  'retraction-cervicale',
  'isometrique-cou',
];

export interface FicheRuleInfo {
  id: string;
  /** Champ `doux_pour` du frontmatter. */
  douxPour?: readonly string[];
}

/** Niveau réel d'une blessure : « cou après un choc » vaut toujours 3 (C3). */
export function effectiveLevel(injury: Pick<Injury, 'zone' | 'level' | 'afterShock'>): InjuryLevel {
  return injury.zone === 'cou' && injury.afterShock ? 3 : injury.level;
}

/** Niveau 0 = zone sans gêne. Plusieurs lignes actives pour une zone : la plus prudente gagne. */
export function zoneLevel(
  injuries: readonly Pick<Injury, 'zone' | 'level' | 'afterShock' | 'active' | 'deletedAt'>[],
  zone: InjuryZone,
): 0 | InjuryLevel {
  let level: 0 | InjuryLevel = 0;
  for (const i of injuries) {
    if (i.zone !== zone || !i.active || i.deletedAt) continue;
    level = Math.max(level, effectiveLevel(i)) as InjuryLevel;
  }
  return level;
}

/** Message « consulte » du niveau 3 de la zone cou à cause d'un choc, sinon null. */
export function neckShockMessage(injuries: readonly Pick<Injury, 'zone' | 'active' | 'deletedAt' | 'afterShock'>[]): string | null {
  return injuries.some((i) => i.zone === 'cou' && i.active && !i.deletedAt && i.afterShock) ? NECK_SHOCK_MESSAGE : null;
}

/**
 * Cette fiche liée au cou peut-elle être proposée ? (C1, C2, C5)
 * - niveau 3 : aucune fiche douce ni dédiée ;
 * - fiche dédiée douce : niveaux 1 et 2 seulement (niveau 0 : seulement sur demande explicite) ;
 * - isometrique-cou (dédiée, non douce) : niveau 1 seulement, jamais sur simple demande ;
 * - autres fiches (dont retraction-omoplates) : normales aux niveaux 0 à 2 ; une fiche douce pour le cou
 *   est retirée au niveau 3.
 * Les autres lignes du tableau zone x niveau de la fiche (garder / adapter / retirer) restent appliquées par ailleurs.
 */
export function neckFicheAllowed(fiche: FicheRuleInfo, neckLevel: 0 | InjuryLevel, explicitRequest = false): boolean {
  const douce = fiche.douxPour?.includes('cou') ?? false;
  const dedicated = NECK_DEDICATED_IDS.includes(fiche.id);
  if (!douce && !dedicated) return true;
  if (neckLevel === 3) return false;
  if (!dedicated) return true; // douce mais non dédiée au cou (retraction-omoplates)
  if (!douce) return neckLevel === 1; // isometrique-cou
  return neckLevel > 0 || explicitRequest;
}

/** Filtre le catalogue selon les blessures actives (partie « cou » ; les autres zones suivent leur tableau). */
export function filterByNeck<T extends FicheRuleInfo>(
  fiches: readonly T[],
  injuries: Parameters<typeof zoneLevel>[0],
  explicitRequestIds: readonly string[] = [],
): T[] {
  const level = zoneLevel(injuries, 'cou');
  return fiches.filter((f) => neckFicheAllowed(f, level, explicitRequestIds.includes(f.id)));
}
