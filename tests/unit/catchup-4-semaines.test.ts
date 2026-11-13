// Simulation du rattrapage sur 4 semaines (zones-musculaires.md §7 et son « Avis kine du 13/11/2026 » ; question de l'utilisateur : « il manque les
// deltoïdes en semaine 1, on rattrape en semaine 2, mais du coup on travaille moins les quadriceps : sur 4 semaines, le retard s'accumule-t-il ? »).
// Scénario : programme de 4 jours (intermédiaire, prise de muscle) ; semaine 1 sans exercice de deltoïdes (zone en retard par construction),
// semaines 2 et 3 : la séance de jambes est sautée ; semaine 4 : tout est fait. À chaque début de semaine le rattrapage est recalculé avec un
// journal local (catchUpLog) qui se remplit comme dans l'appli.
import { describe, expect, it } from 'vitest';
import type { CatchUpLogEntry, ProgramDay, SetLog } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import { CATCHUP } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { makePlaf, splitCapsOk, weekCapsOk } from '../../src/generator/plaf';
import type { GeneratorInput } from '../../src/generator/types';
import { zoneCapsOk } from '../../src/generator/zones-check';
import { withProgramWeek } from '../../src/session/program';
import { addDays } from '../../src/session/missed';
import { zoneCatchUp, genOf, durOf, type CatchUpProfile, type CatchUpResult } from '../../src/zones/catchup';
import { JUMPS } from '../../src/generator/config';
import { sportGate, sportLoad } from '../../src/sport/sport-load';
import { mergeCatchUpLog } from '../../src/zones/catchup-log';
import { capGroupPoints, pointsByZone, thresholdsOf, zoneCaps, zoneCoefs, ZONES, type ZoneFiche } from '../../src/zones/zones';
import { FICHES, mk } from './generator-helpers';

let n = 0;
const set = (movementId: string, sessionId: string): SetLog => ({
  id: `s${n++}`, sessionId, movementId, variantId: 'v', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
  reps: 10, loadKg: null, rir: 2, pain: false, comment: '', completedAt: '2026-11-03T10:00:00.000Z',
} as SetLog);
const doneOf = (days: readonly ProgramDay[], skip: number[] = []): SetLog[] =>
  days.flatMap((d, i) => (skip.includes(i) ? [] : d.exercises.filter((e) => e.role !== 'cardio').flatMap((e) => Array.from({ length: e.sets }, () => set(e.movementId, `d${i}`)))));

const byId = new Map(FICHES.map((f) => [f.id, f as unknown as ZoneFiche]));
const ptsOf = (days: readonly ProgramDay[]) =>
  pointsByZone(days.flatMap((d) => d.exercises.filter((e) => e.role !== 'cardio').map((e) => ({ ficheId: e.movementId, sets: e.sets }))), byId);
const SHOULDER = CATCHUP.shoulderZones;
const LEGS = CATCHUP.swap.noLossZones;

// Scénario AVEC sport : volley, match le samedi, séance habituelle le dimanche ; le rattrapage a lieu le lundi à midi (jambes refusées, épaule chargée).
const SPORT_MONDAY = (() => {
  const load = sportLoad([], [{ sport: 'volley', weekdays: [6], matchWeekday: 5 }], new Date(2026, 10, 9, 12));
  return { gate: sportGate(load, 'intermediaire', JUMPS.startContacts.intermediaire), hasPain: false, shoulderSport: true } as NonNullable<CatchUpProfile['sport']>;
})();
const PROFILES: [string, GeneratorInput, boolean, CatchUpProfile['sport']][] = [
  ['maison élastique', mk({ level: 'intermediaire', days: 4, dur: 60, goal: 'muscle', profile: 'B', place: 'maison' }), false, undefined],
  // 13/11/2026 (lot 4, CAL-20) : avec les 12 nouvelles fiches et les isolations du haut, la maison complète trouve toujours une série à ajouter : le scénario ne force plus d'échange
  // (propriété testée ailleurs : une série en plus est préférée à l'échange, RAT-1). La preuve RAT-6 dans le flux complet est portée par la salle à 45 min (2 échanges mesurés, 4 semaines).
  ['maison complète', mk({ level: 'intermediaire', days: 4, dur: 60, goal: 'muscle', profile: 'E', place: 'maison' }), false, undefined],
  ['salle', mk({ level: 'intermediaire', days: 4, dur: 45, goal: 'muscle', profile: 'F', place: 'salle' }), true, undefined],
  ['salle avec sport (match samedi, séance dimanche)', mk({ level: 'intermediaire', days: 4, dur: 60, goal: 'muscle', profile: 'F', place: 'salle' }), false, SPORT_MONDAY],
];
const SPORT_ZONES = [...CATCHUP.legZones, ...CATCHUP.shoulderLoadZones];

describe.each(PROFILES)('rattrapage sur 4 semaines : %s', (_name, input, expectSwap, sport) => {
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  const ctx = buildCtx(input);
  const durationMin = r.program.durationMin;
  const baseDays = toProgramDays(r.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
  const weekPlan = (w: number): ProgramDay[] => baseDays.map((d) => withProgramWeek(d, w));
  const legPoints = (d: ProgramDay) => LEGS.reduce((a, z) => a + (ptsOf([d])[z] ?? 0), 0);
  const legIdx = baseDays.map((d, i) => ({ i, p: legPoints(d) })).sort((a, b) => b.p - a.p)[0].i;
  // Semaine 1 « construite » sans deltoïdes : les exercices qui travaillent les deltoïdes sont absents du programme prévu (défaut de répartition).
  const noShoulder = (days: ProgramDay[]): ProgramDay[] =>
    days.map((d) => ({ ...d, exercises: d.exercises.filter((e) => SHOULDER.every((z) => (zoneCoefs(byId.get(e.movementId)!).get(z) ?? 0) < 0.5)) }));

  it('aucune zone ne perd de points à cause du rattrapage, plafonds, durée et RAT-1 tenus ; séance manquée = 0 série ; message RAT-3', () => {
    let log: CatchUpLogEntry[] | null = null;
    const results: CatchUpResult[] = [];
    const prevAdded = new Set<string>();
    let swaps = 0;
    const lines: string[] = [];
    // Ce qui a été FAIT chaque semaine : scénario.
    let doneWeek: SetLog[] = doneOf(noShoulder(weekPlan(1)));
    let plannedPrev: ProgramDay[] = noShoulder(weekPlan(1));
    for (let w = 1; w <= 4; w++) {
      const weekKey = addDays('2026-11-02', 7 * w);
      const next = weekPlan(w + 1);
      const res = zoneCatchUp(doneWeek, { days: next, prevDays: plannedPrev, dayIndex: 0, durationMin, weekKey }, {
        ctx, pool: FICHES, repriseActive: false, symptomFrozen: false, painFrozen: () => false, log, sport,
      });
      results.push(res);
      const baseNext = ptsOf(next);
      const after = next.map((d, i) => (i === 0 ? res.day : d));
      const afterPts = ptsOf(after);
      // 1. Aucune zone ne perd de points (quadriceps, fessiers, ischios, mollets compris), échange compris.
      // Les séries en plus n'enlèvent rien. Seul un échange (RAT-6) peut retirer au plus 1 point à une zone déjà au seuil rouge ou au-dessus,
      // 2 points au total, jamais aux jambes (quadriceps, fessiers, ischios, mollets) : la simulation vérifie ces bornes une à une.
      for (const z of LEGS) expect(afterPts[z], `S${w + 1} jambes ${z}`).toBeGreaterThanOrEqual(baseNext[z] - 1e-9);
      const losses = ZONES.map((z) => ({ z: z.id, d: (baseNext[z.id] ?? 0) - (afterPts[z.id] ?? 0) })).filter((x) => x.d > 1e-9);
      if (!res.swapped) expect(losses, `S${w + 1} aucune perte sans échange`).toEqual([]);
      for (const l of losses) {
        const rouge = thresholdsOf(l.z, ctx.goalKey).rouge;
        expect(l.d, `S${w + 1} perte ${l.z}`).toBeLessThanOrEqual(1 + 1e-9);
        expect(baseNext[l.z], `S${w + 1} ${l.z} au rouge avant`).toBeGreaterThanOrEqual(rouge - 1e-9);
        expect(afterPts[l.z], `S${w + 1} ${l.z} reste au rouge`).toBeGreaterThanOrEqual(rouge - 1e-9);
      }
      expect(losses.reduce((a, l) => a + l.d, 0), `S${w + 1} pertes totales`).toBeLessThanOrEqual(2 + 1e-9);
      if (res.swapped) swaps++;
      if (sport) {
        // Zones chargées par le sport (jambes, épaule) : aucune série, aucun échange vers elles, aucun point perdu.
        expect(sport.gate?.legs, 'jambes refusées ce jour-là').not.toBe('ok');
        for (const a of res.added) expect(SPORT_ZONES, `sport : série sur ${a.zone}`).not.toContain(a.zone);
        if (res.swapped) expect(SPORT_ZONES).not.toContain(res.swapped.zone);
        for (const l of losses) expect(SPORT_ZONES, `sport : perte sur ${l.z}`).not.toContain(l.z);
      }
      lines.push(`S${w + 1}: +${res.added.length} échange=${res.swapped ? 1 : 0} signalées=${res.stuck.length}`);
      // 2. Plafonds : 11 / 12 par muscle et par séance (V-PLAF), 20 par semaine, plafonds de zone, durée.
      const gens = (d: ProgramDay) => d.exercises.map((e) => genOf(e, ctx)).filter((e): e is NonNullable<ReturnType<typeof genOf>> => e !== null);
      expect(splitCapsOk(gens(res.day), makePlaf(ctx, 'auto')), `S${w + 1} plafond de séance`).toBe(true);
      expect(weekCapsOk(after.map((d) => ({ exercises: gens(d) }))), `S${w + 1} plafond hebdomadaire`).toBe(true);
      expect(zoneCapsOk(next.map((d) => ({ exercises: gens(d) })), after.map((d) => ({ exercises: gens(d) })), ctx)).toBe(true);
      const before = capGroupPoints(baseNext);
      for (const [g, v] of capGroupPoints(afterPts)) expect(v.points, `S${w + 1} ${g}`).toBeLessThanOrEqual(Math.max(zoneCaps(v.zone).week, before.get(g)!.points));
      expect(durOf(res.day, gens(res.day), ctx), `S${w + 1} durée`).toBeLessThanOrEqual(Math.max(durationMin * 60, durOf(next[0], gens(next[0]), ctx)));
      // 3. RAT-1 : au plus +2 séries et 2 zones (un échange compte 1), +6 min ; épaule : 1 zone et +1 série ; jamais une zone de protection.
      const extra = res.day.exercises.reduce((a, e) => a + e.sets, 0) - next[0].exercises.reduce((a, e) => a + e.sets, 0);
      expect(extra, `S${w + 1} séries en plus`).toBeLessThanOrEqual(CATCHUP.maxExtraSets);
      expect(res.added.length + (res.swapped ? 1 : 0)).toBeLessThanOrEqual(CATCHUP.maxExtraSets);
      expect(new Set([...res.added.map((a) => a.zone), ...(res.swapped ? [res.swapped.zone] : [])]).size).toBeLessThanOrEqual(CATCHUP.maxZones);
      expect(res.added.filter((a) => SHOULDER.includes(a.zone)).length).toBeLessThanOrEqual(CATCHUP.shoulderMaxZones);
      for (const a of res.added) expect(CATCHUP.noZones, `zone de protection ${a.zone}`).not.toContain(a.zone);
      expect(res.day.estimatedMin! * 60 - (next[0].estimatedMin ?? 0) * 60, `S${w + 1} minutes en plus`).toBeLessThanOrEqual(CATCHUP.maxExtraMin * 60 + 5 * 60);
      // 4. RAT-2 : jamais le même exercice deux semaines de suite.
      for (const a of res.added) expect(prevAdded.has(a.movementId), `S${w + 1} ${a.movementId} deux semaines de suite`).toBe(false);
      prevAdded.clear();
      for (const a of res.added) prevAdded.add(a.movementId);
      // 5. RAT-4 : après une séance manquée, aucune série de compensation sur les zones de la séance sautée.
      if (w === 2 || w === 3) {
        const skippedZones = ZONES.filter((z) => legPoints(next[legIdx]) > 0 && (ptsOf([next[legIdx]])[z.id] ?? 0) >= 1).map((z) => z.id);
        for (const a of res.added) expect(skippedZones, `S${w + 1} compensation de ${a.zone}`).not.toContain(a.zone);
        const sw = res.swapped;
        if (sw) expect(skippedZones).not.toContain(sw.zone);
        // Les exercices de la séance sautée (séance du jour 0 ou non) n'ont pas une série de plus.
        for (const e of res.day.exercises) {
          const was = next[0].exercises.find((x) => x.movementId === e.movementId);
          if (was && LEGS.some((z) => (zoneCoefs(byId.get(e.movementId)!).get(z) ?? 0) >= 0.5)) expect(e.sets, `S${w + 1} ${e.movementId}`).toBeLessThanOrEqual(was.sets);
        }
      }
      log = mergeCatchUpLog(log ?? undefined, weekKey, res.log);
      // Scénario de la semaine suivante.
      const planNext = after;
      plannedPrev = planNext;
      const skip = w + 1 === 2 || w + 1 === 3 ? [legIdx] : [];
      doneWeek = doneOf(planNext, skip);
      void thresholdsOf;
    }
    // Semaine 1 : les deltoïdes manquent par construction ; ils sont rattrapés avec au plus 1 série, ou signalés (jamais plus).
    const first = results[0];
    expect(first.low.some((z) => SHOULDER.includes(z.zone))).toBe(true);
    expect(first.added.filter((a) => SHOULDER.includes(a.zone)).length).toBeLessThanOrEqual(1);
    // Semaine 3 (séance de jambes sautée deux semaines de suite) : message RAT-3 pour les zones des jambes, cause « séance manquée », et aucune série.
    const wk3 = results[2];
    const stuckLegs = wk3.stuck.filter((s) => LEGS.includes(s.zone));
    expect(stuckLegs.length, 'RAT-3 : une zone restée basse deux semaines est signalée').toBeGreaterThan(0);
    expect(stuckLegs.some((s) => s.cause === 'manquee' && s.weeks >= 2), 'cause : séance manquée').toBe(true);
    expect(stuckLegs.every((s) => ['manquee', 'materiel', 'plafond', 'protection', 'sport'].includes(s.cause))).toBe(true);
    expect(wk3.added.filter((a) => LEGS.includes(a.zone))).toEqual([]);
    // Semaine 4 : tout fait, les jambes ne sont plus basses (le retard ne s'accumule pas).
    const wk4 = results[3];
    // Les jambes basses en semaine 4 le sont par construction du programme (mêmes points que prévus), jamais par un retard reporté.
    const planned4 = ptsOf(weekPlan(4));
    for (const z of wk4.low.filter((l) => LEGS.includes(l.zone))) expect(z.points, `jambes ${z.zone} : points faits = points prévus`).toBeGreaterThanOrEqual((planned4[z.zone] ?? 0) - 1e-9);
    expect(wk4.log.filter((l) => LEGS.includes(l.zone) && l.cause === 'manquee'), 'plus aucune séance manquée en semaine 4').toEqual([]);
    expect(wk4.stuck.filter((s) => s.cause === 'manquee')).toEqual([]);
    // Le journal reste court (4 semaines au plus) et sans donnée de santé.
    // Preuve RAT-6 dans le flux complet : au moins un échange a eu lieu (profils sans sport) et ses points ont été vérifiés zone par zone ci-dessus.
    if (expectSwap) expect(swaps, 'un échange forcé par ce scénario').toBeGreaterThan(0);
    expect(new Set((log ?? []).map((l) => l.week)).size).toBeLessThanOrEqual(CATCHUP.logWeeks);
    for (const l of log ?? []) expect(Object.keys(l).every((k) => ['week', 'zone', 'movementId', 'cause'].includes(k))).toBe(true);
  });
});
