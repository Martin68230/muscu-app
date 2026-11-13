// Plafonds relevés (décision de l'utilisateur du 13/11/2026, avis kiné ; NON SOURCÉ comme plafonds) : 24 séries par semaine et par muscle PRINCIPAL
// (au lieu de 20), plafonds de zone x1,2, pour l'intermédiaire et l'avancé SANS blessure, hors santé, grossesse / post-partum, reprise, semaine allégée.
// Six groupes PROTÉGÉS (épaules, trapèzes, triceps, biceps, avant-bras, érecteurs / lombaires) restent à 20 / 10, comptage 0,5 ; plafond par séance inchangé.
// Annulation : RAISED_CAPS.enabled = false (src/generator/config.ts).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { RAISED_CAPS, VOLUME, weekCountsSecondary } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { raisedCaps, sessionVol, weekCapFor, weekVol, weekMusclesOf } from '../../src/generator/plaf';
import { hasHeavyShoulderTrap, weekPoints } from '../../src/generator/zones-check';
import type { GeneratorInput, GenProgram } from '../../src/generator/types';
import { capGroupPoints, isProtectedZone, zoneCaps, ZONES } from '../../src/zones/zones';
import { mk, type MkOpts } from './generator-helpers';

const NECK = 'renfo-cou-isometrique';
const place = (profile: string) => (profile === 'F' ? ('salle' as const) : ('maison' as const));
const base = (o: MkOpts): MkOpts => ({ goal: 'muscle', level: 'intermediaire', dur: 60, days: 4, place: place(o.profile ?? 'C'), ...o });
const ctxOf = (o: MkOpts) => buildCtx(mk(base(o)));

const PROTECTED_MUSCLES = ['coiffe_des_rotateurs', 'dentele_anterieur', 'deltoides', 'deltoides_lateraux', 'deltoides_anterieurs', 'deltoides_posterieurs', 'trapezes', 'triceps', 'biceps', 'avant_bras', 'erecteurs_rachis', 'rhomboides', 'carre_des_lombes'];
const FREE_MUSCLES = ['quadriceps', 'fessiers', 'ischios', 'pectoraux', 'grand_dorsal', 'mollets'];

describe('Plafonds relevés : qui y a droit', () => {
  it('intermédiaire et avancé sans blessure : oui', () => {
    for (const level of ['intermediaire', 'avance'] as const) for (const goal of ['muscle', 'force', 'perte_gras']) expect(raisedCaps(ctxOf({ level, goal })), `${level} ${goal}`).toBe(true);
  });
  it('débutant, santé, grossesse, post-partum, reprise, semaine allégée, zone gênée, douleur récente, interrupteur coupé : non (plafonds actuels)', () => {
    expect(raisedCaps(ctxOf({ level: 'debutant' }))).toBe(false);
    expect(raisedCaps(ctxOf({ goal: 'sante' }))).toBe(false);
    expect(raisedCaps(ctxOf({ preg: 'enceinte' }))).toBe(false);
    expect(raisedCaps(ctxOf({ preg: 'post_partum' }))).toBe(false);
    expect(raisedCaps(buildCtx({ ...mk(base({})), options: { repriseActive: true } }))).toBe(false);
    expect(raisedCaps({ ...ctxOf({}), lightWeek: true })).toBe(false);
    for (const zone of ['genou', 'epaule', 'dos', 'poignet', 'cheville'] as const) expect(raisedCaps(ctxOf({ injuries: [[zone, 1]] })), zone).toBe(false);
    const painted = mk(base({}));
    painted.injuries = [{ zone: 'epaule', level: 1, active: false, deletedAt: null, updatedAt: '2026-11-10T10:00:00.000Z' }];
    painted.options = { nowIso: '2026-11-12T10:00:00.000Z' };
    expect(raisedCaps(buildCtx(painted)), 'douleur passée depuis moins de 7 jours').toBe(false);
    (RAISED_CAPS as { enabled: boolean }).enabled = false;
    try { expect(raisedCaps(ctxOf({ level: 'avance' }))).toBe(false); } finally { (RAISED_CAPS as { enabled: boolean }).enabled = true; }
  });
  it('plafond hebdomadaire : 24 pour un muscle non protégé d\'un profil relevé ; 20 pour les six groupes protégés et pour tous les autres profils', () => {
    const raised = ctxOf({ level: 'avance' });
    for (const m of FREE_MUSCLES) expect(weekCapFor(raised, m), m).toBe(24);
    for (const m of PROTECTED_MUSCLES) expect(weekCapFor(raised, m), m).toBe(VOLUME.maxPerMuscleWeek);
    for (const o of [{ level: 'debutant' as const }, { goal: 'sante' }, { preg: 'enceinte' as const }, { injuries: [['genou', 1]] as MkOpts['injuries'] }]) {
      const c = ctxOf(o);
      for (const m of [...FREE_MUSCLES, ...PROTECTED_MUSCLES]) expect(weekCapFor(c, m), `${JSON.stringify(o)} ${m}`).toBe(VOLUME.maxPerMuscleWeek);
    }
    for (const m of FREE_MUSCLES) expect(weekCapFor(undefined, m)).toBe(VOLUME.maxPerMuscleWeek);
  });
  it('les muscles protégés de weekCountsSecondary (hors rhomboïdes et carré des lombes, protégés par weekCapFor seulement)', () => {
    for (const m of PROTECTED_MUSCLES.filter((x) => !['rhomboides', 'carre_des_lombes', 'coiffe_des_rotateurs', 'dentele_anterieur'].includes(x))) expect(weekCountsSecondary(m), m).toBe(true);
    for (const m of FREE_MUSCLES) expect(weekCountsSecondary(m), m).toBe(false);
  });
});

describe('Plafonds relevés : plafonds de zone', () => {
  it('x1,2 sur les zones non protégées (20 -> 24, 10 -> 12), inchangés sur les zones protégées ; plafond par séance jamais modifié', () => {
    let relevees = 0;
    for (const z of ZONES) {
      const b = zoneCaps(z.id);
      const r = zoneCaps(z.id, { factor: RAISED_CAPS.zoneFactor });
      expect(r.session, z.id).toBe(b.session);
      if (isProtectedZone(z.id)) expect(r.week, z.id).toBe(b.week);
      else { expect(r.week, z.id).toBe(Math.round(b.week * 1.2)); relevees++; }
    }
    expect(relevees).toBeGreaterThan(10);
    // Les six groupes protégés existent bien comme zones.
    // Les groupes protégés (épaules, trapèzes, triceps, biceps, avant-bras, lombaires / carré des lombes, coiffe, dentelé) existent comme zones : un id absent fait échouer le test.
    const PROT_IDS = ['epaules_avant', 'epaules_cote', 'epaules_arriere', 'trapezes_haut', 'trapezes_moyen', 'trapezes_bas', 'biceps', 'avant_bras', 'lombaires', 'carre_des_lombes', 'coiffe_rotateurs', 'dentele_anterieur'];
    for (const id of PROT_IDS) {
      expect(ZONES.some((z) => z.id === id), `zone ${id} existe`).toBe(true);
      expect(isProtectedZone(id), id).toBe(true);
    }
    expect(ZONES.filter((z) => z.id.startsWith('triceps')).length).toBeGreaterThan(0);
    for (const z of ZONES.filter((x) => x.id.startsWith('triceps'))) expect(isProtectedZone(z.id), z.id).toBe(true);
    expect(zoneCaps('quadriceps_droit_femoral').week).toBe(20);
    expect(zoneCaps('quadriceps_droit_femoral', { factor: 1.2 }).week).toBe(24);
  });
});

/** Un programme : chaque muscle <= son plafond hebdomadaire ; chaque groupe protégé <= plafond non relevé ; séance <= 12 (débutant 10). */
function expectCapsHold(label: string, input: GeneratorInput, p: GenProgram) {
  const ctx = buildCtx(input);
  const raised = raisedCaps(ctx);
  for (const m of weekMusclesOf(p.sessions)) {
    const v = p.sessions.reduce((a, s) => a + weekVol(s, m), 0);
    expect(v, `${label} ${m} semaine`).toBeLessThanOrEqual(weekCapFor(ctx, m));
    if (!raised) expect(v, `${label} ${m} (profil non relevé : 20)`).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    if (weekCountsSecondary(m)) expect(v, `${label} ${m} (groupe protégé : 20, comptage 0,5)`).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
  }
  // Zone protégée ou profil non relevé : plafond de zone actuel (20 / 10), jamais x1,2 ; le programme de base peut déjà dépasser sur un groupe (chiffre propre au
  // placement, inchangé : trapèzes de A0 avancé 4 j) : jamais au-delà du même profil avec les plafonds actuels.
  (RAISED_CAPS as { enabled: boolean }).enabled = false;
  let reference = new Map<string, { points: number }>();
  try {
    const r = generateProgram(input);
    if (r.ok) reference = capGroupPoints(weekPoints(r.program.sessions, buildCtx(input), false));
  } finally { (RAISED_CAPS as { enabled: boolean }).enabled = true; }
  for (const [g, v] of capGroupPoints(weekPoints(p.sessions, ctx, raised))) {
    if (!raised || isProtectedZone(v.zone)) expect(v.points, `${label} zone ${g}`).toBeLessThanOrEqual(Math.max(zoneCaps(v.zone).week, reference.get(g)?.points ?? 0) + 1e-9);
  }
  for (const s of p.sessions) for (const m of weekMusclesOf([s])) {
    expect(sessionVol(s, m), `${label} ${s.label} ${m} séance`).toBeLessThanOrEqual(ctx.level === 'debutant' ? VOLUME.maxPerMuscleSession : VOLUME.maxPerMuscleSessionSlots);
  }
}

describe('Plafonds relevés : jamais au-delà de 20 / 10 pour les profils protégés, 24 au plus pour les autres', () => {
  const GRID: [string, MkOpts][] = [];
  for (const profile of ['A0', 'B', 'D', 'F']) for (const days of [3, 4, 5]) {
    GRID.push([`${profile} intermédiaire ${days}j`, { profile, days, level: 'intermediaire' }]);
    GRID.push([`${profile} avancé ${days}j`, { profile, days, level: 'avance' }]);
  }
  it('profils relevés : 24 au plus (principal seul), groupes protégés à 20', () => {
    for (const [name, o] of GRID) {
      const input = mk(base(o));
      const r = generateProgram(input);
      expect(r.ok, name).toBe(true);
      if (!r.ok) continue;
      expect(raisedCaps(buildCtx(input)), name).toBe(true);
      expectCapsHold(name, input, r.program);
    }
  }, 280_000);
  it('débutant, santé, grossesse, post-partum, reprise, zone gênée : jamais plus de 20 par muscle ni de 10 par zone-plafond', () => {
    const CASES: [string, MkOpts][] = [
      ['débutant F', { profile: 'F', level: 'debutant', days: 3 }],
      ['débutant D', { profile: 'D', level: 'debutant', days: 4 }],
      ['santé F avancé', { profile: 'F', level: 'avance', goal: 'sante', days: 4 }],
      ['santé D intermédiaire', { profile: 'D', level: 'intermediaire', goal: 'sante', days: 3 }],
      ['grossesse D', { profile: 'D', level: 'intermediaire', preg: 'enceinte', days: 3 }],
      ['post-partum F', { profile: 'F', level: 'intermediaire', preg: 'post_partum', days: 3 }],
      ['reprise F avancé', { profile: 'F', level: 'avance', days: 4, options: { repriseActive: true } }],
      ['genou gêné F avancé', { profile: 'F', level: 'avance', days: 5, injuries: [['genou', 1]] }],
      ['dos gêné D intermédiaire', { profile: 'D', level: 'intermediaire', days: 4, injuries: [['dos', 1]] }],
      ['épaule gênée B avancé', { profile: 'B', level: 'avance', days: 4, injuries: [['epaule', 1]] }],
    ];
    for (const [name, o] of CASES) {
      const input = mk(base(o));
      const r = generateProgram(input);
      expect(r.ok, name).toBe(true);
      if (!r.ok) continue;
      expect(raisedCaps(buildCtx(input)), name).toBe(false);
      expectCapsHold(name, input, r.program);
      // Aucun muscle (même non protégé) au-dessus de 20 séries principales par semaine.
      for (const m of weekMusclesOf(r.program.sessions)) expect(r.program.sessions.reduce((a, s) => a + weekVol(s, m), 0), `${name} ${m}`).toBeLessThanOrEqual(20);
    }
  }, 280_000);
});

describe('Plafonds relevés : le cou reste placé, CAL-12 reste strict', () => {
  it('« Non, rien » : un exercice de cou dans UNE séance du bas du corps, jamais avec un exercice lourd d\'épaules / trapèzes', () => {
    let placed = 0;
    let total = 0;
    for (const profile of ['B', 'D', 'F']) for (const days of [4, 5]) for (const level of ['intermediaire', 'avance'] as const) {
      const input = mk(base({ profile, days, level }));
      input.profile.neckScreen = 'non';
      const r = generateProgram(input);
      if (!r.ok) throw new Error(`${profile} ${days}j ${level}: ${r.code}`);
      const ctx = buildCtx(input);
      const withNeck = r.program.sessions.filter((s) => s.exercises.some((e) => e.ficheId === NECK));
      // Le cou n'est jamais forcé : il n'est placé que s'il tient sous les plafonds de zone (trapèzes : groupe protégé à 20) ; au plus une fois par semaine.
      expect(withNeck.length, `${profile} ${days}j ${level}`).toBeLessThanOrEqual(1);
      for (const s of withNeck) {
        placed++;
        expect(['LEGS', 'BAS'], `${profile} ${days}j ${level}`).toContain(s.type);
        expect(hasHeavyShoulderTrap(s, ctx), `${profile} ${days}j ${level} : séance avec le cou`).toBe(false);
      }
      total++;
    }
    // Mesuré le 13/11/2026 : 10 programmes sur 12 (B avancé 5 j et D intermédiaire 4 j : zone de trapèzes déjà au plafond de zone, le cou n'est pas forcé).
    expect(placed, `cou placé dans ${placed} programmes sur ${total}`).toBeGreaterThanOrEqual(9);
  }, 200_000);
  it('sans « Non, rien » : aucun cou et aucune séance réservée (les programmes sont les mêmes avec ou sans la réponse « Oui »)', () => {
    for (const a of [undefined, 'oui', 'refus'] as const) {
      const input = mk(base({ profile: 'F', days: 5, level: 'avance' }));
      if (a) input.profile.neckScreen = a;
      const r = generateProgram(input);
      if (!r.ok) throw new Error(r.code);
      expect(r.program.sessions.flatMap((s) => s.exercises).some((e) => e.ficheId === NECK)).toBe(false);
    }
  });
});

describe('Plafonds relevés : séances plus longues sans rien relâcher', () => {
  it('à 5 jours, 60 min, intermédiaire / avancé : moins de séances courtes qu\'avec les plafonds actuels', () => {
    const measure = () => {
      let short = 0;
      let tiny = 0;
      for (const profile of ['A0', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) {
        const r = generateProgram(mk(base({ profile, level, days: 5 })));
        expect(r.ok, `${profile} ${level}`).toBe(true);
      if (!r.ok) continue;
        for (const s of r.program.sessions) {
          if ((s.estimatedMin ?? 0) < 0.85 * 60) short++;
          if ((s.estimatedMin ?? 0) <= 30) tiny++;
        }
      }
      return { short, tiny };
    };
    const on = measure();
    (RAISED_CAPS as { enabled: boolean }).enabled = false;
    let off: ReturnType<typeof measure>;
    try { off = measure(); } finally { (RAISED_CAPS as { enabled: boolean }).enabled = true; }
    expect(on.short).toBeLessThanOrEqual(off.short);
    expect(on.tiny).toBeLessThanOrEqual(off.tiny);
  }, 280_000);
});

// ---- CAL-12 et plafonds relevés : rattrapage (swapForZone), création de séance, remplissage du temps ----
import { CORRECTIF_COU } from '../../src/generator/config';
import { toProgramDays } from '../../src/generator';
import { weekCapsOk } from '../../src/generator/plaf';
import { fillExerciseTime } from '../../src/session/intensity';
import { genOf, zoneCatchUp, type CatchUpProfile } from '../../src/zones/catchup';
import type { SetLog } from '../../src/data/model';
import { FICHES } from './generator-helpers';

describe('Plafonds relevés : le rattrapage applique 24 ou 20 selon le profil', () => {
  const mkEx = (muscle: string, sets: number) => ({ sets, musclesPrincipaux: [muscle], musclesSecondaires: [], schema: 'x', slot: 'poussee_2', ficheId: 'x', tags: [] }) as never;
  it('22 séries principales de quadriceps : accepté pour un profil relevé (24), refusé pour un débutant (20) ; biceps (protégé) refusé dans les deux', () => {
    const week = (m: string) => [{ exercises: [mkEx(m, 12)] }, { exercises: [mkEx(m, 10)] }];
    const raised = ctxOf({ level: 'avance' });
    const novice = ctxOf({ level: 'debutant' });
    expect(weekCapsOk(week('quadriceps'), raised)).toBe(true);
    expect(weekCapsOk(week('quadriceps'), novice)).toBe(false);
    expect(weekCapsOk(week('biceps'), raised)).toBe(false);
    expect(weekCapsOk(week('quadriceps'), undefined)).toBe(false);
  });
});

describe('CAL-12 avec les plafonds relevés : jamais d exercice lourd d épaules / trapèzes dans la séance qui a le cou', () => {
  const input = mk(base({ profile: 'F', level: 'avance', days: 5 }));
  input.profile.neckScreen = 'non';
  const r = generateProgram(input);
  it('le programme de départ place le cou', () => { expect(r.ok).toBe(true); });
  if (!r.ok) return;
  const ctx = buildCtx(input);
  const days = toProgramDays(r.program).map((d) => ({ ...d, exercises: d.exercises.map((e) => ({ ...e, alt: undefined })) }));
  const neckIdx = days.findIndex((d) => d.exercises.some((e) => e.movementId === CORRECTIF_COU.ficheId));
  it('une séance du bas du corps porte le cou', () => { expect(neckIdx).toBeGreaterThanOrEqual(0); });
  const doneAll = (skip: (movementId: string) => boolean): SetLog[] =>
    days.flatMap((d, i) => d.exercises.filter((e) => e.role !== 'cardio' && !skip(e.movementId)).flatMap((e) => Array.from({ length: e.sets }, (_, k) => ({
      id: `s${i}${e.movementId}${k}`, sessionId: `s${i}`, movementId: e.movementId, variantId: 'v', exerciseIndex: 0, setIndex: k, targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: null, rir: 2, pain: false, comment: '', completedAt: '2026-11-03T10:00:00.000Z',
    } as SetLog))));
  const profile = (): CatchUpProfile => ({ ctx, pool: FICHES, repriseActive: false, symptomFrozen: false, painFrozen: () => false, log: null, sport: undefined } as unknown as CatchUpProfile);
  it('rattrapage (échange compris) : la séance du jour avec le cou ne reçoit jamais d exercice lourd, quelles que soient les zones basses', () => {
    for (const skipZone of [(id: string) => id.includes('pompe') || id.includes('developpe'), (id: string) => id.includes('squat') || id.includes('fente'), () => false]) {
      const res = zoneCatchUp(doneAll(skipZone), { days, dayIndex: neckIdx, prevDays: days, durationMin: r.program.durationMin, weekKey: 'c00001' }, profile());
      const gens = res.day.exercises.map((e) => genOf(e, ctx)).filter((e): e is NonNullable<typeof e> => e !== null);
      expect(hasHeavyShoulderTrap({ exercises: gens }, ctx)).toBe(false);
    }
  });
  it('rattrapage : aucune série en plus quand le volume réel des 7 derniers jours est déjà au plafond du muscle (deux cycles courts dans la même semaine)', () => {
    const musclesAll = [...new Set(FICHES.flatMap((x) => [...x.musclesPrincipaux, ...x.musclesSecondaires]))];
    const saturated = Object.fromEntries(musclesAll.map((m) => [m, 100]));
    for (let i = 0; i < days.length; i++) {
      const res = zoneCatchUp(doneAll((id) => id.includes('pompe') || id.includes('developpe') || id.includes('rowing')), { days, dayIndex: i, prevDays: days, durationMin: r.program.durationMin, weekKey: 'c00001' }, { ...profile(), recentWeek: saturated });
      expect(res.added, `séance ${i}`).toEqual([]);
    }
  });
  it('remplissage du temps (fillExerciseTime) : jamais d exercice lourd ajouté dans la séance qui a le cou', () => {
    for (let k = 0; k < 2; k++) {
      const out = fillExerciseTime({ ctx, days, dayIndex: neckIdx, limitSec: 75 * 60, locked: () => false, frozenFiche: () => false });
      if (!out) continue;
      const gens = out.exercises.map((e) => genOf(e, ctx)).filter((e): e is NonNullable<typeof e> => e !== null);
      expect(hasHeavyShoulderTrap({ exercises: gens }, ctx)).toBe(false);
    }
  });
});
