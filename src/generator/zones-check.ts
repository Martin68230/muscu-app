// Niveau 2, étape 2 (06/11/2026) : contrôle des zones musculaires de la semaine prévue (src/zones, knowledge/zones-musculaires.md).
// Objectif : AUCUNE zone grise, hors zones liées à une blessure déclarée (niveau >= 1) et zones sans fiche admissible pour le matériel,
// le niveau, la grossesse ou la douleur ; zones orange : signalées par un message simple (repère d'équilibre, jamais une obligation).
// Correction : d'abord changer d'exercice (même emplacement, même classement), puis ajouter des séries ; jamais au-delà des plafonds
// V-PLAF / hebdomadaire (plaf.ts), des plafonds par zone (§3 : 20 / 10 par semaine, 6 par séance pour une petite zone), de la durée
// choisie ni d'une protection (grossesse, reprise, semaine allégée, douleur : aucune série ajoutée sur une fiche qui touche une zone gênée).
import { CORRECTIF, doseLimitOf, FIXED_DOSE, MAIN_EXERCISE_SLOTS, VOLUME } from './config';
import { isIsoSlot } from './isolation';
import { levelIdx, type Ctx } from './context';
import { buildExercise } from './dose';
import { estimerDuree, type DurSession } from './duration';
import { resolveFiche, type Candidate } from './safety';
import { tierRank } from './slots';
import type { Fiche, GenExercise } from './types';
import { capGroupOf, capGroupPoints, pointsByZone, zoneCaps, zoneCoefs, zonesOfInjury, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneStatus } from '../zones/zones';

type Sess = DurSession<GenExercise>;
export type ZoneExclusion = 'blessure' | 'materiel';

/**
 * Décision du chef de projet (06/11/2026) : petites zones (et adducteurs) sans emplacement dans les séances ; ni changement d'exercice
 * ni série ajoutée (fillGreyZones) ; couvertes par l'emplacement correctif (addCorrectifs, CORRECTIF) quand une fiche légère compatible
 * existe pour le profil. Sans fiche compatible (slotlessFor) : ni corrigées ni citées, le rapport les liste à part.
 */
export const SLOTLESS_ZONES: readonly ZoneId[] = ['coiffe_rotateurs', 'carre_des_lombes', 'flechisseurs_hanche', 'peroniers', 'abducteurs', 'adducteurs', 'mollets_soleaire', 'tibiaux'];

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

export function weekPoints(sessions: readonly { exercises: readonly GenExercise[] }[], ctx: Ctx): Record<ZoneId, number> {
  const fiches = new Map<string, ZoneFiche>();
  const sets = sessions.flatMap((s) => s.exercises.map((e) => {
    const f = zf(ctx, e.ficheId);
    if (f) fiches.set(f.id, f);
    return { ficheId: e.ficheId, sets: e.sets };
  }));
  return pointsByZone(sets, fiches);
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

/** Fiches correctif admissibles d'une zone pour le profil (liste fermée CORRECTIF, matériel, niveau, cases de sécurité, grossesse). */
export function correctifCandidates(z: ZoneId, ctx: Ctx, pool: readonly Fiche[]): Candidate[] {
  const key = `correctif:${z}`;
  const hit = ctx.memo.get(key) as Candidate[] | undefined;
  if (hit) return hit;
  const out: Candidate[] = [];
  for (const id of CORRECTIF.ids[z] ?? []) {
    const f = pool.find((x) => x.id === id);
    if (!f || ficheTouchesSensitive(f, ctx) || (zoneCoefs(f as ZoneFiche).get(z) ?? 0) < MIN_COEF) continue;
    if (ctx.level === 'debutant' && levelIdx(f.niveauMin) > 0) continue;
    const cand = resolveFiche(f, ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces);
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
function correctifExercise(c: Candidate, ctx: Ctx): GenExercise {
  const ex = buildExercise({ ...c, capped: true }, 'correctif', 'a', ctx);
  ex.sets = Math.min(ex.sets, CORRECTIF.maxSets);
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
export function addCorrectifs(sessions: Sess[], d: FillDeps): void {
  const { ctx, pool } = d;
  if (ctx.repriseActive || ctx.lightWeek) return;
  const maxPer = ctx.level === 'debutant' ? CORRECTIF.maxPerSessionDebutant : CORRECTIF.maxPerSession;
  const count = (s: Sess) => s.exercises.filter((e) => e.slot === 'correctif').length;
  const free = (s: Sess) => d.budget(s) - estimerDuree(s);
  for (const z of SLOTLESS_ZONES) {
    if (checkZones(sessions, ctx, pool).status[z] !== 'gris' || excludedZones(ctx, pool)[z]) continue;
    const weekIds = new Set(sessions.flatMap((s) => s.exercises.map((e) => e.ficheId)));
    const order = sessions.filter((s) => count(s) < maxPer).sort((a, b) => count(a) - count(b) || free(b) - free(a));
    let done = false;
    for (const c of correctifCandidates(z, ctx, pool)) {
      if (done || weekIds.has(c.fiche.id)) continue;
      const ex = correctifExercise(c, ctx);
      for (const s of order) {
        const trial = { ...s, exercises: [...s.exercises, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        if (checkZones(all, ctx, pool).status[z] === 'gris') break; // la fiche ne suffit pas à sortir la zone du gris : fiche suivante
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
  const gb = capGroupPoints(weekPoints(before, ctx));
  const ga = capGroupPoints(weekPoints(after, ctx));
  for (const [g, a] of ga) {
    const cap = zoneCaps(a.zone).week;
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
function addOneSet(work: Sess[], z: ZoneId, d: FillDeps): boolean {
  const cands: { i: number; e: GenExercise; c: number }[] = [];
  work.forEach((s, i) => s.exercises.forEach((e) => {
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

export const zoneGroupOf = capGroupOf;
