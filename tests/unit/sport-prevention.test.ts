// « Mon sport » A2 (saisie-sport-v1.md §9, avis kiné du 13/11/2026) : prévention du sport en exercices dans les séances de force du programme.
import { describe, expect, it } from 'vitest';
import type { SportPlanEntry } from '../../src/data/model';
import { generateProgram } from '../../src/generator';
import { buildCtx } from '../../src/generator/context';
import { weekCapFor, weekMusclesOf, weekVol } from '../../src/generator/plaf';
import { PREVENTION_LISTS } from '../../src/generator/sport-prevention';
import { CAL11 } from '../../src/generator/config';
import { mk, type MkOpts } from './generator-helpers';

const ALL_IDS = new Set(Object.values(PREVENTION_LISTS).flat().map((x) => x.id));
const gen = (o: MkOpts, plan: SportPlanEntry[]) => {
  const input = mk({ goal: 'muscle', dur: 60, days: 4, level: 'intermediaire', profile: 'F', place: 'salle', ...o });
  input.profile.sportPlan = plan;
  const r = generateProgram(input);
  return { input, r };
};
const prevOf = (s: { exercises: readonly { slot: string; ficheId: string; cappedLabel?: string | null | undefined }[] }) => s.exercises.filter((e) => ALL_IDS.has(e.ficheId) && (e.slot === 'prevention_sport' || e.cappedLabel === CAL11.stopMessage));

describe('A2 : prévention du sport en exercices', () => {
  it('volley (mardi ; match samedi, ou sans match) : 1 à 2 exercices par séance, 2 séries, dose fixe, liste fermée, jamais le jour ou la veille du match', () => {
    let seen = 0;
    for (const [level, plan] of [['intermediaire', [{ sport: 'volley', weekdays: [1] }]], ['avance', [{ sport: 'volley', weekdays: [1], matchWeekday: 5 }]], ['avance', [{ sport: 'volley', weekdays: [1] }]]] as const) {
      const { input, r } = gen({ level, profile: 'D', place: 'maison', days: 4 }, plan as unknown as SportPlanEntry[]);
      expect(r.ok, level).toBe(true);
      if (!r.ok) continue;
      const ctx = buildCtx(input);
      for (const s of r.program.sessions) {
        const p = prevOf(s);
        expect(p.length, `${s.label}`).toBeLessThanOrEqual(2);
        if ((plan as unknown as readonly SportPlanEntry[]).some((x) => x.matchWeekday === 5) && (s.weekday === 4 || s.weekday === 5)) expect(p, `veille / jour de match ${s.weekday}`).toEqual([]);
        for (const e of p as never as { ficheId: string; sets: number; capped: boolean; slot: string }[]) {
          seen++;
          expect(e.sets).toBeLessThanOrEqual(2);
          expect(e.capped).toBe(true);
          expect(['nordique-ischios', 'nordique-ischios-court']).not.toContain(e.ficheId);
          if (e.slot === 'prevention_sport') expect(s.exercises[0].slot, `${s.label} : entrée de séance`).toBe('prevention_sport');
        }
      }
      for (const m of weekMusclesOf(r.program.sessions)) expect(r.program.sessions.reduce((a, s) => a + weekVol(s, m), 0), `${level} ${m}`).toBeLessThanOrEqual(weekCapFor(ctx, m));
    }
    expect(seen).toBeGreaterThan(0);
  }, 200_000);

  it('aucune prévention : débutant, grossesse, sport « autre », sans sport, reprise', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', weekdays: [1, 3], matchWeekday: 5 }];
    const CASES: [string, MkOpts, SportPlanEntry[]][] = [
      ['débutant', { level: 'debutant' }, plan], ['grossesse', { preg: 'enceinte' }, plan], ['autre', {}, [{ sport: 'autre', name: 'escalade', weekdays: [1, 3] }]],
      ['sans sport', {}, []], ['reprise', { options: { repriseActive: true } }, plan],
    ];
    for (const [name, o, p] of CASES) {
      const { r } = gen(o, p);
      if (!r.ok) continue;
      for (const s of r.program.sessions) expect(prevOf(s), `${name} ${s.label}`).toEqual([]);
    }
  }, 200_000);

  it('raquettes : le texte « prévention inspirée d\'autres sports… » accompagne toute prévention placée ; sinon rien', () => {
    const { r } = gen({}, [{ sport: 'raquette', weekdays: [1, 3] }]);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const placed = r.program.sessions.some((s) => prevOf(s).length > 0);
    const text = r.program.messages.some((m) => m.id === 'V-MSG-SPORT-PREV' && /non démontrée pour le tennis/.test(m.text));
    expect(text).toBe(placed);
    const foot = gen({}, [{ sport: 'foot', weekdays: [1, 3] }]);
    if (foot.r.ok) expect(foot.r.program.messages.some((m) => m.id === 'V-MSG-SPORT-PREV')).toBe(false);
  }, 200_000);

  it('copenhague-court : jamais dans les 48 h avant ou après un match', () => {
    for (const match of [2, 5]) {
      const { r } = gen({ days: 5 }, [{ sport: 'foot', weekdays: [1], matchWeekday: match }]);
      if (!r.ok) continue;
      for (const s of r.program.sessions) {
        const near = [0, 1, 2].some((k) => (match + k) % 7 === s.weekday) || [1, 2].some((k) => (match - k + 7) % 7 === s.weekday);
        if (near) expect(s.exercises.map((e) => e.ficheId), `${s.label} jour ${s.weekday} / match ${match}`).not.toContain('copenhague-court');
      }
    }
  }, 200_000);
});
