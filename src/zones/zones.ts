// Zones musculaires (knowledge/zones-musculaires.md, knowledge/zones-correspondance.json, rédigés par `coach`, PROVISOIRE / NON SOURCÉ sauf
// le 10 de la prise de muscle). Module PUR : aucune écriture, aucun stockage ; tout se recalcule depuis le programme ou l'historique.
// Décisions du chef de projet (06/11/2026) : dérivation automatique par muscles + règles (aucune fiche réécrite à la main) ; sous-zones
// = seuils de la zone mère ; mobilité, récupération, cardio et échauffement = 0 point.
import data from '../../knowledge/zones-correspondance.json';

export type ZoneId = string;
export type ZoneStatus = 'gris' | 'orange' | 'rouge';
export type ZoneClass = 'G' | 'P';

export interface ZoneDef {
  id: ZoneId;
  nom: string;
  groupe: string;
  sous_zone: boolean;
  indicatif: boolean;
  vue: string;
  seuil: ZoneClass;
}

/** Ce dont le calcul a besoin d'une fiche (Fiche de src/data/model.ts ou exercice du générateur). */
export interface ZoneFiche {
  id: string;
  type?: string;
  schema: string;
  musclesPrincipaux: readonly string[];
  musclesSecondaires: readonly string[];
}

/**
 * Séries de travail réalisées ou prévues. `sets` (1 par défaut) : une série d'un exercice par côté = les deux côtés (comme plaf.ts et
 * isPerSide) ; une ligne d'historique notée d'un seul côté (`side`) vaut une demi-série. `warmup: true` = échauffement : 0 point.
 */
export interface ZoneSet {
  ficheId: string;
  /** Dose fixe plafonnée par une règle de sécurité (cou, correctifs, prévention) : sert à l'AFFICHAGE seulement (zone « couverte »). */
  capped?: boolean;
  sets?: number;
  warmup?: boolean;
  side?: 'gauche' | 'droite' | null;
}

interface ZoneCoef { zone: ZoneId; coef: number }
interface Rule { id: string; muscle?: string | null; motif_id?: string; schema?: string[]; zones?: ZoneCoef[] }
interface Thresholds { gris_sous: number; rouge_defaut: number; rouge_muscle: number; rouge_force: number; plafond_semaine: number; plafond_seance_standard: number }

export const ZONES: readonly ZoneDef[] = data.zones as ZoneDef[];
const ZONE_BY_ID = new Map(ZONES.map((z) => [z.id, z]));
const POINTS = data.points;
// `cou` n'est pas dans la table des muscles du coach : ajouté aux muscles des fiches le 06/11/2026 (validateur), il remplit la zone cou.
const MUSCLE_ZONES: Record<string, ZoneCoef[]> = { ...(data.muscles as Record<string, ZoneCoef[]>), cou: [{ zone: 'cou', coef: 1 }] };
const RULES: (Rule & { re: RegExp | null })[] = (data.regles_sous_zones as Rule[])
  .filter((r) => r.zones)
  .map((r) => ({ ...r, re: r.motif_id ? new RegExp(r.motif_id) : null }));
const SEUILS = data.seuils as unknown as Record<ZoneClass, Thresholds>;

/** Types de fiche qui comptent (séries de travail de force) ; mobilité, récupération, cardio : 0 point. */
const COUNTED_TYPES = new Set(['force', 'fonctionnel', 'gainage']);

const ruleMatches = (r: Rule & { re: RegExp | null }, f: ZoneFiche) => (r.re !== null && r.re.test(f.id)) || (r.schema?.includes(f.schema) ?? false);

/** Zones d'un muscle pour cette fiche : première règle du muscle qui correspond (motif d'id et/ou schéma), sinon la table des muscles. */
function zonesOfMuscle(muscle: string, f: ZoneFiche): ZoneCoef[] {
  const r = RULES.find((x) => x.muscle === muscle && ruleMatches(x, f));
  return r ? r.zones! : MUSCLE_ZONES[muscle] ?? [];
}

const coefCache = new Map<string, ReadonlyMap<ZoneId, number>>();
const capCoefCache = new Map<string, ReadonlyMap<ZoneId, number>>();

/** Points par zone pour UNE série de travail de la fiche (principal 1, secondaire 0,5, multipliés par les coefficients). */
export function zoneCoefs(f: ZoneFiche, principalOnly = false): ReadonlyMap<ZoneId, number> {
  const key = `${f.id}|${f.type ?? ''}|${f.schema}|${f.musclesPrincipaux.join(',')}|${f.musclesSecondaires.join(',')}`;
  const cache = principalOnly ? capCoefCache : coefCache;
  const hit = cache.get(key);
  if (hit) return hit;
  const out = new Map<ZoneId, number>();
  if (f.type === undefined || COUNTED_TYPES.has(f.type)) {
    const add = (muscle: string, w: number) => {
      for (const { zone, coef } of zonesOfMuscle(muscle, f)) if (coef > 0) out.set(zone, (out.get(zone) ?? 0) + w * coef);
    };
    for (const m of f.musclesPrincipaux) add(m, POINTS.principal);
    if (!principalOnly) for (const m of f.musclesSecondaires) add(m, POINTS.secondaire);
    // Règles sans muscle (R-COU) : la zone reçoit au moins coef x 1, sans double compte si un muscle la remplit déjà.
    for (const r of RULES) {
      if (r.muscle || !ruleMatches(r, f)) continue;
      for (const { zone, coef } of r.zones!) out.set(zone, Math.max(out.get(zone) ?? 0, coef * POINTS.principal));
    }
  }
  cache.set(key, out);
  return out;
}

/** Points par zone (toutes les zones présentes, 0 compris), arrondis au centième. Fiche inconnue : ignorée. */
export function pointsByZone(sets: readonly ZoneSet[], fiches: ReadonlyMap<string, ZoneFiche> | readonly ZoneFiche[], capMode = false): Record<ZoneId, number> {
  const byId = 'get' in fiches ? (fiches as ReadonlyMap<string, ZoneFiche>) : new Map((fiches as readonly ZoneFiche[]).map((f) => [f.id, f]));
  const pts: Record<ZoneId, number> = Object.fromEntries(ZONES.map((z) => [z.id, 0]));
  for (const s of sets) {
    if (s.warmup) continue;
    const f = byId.get(s.ficheId);
    if (!f) continue;
    const n = (s.sets ?? 1) * (s.side ? 0.5 : 1);
    // capMode (plafonds relevés, 13/11/2026) : muscles principaux seulement, sauf zones protégées (comptage complet).
    for (const [z, c] of zoneCoefs(f)) pts[z] = (pts[z] ?? 0) + n * c;
    if (capMode) {
      const po = zoneCoefs(f, true);
      for (const zz of Object.keys(pts)) if (!isProtectedZone(zz)) pts[zz] = (pts[zz] ?? 0) - n * (zoneCoefs(f).get(zz as ZoneId) ?? 0) + n * (po.get(zz as ZoneId) ?? 0);
    }
  }
  for (const z of Object.keys(pts)) pts[z] = Math.round(pts[z] * 100) / 100;
  return pts;
}

/** Seuils d'une zone : sous `gris` = gris ; à partir de `rouge` = rouge ; entre les deux = orange. Sous-zones : seuils de la zone mère. */
export function thresholdsOf(zone: ZoneId, objectif: string | null | undefined): { gris: number; rouge: number } {
  const t = SEUILS[ZONE_BY_ID.get(zone)?.seuil ?? 'G'];
  const rouge = objectif === 'muscle' ? t.rouge_muscle : objectif === 'force' ? t.rouge_force : t.rouge_defaut;
  return { gris: t.gris_sous, rouge };
}

/** Statut d'une zone pour l'objectif principal (`muscle` = 10 / 5, `force` = 4 / 2, autre = 6 / 3). */
export function zoneStatus(points: number, zone: ZoneId, objectif: string | null | undefined): ZoneStatus {
  const { gris, rouge } = thresholdsOf(zone, objectif);
  if (points < gris) return 'gris';
  return points >= rouge ? 'rouge' : 'orange';
}

/** Nom affiché d'une zone, en minuscule initiale pour une liste dans une phrase (« épaules (côté) »). */
export const zoneName = (zone: ZoneId): string => {
  const n = ZONE_BY_ID.get(zone)?.nom ?? zone;
  return n.charAt(0).toLowerCase() + n.slice(1);
};

/** Zones de la carte liées à une zone de blessure (InjuryZone) : affichage « sensible » et exclusion du contrôle « aucune zone grise ». */
export const zonesOfInjury = (injuryZone: string): readonly ZoneId[] => (data.zones_blessures as Record<string, ZoneId[]>)[injuryZone] ?? [];

/** Muscle mère d'une sous-zone (plafond calculé avec le MAXIMUM des sous-zones, zones-musculaires.md §3) ; zone simple : elle-même. */
const PARENT: Record<ZoneId, string> = {
  pectoraux_haut: 'pectoraux', pectoraux_milieu_bas: 'pectoraux',
  trapezes_haut: 'trapezes', trapezes_moyen: 'trapezes', trapezes_bas: 'trapezes',
  triceps_long_chef: 'triceps', triceps_lateral_medial: 'triceps',
  fessiers_grand: 'fessiers', fessiers_moyen: 'fessiers',
  quadriceps_vastes: 'quadriceps', quadriceps_droit_femoral: 'quadriceps',
  mollets_gastrocnemien: 'mollets', mollets_soleaire: 'mollets',
};
export const capGroupOf = (zone: ZoneId): string => PARENT[zone] ?? zone;

/** Plafonds d'une zone (§3, NON SOURCÉ) : par semaine 20 / 10, par séance 10 / 6 (grandes zones : V-PLAF du générateur fait foi). */
/** Zones protégées (13/11/2026, kiné) : jamais de plafond relevé (épaules, trapèzes, triceps, biceps, avant-bras, lombaires, carré des lombes). */
export const isProtectedZone = (z: string) => /^(epaules|trapezes|triceps)/.test(z) || ['biceps', 'avant_bras', 'lombaires', 'carre_des_lombes', 'coiffe_rotateurs', 'dentele_anterieur'].includes(z);
/** `raised` : plafond hebdomadaire x `factor` (RAISED_CAPS) pour les zones non protégées ; le plafond par séance ne change jamais. */
export function zoneCaps(zone: ZoneId, raised: { factor: number } | false = false): { week: number; session: number } {
  const t = SEUILS[ZONE_BY_ID.get(zone)?.seuil ?? 'G'];
  const week = raised && !isProtectedZone(zone) ? Math.round(t.plafond_semaine * raised.factor) : t.plafond_semaine;
  return { week, session: t.plafond_seance_standard };
}

/** Points de chaque groupe de plafond (maximum des sous-zones, jamais la somme). */
export function capGroupPoints(points: Readonly<Record<ZoneId, number>>): Map<string, { points: number; zone: ZoneId }> {
  const out = new Map<string, { points: number; zone: ZoneId }>();
  for (const z of ZONES) {
    const g = capGroupOf(z.id);
    const p = points[z.id] ?? 0;
    const cur = out.get(g);
    if (!cur || p > cur.points) out.set(g, { points: p, zone: z.id });
  }
  return out;
}
