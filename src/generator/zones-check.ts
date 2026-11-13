// Niveau 2, étape 2 (06/11/2026) : contrôle des zones musculaires de la semaine prévue (src/zones, knowledge/zones-musculaires.md).
// Objectif : AUCUNE zone grise, hors zones liées à une blessure déclarée (niveau >= 1) et zones sans fiche admissible pour le matériel,
// le niveau, la grossesse ou la douleur ; zones orange : signalées par un message simple (repère d'équilibre, jamais une obligation).
// Correction : d'abord changer d'exercice (même emplacement, même classement), puis ajouter des séries ; jamais au-delà des plafonds
// V-PLAF / hebdomadaire (plaf.ts), des plafonds par zone (§3 : 20 / 10 par semaine, 6 par séance pour une petite zone), de la durée
// choisie ni d'une protection (grossesse, reprise, semaine allégée, douleur : aucune série ajoutée sur une fiche qui touche une zone gênée).
import { CORRECTIF, CORRECTIF_COU, HEAVY_TAGS_B1, doseLimitOf, FIXED_DOSE, MAIN_EXERCISE_SLOTS, RAISED_CAPS, VOLUME, weekCountsSecondary } from './config';
import { raisedCaps } from './plaf';
import { isIsoSlot } from './isolation';
import { levelIdx, type Ctx } from './context';
import { buildExercise } from './dose';
import { estimerDuree, type DurSession } from './duration';
import { resolveFiche, type Candidate } from './safety';
import { isTwinOfUsed, tierRank } from './slots';
import type { Fiche, GenExercise } from './types';
import { capGroupOf, capGroupPoints, pointsByZone, thresholdsOf, zoneCaps, zoneCoefs, zonesOfInjury, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneStatus } from '../zones/zones';

type Sess = DurSession<GenExercise>;
export type ZoneExclusion = 'blessure' | 'materiel';

/**
 * Décision du chef de projet (06/11/2026) : petites zones (et adducteurs) sans emplacement dans les séances ; ni changement d'exercice
 * ni série ajoutée (fillGreyZones) ; couvertes par l'emplacement correctif (addCorrectifs, CORRECTIF) quand une fiche légère compatible
 * existe pour le profil. Sans fiche compatible (slotlessFor) : ni corrigées ni citées, le rapport les liste à part.
 */
export const SLOTLESS_ZONES: readonly ZoneId[] = ['coiffe_rotateurs', 'carre_des_lombes', 'flechisseurs_hanche', 'peroniers', 'abducteurs', 'adducteurs', 'mollets_soleaire', 'tibiaux', 'avant_bras', 'cou'];

export interface ZoneCheck {
  points: Record<ZoneId, number>;
  status: Record<ZoneId, ZoneStatus>;
  /** Zones hors du contrôle « aucune zone grise » et sans message « il en manque ». */
  excluded: Partial<Record<ZoneId, ZoneExclusion>>;
  grey: ZoneId[];
  orange: ZoneId[];
  /** Zones grises à corriger (hors slotlessFor : zones principales et petites zones à fiche correctif compatible) : message V-MSG-ZONES-GRIS. */
  greyFixable: ZoneId[];
  /** Zones grises sans emplacement ni fiche correctif compatible (slotlessFor), listées dans le rapport seulement. */
  greySlotless: ZoneId[];
}

/** Coefficient minimal pour qu'une fiche « travaille » une zone (une série = au moins une demi-série de la zone). */
const MIN_COEF = 0.5;

const zf = (ctx: Ctx, ficheId: string): ZoneFiche | undefined => ctx.fichesById.get(ficheId) as ZoneFiche | undefined;

export function weekPoints(sessions: readonly { exercises: readonly GenExercise[] }[], ctx: Ctx, capMode = false): Record<ZoneId, number> {
  const fiches = new Map<string, ZoneFiche>();
  const sets = sessions.flatMap((s) => s.exercises.map((e) => {
    const f = zf(ctx, e.ficheId);
    if (f) fiches.set(f.id, f);
    return { ficheId: e.ficheId, sets: e.sets };
  }));
  return pointsByZone(sets, fiches, capMode);
}

/** Zones exclues du contrôle : blessure déclarée (niveau >= 1), puis aucune fiche admissible (coefficient >= 0,5) dans le catalogue. */
export function excludedZones(ctx: Ctx, pool: readonly Fiche[]): Partial<Record<ZoneId, ZoneExclusion>> {
  const key = 'zones:excl';
  const hit = ctx.memo.get(key) as Partial<Record<ZoneId, ZoneExclusion>> | undefined;
  if (hit) return hit;
  const out: Partial<Record<ZoneId, ZoneExclusion>> = {};
  for (const z of ctx.zones) if (!z.isG && z.level >= 1) for (const id of zonesOfInjury(z.key)) out[id] = 'blessure';
  const reachable = new Set<ZoneId>();
  for (const f of pool) {
    if (!resolveFiche(f, ctx).candidates.length) continue;
    for (const [z, c] of zoneCoefs(f as ZoneFiche)) if (c >= MIN_COEF) reachable.add(z);
  }
  for (const z of ZONES) if (!out[z.id] && !reachable.has(z.id)) out[z.id] = 'materiel';
  ctx.memo.set(key, out);
  return out;
}

export function checkZones(sessions: readonly { exercises: readonly GenExercise[] }[], ctx: Ctx, pool: readonly Fiche[]): ZoneCheck {
  const points = weekPoints(sessions, ctx);
  const excluded = excludedZones(ctx, pool);
  const status = Object.fromEntries(ZONES.map((z) => [z.id, zoneStatus(points[z.id], z.id, ctx.goalKey)])) as Record<ZoneId, ZoneStatus>;
  const watched = ZONES.filter((z) => !excluded[z.id]).map((z) => z.id);
  const grey = watched.filter((z) => status[z] === 'gris');
  const slotless = slotlessFor(ctx, pool);
  return {
    points, status, excluded, grey, orange: watched.filter((z) => status[z] === 'orange'),
    greyFixable: grey.filter((z) => !slotless.has(z)), greySlotless: grey.filter((z) => slotless.has(z)),
  };
}

// ----- Emplacement correctif (06/11/2026) -----

/** Une fiche qui porte une ligne de zone gênée (niveau >= 1) : jamais en correctif (lecture restrictive, comme l'isolation STR-ISO-2). */
const ficheTouchesSensitive = (f: Fiche, ctx: Ctx) =>
  ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));

/**
 * Cou (`kine`, 07/11/2026) : dépistage « Non, rien » ; ni grossesse / post-partum, ni reprise ; aucune gêne déclarée au cou (tout niveau,
 * dont après un choc) ; épaule ou dos au niveau 2 et plus : rien.
 */
export const neckAllowed = (ctx: Ctx): boolean =>
  CORRECTIF_COU.enabled && ctx.neckScreenOk && !ctx.pregnant && !ctx.postPartum && !ctx.repriseActive &&
  !ctx.zones.some((z) => !z.isG && (z.key === 'cou' || (z.level >= 2 && CORRECTIF_COU.blockZonesFromLevel2.includes(z.key))));

const PUSH_PULL_SCHEMAS: readonly string[] = ['poussee_h', 'poussee_v', 'tirage_h', 'tirage_v'];
const isExternalLoadTag = (t: string) => HEAVY_TAGS_B1.includes(t) || t === 'halteres' || t === 'anneaux' || t.startsWith('sangle');

/**
 * CAL-12 (kiné 12/11/2026, NON SOURCÉ, prudent : un doute = lourd) : exercice « lourd » d'épaules / trapèzes pour le cou. Lourd si :
 * 1. coefficient >= 0,5 sur trapezes_* / epaules_* / cou et (a) tag de charge externe (liste B1, haltères, anneaux, sangle), (b) élastique,
 *    (c) schéma de poussée ou de tirage (poids du corps, barre de traction, tout autre appui), (d) schéma porté ou gainage (appui des épaules) ;
 * 2. squat avec barre ou rack, sans condition de coefficient.
 * Non lourd : mobilité, cardio, et tout exercice sous 0,5 sur toutes ces zones. Fiche ou tags illisibles : lourd.
 */
export function isHeavyShoulderTrapExercise(x: Pick<GenExercise, 'ficheId' | 'tags' | 'schema'>, ctx: Ctx): boolean {
  const f = zf(ctx, x.ficheId);
  if (!f || !Array.isArray(x.tags)) return true;
  const type = (f as { type?: string }).type ?? '';
  if (type.startsWith('mobilite') || type === 'cardio') return false;
  if (x.schema === 'squat' && x.tags.some((t) => t === 'barre' || t === 'rack')) return true;
  const coefs = zoneCoefs(f);
  if (!coefs.size) return true;
  if (![...coefs].some(([z, c]) => c >= MIN_COEF && (z.startsWith('trapezes') || z.startsWith('epaules') || z === 'cou'))) return false;
  return x.tags.some(isExternalLoadTag) || x.tags.includes('elastique') || PUSH_PULL_SCHEMAS.includes(x.schema) || x.schema === 'porte' || x.schema === 'gainage';
}

/** Cou (CAL-12) : pas de cou dans une séance dont l'exercice principal ou son alternative est lourd (hors emplacement correctif). */
export const hasHeavyShoulderTrap = (s: Pick<Sess, 'exercises'>, ctx: Ctx): boolean =>
  s.exercises.some((e) => [e, ...(e.alt ? [e.alt] : [])].some((x) => x.slot !== 'correctif' && isHeavyShoulderTrapExercise(x, ctx)));

/** Fiches correctif admissibles d'une zone pour le profil (liste fermée CORRECTIF, matériel, niveau, cases de sécurité, grossesse). */
export function correctifCandidates(z: ZoneId, ctx: Ctx, pool: readonly Fiche[]): Candidate[] {
  const key = `correctif:${z}`;
  const hit = ctx.memo.get(key) as Candidate[] | undefined;
  if (hit) return hit;
  const out: Candidate[] = [];
  if (z === 'cou' && !neckAllowed(ctx)) {
    ctx.memo.set(key, out);
    return out;
  }
  for (const id of CORRECTIF.ids[z] ?? []) {
    const f = pool.find((x) => x.id === id);
    if (!f || ficheTouchesSensitive(f, ctx) || (zoneCoefs(f as ZoneFiche).get(z) ?? 0) < MIN_COEF) continue;
    if (ctx.level === 'debutant' && levelIdx(f.niveauMin) > 0) continue;
    const cand = resolveFiche(f, ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces && (z !== 'cou' || c.variant.id === CORRECTIF_COU.variantId));
    if (cand) out.push(cand);
  }
  ctx.memo.set(key, out);
  return out;
}

/**
 * Petites zones sans emplacement ni fiche correctif admissible capable, seule (2 séries), de sortir la zone du gris pour ce profil :
 * ni citées dans les messages (rapport seulement). Une fiche à coefficient 0,5 peut quand même être ajoutée si la zone a déjà des points.
 */
export function slotlessFor(ctx: Ctx, pool: readonly Fiche[]): ReadonlySet<ZoneId> {
  const key = 'zones:slotless';
  const hit = ctx.memo.get(key) as Set<ZoneId> | undefined;
  if (hit) return hit;
  const enough = (z: ZoneId) => correctifCandidates(z, ctx, pool).some((c) => {
    const sets = Math.min(correctifExercise(c, ctx).sets, CORRECTIF.maxSets);
    return zoneStatus(sets * (zoneCoefs(c.fiche as ZoneFiche).get(z) ?? 0), z, ctx.goalKey) !== 'gris';
  });
  const out = new Set(SLOTLESS_ZONES.filter((z) => !enough(z)));
  ctx.memo.set(key, out);
  return out;
}

/** Exercice correctif : dose de la fiche (ligne « isolation »), 2 séries au plus, aucun échauffement, charge la plus légère jamais augmentée. */
export function correctifExercise(c: Candidate, ctx: Ctx): GenExercise {
  const ex = buildExercise({ ...c, capped: true }, 'correctif', 'a', ctx);
  ex.sets = Math.min(ex.sets, CORRECTIF.maxSets);
  if (c.fiche.id === CORRECTIF_COU.ficheId) {
    // Cou : 1 série de 2 maintiens de 3 s, effort léger, jamais augmenté ; message d'arrêt affiché avec l'exercice.
    ex.sets = CORRECTIF_COU.sets;
    ex.unit = 'sec';
    ex.holdSec = CORRECTIF_COU.holdSec;
    ex.repsMin = CORRECTIF_COU.holds;
    ex.repsMax = CORRECTIF_COU.holds;
    ex.cappedLabel = CORRECTIF_COU.stopMessage;
  }
  ex.role = 'autre';
  ex.warmupSets = [];
  ex.capped = true;
  ex.cappedLabel = ex.cappedLabel ?? CORRECTIF.label;
  return ex;
}

/**
 * Emplacement correctif : après les exercices principaux (et fillGreyZones), au plus 1 exercice léger par séance (débutant) ou 2, une
 * zone par séance d'abord (séances sans correctif, puis celle qui a le plus de temps libre) ; ajouté seulement s'il sort la zone du gris,
 * tient dans la durée choisie, V-PLAF, le plafond hebdomadaire et les plafonds par zone ; jamais une fiche déjà dans la semaine.
 * Aucun correctif en semaine allégée ni en reprise (protections de canAddSets). Modifie `sessions` en place.
 */
export function addCorrectifs(
  sessions: Sess[], d: FillDeps,
  opts: { orange?: boolean; canUse?: (s: Sess) => boolean; only?: readonly ZoneId[] } = {},
): void {
  const { ctx, pool } = d;
  if (ctx.repriseActive || ctx.lightWeek) return;
  const maxPer = ctx.level === 'debutant' ? CORRECTIF.maxPerSessionDebutant : CORRECTIF.maxPerSession;
  const count = (s: Sess) => s.exercises.filter((e) => e.slot === 'correctif').length;
  const free = (s: Sess) => d.budget(s) - estimerDuree(s);
  // Lot cohérence 3 b : en remplissage du temps, aussi les petites zones orange (les moins travaillées d'abord).
  const zc0 = checkZones(sessions, ctx, pool);
  const ratio = (z: ZoneId) => zc0.points[z] / Math.max(1e-9, thresholdsOf(z, ctx.goalKey).rouge);
  const byRatio = opts.orange ? [...SLOTLESS_ZONES].sort((a, b) => ratio(a) - ratio(b)) : [...SLOTLESS_ZONES];
  // Cou : seule la séance réservée (plafonds relevés, ctx.neckSafeLabels) peut le recevoir ; il passe donc avant les autres petites zones, qui prendraient sa place.
  const ordered = ctx.neckSafeLabels ? [...byRatio.filter((z) => z === 'cou'), ...byRatio.filter((z) => z !== 'cou')] : byRatio;
  const zones = opts.only ? ordered.filter((z) => opts.only!.includes(z)) : ordered;
  for (const z of zones) {
    const st = checkZones(sessions, ctx, pool).status[z];
    if ((st !== 'gris' && !(opts.orange && st === 'orange')) || excludedZones(ctx, pool)[z]) continue;
    const weekIds = new Set(sessions.flatMap((s) => s.exercises.map((e) => e.ficheId)));
    const order = sessions.filter((s) => count(s) < maxPer && (opts.canUse?.(s) ?? true)).sort((a, b) => count(a) - count(b) || free(b) - free(a));
    let done = false;
    for (const c of correctifCandidates(z, ctx, pool)) {
      if (done || weekIds.has(c.fiche.id)) continue;
      const ex = correctifExercise(c, ctx);
      for (const s of order) {
        if (z === 'cou' && hasHeavyShoulderTrap(s, ctx)) continue;
        if (isTwinOfUsed(c.fiche, new Set(s.exercises.map((e) => e.ficheId)), ctx)) continue; // lot cohérence 5 a
        const trial = { ...s, exercises: [...s.exercises, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        if (z !== 'cou' && checkZones(all, ctx, pool).status[z] === 'gris') break; // la fiche ne suffit pas à sortir la zone du gris : fiche suivante
        s.exercises = trial.exercises;
        done = true;
        break;
      }
    }
  }
}

/** Plafonds par zone (§3) : hebdomadaire par groupe (maximum des sous-zones) ; par séance pour les petites zones (6). Lecture relative :
 * un changement ne doit jamais faire passer un groupe au-dessus de son plafond, ni monter un groupe déjà au-dessus. */
export function zoneCapsOk(before: readonly Pick<Sess, 'exercises'>[], after: readonly Pick<Sess, 'exercises'>[], ctx: Ctx): boolean {
  const po = raisedCaps(ctx); // plafonds relevés : points de plafond sur les muscles principaux seulement (zones protégées : comptage complet)
  const gb = capGroupPoints(weekPoints(before, ctx, po));
  const ga = capGroupPoints(weekPoints(after, ctx, po));
  for (const [g, a] of ga) {
    const cap = zoneCaps(a.zone, raisedCaps(ctx) && { factor: RAISED_CAPS.zoneFactor }).week;
    if (a.points > cap && a.points > (gb.get(g)?.points ?? 0)) return false;
  }
  for (let i = 0; i < after.length; i++) {
    if (after[i] === before[i]) continue;
    const pb = weekPoints([before[i]], ctx);
    const pa = weekPoints([after[i]], ctx);
    for (const z of ZONES) {
      if (z.seuil !== 'P') continue;
      const cap = zoneCaps(z.id).session;
      if (pa[z.id] > cap && pa[z.id] > pb[z.id]) return false;
    }
  }
  return true;
}

export interface FillDeps {
  ctx: Ctx;
  pool: readonly Fiche[];
  /** Budget de durée de la séance (secondes). */
  budget: (s: Sess) => number;
  /** V-PLAF par séance (splitCapsOk / sessionCapsOk avec le plafond voulu) et plafond hebdomadaire (weekCapsOk). */
  sessionOk: (exercises: GenExercise[], mode: 'slot' | 'auto') => boolean;
  weekOk: (sessions: readonly Sess[]) => boolean;
  /** Remplaçants classés pour l'emplacement de `e` (même règles que le placement), fiches de la séance exclues. */
  alternatives: (s: Sess, e: GenExercise, all: readonly Sess[]) => Iterable<GenExercise>;
}

/** Zones grises corrigées par changement d'exercice ou séries ajoutées : jamais les petites zones (SLOTLESS_ZONES, emplacement correctif). */
const greyMain = (ss: readonly Sess[], d: FillDeps) => checkZones(ss, d.ctx, d.pool).grey.filter((z) => !SLOTLESS_ZONES.includes(z));
const greyCount = (ss: readonly Sess[], d: FillDeps) => greyMain(ss, d).length;

/** Une fiche qui porte une ligne de zone gênée (niveau >= 1) ne reçoit jamais de série en plus (lecture restrictive, comme G1). */
function touchesSensitive(e: GenExercise, ctx: Ctx): boolean {
  const f = ctx.fichesById.get(e.ficheId);
  return !!f && ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));
}

/** Protections : aucune série ajoutée au débutant (2 séries, STR-REP), en grossesse / post-partum, reprise, semaine allégée, ou zone épaule / dos au niveau >= 2 (STR-REP-14 a). */
const canAddSets = (ctx: Ctx) =>
  ctx.level !== 'debutant' && !ctx.pregnant && !ctx.repriseActive && !ctx.lightWeek && !ctx.zones.some((z) => !z.isG && z.level >= 2 && (z.key === 'epaule' || z.key === 'dos'));

function trySwap(sessions: Sess[], z: ZoneId, d: FillDeps): boolean {
  const before = greyCount(sessions, d);
  for (const s of sessions) {
    for (const e of s.exercises) {
      if (MAIN_EXERCISE_SLOTS.includes(e.slot) || e.supersetGroup) continue;
      const cur = zoneCoefs(zf(d.ctx, e.ficheId) ?? (e as unknown as ZoneFiche)).get(z) ?? 0;
      for (const alt of d.alternatives(s, e, sessions)) {
        if (tierRank(alt.tier) > tierRank(e.tier)) continue;
        const f = zf(d.ctx, alt.ficheId);
        if (!f || (zoneCoefs(f).get(z) ?? 0) < Math.max(MIN_COEF, cur + 1e-9)) continue;
        const exs = s.exercises.map((x) => (x === e ? alt : x));
        const trial = { ...s, exercises: exs };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > Math.max(d.budget(s), estimerDuree(s))) continue;
        if (!d.sessionOk(exs, 'slot') || !d.weekOk(all) || !zoneCapsOk(sessions, all, d.ctx)) continue;
        if (greyCount(all, d) >= before) continue;
        s.exercises = exs;
        return true;
      }
    }
  }
  return false;
}

/** Une série de plus sur le meilleur exercice possible de la zone (copie de travail), ou false. */
function addOneSet(work: Sess[], z: ZoneId, d: FillDeps, canUse: (s: Sess) => boolean = () => true): boolean {
  const cands: { i: number; e: GenExercise; c: number }[] = [];
  work.forEach((s, i) => canUse(s) && s.exercises.forEach((e) => {
    const f = zf(d.ctx, e.ficheId);
    const c = f ? zoneCoefs(f).get(z) ?? 0 : 0;
    if (c >= MIN_COEF) cands.push({ i, e, c });
  }));
  // Plus fort coefficient d'abord, puis l'exercice qui a le moins de séries (répartition sur la semaine).
  cands.sort((a, b) => b.c - a.c || a.e.sets - b.e.sets);
  for (const { i, e } of cands) {
    const s = work[i];
    // Dose fixe (lancers, gainage dynamique : N4 / Q23) et isolation (2 séries, STR-ISO) : jamais de série en plus.
    if (e.capped || FIXED_DOSE[e.ficheId] || isIsoSlot(e.slot) || touchesSensitive(e, d.ctx)) continue;
    if (e.sets >= Math.min(VOLUME.maxSetsPerExercise, doseLimitOf(e.ficheId, e.variantId).maxSets ?? Infinity, e.setsCap ?? Infinity)) continue;
    const exs = s.exercises.map((x) => (x === e ? { ...x, sets: x.sets + 1 } : x));
    const trial = { ...s, exercises: exs };
    const all = work.map((x) => (x === s ? trial : x));
    if (estimerDuree(trial) > d.budget(s)) continue;
    if (!d.sessionOk(exs, 'auto') || !d.weekOk(all) || !zoneCapsOk(work, all, d.ctx)) continue;
    work[i] = trial;
    return true;
  }
  return false;
}

/**
 * Plafonds relevés (13/11/2026) : temps restant d'une séance sous sa cible, rempli par UNE série de plus sur un exercice déjà placé (jamais un
 * exercice protégé en premier : épaules, trapèzes, triceps, biceps, avant-bras, érecteurs ; puis le moins chargé en séries), sous les mêmes
 * garde-fous que addOneSet (dose, V-PLAF « auto », plafond hebdomadaire 24 / 20 selon le muscle, plafonds de zone). Profils relevés seulement.
 */
function addTimeSet(work: Sess[], d: FillDeps, under: (s: Sess) => boolean): boolean {
  const cands: { i: number; e: GenExercise }[] = [];
  work.forEach((s, i) => under(s) && s.exercises.forEach((e) => {
    if (e.role === 'cardio' || e.slot === 'correctif' || e.slot === 'tronc' || e.slot === 'fonctionnel') return;
    cands.push({ i, e });
  }));
  const prot = (e: GenExercise) => (e.musclesPrincipaux.some(weekCountsSecondary) ? 1 : 0);
  cands.sort((a, b) => prot(a.e) - prot(b.e) || a.e.sets - b.e.sets);
  for (const { i, e } of cands) {
    const s = work[i];
    if (e.capped || FIXED_DOSE[e.ficheId] || isIsoSlot(e.slot) || touchesSensitive(e, d.ctx) || !e.rirAsked || e.unit !== 'reps') continue;
    if (e.sets >= Math.min(VOLUME.maxSetsPerExercise, doseLimitOf(e.ficheId, e.variantId, e.tags).maxSets ?? Infinity, e.setsCap ?? Infinity)) continue;
    const exs = s.exercises.map((x) => (x === e ? { ...x, sets: x.sets + 1 } : x));
    const trial = { ...s, exercises: exs };
    const all = work.map((x) => (x === s ? trial : x));
    if (estimerDuree(trial) > d.budget(s)) continue;
    if (!d.sessionOk(exs, 'auto') || !d.weekOk(all) || !zoneCapsOk(work, all, d.ctx)) continue;
    work[i] = trial;
    return true;
  }
  return false;
}

/** Séries ajoutées jusqu'à sortir la zone du gris ; rien n'est gardé si la zone reste grise ou si le nombre de zones grises ne baisse pas. */
function tryAddSets(sessions: Sess[], z: ZoneId, d: FillDeps): boolean {
  if (!canAddSets(d.ctx)) return false;
  const before = greyCount(sessions, d);
  const work = sessions.map((s) => ({ ...s }));
  while (checkZones(work, d.ctx, d.pool).status[z] === 'gris') if (!addOneSet(work, z, d)) return false;
  if (greyCount(work, d) >= before) return false;
  sessions.forEach((s, i) => { s.exercises = work[i].exercises; });
  return true;
}

/** Corrige les zones grises de la semaine (changement d'exercice, puis séries ajoutées). Modifie `sessions` en place. */
export function fillGreyZones(sessions: Sess[], d: FillDeps): void {
  for (let guard = 0; guard < 60; guard++) {
    const grey = greyMain(sessions, d);
    if (!grey.length) return;
    let progressed = false;
    for (const z of grey) if (trySwap(sessions, z, d)) { progressed = true; break; }
    if (!progressed) for (const z of grey) if (tryAddSets(sessions, z, d)) { progressed = true; break; }
    if (!progressed) return;
  }
}

/**
 * Lot cohérence, point 3 (décision de l'utilisateur du 06/11/2026) : temps restant d'une séance sous sa cible (« illimité » : 60 min ;
 * durée choisie : cette durée, budget = jamais au-delà), rempli dans cet ordre : a) zones de la semaine encore orange, jusqu'au rouge,
 * par séries ajoutées (mêmes garde-fous que fillGreyZones : V-PLAF « auto », plafond hebdomadaire, plafonds par zone, dose de la fiche,
 * protections canAddSets) ; b) petites zones grises ou orange par l'emplacement correctif (fiches existantes de CORRECTIF seulement) ;
 * c) le cardio reste en dernier (bloc décidé après, dans index.ts). Aucune règle de sécurité ni aucun plafond n'est relâché ; grossesse,
 * reprise et semaine allégée : rien n'est ajouté (lecture prudente). Modifie `sessions` en place.
 */
export function fillToTarget(
  sessions: Sess[],
  d: FillDeps & { target: (s: Sess) => number; functional?: (s: Sess, all: readonly Sess[]) => Iterable<GenExercise> },
): void {
  const { ctx, pool } = d;
  if (ctx.pregnant || ctx.repriseActive || ctx.lightWeek) return;
  const under = (s: Sess) => estimerDuree(s) < d.target(s);
  if (canAddSets(ctx)) {
    // Une zone sans série possible le reste (les ajouts ne font que monter le volume et la durée) : elle n'est plus réessayée.
    const blocked = new Set<ZoneId>();
    for (let guard = 0; guard < 300 && sessions.some(under); guard++) {
      const zc = checkZones(sessions, ctx, pool);
      const ratio = (z: ZoneId) => zc.points[z] / Math.max(1e-9, thresholdsOf(z, ctx.goalKey).rouge);
      // Zones principales seulement (les petites zones passent par l'emplacement correctif, comme fillGreyZones).
      const orange = zc.orange.filter((z) => !SLOTLESS_ZONES.includes(z) && !blocked.has(z)).sort((a, b) => ratio(a) - ratio(b));
      let progressed = false;
      for (const z of orange) {
        const work = sessions.map((s) => ({ ...s }));
        if (!addOneSet(work, z, d, under)) {
          blocked.add(z);
          continue;
        }
        sessions.forEach((s, i) => { s.exercises = work[i].exercises; });
        progressed = true;
        break;
      }
      if (!progressed) break;
    }
  }
  // a2) Plafonds relevés : le temps restant est rempli par des séries de plus (jamais sur un exercice protégé tant qu'un autre peut en recevoir).
  if (canAddSets(ctx) && raisedCaps(ctx)) {
    for (let guard = 0; guard < 200 && sessions.some(under); guard++) {
      const work = sessions.map((x) => ({ ...x }));
      if (!addTimeSet(work, d, under)) break;
      sessions.forEach((x, i) => { x.exercises = work[i].exercises; });
    }
  }
  // b) Exercice fonctionnel (emplacement `fonctionnel` du type de séance, mêmes règles que le placement), puis correctifs des petites zones.
  if (d.functional) {
    for (const s of sessions) {
      if (!under(s) || s.exercises.some((e) => e.slot === 'fonctionnel')) continue;
      for (const ex of d.functional(s, sessions)) {
        const trial = { ...s, exercises: [...s.exercises, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        s.exercises = trial.exercises;
        break;
      }
    }
  }
  // Plusieurs passes : une zone encore orange peut recevoir une 2e fiche correctif (jamais une fiche déjà dans la semaine ; plafonds inchangés).
  for (let pass = 0; pass < sessions.length; pass++) {
    const before = sessions.map((s) => s.exercises.length).join();
    addCorrectifs(sessions, d, { orange: true, canUse: under });
    if (sessions.map((s) => s.exercises.length).join() === before) break;
  }
}

export const zoneGroupOf = capGroupOf;
