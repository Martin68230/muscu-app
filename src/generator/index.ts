// Générateur de programmes v1 (knowledge/generateur-v1.md ; phase-2-criteres F3).
// API : generateProgram(input) -> GenerateResult. Fonction pure et déterministe : aucun accès réseau, IndexedDB, horloge
// ni hasard ; les départages suivent l'ordre des ids (V-CLASSE clé 7).
import type { Level, PlannedExercise, ProgramDay } from '../data/model';
import {
  ACCESSORY_REMOVAL_ORDER, ACHAT_CANDIDATES, BLOCK_WEEKS, CARDIO, DEFAULT_DURATION_MIN, DURATION_STEPS_MIN, FREQ_MIN_PER_WEEK, GG_LIST, MIN_DURATION_MIN,
  OBJETS_QUOTIDIEN, PREGNANCY, P_ZONE3_MAX_EMPTY_CORE, START_N_BY_DURATION, TEMPS_RIR_PLACEHOLDER, TIME, TRONC_SCHEMAS, UNLIMITED, VOLUME, WARMUP, type GG,
  CORE_FAMILY_ORDER, CORE_FLOOR, CORE_HEAVY_MAX_HOLD_SEC, CORE_OUT_OF_FLOOR_IDS, CORE_REMOVAL_SESSION_ORDER, CORE_SESSION_PRIORITY, type CoreFamily,
} from './config';
import { coreGoalOf, coreTargetSessions, isHeavyExercise, troncFicheFits } from './core';
import { blockCap, cardioItem, cardioLevel, cardioRoleOf, chooseCardio, chooseCardioDays, dedicatedMinutes, type CardioRole } from './cardio';
import { buildCtx, type Ctx } from './context';
import { chooseDays } from './days';
import { buildExercise } from './dose';
import { ajusterDuree, estimerDuree, formAllPairs, pairRestSec, units, type DurSession } from './duration';
import { cardioMsg, dedupe, GG_LABEL, GOAL_LABEL, msg } from './messages';
import { resolveFiche, USABLE_STATUTS } from './safety';
import { CORE_SLOTS, fillSession, fillSlot, isCore, SLOT_ORDER, slotDef, tierRank, type SlotFill } from './slots';
import type {
  CardioItem, Fiche, GenCardioSession, GenerateResult, GeneratorInput, GenExercise, GenMessage, GenProgram, GenSession, SlotKey, Tier,
} from './types';
import { cooldown, e3Sets, generalWarmup, mobilityWarmup } from './warmup';

export type { CardioItem, GenCardioSession, GenerateResult, GeneratorInput, GenProgram, GenSession, GenExercise, GenMessage } from './types';
export { estimerDuree, ajusterDuree } from './duration';
export { nextCalibrationStep, painProposals } from './calibration';

type Label = 'A' | 'B' | 'C';
const LABELS: Label[] = ['A', 'B', 'C'];
/** V-ORDRE §4.1 : piliers, tirage_1, charnière, accessoires, tronc, fonctionnel. */
const DISPLAY_ORDER: SlotKey[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'poussee_2', 'tirage_2', 'jambes_2', 'tronc', 'fonctionnel'];
/** Ordre de retrait pour respecter les plafonds de volume (V-PLAF) : le moins prioritaire d'abord. */
const PLAF_ORDER: SlotKey[] = ['fonctionnel', 'jambes_2', 'tirage_2', 'poussee_2', 'tronc', 'charniere', 'tirage_1', 'poussee_1', 'jambes_genou'];
const GG_SLOT: Record<GG, SlotKey> = { GG1: 'jambes_genou', GG2: 'charniere', GG3: 'poussee_1', GG4: 'tirage_1', GG5: 'tronc' };
const MUSCLE_LABEL: Record<string, string> = {
  quadriceps: 'quadriceps', fessiers: 'fessiers', ischios: 'ischios', pectoraux: 'pectoraux', grand_dorsal: 'grand dorsal', deltoides: 'épaules (deltoïdes)',
};

interface Duration {
  dMin: number;
  targetMin: number;
  startN: number;
  addMin: number;
}

function resolveDuration(raw: number | null | undefined, pregnant: boolean, out: GenMessage[]): Duration {
  const nFor = (d: number) => [...START_N_BY_DURATION].reverse().find(([k]) => d >= k)?.[1] ?? START_N_BY_DURATION[0][1];
  if (raw === null) {
    if (pregnant) {
      out.push(msg.grosDuree());
      return { dMin: PREGNANCY.maxDurationMin, targetMin: PREGNANCY.maxDurationMin, startN: UNLIMITED.startN, addMin: PREGNANCY.maxDurationMin };
    }
    return { dMin: UNLIMITED.capMin, targetMin: UNLIMITED.targetMin, startN: UNLIMITED.startN, addMin: UNLIMITED.targetMin };
  }
  let d = raw ?? DEFAULT_DURATION_MIN;
  if (d < MIN_DURATION_MIN) {
    d = MIN_DURATION_MIN;
    out.push(msg.dureeMin(d));
  }
  if (pregnant && d > PREGNANCY.maxDurationMin) {
    d = PREGNANCY.maxDurationMin;
    out.push(msg.grosDuree());
  }
  return { dMin: d, targetMin: d, startN: nFor(d), addMin: d };
}

// ----- Couverture des grands groupes (V-GG, V-FREQ) -----
export function ggOf(ex: Pick<GenExercise, 'schema' | 'musclesPrincipaux' | 'substitut' | 'tier'>): { gg: GG; full: boolean }[] {
  const out: { gg: GG; full: boolean }[] = [];
  const full = !ex.substitut;
  if ((ex.schema === 'squat' || ex.schema === 'fente') && ex.musclesPrincipaux.includes('quadriceps')) out.push({ gg: 'GG1', full });
  if (ex.schema === 'charniere') out.push({ gg: 'GG2', full });
  if (ex.schema === 'poussee_h' || ex.schema === 'poussee_v') out.push({ gg: 'GG3', full });
  if (ex.schema === 'tirage_h' || ex.schema === 'tirage_v')
    out.push({ gg: 'GG4', full: full && (ex.musclesPrincipaux.includes('grand_dorsal') || ex.musclesPrincipaux.includes('rhomboides')) });
  if (TRONC_SCHEMAS.includes(ex.schema)) out.push({ gg: 'GG5', full });
  return out;
}
export function coverageOf(sessions: { exercises: GenExercise[] }[]): Record<GG, number> {
  const c = { GG1: 0, GG2: 0, GG3: 0, GG4: 0, GG5: 0 } as Record<GG, number>;
  for (const s of sessions) {
    const set = new Set(s.exercises.flatMap((e) => ggOf(e).map((x) => x.gg)));
    for (const g of set) c[g]++;
  }
  return c;
}

// ----- Volume (V-VOL, V-PLAF) -----
const frac = (e: GenExercise, m: string): number => {
  const match = (x: string) => (m === 'deltoides' ? x.startsWith(VOLUME.deltoidPrefix) : x === m);
  if (e.musclesPrincipaux.some(match)) return 1;
  if (e.musclesSecondaires.some(match)) return VOLUME.secondaryWeight;
  return 0;
};
const sessionVol = (s: { exercises: GenExercise[] }, m: string) => s.exercises.reduce((a, e) => a + e.sets * frac(e, m), 0);
const musclesOf = (s: { exercises: GenExercise[] }[]) => [...new Set(s.flatMap((x) => x.exercises.flatMap((e) => [...e.musclesPrincipaux, ...e.musclesSecondaires])))].sort();
const workSets = (s: { exercises: GenExercise[] }) => s.exercises.reduce((a, e) => a + e.sets, 0);

function sessionCapsOk(s: { exercises: GenExercise[] }): boolean {
  if (s.exercises.length > VOLUME.maxExercisesPerSession) return false;
  if (workSets(s) > VOLUME.maxWorkSetsPerSession) return false;
  return musclesOf([s]).every((m) => sessionVol(s, m) <= VOLUME.maxPerMuscleSession);
}
function weekCapsOk(ss: { exercises: GenExercise[] }[]): boolean {
  return musclesOf(ss).every((m) => ss.reduce((a, s) => a + sessionVol(s, m), 0) <= VOLUME.maxPerMuscleWeek);
}

function removeEx(s: DurSession<GenExercise>, e: GenExercise) {
  s.exercises = s.exercises.filter((x) => x !== e).map((x) => (e.supersetGroup && x.supersetGroup === e.supersetGroup ? { ...x, supersetGroup: null } : x));
}

/** V-PLAF : au plus 10 séries fractionnaires par muscle et par séance, 20 par semaine (baisse de séries ou retrait d'un accessoire, jamais sous 2 séries). */
function enforcePlaf(sessions: DurSession<GenExercise>[]) {
  for (let guard = 0; guard < 300; guard++) {
    let target: { s: DurSession<GenExercise>[]; m: string } | null = null;
    for (const s of sessions) {
      const m = musclesOf([s]).find((x) => sessionVol(s, x) > VOLUME.maxPerMuscleSession);
      if (m) {
        target = { s: [s], m };
        break;
      }
    }
    if (!target) {
      const m = musclesOf(sessions).find((x) => sessions.reduce((a, s) => a + sessionVol(s, x), 0) > VOLUME.maxPerMuscleWeek);
      if (m) target = { s: [...sessions].reverse(), m };
    }
    if (!target) return;
    let fixed = false;
    for (const slot of PLAF_ORDER) {
      for (const s of target.s) {
        const e = s.exercises.find((x) => x.slot === slot && frac(x, target!.m) > 0);
        if (!e) continue;
        const floor = Math.min(e.sets, VOLUME.minSets);
        if (e.sets > floor && e.sets > 1) {
          s.exercises = s.exercises.map((x) => (x === e ? { ...x, sets: x.sets - 1 } : x));
          fixed = true;
        } else if (!isCore(slot)) {
          removeEx(s, e);
          fixed = true;
        }
        if (fixed) break;
      }
      if (fixed) break;
    }
    if (!fixed) return;
  }
}

/** V-VOL (famille muscle, intermédiaire/avancé, hors grossesse) : +1 série (max 4) tant que durée et plafonds le permettent ; sinon V-MSG-VOL. */
function applyVolume(sessions: DurSession<GenExercise>[], budget: (s: DurSession<GenExercise>) => number, ctx: Ctx, out: GenMessage[]) {
  if (ctx.family !== 'muscle' || ctx.level === 'debutant' || ctx.pregnant) return;
  const targets = [...VOLUME.muscles, 'deltoides'];
  for (const m of targets) {
    const week = () => sessions.reduce((a, s) => a + sessionVol(s, m), 0);
    while (week() < VOLUME.targetMuscle) {
      let done = false;
      for (const s of sessions) {
        for (const slot of SLOT_ORDER) {
          const e = s.exercises.find((x) => x.slot === slot);
          if (!e || !e.rirAsked || e.unit !== 'reps' || e.capped || e.sets >= VOLUME.maxSetsPerExercise) continue;
          if (!e.musclesPrincipaux.some((x) => (m === 'deltoides' ? x.startsWith(VOLUME.deltoidPrefix) : x === m))) continue;
          const trial = { ...s, exercises: s.exercises.map((x) => (x === e ? { ...x, sets: x.sets + 1 } : x)) };
          const all = sessions.map((x) => (x === s ? trial : x));
          if (estimerDuree(trial) <= budget(s) && sessionCapsOk(trial) && weekCapsOk(all)) {
            s.exercises = trial.exercises;
            done = true;
            break;
          }
        }
        if (done) break;
      }
      if (!done) break;
    }
    if (week() < VOLUME.targetMuscle) out.push(msg.vol(MUSCLE_LABEL[m] ?? m, week()));
  }
}

function orderExercises(list: GenExercise[]): GenExercise[] {
  const sorted = [...list].sort((a, b) => DISPLAY_ORDER.indexOf(a.slot) - DISPLAY_ORDER.indexOf(b.slot));
  const out: GenExercise[] = [];
  for (const e of sorted) {
    if (out.includes(e)) continue;
    out.push(e);
    if (e.supersetGroup) for (const p of sorted) if (p !== e && p.supersetGroup === e.supersetGroup) out.push(p);
  }
  // Repos de la paire = le plus long des deux, jamais moins de 60 s (V-SUP, SUP-6).
  return out.map((e) => {
    if (!e.supersetGroup) return e;
    const rest = pairRestSec(out.filter((x) => x.supersetGroup === e.supersetGroup));
    return { ...e, restSec: rest };
  });
}

// ----- Causes d'un repli (§7.1) -----
interface Cause {
  cause: 'sante' | 'materiel';
  zones: string[];
}
function causeOf(slot: SlotKey, label: Label, fill: SlotFill, healthFree: SlotFill | undefined, ctx: Ctx, ctxNH: Ctx, pool: Fiche[], placed: Partial<Record<SlotKey, string>>): Cause {
  if (!healthFree || tierRank(healthFree.tier) >= tierRank(fill.tier)) return { cause: 'materiel', zones: [] };
  const def = slotDef(slot, { label, placedSchema: placed });
  const schemas = new Set([...def.a, ...(def.allowB ? def.b : [])].map((r) => r.schema));
  const zones = new Set<string>();
  for (const X of pool) {
    if (!schemas.has(X.schema)) continue;
    if (!resolveFiche(X, ctxNH).candidates.length) continue;
    for (const z of resolveFiche(X, ctx).blockedBy) zones.add(z);
  }
  if (!zones.size) for (const z of ctx.zones) zones.add(z.key);
  return { cause: 'sante', zones: [...zones] };
}

/** Programme complet. */
export function generateProgram(input: GeneratorInput): GenerateResult {
  const ctx = buildCtx(input);
  const msgs: GenMessage[] = [];
  const p = input.profile;
  const want = p.daysPerWeek;
  // B4 (cardio-regles.md §3.2) : cardio principal = 2 séances de musculation (3 à 6 jours) + cardio, de 2 à 6 jours.
  const cardioRole: CardioRole = cardioRoleOf(input.goals);
  const principal = cardioRole === 'principal';
  const okDays = principal ? !!want && want >= 2 && want <= 6 && !!CARDIO.principalMuscuByDays[want] : want === 2 || want === 3;
  if (!okDays || !want) return { ok: false, code: 'HORS', messages: [msg.hors()] };
  const muscuWant: 2 | 3 = principal ? CARDIO.principalMuscuByDays[want] : (want as 2 | 3);
  const dc = chooseDays(p.blockedWeekdays ?? [], muscuWant);
  if (!dc.ok) return { ok: false, code: 'JOURS2', messages: [msg.jours2(dc.suggestion)] };
  if (dc.reduced) msgs.push(msg.jours(dc.days));
  const nDays = dc.days.length as 2 | 3;
  const labels = LABELS.slice(0, nDays);
  const dur = resolveDuration(p.sessionDurationMin, ctx.pregnant, msgs);
  const dSec = dur.dMin * 60;
  const addSec = dur.addMin * 60;

  // Messages d'objectif (V-OBJ) et de santé (R3 une fois par zone, C3).
  if (!ctx.pregnant) {
    if (ctx.goalKey === 'perte_gras') msgs.push(msg.objGras());
    if (ctx.goalKey === 'endurance') msgs.push(msg.objCardio());
    if (ctx.goalKey === 'sport') msgs.push(msg.objSport());
  }
  if (ctx.pregnant) msgs.push(msg.grosAvis());
  for (const z of ctx.zones) {
    if (z.isG || z.level !== 3) continue;
    if (z.key === 'cou' && ctx.neckShock) msgs.push(msg.c3());
    else msgs.push(msg.r3(z.key));
  }
  // Les messages du cardio (B4) se placent ici, après ceux de l'objectif et de la santé.
  const cardioMsgAt = msgs.length;

  const pool = input.fiches.filter((f) => USABLE_STATUTS.includes(f.statut)).sort((a, b) => (a.id < b.id ? -1 : 1));
  const slotList = SLOT_ORDER.filter((s) => s !== 'fonctionnel' || ctx.fonctionnelEnabled);
  // D26 : séances qui reçoivent du core (table §2.2 et CORE-FREQ-5 : A puis C, puis B), rotation des familles (CORE-ALT-1),
  // séance « à charge lourde » (CORE-ORD-4 : core CF1/CF2 seulement, ni roue ni CF1 dynamique, maintien <= 30 s).
  const coreLabels = new Set<Label>(CORE_SESSION_PRIORITY[nDays].slice(0, coreTargetSessions(nDays, coreGoalOf(ctx.goalFamily, principal))));
  const slotsFor = (l: Label) => slotList.filter((s) => s !== 'tronc' || coreLabels.has(l));
  const troncPools = new Map<string, Fiche[]>();
  const troncPool = (fam: CoreFamily, heavy: boolean): Fiche[] => {
    const k = `${fam}:${heavy}`;
    if (!troncPools.has(k)) troncPools.set(k, pool.filter((f) => troncFicheFits(f, fam, heavy)));
    return troncPools.get(k)!;
  };
  const poolNoExtension = pool.filter((f) => !CORE_OUT_OF_FLOOR_IDS.includes(f.id));
  const heavyFill = (f: Map<SlotKey, SlotFill>) =>
    [...f.entries()].some(([slot, fl]) => !!fl.cand && isHeavyExercise({ slot, schema: fl.cand.fiche.schema, ficheId: fl.cand.fiche.id, tags: fl.cand.variant.tags }));
  const heavyBy = new Map<Label, boolean>();
  const fillWeek = (c: Ctx, main = false) => {
    const prev = new Map<SlotKey, Set<string>>();
    const res = new Map<Label, Map<SlotKey, SlotFill>>();
    let rot = 0;
    let prevFam: CoreFamily | null = null;
    for (const l of labels) {
      const slots = slotsFor(l);
      // Passe 1 sans tronc : la séance est-elle « à charge lourde » ? (tous les emplacements candidats comptent : lecture prudente)
      const heavy = heavyFill(fillSession(l, slots.filter((s) => s !== 'tronc'), c, pool, prev));
      let picked: CoreFamily | null = null;
      const f = fillSession(l, slots, c, pool, prev, {
        // Inventaire : extension-dorsale-ballon (CF5) jamais après une charge lourde.
        poolFor: (slot) => (slot === 'charniere' && heavy ? poolNoExtension : null),
        fillTronc: (st, used, prevUsed) => {
          const n = CORE_FAMILY_ORDER.length;
          const order = [...CORE_FAMILY_ORDER.slice(rot % n), ...CORE_FAMILY_ORDER.slice(0, rot % n)];
          // Jamais la même famille que la séance de core précédente, sauf s'il n'en reste qu'une admissible.
          for (const fam of [...order.filter((x) => x !== prevFam), ...order.filter((x) => x === prevFam)]) {
            const fill = fillSlot('tronc', st, used, prevUsed, c, troncPool(fam, heavy));
            if (fill.cand) {
              picked = fam;
              return fill;
            }
          }
          return { slot: 'tronc', tier: 'e', cand: null, schemaRank: 0 };
        },
      });
      if (picked) {
        rot = CORE_FAMILY_ORDER.indexOf(picked) + 1;
        prevFam = picked;
      }
      if (main) heavyBy.set(l, heavy);
      res.set(l, f);
      for (const [slot, fill] of f) if (fill.cand) (prev.get(slot) ?? prev.set(slot, new Set()).get(slot)!).add(fill.cand.fiche.id);
    }
    return res;
  };
  const fills = fillWeek(ctx, true);
  const healthy = ctx.zones.length > 0;
  const ctxNH = buildCtx(input, { zones: [], pregnant: false });
  const fillsNH = healthy ? fillWeek(ctxNH) : fills;
  const ctxNoL3 = buildCtx(input, { zones: ctx.zones.filter((z) => !z.isG && z.level < 3) });
  const fillsNoL3 = ctx.zones.some((z) => !z.isG && z.level === 3) ? fillWeek(ctxNoL3) : fills;
  const tierOf = (m: Map<Label, Map<SlotKey, SlotFill>>, l: Label, s: SlotKey): Tier => m.get(l)!.get(s)?.tier ?? 'e';

  // P-ZONE3 : 3 emplacements du noyau ou plus vides (après les replis a-d) à cause de zones au niveau 3 -> aucun programme.
  for (const l of labels) {
    const empty = CORE_SLOTS.filter((s) => tierOf(fills, l, s) === 'e' && tierOf(fillsNoL3, l, s) !== 'e').length;
    if (empty >= P_ZONE3_MAX_EMPTY_CORE) return { ok: false, code: 'PRO', messages: dedupe([...msgs.filter((m) => m.id === 'R3' || m.id === 'C3'), msg.pro()]) };
  }
  // Tous les emplacements vides pour une cause matériel (impossible avec la bibliothèque du 23/10) -> aucun programme.
  if (labels.every((l) => CORE_SLOTS.every((s) => tierOf(fills, l, s) === 'e' && tierOf(fillsNH, l, s) === 'e'))) {
    return { ok: false, code: 'IMPOS', messages: [msg.impos('squat', 'A')] };
  }

  // Séances : N emplacements de départ, échauffement, supersets, durée, ajout.
  type Built = { s: DurSession<GenExercise>; actions: string[]; removedCore: SlotKey[]; overBudget: boolean; attempted: SlotKey[]; warm: ReturnType<typeof mobilityWarmup> };
  const build = (l: Label, budgetSec: number, addBudgetSec: number, coreProtected: boolean): Built => {
    const f = fills.get(l)!;
    const sl = slotsFor(l);
    const active = sl.slice(0, dur.startN);
    const mk = (slot: SlotKey): GenExercise | null => {
      const fill = f.get(slot);
      if (!fill?.cand) return null;
      const ex = buildExercise(fill.cand, slot, fill.tier, ctx);
      // CORE-ORD-4 : après une charge lourde, maintien de core au plus 30 s (ne fait que baisser).
      if (slot === 'tronc' && heavyBy.get(l) && ex.holdSec !== null) ex.holdSec = Math.min(ex.holdSec, CORE_HEAVY_MAX_HOLD_SEC);
      ex.warmupSets = e3Sets(ex, ctx);
      return ex;
    };
    const exercises = active.map(mk).filter((e): e is GenExercise => !!e);
    const mob = mobilityWarmup(ctx, exercises.some((e) => e.slot === 'charniere'));
    let s: DurSession<GenExercise> = { label: l, days: nDays, level: ctx.level, pregnant: ctx.pregnant, exercises, e1Sec: WARMUP.generalSec, e2Count: mob.length };
    if (ctx.gagnerDuTemps) s = formAllPairs(s);
    const adj = ajusterDuree(s, budgetSec, { coreProtected });
    s = adj.session;
    const attempted = [...active];
    if (!adj.actions.length) {
      // Ajout (§4.4) : si T < D - 10 min et N < 8, emplacement suivant tant que T <= D et que les plafonds tiennent.
      for (const slot of sl) {
        if (attempted.includes(slot)) continue;
        if (s.exercises.length >= VOLUME.maxExercisesPerSession || estimerDuree(s) >= addBudgetSec - TIME.addIfUnderMarginSec) break;
        const ex = mk(slot);
        attempted.push(slot);
        if (!ex) continue;
        const trial = { ...s, exercises: [...s.exercises, ex] };
        if (estimerDuree(trial) <= Math.min(budgetSec, addBudgetSec) && sessionCapsOk(trial)) s = trial;
        else break;
      }
    }
    return { s, actions: adj.actions, removedCore: adj.removedCore, overBudget: adj.overBudget, attempted, warm: mob };
  };

  // Cardio (B4) : type choisi selon le lieu, le matériel et la santé (cardio-regles.md §4-§5) ; blocs après la musculation
  // (cardio secondaire, ou principal à 2 jours, §3.4). La place du bloc est réservée avant l'ajout d'accessoires (goal-resolver.md
  // règle 5 : accessoires coupés avant le cardio) mais jamais au prix d'un emplacement du noyau, d'une série, de l'échauffement
  // ni d'un pilier (le cardio est alors retiré en premier).
  const cardioChoice = cardioRole ? chooseCardio(ctx) : null;
  const blockRole: 'principal' | 'secondaire' | null =
    cardioRole === 'secondaire' ? 'secondaire' : principal && CARDIO.principalDedicatedByDays[want] === 0 ? 'principal' : null;
  const maxBlocks = blockRole === 'secondaire' ? CARDIO.secondaryBlocksMax : nDays;
  const reserveSec = CARDIO.blockStartMin * 60;
  const softActions = (a: string) => a.startsWith('paire:') || ACCESSORY_REMOVAL_ORDER.some((x) => a === `retrait:${x}`);
  const budget = new Map<Label, number>();
  let cardioTimeShort = false;

  const durSessions: DurSession<GenExercise>[] = [];
  const meta = new Map<Label, { removedCore: SlotKey[]; overBudget: boolean; attempted: SlotKey[]; warm: ReturnType<typeof mobilityWarmup> }>();
  const general = generalWarmup(ctx);
  const buildLabel = (l: Label, coreProtected: boolean, blocksBefore: number) => {
    let chosen = build(l, dSec, addSec, coreProtected);
    let placed = false;
    let short = false;
    if (blockRole && cardioChoice && blocksBefore < maxBlocks) {
      // §3.4 (c) : pilier lourd (4-6 répétitions) et durée déjà serrée -> pas de bloc (on coupe le bloc, jamais le pilier).
      const heavy = chosen.s.exercises.some((e) => e.role === 'pilier' && e.unit === 'reps' && e.repsMax <= 6);
      if (!(heavy && chosen.actions.length) && dSec > reserveSec) {
        const red = build(l, dSec - reserveSec, addSec - reserveSec, coreProtected);
        const extra = red.actions.filter((a) => !chosen.actions.includes(a));
        const cap = blockCap(ctx, blockRole, estimerDuree(red.s), dSec);
        if (!red.overBudget && extra.every(softActions) && red.removedCore.length <= chosen.removedCore.length && cap >= CARDIO.blockMinMin) {
          chosen = red;
          placed = true;
        }
      }
      if (!placed) short = true;
    }
    return { chosen, placed, short };
  };
  // D26 (CORE-TPS-1) : le core des séances du plancher (2 séances, 4 séries) n'est jamais retiré pour la durée ; au-delà du plancher,
  // il est raccourci puis retiré avant la charnière et tirage_1, dans l'ordre de séances A, C, B (E1). Grossesse : aucun plancher.
  const results = new Map<Label, ReturnType<typeof buildLabel>>();
  const blocksBefore = (l: Label) => labels.slice(0, labels.indexOf(l)).filter((x) => results.get(x)?.placed).length;
  for (const l of labels) results.set(l, buildLabel(l, coreLabels.has(l) && !ctx.pregnant, blocksBefore(l)));
  let beyondFloor = ctx.pregnant ? 0 : Math.max(0, coreLabels.size - CORE_FLOOR.sessions);
  for (const l of CORE_REMOVAL_SESSION_ORDER[nDays]) {
    if (beyondFloor <= 0) break;
    const r = results.get(l)!;
    if (!coreLabels.has(l) || (!r.chosen.removedCore.length && !r.chosen.overBudget)) continue;
    const alt = buildLabel(l, false, blocksBefore(l));
    if (alt.chosen.actions.some((a) => a === 'tronc:1serie' || a === 'retrait:tronc')) {
      results.set(l, alt);
      beyondFloor--;
    }
  }
  for (const l of labels) {
    const { chosen, placed, short } = results.get(l)!;
    if (placed) budget.set(l, dSec - reserveSec);
    if (short) cardioTimeShort = true;
    durSessions.push(chosen.s);
    meta.set(l, { removedCore: chosen.removedCore, overBudget: chosen.overBudget, attempted: chosen.attempted, warm: chosen.warm });
  }

  enforcePlaf(durSessions);
  applyVolume(durSessions, (s) => budget.get(s.label as Label) ?? dSec, ctx, msgs);

  // Finalisation des séances.
  const sessions: GenSession[] = durSessions.map((s, i) => {
    const m = meta.get(s.label)!;
    const est = estimerDuree(s);
    let cardio: CardioItem | null = null;
    if (budget.has(s.label as Label) && cardioChoice && blockRole) {
      const cap = blockCap(ctx, blockRole, est, dSec);
      if (cap >= CARDIO.blockMinMin) cardio = cardioItem('bloc', cardioChoice, CARDIO.blockStartMin, cap, BLOCK_WEEKS, ctx);
      else cardioTimeShort = true;
    }
    const total = est + (cardio ? cardio.minutes * 60 : 0);
    const base: GenSession = {
      label: s.label,
      weekday: dc.days[i],
      warmup: {
        general: general ? { ...general, sec: s.e1Sec } : null,
        generalSec: s.e1Sec,
        mobility: m.warm.slice(0, s.e2Count),
        cooldown: cooldown(ctx),
      },
      exercises: orderExercises(s.exercises),
      estimatedSec: est,
      estimatedMin: Math.ceil(total / 60 / TIME.displayRoundMin) * TIME.displayRoundMin,
      removedCore: m.removedCore,
      overBudget: est > dSec,
    };
    return cardioRole ? { ...base, cardio, totalSec: total } : base;
  });

  // Séances de cardio dédiées (cardio principal, 3 à 6 jours, §3.2-§3.3) : jours libres seulement, jamais de séance double.
  const cardioSessions: GenCardioSession[] = [];
  if (principal && cardioChoice) {
    const planned = Math.min(CARDIO.principalDedicatedByDays[want], CARDIO.maxDedicated[cardioLevel(ctx)], want - nDays);
    const days = chooseCardioDays(p.blockedWeekdays ?? [], dc.days, planned);
    if (days.length < planned) msgs.push(cardioMsg.jours(planned, days.length));
    const mins = dedicatedMinutes(ctx, dur.targetMin);
    days.forEach((d, i) => {
      const item = cardioItem('seance', cardioChoice, mins.start, mins.cap, BLOCK_WEEKS, ctx);
      cardioSessions.push({
        label: days.length > 1 ? `Cardio ${i + 1}` : 'Cardio',
        weekday: d,
        cardio: item,
        estimatedMin: Math.ceil(item.minutes / TIME.displayRoundMin) * TIME.displayRoundMin,
      });
    });
  }
  const blocks = sessions.map((s) => s.cardio).filter((c): c is CardioItem => !!c);
  const cardioMinWeek = blocks.reduce((a, c) => a + c.minutes, 0) + cardioSessions.reduce((a, c) => a + c.cardio.minutes, 0);
  const cardioMsgs: GenMessage[] = [];
  if (cardioRole) {
    if (!cardioChoice) cardioMsgs.push(cardioMsg.impos());
    else if (cardioMinWeek > 0) {
      // Textes de `kine` (§9bis) : T0 + T4 une fois, T3 à la première ouverture du cardio, T1 et T1u (signes d'arrêt, urgence).
      cardioMsgs.push(cardioMsg.t0(), cardioMsg.t4(), cardioMsg.t3(), cardioMsg.t1(), cardioMsg.t1u());
      if (ctx.pregnant) cardioMsgs.push(cardioMsg.t5(), cardioMsg.omsGrossesse(cardioMinWeek));
      else cardioMsgs.push(cardioMsg.oms(cardioMinWeek));
      if (ctx.available.has('machine_cardio')) cardioMsgs.push(cardioMsg.machine());
    }
    if (cardioChoice && (cardioTimeShort || (blockRole && !blocks.length))) cardioMsgs.push(cardioMsg.temps());
  }

  // Messages des replis (§7.1), durée, plans, force.
  const causeCache = new Map<string, Cause>();
  const getCause = (l: Label, slot: SlotKey) => {
    const k = `${l}:${slot}`;
    if (!causeCache.has(k)) {
      const placed: Partial<Record<SlotKey, string>> = {};
      for (const [sl, fl] of fills.get(l)!) if (fl.cand) placed[sl] = fl.cand.fiche.schema;
      causeCache.set(k, causeOf(slot, l, fills.get(l)!.get(slot)!, fillsNH.get(l)!.get(slot), ctx, ctxNH, pool, placed));
    }
    return causeCache.get(k)!;
  };
  // D26 : plancher de core (CORE-FREQ-3, CORE-SEC-2 point 4, CORE-SEC-4) : aucune fiche de tronc admissible dans les séances prévues ->
  // message neutre (sans alerte ni diagnostic), à la place des avertissements ; dos au niveau 3 : R3 (« demande l'avis d'un
  // professionnel ») est déjà affiché et tient lieu de message (CORE-SEC-3).
  const noCore = coreLabels.size > 0 && [...coreLabels].every((l) => tierOf(fills, l, 'tronc') === 'e');
  const dosL3 = ctx.zones.some((z) => !z.isG && z.key === 'dos' && z.level === 3);
  const troncNeutral = noCore && !dosL3;
  if (troncNeutral) msgs.push(msg.tronc());
  for (const s of sessions) {
    const f = fills.get(s.label)!;
    for (const slot of CORE_SLOTS) {
      if (s.removedCore.includes(slot)) continue;
      const fill = f.get(slot);
      if (!fill || (slot === 'tronc' && troncNeutral)) continue;
      if (fill.tier === 'a') continue;
      const def = slotDef(slot, { label: s.label, placedSchema: {} });
      const schema = def.a[0].schema;
      const cause = getCause(s.label, slot);
      if (fill.tier === 'b' && slot !== 'tronc') msgs.push(msg.plan(schema, fill.cand!.fiche.nom, s.label));
      if (fill.tier === 'c' || fill.tier === 'd') msgs.push(msg.subst(schema, fill.cand!.fiche.nom, s.label));
      if (fill.tier === 'e' && cause.cause === 'materiel') msgs.push(msg.impos(schema, s.label));
      if (cause.cause === 'sante') msgs.push(msg.zone(schema, cause.zones, s.label));
    }
    if (s.removedCore.length || s.overBudget) {
      const names = s.removedCore.map((slot) => {
        const c = f.get(slot)?.cand;
        return c ? c.fiche.nom.toLowerCase() : slot;
      });
      msgs.push(msg.duree(dur.dMin, names, s.label, s.overBudget ? Math.ceil(s.estimatedSec / 60) : null));
    }
  }
  const coverage = coverageOf(sessions);
  for (const gg of GG_LIST) {
    if (coverage[gg] >= FREQ_MIN_PER_WEEK) continue;
    if (gg === 'GG5' && troncNeutral) continue;
    const slot = GG_SLOT[gg];
    let fix: string | null = null;
    if (sessions.some((s) => s.removedCore.includes(slot))) {
      const next = DURATION_STEPS_MIN.find((d) => d > dur.dMin);
      fix = next ? `allonger la séance à ${next} min` : nDays === 2 ? 'ajouter un jour' : null;
    } else if (labels.some((l) => fills.get(l)!.has(slot) && tierOf(fills, l, slot) === 'e' && getCause(l, slot).cause === 'materiel')) fix = 'ajouter du matériel';
    msgs.push(msg.freq(gg, coverage[gg], fix));
  }
  if (nDays === 2) {
    const bothPlanes = (s: GenSession, a: string, b: string) => s.exercises.some((e) => e.schema === a) && s.exercises.some((e) => e.schema === b);
    if (!sessions.every((s) => bothPlanes(s, 'poussee_h', 'poussee_v') && bothPlanes(s, 'tirage_h', 'tirage_v'))) msgs.push(msg.plans());
  }
  const pillars = sessions.flatMap((s) => s.exercises.filter((e) => e.role === 'pilier'));
  const forceNoLoad = ctx.family === 'force' && pillars.some((e) => !e.chargeable);
  if (forceNoLoad) msgs.push(msg.force());

  // Achat le plus utile (V-ACHAT §7.2).
  const achat = computeAchat(input, ctx, labels, fills, meta, getCause, slotList, pool);
  if (achat) msgs.push(OBJETS_QUOTIDIEN.includes(achat.tag) ? msg.objet(achat.tag, achat.gain) : msg.achat(achat.tag, achat.gain));

  // V-MSG-EPAULES (§8.2) : aucune fiche poussee_v admissible pour la personne.
  const pushV = (c: Ctx) => pool.some((f) => f.schema === 'poussee_v' && resolveFiche(f, c).candidates.length > 0);
  if (!pushV(ctx)) {
    const tags = ACHAT_CANDIDATES.filter((t) => !ctx.available.has(t) && pushV(buildCtx(input, { extraTags: [t] })));
    msgs.push(msg.epaules(tags, !!achat));
  }

  let explanation = explain(ctx, nDays, coverage, dur, sessions, forceNoLoad);
  if (cardioRole) explanation = explainCardio(explanation, cardioRole, !!cardioChoice, nDays, sessions, cardioSessions, cardioMinWeek, dur.dMin, ctx.pregnant);
  const messages = dedupe([...msgs.slice(0, cardioMsgAt), ...cardioMsgs, ...msgs.slice(cardioMsgAt)]);
  const program: GenProgram = {
    split: 'corps_entier',
    weeks: BLOCK_WEEKS,
    level: ctx.level,
    family: ctx.family,
    goalKey: ctx.goalKey,
    pregnancy: ctx.pregnant,
    durationMin: dur.dMin,
    targetMin: dur.targetMin,
    sessions,
    explanation,
    messages,
    coverage,
    substitutes: sessions.flatMap((s) =>
      s.exercises.filter((e) => e.substitut).map((e) => ({ session: s.label, slot: e.slot, ficheId: e.ficheId, nom: e.nom, schema: e.schema })),
    ),
    achat,
    ...(cardioRole ? { cardioRole, cardioSessions, cardioMinWeek } : {}),
  };
  return { ok: true, program, messages };
}

function computeAchat(
  input: GeneratorInput,
  ctx: Ctx,
  labels: Label[],
  fills: Map<Label, Map<SlotKey, SlotFill>>,
  meta: Map<Label, { attempted: SlotKey[] }>,
  getCause: (l: Label, s: SlotKey) => Cause,
  slotList: SlotKey[],
  pool: Fiche[],
): { tag: string; gain: number } | null {
  const weak: { l: Label; slot: SlotKey }[] = [];
  for (const l of labels) {
    for (const slot of meta.get(l)!.attempted) {
      const t: Tier = fills.get(l)!.get(slot)!.tier;
      if ((t === 'c' || t === 'd' || t === 'e') && getCause(l, slot).cause === 'materiel') weak.push({ l, slot });
    }
  }
  if (!weak.length) return null;
  let best: { tag: string; gain: number } | null = null;
  for (const tag of ACHAT_CANDIDATES) {
    if (ctx.available.has(tag)) continue;
    const c2 = buildCtx(input, { extraTags: [tag] });
    const prev = new Map<SlotKey, Set<string>>();
    let gain = 0;
    for (const l of labels) {
      const f = fillSession(l, slotList, c2, pool, prev);
      for (const [slot, fill] of f) if (fill.cand) (prev.get(slot) ?? prev.set(slot, new Set()).get(slot)!).add(fill.cand.fiche.id);
      for (const w of weak) if (w.l === l && (f.get(w.slot)!.tier === 'a' || f.get(w.slot)!.tier === 'b')) gain++;
    }
    if (gain > 0 && (!best || gain > best.gain)) best = { tag, gain };
  }
  return best;
}

function explain(ctx: Ctx, nDays: 2 | 3, coverage: Record<GG, number>, dur: Duration, sessions: GenSession[], forceNoLoad: boolean): [string, string] {
  const m = Math.min(...GG_LIST.map((g) => coverage[g]));
  const lowGG = GG_LIST.find((g) => coverage[g] < 2);
  const low = lowGG ? GG_LABEL[lowGG].charAt(0).toLowerCase() + GG_LABEL[lowGG].slice(1) : '';
  let l1: string;
  if (nDays === 3) {
    l1 =
      m >= 3
        ? '3 séances par semaine en corps entier : chaque grand muscle travaille 3 fois.'
        : m === 2
          ? '3 séances par semaine en corps entier : chaque grand muscle travaille au moins 2 fois.'
          : `3 séances par semaine en corps entier ; ${low} ne tient pas dans ${dur.dMin} min.`;
  } else {
    l1 = m >= 2 ? '2 séances par semaine en corps entier : chaque grand muscle travaille 2 fois.' : `2 séances par semaine en corps entier ; ${low} ne tient pas dans ${dur.dMin} min.`;
  }
  const ref = sessions.flatMap((s) => s.exercises).find((e) => e.role === 'pilier' && e.unit === 'reps') ?? sessions[0]?.exercises[0];
  if (ctx.pregnant) {
    const sets = ref?.sets ?? (ctx.level === 'debutant' ? PREGNANCY.setsDebutant : PREGNANCY.setsOther);
    return [l1, `Grossesse ou après un accouchement : séances modérées, ${sets} série(s) de 10 à 15 répétitions, sans effort maximal.`];
  }
  let l2: string;
  if (ctx.family === 'muscle') {
    l2 = `Objectif muscle : ${ref?.sets ?? 3} séries de ${ref?.repsMin}-${ref?.repsMax} répétitions, en gardant environ ${ref?.rirTarget} répétitions en réserve.`;
  } else if (ctx.family === 'force') {
    const charged = sessions.flatMap((s) => s.exercises).find((e) => e.role === 'pilier' && e.chargeable);
    l2 =
      forceNoLoad && !charged
        ? 'Objectif force : sans charges lourdes, on progresse par des variantes plus dures ; la force maximale progresse mieux avec des charges.'
        : `Objectif force : les gros mouvements d'abord, charges lourdes (${charged?.repsMin}-${charged?.repsMax} répétitions) et repos longs.`;
  } else l2 = "Objectif forme : des séances simples et régulières, sans aller jusqu'à l'échec.";
  if (ctx.ramene && ctx.goalKey) l2 = `${GOAL_LABEL[ctx.goalKey] ?? ctx.goalKey} : en attendant la version dédiée, ${l2.charAt(0).toLowerCase()}${l2.slice(1)}`;
  return [l1, l2];
}

/**
 * V-EXPL (goal-resolver.md règle 6) avec cardio : toujours 2 lignes, qui citent le cardio (cardio-regles.md §7).
 * Cardio principal : ligne 1 = répartition musculation + cardio ; ligne 2 = repère OMS (C1, OK) ou ligne grossesse.
 * Cardio secondaire : lignes du programme de musculation, la ligne 2 ajoute le bloc de cardio (ou son absence).
 */
function explainCardio(
  base: [string, string], role: 'principal' | 'secondaire', possible: boolean, nDays: number, sessions: GenSession[],
  dedicated: GenCardioSession[], totalMin: number, dMin: number, pregnant: boolean,
): [string, string] {
  const blocks = sessions.filter((s) => s.cardio);
  const bMin = blocks[0]?.cardio?.minutes;
  const why = !possible ? 'aucun cardio sûr avec tes réglages' : `pas assez de temps dans ${dMin} min, il est retiré en premier`;
  const oms = `Le repère de l'OMS est 150 à 300 min par semaine : ton programme en compte environ ${totalMin} min.`;
  if (role === 'principal') {
    let l1: string;
    if (dedicated.length) {
      const m = dedicated[0].cardio.minutes;
      l1 = `${nDays + dedicated.length} jours : ${nDays} séances de musculation corps entier + ${dedicated.length} séance${dedicated.length > 1 ? 's' : ''} de cardio (${m} min, effort modéré).`;
    } else if (blocks.length) {
      l1 = `${nDays} jours : ${nDays} séances de musculation corps entier, ${blocks.length === nDays ? 'chacune suivie' : `dont ${blocks.length} suivie${blocks.length > 1 ? 's' : ''}`} de ${bMin} min de cardio (effort modéré).`;
    } else l1 = `${base[0]} Cardio : ${why}.`;
    return [l1, pregnant || totalMin === 0 ? base[1] : oms];
  }
  const add = blocks.length
    ? ` Cardio en plus : ${bMin} min après ${blocks.length} séance${blocks.length > 1 ? 's' : ''}, après la musculation, jamais un jour de plus.`
    : ` Cardio : ${why}.`;
  return [base[0], `${base[1]}${add}`];
}

/** Conversion vers le modèle stocké (Program.days / PlannedExercise de src/data/model.ts). */
export function toProgramDays(p: GenProgram): ProgramDay[] {
  const item = (w: { ficheId: string; variantId: string; nom: string; sec: number } | null) =>
    w ? { ficheId: w.ficheId, variantId: w.variantId, nom: w.nom, sec: w.sec } : null;
  const muscu = p.sessions.map((s) => ({
    label: `Séance ${s.label}`,
    weekday: s.weekday,
    estimatedMin: s.estimatedMin,
    warmup: { generalSec: s.warmup.generalSec, general: item(s.warmup.general), mobility: s.warmup.mobility.map((m) => item(m)!), cooldown: item(s.warmup.cooldown) },
    exercises: [
      ...s.exercises.map(
        (e): PlannedExercise => ({
          movementId: e.movementId, variantId: e.variantId, sets: e.sets, repsMin: e.repsMin, repsMax: e.repsMax, restSec: e.restSec,
          supersetGroup: e.supersetGroup, rirTarget: e.rirTarget, unit: e.unit, holdSec: e.holdSec, warmupSets: e.warmupSets, role: e.role,
          slot: e.slot, startLoadKg: e.startLoadKg, capped: e.capped, adaptation: e.adaptation, substitut: e.substitut,
        }),
      ),
      // B4 : bloc de cardio après la musculation et le retour au calme (cardio-regles.md §3.4 b).
      ...(s.cardio ? [cardioPlanned(s.cardio)] : []),
    ],
  }));
  const cardio = (p.cardioSessions ?? []).map((c) => ({
    label: c.label,
    weekday: c.weekday,
    estimatedMin: c.estimatedMin,
    warmup: { generalSec: 0, general: null, mobility: [], cooldown: null },
    exercises: [cardioPlanned(c.cardio)],
  }));
  // Semaine type dans l'ordre des jours : la rotation (séance suivante) suit la semaine.
  return [...muscu, ...cardio]
    .sort((x, y) => x.weekday - y.weekday)
    .map((d, i) => ({ dayIndex: i, ...d }));
}

/** Cardio (B4) -> exercice stocké : une « série » à durée (minutes de la semaine 1), effort modéré, sans réserve ni hausse automatique. */
export function cardioPlanned(c: CardioItem): PlannedExercise {
  return {
    movementId: c.ficheId, variantId: c.variantId, sets: 1, repsMin: 1, repsMax: 1, restSec: 0, supersetGroup: null,
    rirTarget: TEMPS_RIR_PLACEHOLDER, unit: 'sec', holdSec: c.minutes * 60, warmupSets: [], role: 'cardio', slot: 'cardio',
    startLoadKg: null, capped: true, adaptation: null, substitut: false,
  };
}

/** Le jour ne contient que du cardio (séance dédiée). */
export const isCardioDay = (d: Pick<ProgramDay, 'exercises'>): boolean => d.exercises.length > 0 && d.exercises.every((e) => e.role === 'cardio');

/** Utilitaire : niveaux de base, pour les tests. */
export const LEVEL_LIST: Level[] = ['debutant', 'intermediaire', 'avance'];
export { units };
