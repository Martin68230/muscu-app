// Générateur de programmes v1 (knowledge/generateur-v1.md ; phase-2-criteres F3).
// API : generateProgram(input) -> GenerateResult. Fonction pure et déterministe : aucun accès réseau, IndexedDB, horloge
// ni hasard ; les départages suivent l'ordre des ids (V-CLASSE clé 7).
import type { Level, PlannedExercise, ProgramDay } from '../data/model';
import {
  ACHAT_CANDIDATES, BLOCK_WEEKS, DEFAULT_DURATION_MIN, DURATION_STEPS_MIN, FREQ_MIN_PER_WEEK, GG_LIST, MIN_DURATION_MIN,
  OBJETS_QUOTIDIEN, PREGNANCY, P_ZONE3_MAX_EMPTY_CORE, START_N_BY_DURATION, TIME, TRONC_SCHEMAS, UNLIMITED, VOLUME, WARMUP, type GG,
} from './config';
import { buildCtx, type Ctx } from './context';
import { chooseDays } from './days';
import { buildExercise } from './dose';
import { ajusterDuree, estimerDuree, formAllPairs, units, type DurSession } from './duration';
import { dedupe, GG_LABEL, GOAL_LABEL, msg } from './messages';
import { resolveFiche, USABLE_STATUTS } from './safety';
import { CORE_SLOTS, fillSession, isCore, SLOT_ORDER, slotDef, tierRank, type SlotFill } from './slots';
import type { Fiche, GenerateResult, GeneratorInput, GenExercise, GenMessage, GenProgram, GenSession, SlotKey, Tier } from './types';
import { cooldown, e3Sets, generalWarmup, mobilityWarmup } from './warmup';

export type { GenerateResult, GeneratorInput, GenProgram, GenSession, GenExercise, GenMessage } from './types';
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
function applyVolume(sessions: DurSession<GenExercise>[], dSec: number, ctx: Ctx, out: GenMessage[]) {
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
          if (estimerDuree(trial) <= dSec && sessionCapsOk(trial) && weekCapsOk(all)) {
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
  // Repos de la paire = le plus long des deux (V-SUP).
  return out.map((e) => {
    if (!e.supersetGroup) return e;
    const rest = Math.max(...out.filter((x) => x.supersetGroup === e.supersetGroup).map((x) => x.restSec));
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
  if (want !== 2 && want !== 3) return { ok: false, code: 'HORS', messages: [msg.hors()] };
  const dc = chooseDays(p.blockedWeekdays ?? [], want);
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
    if (ctx.goalKey === 'cardio' || ctx.goalKey === 'endurance') msgs.push(msg.objCardio());
    if (ctx.goalKey === 'sport') msgs.push(msg.objSport());
  }
  for (const z of ctx.zones) {
    if (z.isG || z.level !== 3) continue;
    if (z.key === 'cou' && ctx.neckShock) msgs.push(msg.c3());
    else msgs.push(msg.r3(z.key));
  }

  const pool = input.fiches.filter((f) => USABLE_STATUTS.includes(f.statut)).sort((a, b) => (a.id < b.id ? -1 : 1));
  const slotList = SLOT_ORDER.filter((s) => s !== 'fonctionnel' || ctx.fonctionnelEnabled);
  const fillWeek = (c: Ctx) => {
    const prev = new Map<SlotKey, Set<string>>();
    const res = new Map<Label, Map<SlotKey, SlotFill>>();
    for (const l of labels) {
      const f = fillSession(l, slotList, c, pool, prev);
      res.set(l, f);
      for (const [slot, fill] of f) if (fill.cand) (prev.get(slot) ?? prev.set(slot, new Set()).get(slot)!).add(fill.cand.fiche.id);
    }
    return res;
  };
  const fills = fillWeek(ctx);
  const healthy = ctx.zones.length > 0;
  const ctxNH = buildCtx(input, { zones: [], pregnant: false });
  const fillsNH = healthy ? fillWeek(ctxNH) : fills;
  const ctxNoL3 = buildCtx(input, { zones: ctx.zones.filter((z) => !z.isG && z.level < 3) });
  const fillsNoL3 = ctx.zones.some((z) => !z.isG && z.level === 3) ? fillWeek(ctxNoL3) : fills;

  // P-ZONE3 : 3 emplacements du noyau ou plus vides (après les replis a-d) à cause de zones au niveau 3 -> aucun programme.
  for (const l of labels) {
    const empty = CORE_SLOTS.filter((s) => fills.get(l)!.get(s)!.tier === 'e' && fillsNoL3.get(l)!.get(s)!.tier !== 'e').length;
    if (empty >= P_ZONE3_MAX_EMPTY_CORE) return { ok: false, code: 'PRO', messages: dedupe([...msgs.filter((m) => m.id === 'R3' || m.id === 'C3'), msg.pro()]) };
  }
  // Tous les emplacements vides pour une cause matériel (impossible avec la bibliothèque du 23/10) -> aucun programme.
  if (labels.every((l) => CORE_SLOTS.every((s) => fills.get(l)!.get(s)!.tier === 'e' && fillsNH.get(l)!.get(s)!.tier === 'e'))) {
    return { ok: false, code: 'IMPOS', messages: [msg.impos('squat', 'A')] };
  }

  // Séances : N emplacements de départ, échauffement, supersets, durée, ajout.
  const durSessions: DurSession<GenExercise>[] = [];
  const meta = new Map<Label, { removedCore: SlotKey[]; overBudget: boolean; attempted: SlotKey[]; warm: ReturnType<typeof mobilityWarmup> }>();
  const general = generalWarmup(ctx);
  for (const l of labels) {
    const f = fills.get(l)!;
    const active = slotList.slice(0, dur.startN);
    const mk = (slot: SlotKey): GenExercise | null => {
      const fill = f.get(slot)!;
      if (!fill.cand) return null;
      const ex = buildExercise(fill.cand, slot, fill.tier, ctx);
      ex.warmupSets = e3Sets(ex, ctx);
      return ex;
    };
    const exercises = active.map(mk).filter((e): e is GenExercise => !!e);
    const mob = mobilityWarmup(ctx, exercises.some((e) => e.slot === 'charniere'));
    let s: DurSession<GenExercise> = { label: l, days: nDays, level: ctx.level, pregnant: ctx.pregnant, exercises, e1Sec: WARMUP.generalSec, e2Count: mob.length };
    if (ctx.gagnerDuTemps) s = formAllPairs(s);
    const adj = ajusterDuree(s, dSec);
    s = adj.session;
    const attempted = [...active];
    if (!adj.actions.length) {
      // Ajout (§4.4) : si T < D - 10 min et N < 8, emplacement suivant tant que T <= D et que les plafonds tiennent.
      for (const slot of slotList) {
        if (attempted.includes(slot)) continue;
        if (s.exercises.length >= VOLUME.maxExercisesPerSession || estimerDuree(s) >= addSec - TIME.addIfUnderMarginSec) break;
        const ex = mk(slot);
        attempted.push(slot);
        if (!ex) continue;
        const trial = { ...s, exercises: [...s.exercises, ex] };
        if (estimerDuree(trial) <= Math.min(dSec, addSec) && sessionCapsOk(trial)) s = trial;
        else break;
      }
    }
    durSessions.push(s);
    meta.set(l, { removedCore: adj.removedCore, overBudget: adj.overBudget, attempted, warm: mob });
  }

  enforcePlaf(durSessions);
  applyVolume(durSessions, dSec, ctx, msgs);

  // Finalisation des séances.
  const sessions: GenSession[] = durSessions.map((s, i) => {
    const m = meta.get(s.label)!;
    const est = estimerDuree(s);
    return {
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
      estimatedMin: Math.ceil(est / 60 / TIME.displayRoundMin) * TIME.displayRoundMin,
      removedCore: m.removedCore,
      overBudget: est > dSec,
    };
  });

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
  for (const s of sessions) {
    const f = fills.get(s.label)!;
    for (const slot of CORE_SLOTS) {
      if (s.removedCore.includes(slot)) continue;
      const fill = f.get(slot)!;
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
    const slot = GG_SLOT[gg];
    let fix: string | null = null;
    if (sessions.some((s) => s.removedCore.includes(slot))) {
      const next = DURATION_STEPS_MIN.find((d) => d > dur.dMin);
      fix = next ? `allonger la séance à ${next} min` : nDays === 2 ? 'ajouter un jour' : null;
    } else if (labels.some((l) => fills.get(l)!.get(slot)!.tier === 'e' && getCause(l, slot).cause === 'materiel')) fix = 'ajouter du matériel';
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

  const explanation = explain(ctx, nDays, coverage, dur, sessions, forceNoLoad);
  const messages = dedupe(msgs);
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

/** Conversion vers le modèle stocké (Program.days / PlannedExercise de src/data/model.ts). */
export function toProgramDays(p: GenProgram): ProgramDay[] {
  return p.sessions.map((s, i) => ({
    dayIndex: i,
    label: `Séance ${s.label}`,
    exercises: s.exercises.map(
      (e): PlannedExercise => ({
        movementId: e.movementId, variantId: e.variantId, sets: e.sets, repsMin: e.repsMin, repsMax: e.repsMax, restSec: e.restSec,
        supersetGroup: e.supersetGroup, rirTarget: e.rirTarget, unit: e.unit, holdSec: e.holdSec, warmupSets: e.warmupSets, role: e.role,
        slot: e.slot, startLoadKg: e.startLoadKg, capped: e.capped, adaptation: e.adaptation, substitut: e.substitut,
      }),
    ),
  }));
}

/** Utilitaire : niveaux de base, pour les tests. */
export const LEVEL_LIST: Level[] = ['debutant', 'intermediaire', 'avance'];
export { units };
