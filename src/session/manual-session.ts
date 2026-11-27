// Idée 2 (25/11/2026) « Créer une séance » en mode « Je choisis mes exercices » : la personne choisit ses exercices, leur ordre et ses supersets.
// Décision kiné du 27/11/2026 (docs/decisions-prises.md) : le choix manuel ne contourne AUCUNE règle du générateur.
// 1. Liste = seulement ce qui passe ficheAdmissible + resolveFiche + allowedVariants (matériel, niveau, règle 23, blessures, cou, grossesse,
//    sauts jamais) ; un exercice retiré n'apparaît pas, un exercice remplacé apparaît sous la forme du remplaçant ; pas de « forcer ».
// 2. Dose = celle du générateur (buildExercise, emplacement accessoire, jamais pilier lourd) + la dose de « Créer » (§3) ; la personne peut
//    la baisser (moins de séries, plus de repos), jamais la monter.
// 3. Superset : seulement les paires que canPair (SUP-0 à SUP-10) accepte ; jamais pour un débutant ni en grossesse.
// 4. Plafonds par muscle (séance 11 / 12, semaine 20 / 24) et total de la séance : l'ajout est refusé avec un message.
// 5. Verrous du mode automatique (malaise au sport, jambes < 24 h, grossesse, adoucissement < 48 h) : mêmes refus, lus par une sonde createSession.
// Fonctions pures : aucun accès à la base, aucune IA, aucun réseau. Le générateur (src/generator/) n'est pas modifié, seulement appelé.
import type { InjuryZone } from '../data/model';
import { createSession, type CreateContext, type CreatedExercise, type CreatedSession, type CreateMessage } from '../generator';
import { CREER_SEANCE, JUMPS, VOLUME, itemNom, type CreateEntry, type CreateIntensity, type CreateZone } from '../generator/config';
import { SPORT_GATE_TEXT } from '../sport/sport-config';
import { buildCtx, carriesLoad, isUnilateral, levelIdx, type Ctx } from '../generator/context';
import { buildExercise } from '../generator/dose';
import { canPair, estimerDuree, pairRestSec, type DurSession } from '../generator/duration';
import { makePlaf, sessionCapsOk, sessionVol, weekCapFor, weekMusclesOf, weekVol } from '../generator/plaf';
import { allowedVariants, caseFor, ficheAdmissible, lowestVariant, resolveFiche, USABLE_STATUTS, warmupVariant, type Candidate } from '../generator/safety';
import type { Fiche, FicheVariant, GeneratorInput, GenExercise, SlotKey, WarmupItem } from '../generator/types';
import { generalWarmup, mobilityWarmup } from '../generator/warmup';
import { sportGate, sportLoad } from '../sport/sport-load';

const C = CREER_SEANCE;
const LEG_SCHEMAS = ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'];
const CORE_SCHEMAS = ['gainage', 'anti_rotation', 'rotation'];
/** Schémas jamais proposés au choix manuel : mobilité (échauffement), cardio, sauts (jamais placés, D3). */
const EXCLUDED_SCHEMAS = ['mobilite', 'cardio', 'saut'];
/** Refus de la sonde qui ne retirent que les jambes ; « sport-malaise » retire tout. */
const LEG_LOCKS = ['grossesse', 'jambes-trop-proches', 'sport-jambes-trop-proches'];
/** Avertissements de la sonde affichés quand la séance contient un exercice de jambes. */
const LEG_WARNING_IDS = ['adoucie', 'moins-de-72h', 'jambes-demain'];
/**
 * Relecteur 27/11/2026 (bloquant 2) : les fiches des listes fermées de « Créer » portent des règles que la fiche ne code pas (montée rapide :
 * 2 séries, 6 rép., jamais en soutenue, zones bloquantes ; nordique : retiré en séance adoucie). Le choix manuel les applique toutes,
 * fusionnées par fiche (la plus prudente de chaque règle).
 */
const ENTRY_RULES: ReadonlyMap<string, CreateEntry> = (() => {
  const out = new Map<string, CreateEntry>();
  const walk = (x: unknown): void => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (!x || typeof x !== 'object') return;
    const e = x as Partial<CreateEntry>;
    if (typeof e.id === 'string' && Array.isArray(e.variants) && typeof e.minLevel === 'string') {
      const cur = e as CreateEntry;
      const prev = out.get(cur.id);
      if (!prev) return void out.set(cur.id, { ...cur });
      const maxSets = Math.min(prev.maxSets ?? Infinity, cur.maxSets ?? Infinity);
      out.set(cur.id, {
        id: cur.id,
        variants: [...new Set([...prev.variants, ...cur.variants])],
        minLevel: levelIdx(cur.minLevel) > levelIdx(prev.minLevel) ? cur.minLevel : prev.minLevel,
        needsStableChair: prev.needsStableChair || cur.needsStableChair,
        maxSets: Number.isFinite(maxSets) ? maxSets : undefined,
        reps: prev.reps ?? cur.reps,
        notIn: [...new Set([...(prev.notIn ?? []), ...(cur.notIn ?? [])])],
        blockZones: [...new Set([...(prev.blockZones ?? []), ...(cur.blockZones ?? [])])],
        slow3s: prev.slow3s || cur.slow3s,
        tempo: prev.tempo ?? cur.tempo,
      });
      return;
    }
    Object.values(x).forEach(walk);
  };
  walk(CREER_SEANCE.legs);
  return out;
})();

/** Règle de liste fermée respectée ? (mêmes contrôles que candidateFor de create-session.ts). */
function entryOk(r: CreateEntry, v: FicheVariant, ctx: Ctx, intensity: CreateIntensity, chairStable: boolean, softened: boolean): boolean {
  if (levelIdx(r.minLevel) > ctx.levelI) return false;
  if (r.needsStableChair && !chairStable) return false;
  if (r.notIn?.includes(intensity)) return false;
  if (r.blockZones?.length) {
    if (ctx.zones.some((z) => !z.isG && z.level >= 1 && r.blockZones!.includes(z.key))) return false;
    if ([...ctx.recentPainZones].some((z) => r.blockZones!.includes(z))) return false;
  }
  if (softened && r.slow3s) return false;
  return r.variants.includes(v.id);
}

export const MANUAL_TEXT = {
  allBlocked: 'Pas de séance aujourd’hui.',
  sessionCap: (m: string) => `Assez de séries pour ce muscle aujourd’hui (${m}). Choisis un exercice qui travaille autre chose.`,
  weekCap: (m: string) => `Ce muscle a déjà eu assez de séries cette semaine (${m}). Choisis un exercice qui travaille autre chose.`,
  totalCap: 'La séance a déjà assez de séries. Retire un exercice ou baisse des séries avant d’en ajouter.',
  tooMany: 'La séance a déjà assez d’exercices.',
  hinges: 'Pas plus de deux exercices de charnière (soulevé de terre, pont…) dans une séance.',
  duplicate: 'Cet exercice est déjà dans ta séance.',
  pairNo: 'Ces deux exercices ne peuvent pas être enchaînés en superset (sécurité ou muscles trop proches).',
  pairBeginner: 'Pas de superset au niveau débutant : le repos complet entre les séries aide à apprendre la technique.',
  pairPregnant: 'Pas de superset pendant la grossesse ou le post-partum.',
  unavailable: 'Un exercice choisi ne convient plus à ton profil ce jour-là. Change tes choix.',
  empty: 'Choisis au moins un exercice.',
} as const;

export interface ManualOption {
  ficheId: string;
  variantId: string;
  nom: string;
  schema: string;
  /** Groupe affiché (filtre de la liste). */
  group: 'jambes' | 'poussee' | 'tirage' | 'tronc';
  /** Exercice adapté (blessure, grossesse) ou remplaçant d'un exercice retiré. */
  adapted: boolean;
  replaces: string | null;
  notes: string[];
  candidate: Candidate;
}

export interface ManualEnv {
  ctx: Ctx;
  options: ManualOption[];
  /** Tout est refusé ce jour-là (malaise au sport) : message, sinon null. */
  allBlocked: string | null;
  /** Exercices de jambes refusés (grossesse, jambes trop proches) : message, sinon null. */
  legsBlocked: string | null;
  softened: boolean;
  intensity: CreateIntensity;
  chairStable: boolean;
  legWarnings: CreateMessage[];
  warnings: CreateMessage[];
  weekSets: Record<string, number>;
  todayIso: string;
}

export interface ManualRequest {
  intensity: CreateIntensity;
  chairStable: boolean;
  todayIso: string;
}

const isLeg = (schema: string) => LEG_SCHEMAS.includes(schema);
const groupOf = (schema: string): ManualOption['group'] =>
  isLeg(schema) ? 'jambes' : CORE_SCHEMAS.includes(schema) ? 'tronc' : schema.startsWith('tirage') || schema === 'porte' ? 'tirage' : 'poussee';
/** Emplacement de dose : toujours accessoire (jamais pilier lourd, avis kiné point 2) ; ceux des paires P1 / P3 pour canPair. */
const slotOf = (schema: string): SlotKey =>
  isLeg(schema) ? 'jambes_2' : CORE_SCHEMAS.includes(schema) ? 'tronc' : schema.startsWith('tirage') || schema === 'porte' ? 'tirage_2' : 'poussee_2';

/** Même entrée que createSession : une gêne notée au sport devient une blessure temporaire (niveau 1, 3 si renvoi vers un professionnel). */
function withSportInjuries(input: GeneratorInput, context: CreateContext, todayIso: string): GeneratorInput {
  if (!context.sport) return input;
  const load = sportLoad(context.sport.sessions, context.sport.plan, new Date(Date.parse(todayIso)));
  const lv: Partial<Record<InjuryZone, number>> = {};
  for (const z of load.tempPainZones) lv[z] = 1;
  for (const z of load.consult?.zones ?? []) lv[z] = 3;
  const extra = Object.entries(lv).map(([zone, level]) => ({ zone: zone as InjuryZone, level: level as 1 | 3, active: true, deletedAt: null, updatedAt: todayIso }));
  return extra.length ? { ...input, injuries: [...(input.injuries ?? []), ...extra] } : input;
}

/** Variante permise par les règles de « Créer » (§3) : chaise calée, pas d'unilatéral de jambes pour un débutant ni en séance adoucie. */
function variantOk(f: Fiche, v: FicheVariant, ctx: Ctx, chairStable: boolean, softened: boolean): boolean {
  if (!chairStable && v.tags.includes('chaise')) return false;
  for (const e of ctx.zones) {
    const c = caseFor(f, e);
    if (c.action === 'retirer') return false;
    if (c.action === 'adapter' && c.variante && c.variante !== v.id && f.variantes.some((x) => x.id === c.variante)) return false;
  }
  if (isLeg(f.schema) && isUnilateral(v) && (ctx.level === 'debutant' || softened)) return false;
  return true;
}

/** Candidat d'une fiche pour le choix manuel (ou null : la fiche n'est pas proposée). */
function optionOf(f: Fiche, ctx: Ctx, chairStable: boolean, softened: boolean, intensity: CreateIntensity): ManualOption | null {
  if (!USABLE_STATUTS.includes(f.statut) || EXCLUDED_SCHEMAS.includes(f.schema)) return null;
  if (!ficheAdmissible(f, ctx)) return null;
  const cand = resolveFiche(f, ctx).candidates[0];
  if (!cand || EXCLUDED_SCHEMAS.includes(cand.fiche.schema)) return null;
  const rule = ENTRY_RULES.get(cand.fiche.id);
  const fits = (v: FicheVariant) => variantOk(cand.fiche, v, ctx, chairStable, softened) && (!rule || entryOk(rule, v, ctx, intensity, chairStable, softened));
  let variant = cand.variant;
  if (!fits(variant)) {
    // Relecteur 27/11/2026 (bloquant 1, point 4) : autre variante seulement si le candidat n'a AUCUNE adaptation, plafond ni remplacement
    // (une case « sans charge » ou « variante » n'est jamais perdue), et la plus facile (lowestVariant) : aucun échelon sauté.
    if (cand.adaptations.length || cand.capped || cand.replaces || cand.adapted) return null;
    const ok = allowedVariants(cand.fiche, ctx).filter(fits);
    if (!ok.length) return null;
    variant = lowestVariant(cand.fiche, ok, ctx);
  }
  return {
    ficheId: cand.fiche.id, variantId: variant.id, nom: itemNom(cand.fiche.nom, variant), schema: cand.fiche.schema, group: groupOf(cand.fiche.schema),
    adapted: cand.adapted, replaces: cand.replaces, notes: cand.notes, candidate: { ...cand, variant },
  };
}

/** Contexte du choix manuel pour une date : options, verrous et avertissements (mêmes règles que le mode automatique). */
export function manualEnv(input0: GeneratorInput, req: ManualRequest, context: CreateContext = {}): ManualEnv {
  const input = withSportInjuries(input0, context, req.todayIso);
  const ctx = buildCtx({ ...input, options: { ...(input.options ?? {}), nowIso: req.todayIso } });
  // Sonde : le composeur automatique dit si les jambes sont refusées ou adoucies ce jour-là (sans sauts : jamais placés ici).
  const probe = createSession(input0, { zone: 'jambes', sport: null, jumps: false, chairStable: req.chairStable, durationMin: 45, intensity: req.intensity, todayIso: req.todayIso }, context);
  const probeWarnings = probe.ok ? probe.session.warnings : probe.warnings;
  const allBlocked = !probe.ok && probe.code === 'sport-malaise' ? probe.message : !probe.ok && probe.code === 'date' ? probe.message : null;
  const legsBlocked = !probe.ok && LEG_LOCKS.includes(probe.code) ? probe.message : null;
  const softened = probeWarnings.some((w) => w.id === 'adoucie');
  // Relecteur point 5 : le renvoi vers un professionnel (charge du sport) est calculé directement, même quand la sonde refuse les jambes.
  const sportWarnings: CreateMessage[] = [];
  if (context.sport) {
    const load = sportLoad(context.sport.sessions, context.sport.plan, new Date(Date.parse(req.todayIso)));
    const gate = sportGate(load, ctx.level, JUMPS.startContacts[ctx.level]);
    if (gate.consult) sportWarnings.push({ id: 'sport-consulter', text: SPORT_GATE_TEXT.consult });
    if (load.events.length || gate.consult) sportWarnings.push({ id: 'sport-estimation', text: SPORT_GATE_TEXT.estimate });
  }
  const seen = new Set<string>();
  const options: ManualOption[] = [];
  if (!allBlocked) {
    for (const f of [...input.fiches].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))) {
      const o = optionOf(f, ctx, req.chairStable, softened, softened ? 'douce' : req.intensity);
      if (!o || seen.has(o.ficheId) || (legsBlocked && isLeg(o.schema))) continue;
      seen.add(o.ficheId);
      options.push(o);
    }
  }
  return {
    ctx, options, allBlocked, legsBlocked, softened, intensity: req.intensity, chairStable: req.chairStable,
    legWarnings: probeWarnings.filter((w) => LEG_WARNING_IDS.includes(w.id)),
    warnings: sportWarnings,
    weekSets: context.weekSets ?? {}, todayIso: req.todayIso,
  };
}

/** Séance adoucie (jambes < 48 h) : toute la séance en douce, comme le mode automatique (relecteur point 6). */
const intensityFor = (env: ManualEnv): { intensity: CreateIntensity; softened: boolean } =>
  env.softened ? { intensity: 'douce', softened: true } : { intensity: env.intensity, softened: false };

/** Dose proposée (maximum permis) : buildExercise du générateur puis la dose de « Créer » (§3), comme applyDose de create-session.ts. */
export function doseFor(o: ManualOption, env: ManualEnv): GenExercise {
  const ctx = env.ctx;
  const ex: GenExercise = { ...buildExercise(o.candidate, slotOf(o.schema), 'c', ctx) };
  const { intensity, softened } = intensityFor(env);
  const rule = ENTRY_RULES.get(o.ficheId);
  let target: number = softened ? C.softenedSets : intensity === 'douce' ? C.sets.douce : intensity === 'soutenue' ? C.sets.soutenue : ctx.level === 'debutant' ? C.sets.moderateBeginner : C.sets.moderee;
  if (ctx.level === 'debutant') target = Math.min(target, C.sets.moderateBeginner);
  if (rule?.maxSets !== undefined) target = Math.min(target, rule.maxSets);
  if (ex.setsCap !== undefined) target = Math.min(target, ex.setsCap);
  if (ctx.pregnant || !ex.rirAsked) target = Math.min(target, ex.sets);
  ex.sets = Math.max(1, target);
  if (ex.rirAsked) {
    let rir = ex.rirTarget + C.rirDelta[intensity];
    if (ex.capped) rir = Math.max(rir, ex.rirTarget);
    rir = Math.max(rir, C.rirFloor);
    if (ex.unilateral) rir = Math.max(rir, C.rirUnilateralOrAfterJumps);
    ex.rirTarget = rir;
  }
  if (ex.unit === 'reps' || ex.unit === 'reps_par_cote') {
    if (rule?.reps) [ex.repsMin, ex.repsMax] = rule.reps;
    ex.repsMax = Math.min(ex.repsMax, C.repsCap);
    ex.repsMin = Math.min(ex.repsMin, ex.repsMax);
  }
  ex.restSec = intensity === 'douce' || softened ? C.restSec.douce : Math.min(C.restSec.max, Math.max(C.restSec.min, ex.restSec));
  ex.supersetGroup = null;
  return ex;
}

/** Baisse seulement (avis kiné point 2) : séries entre 1 et la dose proposée, repos au moins celui de la dose (au plus +120 s). */
export function adjust(base: GenExercise, want: { sets: number; restSec: number }): GenExercise {
  const sets = Math.max(1, Math.min(base.sets, Math.round(want.sets)));
  const restSec = Math.max(base.restSec, Math.min(base.restSec + 120, Math.round(want.restSec)));
  return { ...base, sets, restSec };
}

const workSets = (exs: readonly GenExercise[]) => exs.reduce((a, e) => a + e.sets, 0);

/** Raison du refus d'une liste d'exercices (plafonds par muscle, par semaine, total, charnières, doublon), ou null si elle passe. */
export function capsProblem(exs: readonly GenExercise[], env: ManualEnv): string | null {
  const ids = exs.map((e) => e.ficheId);
  if (new Set(ids).size !== ids.length) return MANUAL_TEXT.duplicate;
  if (exs.length > VOLUME.maxExercisesPerSession) return MANUAL_TEXT.tooMany;
  if (workSets(exs) > C.totalSetsMax) return MANUAL_TEXT.totalCap;
  if (exs.filter((e) => e.schema === 'charniere').length > VOLUME.maxHingesPerSession) return MANUAL_TEXT.hinges;
  const plaf = makePlaf(env.ctx, 'auto');
  const s = { exercises: exs };
  const bad = weekMusclesOf([s]).find((m) => sessionVol(s, m) > plaf.cap(exs, m));
  if (bad) return MANUAL_TEXT.sessionCap(muscleText(bad));
  const weekBad = weekMusclesOf([s]).find((m) => (env.weekSets[m] ?? 0) + weekVol(s, m) > weekCapFor(env.ctx, m));
  if (weekBad) return MANUAL_TEXT.weekCap(muscleText(weekBad));
  if (!sessionCapsOk(s, plaf)) return MANUAL_TEXT.totalCap;
  return null;
}
const muscleText = (m: string) => m.replace(/_/g, ' ');

/** Raison du refus d'un ajout (plafonds), ou null. */
export function addProblem(current: readonly GenExercise[], next: GenExercise, env: ManualEnv): string | null {
  return capsProblem([...current, next], env);
}

/**
 * Superset de a puis b (consécutifs) : mêmes règles que le générateur (canPair, D26 SUP-0 à SUP-10). `veille` : muscles principaux
 * travaillés la veille (undefined = contrôlé au démarrage par le lecteur, null = inconnue -> aucune paire).
 */
export function pairProblem(a: GenExercise, b: GenExercise, env: ManualEnv, veille?: string[] | null): string | null {
  if (env.ctx.level === 'debutant') return MANUAL_TEXT.pairBeginner;
  if (env.ctx.pregnant || env.ctx.postPartum) return MANUAL_TEXT.pairPregnant;
  for (const [x, y] of [[a, b], [b, a]] as const) {
    for (const id of ['P1', 'P3'] as const) {
      const s: DurSession<GenExercise> = { label: 'M', days: 1, level: env.ctx.level, pregnant: env.ctx.pregnant, veille, exercises: [{ ...x, supersetGroup: null }, { ...y, supersetGroup: null }], e1Sec: 0, e2Count: 0 } as DurSession<GenExercise>;
      if (canPair(s, id)) return null;
    }
  }
  return MANUAL_TEXT.pairNo;
}

export interface ManualPick {
  ex: GenExercise;
  /** Enchaîné en superset avec l'exercice suivant. */
  pairNext: boolean;
}

const zoneOf = (exs: readonly GenExercise[]): CreateZone => {
  const legs = exs.some((e) => isLeg(e.schema));
  const upper = exs.some((e) => !isLeg(e.schema) && !CORE_SCHEMAS.includes(e.schema));
  if (legs && upper) return 'corps_entier';
  if (legs) return 'jambes';
  if (upper) return 'haut';
  return 'tronc';
};

const roundUp5 = (m: number) => Math.max(5, Math.ceil(m / 5) * 5);

/**
 * Séance composée à la main -> même objet qu'une séance créée (CreatedSession) : le lecteur, le calendrier, l'historique et le rapport de la
 * semaine la traitent comme une séance créée. Refuse si un exercice ne convient plus (date changée) ou si un plafond est dépassé.
 */
export function buildManual(picks: readonly ManualPick[], env: ManualEnv, veille?: string[] | null): { ok: true; session: CreatedSession } | { ok: false; message: string } {
  if (env.allBlocked) return { ok: false, message: env.allBlocked };
  if (!picks.length) return { ok: false, message: MANUAL_TEXT.empty };
  const allowed = new Map(env.options.map((o) => [o.ficheId, o]));
  for (const p of picks) {
    const o = allowed.get(p.ex.ficheId);
    if (!o || o.variantId !== p.ex.variantId) return { ok: false, message: MANUAL_TEXT.unavailable };
    // Jamais au-dessus de la dose proposée (relecteur point 6) : séries, répétitions ; repos jamais plus court.
    const base = doseFor(o, env);
    if (p.ex.sets > base.sets || p.ex.repsMax > base.repsMax || p.ex.restSec < base.restSec) return { ok: false, message: MANUAL_TEXT.unavailable };
  }
  const exs = picks.map((p) => p.ex);
  const cap = capsProblem(exs, env);
  if (cap) return { ok: false, message: cap };
  // Paires : contrôlées une à une ; repos de la paire = le plus long, jamais sous 60 s (SUP-6).
  const out: CreatedExercise[] = exs.map((e) => ({ ...e, supersetGroup: null, block: 'general' as const }));
  for (let i = 0; i < picks.length - 1; i++) {
    if (!picks[i].pairNext || out[i].supersetGroup) continue;
    const why = pairProblem(out[i], out[i + 1], env, veille);
    if (why) return { ok: false, message: why };
    const g = `M-${i}`;
    const rest = pairRestSec([out[i], out[i + 1]]);
    out[i] = { ...out[i], supersetGroup: g, restSec: rest };
    out[i + 1] = { ...out[i + 1], supersetGroup: g, restSec: rest };
  }
  const ctx = env.ctx;
  const zone = zoneOf(exs);
  const legs = exs.some((e) => isLeg(e.schema));
  const offChair = (it: WarmupItem | null): it is WarmupItem =>
    !!it && (env.chairStable || !ctx.fichesById.get(it.ficheId)?.variantes.find((v) => v.id === it.variantId)?.tags.includes('chaise'));
  const mobility = mobilityWarmup(ctx, exs.some((e) => e.schema === 'charniere')).filter(offChair);
  if (legs) for (const id of C.warmupLegsExtra) {
    const f = ctx.fichesById.get(id);
    const r = f ? warmupVariant(f, ctx) : null;
    const it = f && r ? { ficheId: f.id, variantId: r.variant.id, nom: itemNom(f.nom, r.variant), sec: 45, adaptations: r.adaptations } : null;
    if (offChair(it) && !mobility.some((m) => m.ficheId === it.ficheId)) mobility.push(it);
  }
  const warmupMin = JUMPS.warmupMin;
  const cooldownMin = C.cooldownMin;
  const general0 = generalWarmup(ctx);
  const general = offChair(general0) ? general0 : null;
  const generalSec = Math.max(0, warmupMin * 60 - mobility.reduce((a, m) => a + m.sec, 0));
  const stretchIds = C.stretch[zone];
  const stretchSec = Math.round((cooldownMin * 60) / Math.max(1, stretchIds.length));
  const cooldownItems = stretchIds.map((id) => {
    const f = ctx.fichesById.get(id);
    const r = f ? warmupVariant(f, ctx) : null;
    return f && r ? { ficheId: f.id, variantId: r.variant.id, nom: itemNom(f.nom, r.variant), sec: stretchSec, adaptations: r.adaptations } : null;
  }).filter(offChair);
  const strengthSec = estimerDuree({ label: 'M', days: 1, level: ctx.level, pregnant: ctx.pregnant, exercises: out, e1Sec: 0, e2Count: 0 } as DurSession);
  const sec = (warmupMin + cooldownMin) * 60 + strengthSec;
  const softened = env.softened && legs;
  const warnings: CreateMessage[] = [...env.warnings, ...(legs ? env.legWarnings : [])];
  if (!env.chairStable && legs) warnings.push({ id: 'chaise', text: C.text.unstableChair });
  // Notes de sécurité des fiches adaptées (cases du profil blessures) : visibles dans le volet des précautions.
  for (const e of exs) {
    const o = allowed.get(e.ficheId);
    if (o?.notes.length) warnings.push({ id: `note-${e.ficheId}`, text: `${o.nom} : ${o.notes.join(' ')}` });
  }
  warnings.push({ id: 'avis', text: C.text.notMedical });
  const durationMin = roundUp5(sec / 60);
  const session: CreatedSession = {
    zone, intensity: softened ? 'douce' : env.intensity, softened, durationMin, order: ['echauffement', 'force', 'retour_au_calme'],
    warmup: { general: general ? { ...general, sec: Math.min(general.sec, generalSec) || general.sec } : null, generalSec, mobility, minutes: warmupMin, bounces: 0 },
    jumps: null, exercises: out, cooldown: { items: cooldownItems, minutes: cooldownMin }, contacts: 0,
    totalSets: workSets(out), estimatedSec: sec, estimatedMin: durationMin,
    heavyLegs: legs, impact: false, prevention: [], header: C.text.header, warnings,
  };
  return { ok: true, session };
}

/** Choix -> même objet re-calculé pour une autre date (calendrier) : chaque exercice reprend sa dose de ce jour-là, baisses conservées. */
export function rebuildFor(picks: readonly ManualPick[], env: ManualEnv): ManualPick[] | null {
  const byId = new Map(env.options.map((o) => [o.ficheId, o]));
  const out: ManualPick[] = [];
  for (const p of picks) {
    const o = byId.get(p.ex.ficheId);
    if (!o || o.variantId !== p.ex.variantId) return null;
    out.push({ ex: adjust(doseFor(o, env), { sets: p.ex.sets, restSec: p.ex.restSec }), pairNext: p.pairNext });
  }
  return out;
}

