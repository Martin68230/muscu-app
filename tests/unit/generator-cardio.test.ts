// Cardio dans le générateur (B4). Règles : knowledge/cardio-regles.md (§3.2 séances dédiées, §3.3 durées, §3.4 blocs,
// §3.5 progression, §4 types, §5 sauts / grossesse / post-partum / blessures, §7 explication, §9bis textes T0-T7) et
// knowledge/goal-resolver.md (règle 5 : budget de temps ; règle 6 : explication de 2 lignes).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram, isCardioDay, toProgramDays } from '../../src/generator';
import { chooseCardio, chooseCardioDays, weekPlan } from '../../src/generator/cardio';
import { buildCtx } from '../../src/generator/context';
import { CARDIO } from '../../src/generator/config';
import { CARDIO_TEXT } from '../../src/generator/messages';
import type { CardioItem, GeneratorInput, GenProgram } from '../../src/generator/types';
import { FICHES, mk, msgIds, type MkOpts } from './generator-helpers';

const withGoals = (o: MkOpts, goals: string[]): GeneratorInput => {
  const input = mk(o);
  input.goals = goals.map((g, i) => ({ goalKey: g, rank: i + 1 }));
  return input;
};
const run = (o: MkOpts, goals: string[]) => generateProgram(withGoals(o, goals));
const ok = (r: ReturnType<typeof generateProgram>): GenProgram => {
  if (!r.ok) throw new Error(`programme attendu, reçu ${r.code}`);
  return r.program;
};
const blocksOf = (p: GenProgram) => p.sessions.map((s) => s.cardio).filter((c): c is CardioItem => !!c);
const cardioItems = (p: GenProgram): CardioItem[] => [...blocksOf(p), ...(p.cardioSessions ?? []).map((c) => c.cardio)];
const without = (...ids: string[]) => FICHES.filter((f) => !ids.includes(f.id));
const ALLOWED = CARDIO.types.map((t) => t.variantId);
/** §5 : aucun saut, aucune corde, aucune course tant que Q5-Q6 ne sont pas décidées (variantes de la bibliothèque à exclure). */
const FORBIDDEN = ['jumping-jacks-saut', 'montees-genoux-course', 'pas-chasses-rapides', 'mountain-climbers-rapide', 'marche-rapide-alternee'];

describe('Cardio principal : séances dédiées selon N (cardio-regles.md §3.2)', () => {
  it('§3.2 : N = 2 -> 2 séances de musculation + un bloc après chacune ; N = 3, 4, 5, 6 -> 1, 2, 3, 3 séances dédiées (intermédiaire)', () => {
    const expected: Record<number, [number, number]> = { 3: [2, 1], 4: [2, 2], 5: [2, 3], 6: [3, 3] };
    const p2 = ok(run({ days: 2, level: 'intermediaire' }, ['cardio']));
    expect(p2.sessions).toHaveLength(2);
    expect(p2.cardioSessions).toHaveLength(0);
    expect(blocksOf(p2)).toHaveLength(2);
    for (const [n, [muscu, ded]] of Object.entries(expected)) {
      const p = ok(run({ days: Number(n), level: 'intermediaire' }, ['cardio']));
      expect(p.sessions, `N=${n}`).toHaveLength(muscu);
      expect(p.cardioSessions, `N=${n}`).toHaveLength(ded);
      expect(blocksOf(p)).toHaveLength(0);
    }
  });

  it('§3.2 : débutant plafonné à 2 séances dédiées ; jamais plus de N jours ; jamais deux séances le même jour (3.1 point 1)', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as const)
      for (const days of [2, 3, 4, 5, 6]) {
        const p = ok(run({ days, level }, ['cardio']));
        const ded = p.cardioSessions ?? [];
        if (level === 'debutant') expect(ded.length).toBeLessThanOrEqual(CARDIO.maxDedicated.debutant);
        expect(ded.length).toBeLessThanOrEqual(CARDIO.maxDedicated[level]);
        const weekdays = [...p.sessions.map((s) => s.weekday), ...ded.map((c) => c.weekday)];
        expect(weekdays.length).toBeLessThanOrEqual(days);
        expect(new Set(weekdays).size).toBe(weekdays.length);
      }
  });

  it('§3.2 : jours bloqués respectés ; moins de jours libres que prévu -> V-MSG-CARDIO-JOURS, aucune séance double', () => {
    const p = ok(run({ days: 6, level: 'avance', blocked: [1, 3, 5, 6] }, ['cardio']));
    const all = toProgramDays(p).map((d) => d.weekday!);
    expect(all.some((d) => [1, 3, 5, 6].includes(d))).toBe(false);
    expect(new Set(all).size).toBe(all.length);
    expect(msgIds(p)).toContain('V-MSG-CARDIO-JOURS');
  });

  it('§3.2 placement : de préférence pas la veille d\'une séance de musculation', () => {
    expect(chooseCardioDays([], [0, 3], 2)).toEqual([1, 4]);
    expect(chooseCardioDays([], [0, 3], 2).some((d) => [6, 2].includes(d))).toBe(false);
    expect(chooseCardioDays([1, 2, 4, 5], [0, 3], 2)).toEqual([6]);
  });

  // D25 : le cardio secondaire suit la répartition par N (STR-REP-7) : 4 jours = haut / bas, plus « HORS ».
  it('cardio principal : 1 jour ou 7 jours -> V-MSG-HORS ; cardio secondaire à 4 jours : haut / bas (D25, STR-REP-7)', () => {
    expect(run({ days: 1 }, ['cardio'])).toMatchObject({ ok: false, code: 'HORS' });
    expect(run({ days: 7 }, ['cardio'])).toMatchObject({ ok: false, code: 'HORS' });
    expect(ok(run({ days: 4 }, ['muscle', 'cardio'])).split).toBe('haut_bas');
  });

  it('cardio principal : musculation corps entier en famille sante (goal-resolver.md : 2 séances de renfo, volume modéré)', () => {
    const p = ok(run({ days: 4 }, ['cardio', 'muscle']));
    expect(p.family).toBe('sante');
    expect(p.cardioRole).toBe('principal');
  });
});

describe('Durées (cardio-regles.md §3.3, §3.4, §3.5)', () => {
  it('§3.3 / §6.1-6.3 : séance dédiée de départ 20 min (débutant), 30 min (intermédiaire, avancé), jamais plus que D', () => {
    for (const [level, min] of [['debutant', 20], ['intermediaire', 30], ['avance', 30]] as const) {
      const p = ok(run({ days: 3, level, dur: 60 }, ['cardio']));
      expect(p.cardioSessions![0].cardio.minutes).toBe(min);
      expect(Math.max(...p.cardioSessions![0].cardio.weekMin)).toBeLessThanOrEqual(CARDIO.dedicatedMaxMin[level]);
    }
    const p20 = ok(run({ days: 3, level: 'avance', dur: 20 }, ['cardio']));
    expect(Math.max(...p20.cardioSessions![0].cardio.weekMin)).toBeLessThanOrEqual(20);
  });

  it('§3.4 : bloc de 10 min au départ, plafond du niveau (15 / 20 / 25 min), jamais sous 10 min', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as const) {
      const p = ok(run({ days: 2, level, dur: 75 }, ['cardio']));
      for (const b of blocksOf(p)) {
        expect(b.minutes).toBe(CARDIO.blockStartMin);
        expect(b.capMin).toBeLessThanOrEqual(CARDIO.blockMaxMin[level]);
        // D25 (§3.4 f) : le 2e bloc d'un débutant n'existe qu'à partir de la semaine 3 (0 avant).
        expect(Math.min(...b.weekMin.filter((_, i) => !b.fromWeek || i + 1 >= b.fromWeek))).toBeGreaterThanOrEqual(CARDIO.blockMinMin);
      }
    }
  });

  it('§3.5 : +10 % au plus par semaine (arrondi vers le bas), plafond, 4e semaine allégée de 30 %, garde-fou 110 %', () => {
    expect(weekPlan(20, 40, 10, 4, true)).toEqual([20, 22, 24, 16]);
    expect(weekPlan(30, 45, 10, 4, true)).toEqual([30, 33, 36, 25]);
    expect(weekPlan(10, 11, 10, 4, true)).toEqual([10, 11, 11, 10]);
    expect(weekPlan(20, 40, 10, 4, false)).toEqual([20, 20, 20, 14]);
    for (const [s, c] of [[20, 40], [30, 60], [10, 25], [13, 14]]) {
      const w = weekPlan(s, c, 10, 4, true);
      for (let i = 1; i < w.length; i++) expect(w[i]).toBeLessThanOrEqual(Math.floor(Math.max(...w.slice(0, i)) * 1.1));
      expect(Math.max(...w)).toBeLessThanOrEqual(c);
    }
  });
});

describe('Cardio secondaire : bloc court après la musculation (§3.4, goal-resolver.md règle 5)', () => {
  it('§3.4 (d) : 2 blocs au plus, chacun <= 25 % de la séance de musculation, jamais un jour de plus', () => {
    for (const dur of [60, 75, null])
      for (const level of ['debutant', 'intermediaire', 'avance'] as const)
        for (const main of ['muscle', 'force', 'sante', 'perte_gras']) {
          const p = ok(run({ days: 3, level, dur, profile: 'C' }, [main, 'cardio']));
          const blocks = blocksOf(p);
          expect(blocks.length).toBeLessThanOrEqual(CARDIO.secondaryBlocksMax);
          expect(p.cardioSessions ?? []).toHaveLength(0);
          expect(p.sessions).toHaveLength(3);
          for (const s of p.sessions.filter((x) => x.cardio))
            expect(Math.max(...s.cardio!.weekMin)).toBeLessThanOrEqual(Math.floor((s.estimatedSec / 60) * CARDIO.secondaryMaxShare));
        }
  });

  it('§3.4 (a) / goal-resolver.md règle 5 : temps total (musculation + cardio, chaque semaine) <= temps disponible', () => {
    for (const dur of [20, 30, 45, 60, 75, null])
      for (const [goals, days] of [[['muscle', 'cardio'], 3], [['force', 'cardio'], 2], [['cardio'], 2], [['cardio'], 4]] as const) {
        const p = ok(run({ days, dur, level: 'avance' }, [...goals]));
        const dSec = p.durationMin * 60;
        for (const s of p.sessions) {
          if (!s.cardio) continue;
          expect(s.estimatedSec + Math.max(...s.cardio.weekMin) * 60, `${goals} ${dur}`).toBeLessThanOrEqual(dSec);
          expect(s.totalSec).toBeLessThanOrEqual(dSec);
        }
        for (const c of p.cardioSessions ?? []) expect(Math.max(...c.cardio.weekMin)).toBeLessThanOrEqual(p.targetMin);
      }
  });

  it('pas assez de temps (45 min) : aucun bloc, V-MSG-CARDIO-TEMPS, la musculation reste celle de l\'objectif principal', () => {
    const p = ok(run({ days: 3, dur: 45 }, ['muscle', 'cardio']));
    expect(blocksOf(p)).toHaveLength(0);
    expect(msgIds(p)).toContain('V-MSG-CARDIO-TEMPS');
    expect(p.family).toBe('muscle');
    // Sans cardio placé : la musculation est identique à celle de l'objectif muscle seul.
    const alone = ok(run({ days: 3, dur: 45 }, ['muscle']));
    expect(p.sessions.map((s) => s.exercises)).toEqual(alone.sessions.map((s) => s.exercises));
    expect(msgIds(p)).not.toContain('T0');
  });

  it('perte de gras garde la musculation (famille muscle) ; le bloc s\'ajoute à 60 min', () => {
    const p = ok(run({ days: 3, dur: 60 }, ['perte_gras', 'cardio']));
    expect(p.family).toBe('muscle');
    expect(blocksOf(p).length).toBeGreaterThan(0);
  });

  it('règle 5 : la place du bloc ne retire jamais un emplacement du noyau ni un pilier', () => {
    for (const dur of [30, 45, 60, 75])
      for (const goals of [['muscle', 'cardio'], ['cardio']]) {
        const days = goals[0] === 'cardio' ? 2 : 3;
        const withC = ok(run({ days, dur }, goals));
        const alone = ok(run({ days, dur }, [goals[0] === 'cardio' ? 'sante' : goals[0]]));
        withC.sessions.forEach((s, i) => {
          expect(s.removedCore).toEqual(alone.sessions[i].removedCore);
          expect(s.exercises.filter((e) => e.role === 'pilier').map((e) => e.variantId)).toEqual(
            alone.sessions[i].exercises.filter((e) => e.role === 'pilier').map((e) => e.variantId),
          );
        });
      }
  });
});

describe('Type de cardio selon le lieu, le matériel et la santé (§4, §5)', () => {
  it('§4 : maison sans matériel -> marche rapide continue (sans saut)', () => {
    const p = ok(run({ days: 4, profile: 'A0' }, ['cardio']));
    for (const c of cardioItems(p)) expect(c.variantId).toBe('marche-rapide-continue');
  });

  it('§4 / réserve n° 8 : salle avec machine_cardio -> aucune fiche machine (aucune n\'est relue), marche rapide + V-MSG-CARDIO-MACHINE', () => {
    const p = ok(run({ days: 4, profile: 'F', place: 'salle', extraTags: ['machine_cardio'] }, ['cardio']));
    const variants = FICHES.flatMap((f) => f.variantes);
    for (const c of cardioItems(p)) expect(variants.find((v) => v.id === c.variantId)!.tags).not.toContain('machine_cardio');
    expect(cardioItems(p)[0].variantId).toBe('marche-rapide-continue');
    expect(msgIds(p)).toContain('V-MSG-CARDIO-MACHINE');
  });

  it('§5 : aucun saut, aucune corde, aucune course, partout ; seulement les types autorisés (échelon 1)', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as const)
      for (const profile of ['A0', 'C', 'E', 'F'])
        for (const goals of [['cardio'], ['muscle', 'cardio']])
          for (const inj of [[], [['genou', 1]], [['cheville', 2]], [['dos', 1]]] as MkOpts['injuries'][]) {
            const p = ok(run({ days: goals.length === 1 ? 4 : 3, level, profile, dur: 60, injuries: inj, place: profile === 'F' ? 'salle' : 'maison' }, goals));
            for (const c of cardioItems(p)) {
              expect(ALLOWED).toContain(c.variantId);
              expect(FORBIDDEN).not.toContain(c.variantId);
              const v = FICHES.flatMap((f) => f.variantes).find((x) => x.id === c.variantId)!;
              expect(v.tags).not.toContain('corde_a_sauter');
              expect(v.echelon).toBe(1);
              // §3.4 (g), §3.7 (a) : après jambes lourdes, bloc « facile » (marche) ; sinon modéré ; jamais soutenu.
              expect(['moderee', 'facile']).toContain(c.intensity);
            }
          }
  });

  it('§5 débutant : jamais de mountain climbers (intermédiaire minimum) ; intermédiaire : permis ; épaule ou poignet : retiré', () => {
    const fiches = without('marche-rapide-intervalles', 'montees-genoux-sur-place', 'pas-chasses-lateraux', 'jumping-jacks', 'boxe-dans-le-vide');
    const deb = ok(run({ days: 4, level: 'debutant', fiches }, ['cardio']));
    expect(cardioItems(deb)).toHaveLength(0);
    expect(msgIds(deb)).toContain('V-MSG-CARDIO-IMPOS');
    const inter = ok(run({ days: 4, level: 'intermediaire', fiches }, ['cardio']));
    expect(cardioItems(inter)[0].variantId).toBe('mountain-climbers-chaise');
    for (const z of ['epaule', 'poignet'] as const) {
      const p = ok(run({ days: 4, level: 'avance', fiches, injuries: [[z, 1]] }, ['cardio']));
      expect(cardioItems(p)).toHaveLength(0);
    }
  });

  it('§5 grossesse : marche, montées de genoux en marchant, pas chassés lents seulement ; jamais jumping jacks, boxe, mountain climbers', () => {
    const p = ok(run({ days: 4, preg: 'enceinte', level: 'avance' }, ['cardio']));
    expect(cardioItems(p)[0].variantId).toBe('marche-rapide-continue');
    const noWalk = ok(run({ days: 4, preg: 'enceinte', level: 'avance', fiches: without('marche-rapide-intervalles') }, ['cardio']));
    expect(cardioItems(noWalk)[0].variantId).toBe('montees-genoux-marche');
    const only = ok(run({ days: 4, preg: 'enceinte', level: 'avance', fiches: without('marche-rapide-intervalles', 'montees-genoux-sur-place', 'pas-chasses-lateraux') }, ['cardio']));
    expect(cardioItems(only)).toHaveLength(0);
    expect(msgIds(only)).toContain('V-MSG-CARDIO-IMPOS');
  });

  it('§5 post-partum : liste blanche = marche rapide (vélo assis et escaliers : pas de fiche) ; rien d\'autre', () => {
    const p = ok(run({ days: 4, preg: 'post_partum' }, ['cardio']));
    for (const c of cardioItems(p)) expect(c.variantId).toBe('marche-rapide-continue');
    const noWalk = ok(run({ days: 4, preg: 'post_partum', fiches: without('marche-rapide-intervalles') }, ['cardio']));
    expect(cardioItems(noWalk)).toHaveLength(0);
    expect(msgIds(noWalk)).toContain('V-MSG-CARDIO-IMPOS');
  });

  it('9bis Q4(d) : grossesse / post-partum -> durées du débutant, sans progression, quel que soit le niveau ; T5 et repère OMS non visé', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) {
      const p = ok(run({ days: 4, preg, level: 'avance', dur: 60 }, ['cardio']));
      for (const c of p.cardioSessions!) {
        expect(c.cardio.minutes).toBe(CARDIO.dedicatedStartMin.debutant);
        expect(c.cardio.weekMin.slice(0, 3)).toEqual([20, 20, 20]);
      }
      expect(msgIds(p)).toContain('T5');
      expect(p.messages.find((m) => m.id === 'V-MSG-CARDIO-OMS')!.text).toContain('pendant la grossesse');
      const b = ok(run({ days: 2, preg, level: 'avance', dur: 60 }, ['cardio']));
      for (const c of blocksOf(b)) expect(Math.max(...c.weekMin)).toBe(CARDIO.blockStartMin);
    }
  });

  it('§5 zone dos (tout niveau) : jamais de machine ; dos niveau 3 -> la fiche marche est retirée par sa case, aucun cardio hors fiche', () => {
    for (const l of [1, 2] as const) {
      const p = ok(run({ days: 4, injuries: [['dos', l]], profile: 'F', place: 'salle', extraTags: ['machine_cardio'] }, ['cardio']));
      expect(cardioItems(p)[0].variantId).toBe('marche-rapide-continue');
    }
    // Dos niveau 3 : toutes les fiches de cardio sont « retirer » (la musculation, elle, donne V-MSG-PRO).
    expect(chooseCardio(buildCtx(withGoals({ injuries: [['dos', 3]] }, ['cardio'])))).toBeNull();
  });

  it('§5 genou niveau 2 : la case de la fiche s\'applique (variante continue imposée)', () => {
    const p = ok(run({ days: 4, injuries: [['genou', 2]] }, ['cardio']));
    expect(cardioItems(p)[0].variantId).toBe('marche-rapide-continue');
  });
});

describe('Explication (V-EXPL, goal-resolver.md règle 6) et textes de sécurité (§9bis)', () => {
  it('2 lignes qui citent le cardio quand il est présent, ou son absence', () => {
    for (const goals of [['cardio'], ['muscle', 'cardio'], ['force', 'cardio']])
      for (const days of goals.length === 1 ? [2, 3, 4] : [2, 3])
        for (const dur of [30, 45, 60]) {
          const p = ok(run({ days, dur }, goals));
          expect(p.explanation).toHaveLength(2);
          expect(p.explanation.join(' ').toLowerCase()).toContain('cardio');
        }
    const p4 = ok(run({ days: 4, level: 'intermediaire' }, ['cardio']));
    expect(p4.explanation[0]).toBe('4 jours : 2 séances de musculation corps entier + 2 séances de cardio (30 min, effort modéré).');
    expect(p4.explanation[1]).toBe("Le repère de l'OMS est 150 à 300 min par semaine : ton programme en compte environ 60 min.");
  });

  it('cardio n\'est plus « ramené » (pas de « en attendant la version dédiée ») ; endurance et sport restent ramenés', () => {
    const p = ok(run({ days: 4 }, ['cardio']));
    expect(p.explanation.join(' ')).not.toContain('en attendant la version dédiée');
    expect(msgIds(p)).not.toContain('V-MSG-OBJ');
    for (const g of ['endurance', 'sport']) {
      const q = ok(run({ days: 3 }, [g]));
      expect(q.explanation[1]).toContain('en attendant la version dédiée');
      expect(msgIds(q)).toContain('V-MSG-OBJ');
      expect(q.cardioRole ?? null).toBeNull(); // D31 : sport -> séance dédiée incluse (cardioRole null, cardioSessions de type « sport »)
    }
  });

  it('T0, T4, T3, T1, T1u et le repère OMS affichés quand du cardio est proposé ; textes de kine repris mot pour mot', () => {
    const p = ok(run({ days: 3 }, ['cardio']));
    const ids = msgIds(p);
    for (const id of ['T0', 'T4', 'T3', 'T1', 'T1u', 'V-MSG-CARDIO-OMS']) expect(ids).toContain(id);
    expect(ids).not.toContain('T5');
    const md = readFileSync('knowledge/cardio-regles.md', 'utf8');
    for (const [k, t] of Object.entries(CARDIO_TEXT)) expect(md.includes(t), k).toBe(true);
    expect(p.messages.find((m) => m.id === 'T1u')!.text).toContain('Urgence : appelle le 15 (SAMU) ou le 112.');
    expect(p.messages.find((m) => m.id === 'V-MSG-CARDIO-OMS')!.text).toContain('150 à 300 min');
  });

  it('objectif muscle seul : aucun élément de cardio (non-régression détaillée dans generator-nonregression.test.ts)', () => {
    const p = ok(run({ days: 3 }, ['muscle']));
    expect(p.cardioRole).toBeUndefined();
    expect(p.sessions.every((s) => s.cardio === undefined)).toBe(true);
    expect(msgIds(p).some((i) => i.startsWith('T') || i.startsWith('V-MSG-CARDIO'))).toBe(false);
  });
});

describe('Programme stocké (toProgramDays)', () => {
  it('jours dans l\'ordre de la semaine ; cardio = rôle cardio, durée en secondes, séance dédiée sans échauffement', () => {
    const p = ok(run({ days: 4, level: 'intermediaire' }, ['cardio']));
    const days = toProgramDays(p);
    expect(days.map((d) => d.weekday)).toEqual([...days.map((d) => d.weekday!)].sort((a, b) => a - b));
    expect(days.map((d) => d.dayIndex)).toEqual(days.map((_, i) => i));
    const ded = days.filter(isCardioDay);
    expect(ded).toHaveLength(2);
    for (const d of ded) {
      expect(d.exercises).toHaveLength(1);
      expect(d.exercises[0]).toMatchObject({ role: 'cardio', unit: 'sec', holdSec: 30 * 60, sets: 1, capped: true });
      expect(d.warmup).toEqual({ generalSec: 0, general: null, mobility: [], cooldown: null });
    }
    const p2 = ok(run({ days: 2 }, ['cardio']));
    for (const d of toProgramDays(p2)) {
      expect(isCardioDay(d)).toBe(false);
      expect(d.exercises[d.exercises.length - 1].role).toBe('cardio'); // §3.4 (b) : toujours après la musculation
    }
  });

  it('déterministe : deux appels identiques donnent le même programme', () => {
    expect(run({ days: 5, level: 'avance' }, ['cardio', 'force'])).toEqual(run({ days: 5, level: 'avance' }, ['cardio', 'force']));
  });
});
