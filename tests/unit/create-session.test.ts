// D28 « Créer une séance », étape 1 : le composeur (src/generator/create-session.ts). Règles : knowledge/creer-seance-v1.md (avis `kine` §8).
// Fiches réelles (public/data/fiches.json). Cas imposé : jambes, volley, élastique + chaise, 30 min, intensité modérée.
import { describe, expect, it } from 'vitest';
import { createSession, type CreateContext, type CreatedSession, type CreateSessionRequest } from '../../src/generator';
import { CREER_SEANCE, JUMPS, PENDING_RULES, VOLUME } from '../../src/generator/config';
import { availableTags } from '../../src/generator/context';
import { frac, weekMusclesOf, sessionVol } from '../../src/generator/plaf';
import type { GeneratorInput } from '../../src/generator/types';
import { FICHES, mk, type MkOpts } from './generator-helpers';

const NOW = '2026-11-12T10:00:00.000Z';
const ago = (hours: number): string => new Date(Date.parse(NOW) - hours * 3600 * 1000).toISOString();
// Profil du cas imposé : intermédiaire, à la maison, tags élastique + chaise (poids du corps, tapis, mur… implicites).
const home = (o: MkOpts = {}): GeneratorInput => mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'intermediaire', ...o });
const req = (o: Partial<CreateSessionRequest> = {}): CreateSessionRequest => ({
  zone: 'jambes', sport: 'volley', chairStable: true, durationMin: 30, intensity: 'moderee', todayIso: NOW, ...o,
});
const ok = (input: GeneratorInput, r: CreateSessionRequest, c: CreateContext = {}): CreatedSession => {
  const res = createSession(input, r, c);
  if (!res.ok) throw new Error(`refus inattendu : ${res.code} ${res.message}`);
  return res.session;
};
const tagsOf = (variantId: string): string[] => FICHES.flatMap((f) => f.variantes).find((v) => v.id === variantId)!.tags;
const variantIds = (s: CreatedSession): string[] => [...s.exercises.map((e) => e.variantId), ...(s.jumps?.items.map((j) => j.variantId) ?? [])];
const allVariantIds = (s: CreatedSession): string[] => [
  ...variantIds(s), ...s.warmup.mobility.map((m) => m.variantId), ...(s.warmup.general ? [s.warmup.general.variantId] : []), ...s.cooldown.items.map((m) => m.variantId),
];

/** Invariants de toute séance créée : matériel, durée, contacts, plafonds, ordre, supersets D26, repos des sauts. */
function invariants(input: GeneratorInput, r: CreateSessionRequest, s: CreatedSession): void {
  const avail = availableTags(input.equipment);
  for (const id of allVariantIds(s)) for (const t of tagsOf(id)) expect(avail.has(t), `${id} : tag ${t} absent du profil`).toBe(true);
  expect(s.estimatedSec).toBeLessThanOrEqual(r.durationMin * 60);
  expect(s.estimatedMin).toBeLessThanOrEqual(r.durationMin);
  const level = (input.profile.level ?? 'intermediaire') as 'debutant' | 'intermediaire' | 'avance';
  expect(s.contacts).toBeLessThanOrEqual(JUMPS.capContacts[level]);
  expect(s.totalSets).toBeLessThanOrEqual(CREER_SEANCE.totalSetsMax);
  expect(s.order[0]).toBe('echauffement');
  expect(s.order[s.order.length - 1]).toBe('retour_au_calme');
  if (s.jumps) expect(s.order.indexOf('sauts')).toBeLessThan(s.order.indexOf('force') === -1 ? 99 : s.order.indexOf('force'));
  // Aucun saut sur chaise, aucun squat sauté avec élastique, aucune fente sautée.
  for (const id of variantIds(s)) {
    expect(id).not.toMatch(/saut-fendu|squat-saute|saute-elastique/);
    if (/saut|rebond/.test(id) && !/douce|pointe/.test(id)) expect(tagsOf(id)).not.toContain('chaise');
  }
  expect(s.exercises.some((e) => e.ficheId === 'saut-fendu-alterne')).toBe(false);
  // Plafonds par muscle (12 au plus) et jamais de saut en superset.
  const exs = s.exercises;
  for (const m of weekMusclesOf([{ exercises: exs }])) expect(sessionVol({ exercises: exs }, m)).toBeLessThanOrEqual(VOLUME.maxPerMuscleSessionSlots);
  for (const e of exs) if (e.supersetGroup) expect(['poussee_2', 'tirage_2', 'jambes_2', 'tronc']).toContain(e.slot);
  const groups = new Map<string, string[]>();
  for (const e of exs) if (e.supersetGroup) groups.set(e.supersetGroup, [...(groups.get(e.supersetGroup) ?? []), e.slot]);
  for (const slots of groups.values()) {
    expect(slots).toHaveLength(2);
    expect([...slots].sort().join('+')).toMatch(/^(jambes_2\+tronc|poussee_2\+tirage_2)$/);
  }
  for (const j of s.jumps?.items ?? []) {
    expect(j.restSec).toBeGreaterThanOrEqual(60);
    if (!j.soft) {
      expect(j.reps).toBeGreaterThanOrEqual(5);
      expect(j.reps).toBeLessThanOrEqual(8);
    }
  }
  // Séries de force : jamais 4 ou plus, repos 60 à 90 s.
  for (const e of exs) {
    expect(e.sets).toBeLessThanOrEqual(3);
    if (e.rirAsked) expect(e.rirTarget).toBeGreaterThanOrEqual(2);
    expect(e.restSec).toBeGreaterThanOrEqual(60);
    expect(e.restSec).toBeLessThanOrEqual(90);
    expect(e.repsMax).toBeLessThanOrEqual(CREER_SEANCE.repsCap);
  }
}

describe('D28 composeur : statut', () => {
  it('l’écran est codé (étape 2) : PENDING_RULES.creerSeance actif ; les réglages restent NON SOURCÉ / PROVISOIRE et citent la spec', () => {
    expect(PENDING_RULES.creerSeance.enabled).toBe(true);
    expect(CREER_SEANCE.status).toBe('PROVISOIRE_NON_SOURCE');
    expect(CREER_SEANCE.source).toBe('knowledge/creer-seance-v1.md');
  });
});

describe('Cas 1 : jambes, volley, élastique + chaise, 30 min, modérée (intermédiaire, maison)', () => {
  const input = home();
  const s = ok(input, req());
  it('séance cohérente : échauffement, sauts, force lente, retour au calme ; durée tenue', () => {
    invariants(input, req(), s);
    expect(s.order).toEqual(['echauffement', 'sauts', 'force', 'retour_au_calme']);
    expect(s.estimatedMin).toBeLessThanOrEqual(30);
    expect(s.jumps?.items.length).toBeGreaterThanOrEqual(2);
    expect(s.exercises.length).toBe(2); // CAL-1 : 3 exercices de force, le bloc de sauts compte pour 1
    expect(s.header).toContain('elle s’ajoute à ton programme');
    expect(s.warnings.map((w) => w.id)).toEqual(expect.arrayContaining(['t8', 'arret-sauts', 'avis']));
  });
  it('contacts au plafond du niveau (départ 60), séries de sauts de 5 à 8 répétitions, repos >= 60 s', () => {
    expect(s.contacts).toBeGreaterThan(JUMPS.warmupBounces);
    expect(s.contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
    expect(s.jumps!.contacts).toBe(s.contacts);
  });
  it('force après les sauts : unilatéral à 2 séries, réserve 3, descente lente 8 à 12 ; aucun exercice hors matériel ni sur élastique sauté', () => {
    for (const e of s.exercises) {
      if (e.unilateral) expect(e.sets).toBeLessThanOrEqual(2);
      expect(e.rirTarget).toBeGreaterThanOrEqual(3);
    }
    const slow = s.exercises.find((e) => e.block === 'slow');
    expect(slow?.repsMin).toBeGreaterThanOrEqual(8);
    expect(slow?.repsMax).toBeLessThanOrEqual(12);
    expect(s.heavyLegs).toBe(true);
    expect(s.impact).toBe(true);
  });
  it('supersets conformes à D26 : aucun par défaut ; avec « gagner du temps » les paires restent P1 / P3 et jamais un saut', () => {
    expect(s.exercises.every((e) => !e.supersetGroup)).toBe(true);
    const fast = home({ options: { gagnerDuTemps: true } });
    const f = ok(fast, req({ durationMin: 50 }), { veilleMuscles: [] });
    invariants(fast, req({ durationMin: 50 }), f);
    const h = ok(fast, req({ zone: 'haut', sport: null, durationMin: 45 }), { veilleMuscles: [] });
    invariants(fast, req({ zone: 'haut', sport: null, durationMin: 45 }), h);
    const deb = ok(home({ options: { gagnerDuTemps: true }, level: 'debutant' }), req({ zone: 'haut', sport: null, durationMin: 45 }), { veilleMuscles: [] });
    expect(deb.exercises.every((e) => !e.supersetGroup)).toBe(true); // SUP-4 : aucun superset pour un débutant
  });
  it('déterministe : deux appels, même séance', () => {
    expect(ok(input, req())).toEqual(s);
  });
});

describe('Cas 2 : débutant -> 0 contact, montée sur la pointe des pieds seulement, 2 séries, aucun unilatéral', () => {
  const input = home({ level: 'debutant' });
  const s = ok(input, req());
  it('version douce d’abord, aucun squat sauté ni saut en longueur', () => {
    invariants(input, req(), s);
    expect(s.contacts).toBe(0);
    expect(s.jumps?.items.map((j) => j.variantId)).toEqual(['releve-mollets-mur']);
    expect(s.jumps?.items.every((j) => j.soft)).toBe(true);
    expect(variantIds(s)).not.toContain('saut-longueur-sur-place');
    expect(variantIds(s)).not.toContain('squat-petit-saut-saut');
    expect(s.warnings.some((w) => w.id === 'debutant-doux')).toBe(true);
    expect(s.impact).toBe(false);
  });
  it('force : 2 séries, jamais unilatéral ni force explosive', () => {
    for (const e of s.exercises) {
      expect(e.sets).toBeLessThanOrEqual(2);
      expect(e.unilateral).toBe(false);
      expect(e.block).not.toBe('explosive');
    }
  });
});

describe('Cas 3 : grossesse / post-partum -> jambes et corps entier refusés avec le message ; haut du corps selon les fiches', () => {
  for (const preg of ['enceinte', 'post_partum'] as const) {
    it(`${preg} : refus de jambes et de corps entier, texte de la règle`, () => {
      const input = home({ preg });
      for (const zone of ['jambes', 'corps_entier'] as const) {
        const r = createSession(input, req({ zone }));
        expect(r.ok).toBe(false);
        if (!r.ok) {
          expect(r.code).toBe('grossesse');
          expect(r.message).toBe('Cette séance n’est pas proposée pendant la grossesse ou le post-partum ; ton programme adapté reste disponible.');
          expect(r.suggestions).toEqual(['haut', 'tronc']);
        }
      }
      const haut = ok(input, req({ zone: 'haut', sport: null }));
      expect(haut.jumps).toBeNull();
      expect(haut.contacts).toBe(0);
      invariants(input, req({ zone: 'haut', sport: null }), haut);
    });
  }
});

describe('Cas 4 : genou gêné niveau 1 -> aucun saut ; douleur récente -> idem', () => {
  it('genou niveau 1 : séance sans saut, avertissement avec la raison, force de jambes adaptée par les fiches', () => {
    const input = home({ injuries: [['genou', 1]] });
    const s = ok(input, req());
    invariants(input, req(), s);
    expect(s.jumps).toBeNull();
    expect(s.contacts).toBe(0);
    expect(s.order).not.toContain('sauts');
    expect(s.warnings.some((w) => w.id === 'sauts-off' && w.text.includes('zone gênée'))).toBe(true);
    expect(s.exercises.some((e) => e.block === 'explosive')).toBe(false);
  });
  it('cheville, hanche, dos, cuisse, aine : mêmes retraits ; épaule seule ne retire pas les sauts des jambes', () => {
    for (const zone of ['cheville', 'hanche', 'dos', 'cuisse', 'aine'] as const) expect(ok(home({ injuries: [[zone, 1]] }), req()).jumps).toBeNull();
    expect(ok(home({ injuries: [['epaule', 1]] }), req()).jumps).not.toBeNull();
  });
  it('douleur sur le genou dans les 7 derniers jours (gêne passée mise à jour récemment) : pas de saut', () => {
    const input = home();
    input.injuries = [{ zone: 'genou', level: 1, active: false, deletedAt: null, updatedAt: ago(48) }];
    expect(ok(input, req()).jumps).toBeNull();
  });
});

describe('Cas 5 : espacement des séances de jambes (24 / 48 / 72 h) et des sauts', () => {
  it('jambes il y a 20 h : refusée avec proposition haut du corps / tronc', () => {
    const r = createSession(home(), req(), { sessions: [{ endIso: ago(20), heavyLegs: true }] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe('jambes-trop-proches');
      expect(r.suggestions).toEqual(['haut', 'tronc']);
    }
    expect(createSession(home(), req({ zone: 'corps_entier' }), { sessions: [{ endIso: ago(20), heavyLegs: true }] }).ok).toBe(false);
    // Le haut du corps et le tronc restent permis.
    expect(createSession(home(), req({ zone: 'haut', sport: null }), { sessions: [{ endIso: ago(20), heavyLegs: true }] }).ok).toBe(true);
  });
  it('jambes il y a 36 h : adoucie (douce, 2 séries, sans sauts, sans unilatéral, sans nordique ni descente lente), avec avertissement', () => {
    const input = home({ extraTags: ['elastique', 'chaise', 'partenaire_ou_ancrage'] });
    const s = ok(input, req({ intensity: 'soutenue' }), { sessions: [{ endIso: ago(36), heavyLegs: true }] });
    invariants(input, req({ intensity: 'soutenue' }), s);
    expect(s.softened).toBe(true);
    expect(s.intensity).toBe('douce');
    expect(s.jumps).toBeNull();
    for (const e of s.exercises) {
      expect(e.sets).toBeLessThanOrEqual(2);
      expect(e.unilateral).toBe(false);
      expect(e.ficheId).not.toBe('nordique-ischios');
      expect(e.ficheId).not.toBe('descente-une-jambe-chaise');
    }
    expect(s.warnings.map((w) => w.id)).toContain('adoucie');
  });
  it('jambes il y a 60 h : avertissement seul ; plus de 72 h : libre', () => {
    const a = ok(home(), req(), { sessions: [{ endIso: ago(60), heavyLegs: true }] });
    expect(a.warnings.map((w) => w.id)).toContain('moins-de-72h');
    expect(a.softened).toBe(false);
    const b = ok(home(), req(), { sessions: [{ endIso: ago(90), heavyLegs: true }] });
    expect(b.warnings.map((w) => w.id)).not.toContain('moins-de-72h');
  });
  it('sauts il y a 30 h : sauts refusés (séance composée sans saut) ; séance de jambes prévue demain : avertissement', () => {
    const s = ok(home(), req(), { sessions: [{ endIso: ago(30), jumps: true, impact: true, contacts: 40 }], heavyLegsTomorrow: true });
    expect(s.jumps).toBeNull();
    expect(s.warnings.some((w) => w.id === 'sauts-off')).toBe(true);
    expect(s.warnings.map((w) => w.id)).toContain('jambes-demain');
  });
  it('séance interrompue aujourd’hui, signe d’arrêt récent, reprise : pas de saut', () => {
    expect(ok(home(), req(), { interruptedToday: true }).jumps).toBeNull();
    expect(ok(home(), req(), { stopSignRecent: true }).jumps).toBeNull();
    expect(ok(home({ options: { repriseActive: true } }), req()).jumps).toBeNull();
  });
});

describe('Cas 6 : chaise non stable -> alternatives mur / sol, aucun exercice sur chaise', () => {
  it('ni bulgare, ni hip thrust sur chaise, ni montée ni descente sur chaise ; chaise murale / fente contre le mur / pont au sol', () => {
    const input = home();
    const r = req({ chairStable: false, durationMin: 50 });
    const s = ok(input, r);
    invariants(input, r, s);
    for (const e of s.exercises) {
      expect(e.tags).not.toContain('chaise');
      expect(['squat-bulgare', 'hip-thrust-chaise', 'descente-une-jambe-chaise', 'montee-rapide-chaise']).not.toContain(e.ficheId);
    }
    expect(s.exercises.some((e) => e.block === 'explosive')).toBe(false);
    expect(s.warnings.map((w) => w.id)).toContain('chaise');
    expect(s.exercises.length).toBeGreaterThan(0);
  });
  it('par défaut (réponse absente) la chaise est considérée non stable', () => {
    const s = ok(home(), req({ chairStable: undefined }));
    for (const e of s.exercises) expect(e.tags).not.toContain('chaise');
  });
  it('chaise stable, 50 min : bulgare, force explosive (montée sur chaise, 2 séries, 6 par jambe), jamais en soutenue', () => {
    const r = req({ durationMin: 50, sport: null, jumps: true });
    const s = ok(home(), r);
    const up = s.exercises.find((e) => e.block === 'explosive');
    expect(up?.variantId).toBe('montee-rapide-chaise-sans-charge');
    expect(up?.sets).toBeLessThanOrEqual(2);
    expect(up?.repsMax).toBe(6);
    expect(up?.tempo).toContain('aucun décollage');
    expect(ok(home(), req({ durationMin: 50, intensity: 'soutenue', sport: null, jumps: true })).exercises.some((e) => e.block === 'explosive')).toBe(false);
    // Genou gêné niveau 1 : la montée sur chaise est retirée (et les sauts aussi).
    expect(ok(home({ injuries: [['genou', 1]] }), r).exercises.some((e) => e.block === 'explosive')).toBe(false);
  });
  it('lot 2 : les 4 fiches sont chargées ; step-up : fiche montee-rapide-chaise, 2 séries x 6, aucune charge', () => {
    for (const id of ['montee-rapide-chaise', 'good-morning-elastique', 'balances-de-jambe', 'extension-triceps-sol-leger']) {
      expect(FICHES.find((x) => x.id === id), id).toBeDefined();
    }
    const up = ok(home(), req({ durationMin: 50, sport: null, jumps: true })).exercises.find((e) => e.block === 'explosive');
    expect(up?.ficheId).toBe('montee-rapide-chaise');
    expect(up?.sets).toBe(2);
    expect(up?.repsMax).toBe(6);
    expect(up?.tags).not.toContain('halteres');
  });
});

describe('Cas 7 : 45 à 55 min -> blocs complets, contacts jamais au-dessus du plafond, 6 exercices de force au plus', () => {
  it('50 min modérée : échauffement 7 min, 3 exercices de sauts, contacts <= départ 60, retour au calme 5 min, plafonds 11 / 12 et 19 séries', () => {
    const input = home();
    const r = req({ durationMin: 50, sport: null, jumps: true });
    const s = ok(input, r);
    invariants(input, r, s);
    expect(s.warmup.minutes).toBe(7);
    expect(s.cooldown.minutes).toBe(5);
    expect(s.jumps?.items.length).toBe(3);
    expect(s.contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
    expect(s.exercises.length).toBeLessThanOrEqual(6);
    expect(s.exercises.length).toBeLessThanOrEqual(4); // 5 exercices de force à 45-60 min, moins 1 pour le bloc de sauts
    expect(s.order).toEqual(['echauffement', 'sauts', 'force', 'retour_au_calme']);
    // Ordre des blocs : force explosive, force lente, chaîne postérieure, finisher.
    const order = s.exercises.map((e) => e.block);
    const rank = (b: string) => ['explosive', 'slow', 'posterior', 'finisher'].indexOf(b);
    expect([...order].sort((a, b) => rank(a) - rank(b))).toEqual(order);
  });
  it('soutenue avec une séance de sauts sans douleur il y a 7 jours (60 contacts) : 65 contacts (+5), sous le plafond 100', () => {
    const input = home();
    const r = req({ durationMin: 50, intensity: 'soutenue', sport: null, jumps: true });
    const s = ok(input, r, { sessions: [{ endIso: ago(7 * 24), jumps: true, impact: true, contacts: 60 }] });
    invariants(input, r, s);
    expect(s.contacts).toBeLessThanOrEqual(65);
    expect(s.contacts).toBeGreaterThan(JUMPS.startContacts.intermediaire - 1);
    expect(s.contacts).toBeLessThanOrEqual(JUMPS.capContacts.intermediaire);
  });
  it('plafond hebdomadaire de 20 séries par muscle : des séries sont retirées ; impossible même à 2 séries : refus avec le texte de la règle', () => {
    const input = home();
    const r = req({ durationMin: 50, sport: null, intensity: 'soutenue' });
    const full = ok(input, r);
    const qFull = sessionVol({ exercises: full.exercises }, 'quadriceps');
    const part = ok(input, r, { weekSets: { quadriceps: VOLUME.maxPerMuscleWeek - 6, fessiers: 0 } });
    const qPart = sessionVol({ exercises: part.exercises }, 'quadriceps');
    expect(qPart).toBeLessThanOrEqual(6);
    expect(qPart).toBeLessThan(qFull);
    for (const m of weekMusclesOf([{ exercises: part.exercises }])) expect((m === 'quadriceps' ? VOLUME.maxPerMuscleWeek - 6 : 0) + sessionVol({ exercises: part.exercises }, m)).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    const refused = createSession(input, r, { weekSets: { quadriceps: 20, fessiers: 20, ischios: 20, mollets: 20 } });
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.code).toBe('plafond-hebdomadaire');
      expect(refused.message).toBe('Tu as déjà beaucoup travaillé cette zone cette semaine ; essaie une autre zone ou attends.');
    }
    void frac;
  });
});

describe('Cas 8 : soutenue sans séance de sauts récente -> départ du niveau (pas de +20)', () => {
  it('intermédiaire : contacts <= 60 en soutenue sans historique, et aussi si la dernière séance de sauts date de plus de 14 jours', () => {
    const input = home();
    const r = req({ durationMin: 50, intensity: 'soutenue' });
    expect(ok(input, r).contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
    expect(ok(input, r, { sessions: [{ endIso: ago(20 * 24), jumps: true, impact: true, contacts: 90 }] }).contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
  });
  it('pause de plus de 2 semaines : départ du niveau même avec une séance récente ; douleur à la dernière séance : pas de hausse', () => {
    const input = home();
    const r = req({ durationMin: 50, intensity: 'soutenue' });
    const recent = [{ endIso: ago(7 * 24), jumps: true, impact: true, contacts: 60 }];
    expect(ok(input, r, { sessions: recent, pauseOver2Weeks: true }).contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
    expect(ok(input, r, { sessions: [{ ...recent[0], pain: true }] }).contacts).toBeLessThanOrEqual(60);
  });
  it('avancé : départ 80, plafond 120 ; jamais au-dessus', () => {
    const input = home({ level: 'avance' });
    const r = req({ durationMin: 60, intensity: 'soutenue' });
    expect(ok(input, r).contacts).toBeLessThanOrEqual(JUMPS.startContacts.avance);
    expect(ok(input, r, { sessions: [{ endIso: ago(7 * 24), jumps: true, impact: true, contacts: 115 }] }).contacts).toBeLessThanOrEqual(JUMPS.capContacts.avance);
  });
});

describe('Autres zones, sports et durées', () => {
  it('foot / raquette : sauts décochés par défaut, cochables ; objectif détente active les sauts ; haut du corps : jamais de saut', () => {
    expect(ok(home(), req({ sport: 'foot' })).jumps).toBeNull();
    expect(ok(home(), req({ sport: 'raquette' })).jumps).toBeNull();
    expect(ok(home(), req({ sport: 'foot', jumps: true })).jumps).not.toBeNull();
    expect(ok(home(), req({ sport: null, objective: 'detente' })).jumps).not.toBeNull();
    const h = ok(home(), req({ zone: 'haut', sport: 'volley' }));
    expect(h.jumps).toBeNull();
    expect(h.warnings.map((w) => w.id)).toContain('sauts-hors-jambes');
  });
  it('haut du corps, tronc et corps entier : séances valides, matériel respecté, durée tenue, 20 / 30 / 60 min', () => {
    for (const zone of ['haut', 'tronc', 'corps_entier'] as const) {
      for (const d of [20, 30, 60]) {
        const input = home();
        const r = req({ zone, sport: null, durationMin: d, intensity: 'moderee' });
        const s = ok(input, r);
        invariants(input, r, s);
        expect(s.exercises.length).toBeGreaterThan(0);
      }
    }
  });
  it('20 min avec sauts : tient dans la durée (sinon les sauts sont retirés avec la raison)', () => {
    const input = home();
    const r = req({ durationMin: 20 });
    const s = ok(input, r);
    invariants(input, r, s);
  });
  it('date illisible : refus propre', () => {
    const r = createSession(home(), req({ todayIso: 'pas une date' }));
    expect(r.ok).toBe(false);
  });
});

describe('Relecteur D28 point 3 : chaise non stable, toutes les zones', () => {
  for (const zone of ['haut', 'tronc', 'corps_entier', 'jambes'] as const) {
    it(`${zone} : aucune variante portant le tag chaise quand la chaise n’est pas stable`, () => {
      for (const dur of [30, 45, 60]) {
        const res = createSession(home(), req({ zone, sport: null, chairStable: false, durationMin: dur }), {});
        if (!res.ok) continue;
        for (const id of allVariantIds(res.session)) expect(tagsOf(id), `${zone} ${dur} : ${id}`).not.toContain('chaise');
      }
    });
  }
  it('corps entier + chaise stable : une séance est composée', () => {
    const s = ok(home(), req({ zone: 'corps_entier', sport: null, chairStable: true, durationMin: 45 }));
    expect(s.exercises.length).toBeGreaterThan(0);
  });
});

describe('Chaise non stable : sauts, échauffement et retour au calme sans chaise', () => {
  it('jambes et corps entier avec volley, niveaux intermédiaire et avancé : aucune variante sur chaise, sauts compris', () => {
    for (const level of ['intermediaire', 'avance'] as const) {
      for (const zone of ['jambes', 'corps_entier'] as const) {
        const res = createSession(home({ level }), req({ zone, sport: 'volley', chairStable: false, durationMin: 45 }), {});
        if (!res.ok) continue;
        for (const id of allVariantIds(res.session)) expect(tagsOf(id), `${level} ${zone} : ${id}`).not.toContain('chaise');
      }
    }
  });
});
