// « Mon sport », étape 1 (knowledge/saisie-sport-v1.md §7) : validation à l'import, charge (sportLoad / sportGate), D28 (refuse, allège, décale).
// Fiches réelles. L'horloge est fixée : jeudi 12/11/2026 à midi, heure locale.
import { beforeEach, describe, expect, it } from 'vitest';
import { createSession, type CreateContext, type CreatedSession, type CreateSessionRequest } from '../../src/generator';
import type { GeneratorInput } from '../../src/generator/types';
import { SPORT_LISTS, UPPER_PUSH_IDS } from '../../src/generator/sport-lists';
import { exportData, importData, wipeAllData } from '../../src/data/backup';
import { SCHEMA_VERSION, type SportPlanEntry, type SportSession } from '../../src/data/model';
import { create, list, listAll, listTrusted, setClock } from '../../src/data/repo';
import { validateRow } from '../../src/data/validate';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { createHistory, weekSetsOf } from '../../src/session/create-store';
import { cardioBlocked, sportGate, sportLoad } from '../../src/sport/sport-load';
import { addSportSession, draftError, normalizePlan, savedMessages, startedAtOf, toRow, type SportDraft } from '../../src/sport/sport-store';
import { FICHES, mk, type MkOpts } from './generator-helpers';

const NOW = new Date(2026, 10, 12, 12, 0, 0); // jeudi, heure locale
const NOW_ISO = NOW.toISOString();
const hoursAgo = (h: number): Date => new Date(NOW.getTime() - h * 3600 * 1000);
const base = (id: string) => ({ id, ownerId: 'u1', createdAt: '2026-11-01T10:00:00.000Z', updatedAt: '2026-11-01T10:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null });

/** Séance de sport qui se TERMINE il y a `endedHoursAgo` heures. */
function ss(o: Partial<SportSession> & { endedHoursAgo?: number } = {}): SportSession {
  const dur = o.durationMin ?? 60;
  const { endedHoursAgo = 30, ...rest } = o;
  return { ...base(`s${Math.random().toString(36).slice(2)}`), sport: 'volley', startedAt: new Date(hoursAgo(endedHoursAgo).getTime() - dur * 60_000).toISOString(), durationMin: dur, effort: 'soutenue', feelings: [], ...rest };
}
const HOME = (o: MkOpts = {}): GeneratorInput => mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'intermediaire', ...o });
const req = (o: Partial<CreateSessionRequest> = {}): CreateSessionRequest => ({ zone: 'jambes', sport: 'volley', chairStable: true, durationMin: 45, intensity: 'moderee', todayIso: NOW_ISO, ...o });
const withSport = (sessions: SportSession[], plan: SportPlanEntry[] = []): CreateContext => ({ sport: { sessions, plan } });
const run = (input: GeneratorInput, r: CreateSessionRequest, c: CreateContext = {}) => createSession(input, r, c);
const ok = (input: GeneratorInput, r: CreateSessionRequest, c: CreateContext = {}): CreatedSession => {
  const res = run(input, r, c);
  if (!res.ok) throw new Error(`refus inattendu : ${res.code}`);
  return res.session;
};
const texts = (s: CreatedSession): string => s.warnings.map((w) => w.text).join(' | ');

beforeEach(() => setClock(() => NOW));

// ---------------------------------------------------------------------------------------------------------------------------------
describe('Validation profonde à l\'import', () => {
  const good = (o: Record<string, unknown> = {}) => ({ ...base('x1'), sport: 'foot', startedAt: '2026-11-10T18:00:00.000Z', durationMin: 90, effort: 'tres_dur', feelings: ['jambes_lourdes'], ...o });
  it('une séance de sport valable passe', () => {
    expect(validateRow('sportSessions', good())).toEqual([]);
    expect(validateRow('sportSessions', good({ sport: 'autre', name: 'Escalade', match: true, jumps: true, overhead: true, painZone: 'epaule', signs: ['nuit'], note: 'ok' }))).toEqual([]);
  });
  it.each([
    ['durée trop courte', { durationMin: 4 }], ['durée trop longue', { durationMin: 241 }], ['durée NaN', { durationMin: Number.NaN }],
    ['effort inconnu', { effort: 'facile!' }], ['sport hors liste', { sport: 'rugby' }], ['date illisible', { startedAt: 'demain' }],
    ['date avant 2000', { startedAt: '1999-12-31T00:00:00.000Z' }], ['date après 2100', { startedAt: '2101-01-01T00:00:00.000Z' }],
    ['ressenti inconnu', { feelings: ['x'] }], ['ressenti en double', { feelings: ['jambes_lourdes', 'jambes_lourdes'] }], ['ressenti absent', { feelings: undefined }],
    ['zone inconnue', { painZone: 'oreille' }], ['signe inconnu', { signs: ['x'] }], ['note trop longue', { note: 'a'.repeat(201) }], ['nom trop long', { name: 'a'.repeat(41) }],
    ['effort absent', { effort: undefined }],
  ])('refuse : %s', (_n, o) => {
    expect(validateRow('sportSessions', good(o as Record<string, unknown>)).length).toBeGreaterThan(0);
  });
  it('refuse une clé dangereuse imbriquée', () => {
    expect(validateRow('sportSessions', good({ feelings: [], extra: JSON.parse('{"__proto__":{"a":1}}') })).length).toBeGreaterThan(0);
  });
  const profile = (plan: unknown) => ({
    ...base('p1'), displayName: 'A', adultConfirmedAt: null, healthDisclaimerAcceptedAt: null, level: 'debutant', daysPerWeek: 3, blockedWeekdays: [], sessionDurationMin: 45,
    sports: [], heightCm: null, aiEnabled: false, sportPlan: plan,
  });
  it('sportPlan : valable, absent accepté, bornes et champs inconnus refusés', () => {
    expect(validateRow('profile', profile([{ sport: 'foot', perWeek: 2, weekdays: [1, 3], matchWeekday: 5, jumps: true }, { sport: 'autre', name: 'Yoga' }]))).toEqual([]);
    expect(validateRow('profile', { ...profile(undefined), sportPlan: undefined })).toEqual([]);
    const bad = (e: unknown) => validateRow('profile', profile(e)).length > 0;
    expect(bad([{ sport: 'foot' }, { sport: 'danse' }, { sport: 'volley' }, { sport: 'hand' }])).toBe(true);
    expect(bad([{ sport: 'foot', evil: 1 }])).toBe(true);
    expect(bad([{ sport: 'golf' }])).toBe(true);
    expect(bad([{ sport: 'foot', perWeek: 8 }])).toBe(true);
    expect(bad([{ sport: 'foot', weekdays: [7] }])).toBe(true);
    expect(bad([{ sport: 'foot', weekdays: [1, 1] }])).toBe(true);
    expect(bad([{ sport: 'foot', matchWeekday: 9 }])).toBe(true);
    expect(bad([{ sport: 'autre', name: 'x'.repeat(41) }])).toBe(true);
    expect(bad('foot')).toBe(true);
  });
});

describe('Export, import et suppression', () => {
  it('la table sportSessions et sportPlan sont exportées, réimportées, puis supprimées avec les données', async () => {
    const p = await ensureLocalUser();
    const { update } = await import('../../src/data/repo');
    await update('profile', p.id, { sportPlan: [{ sport: 'hand', perWeek: 2 }] });
    await create('sportSessions', { sport: 'hand', startedAt: '2026-11-10T18:00:00.000Z', durationMin: 60, effort: 'soutenue', feelings: [] });
    const out = await exportData();
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(out.data.sportSessions).toHaveLength(1);
    expect(out.data.profile[0].sportPlan).toEqual([{ sport: 'hand', perWeek: 2 }]);
    const r = await importData(JSON.parse(JSON.stringify(out)));
    expect(r.ok).toBe(true);
    await wipeAllData();
    expect(await listAll('sportSessions')).toHaveLength(0);
  });
  it('un export ancien (sans la table) est accepté ; un fichier avec une séance de sport invalide est refusé sans rien écrire', async () => {
    const old = { format: 'muscu-app-export', schemaVersion: 3, exportedAt: NOW_ISO, data: { profile: [] } };
    expect((await importData(old)).ok).toBe(true);
    const bad = { ...old, schemaVersion: 4, data: { sportSessions: [{ ...base('b'), sport: 'foot', startedAt: NOW_ISO, durationMin: 9999, effort: 'soutenue', feelings: [] }] } };
    const r = await importData(bad);
    expect(r.ok).toBe(false);
    expect(await listAll('sportSessions')).toHaveLength(0);
  });
});

describe('Les séances de sport ne sont pas des séances de musculation', () => {
  it('ni listTrusted, ni historique de D28, ni séries de la semaine ne les lisent', async () => {
    await ensureLocalUser();
    await addSportSession({ sport: 'foot', day: '2026-11-12', durationMin: 60, effort: 'soutenue', feelings: [] }, { pregnancy: null, sportPlan: [] }, NOW);
    expect(await list('sportSessions')).toHaveLength(1);
    expect(await list('sessions')).toHaveLength(0);
    expect(await listTrusted('sessions')).toHaveLength(0);
    expect(await listTrusted('sets')).toHaveLength(0);
    expect(createHistory({ sessions: [], sets: [], programs: [], schemaOf: () => undefined })).toEqual([]);
    expect(weekSetsOf({ sessions: [], sets: [], musclesOf: () => undefined, now: NOW })).toEqual({});
  });
  it('saisie : intensité obligatoire, durée bornée, début jamais futur, champs inutiles écartés', () => {
    const d: SportDraft = { sport: 'foot', day: '2026-11-12', durationMin: 60, effort: null, feelings: [] };
    expect(draftError(d)).toMatch(/intensité/);
    expect(draftError({ ...d, effort: 'facile', durationMin: 3 })).toMatch(/durée/);
    expect(draftError({ ...d, effort: 'facile' })).toBeNull();
    expect(Date.parse(startedAtOf({ day: '2026-11-12', durationMin: 60 }, NOW))).toBe(NOW.getTime() - 3600_000);
    expect(Date.parse(startedAtOf({ day: '2030-01-01', durationMin: 60 }, NOW))).toBeLessThanOrEqual(NOW.getTime());
    const row = toRow({ ...d, effort: 'soutenue', feelings: ['courbatures'], painZone: 'genou', signs: ['nuit'], jumps: false, note: ' ok ' }, NOW);
    expect(row.painZone).toBeUndefined(); // pas de « gêne » cochée : zone et signes ignorés
    expect(row.signs).toBeUndefined();
    expect(row.note).toBe('ok');
    expect(normalizePlan([{ sport: 'foot' }, { sport: 'foot' }, { sport: 'danse' }, { sport: 'volley' }, { sport: 'hand' }])).toHaveLength(3);
    expect(normalizePlan([{ sport: 'autre', name: ' x'.repeat(50) }])[0].name!.length).toBeLessThanOrEqual(40);
  });
});

// ---------------------------------------------------------------------------------------------------------------------------------
describe('sportLoad : tableau de charge du §7', () => {
  const load = (s: SportSession[], plan: SportPlanEntry[] = []) => sportLoad(s, plan, NOW);
  const ev = (s: Partial<SportSession>, plan: SportPlanEntry[] = []) => load([ss({ endedHoursAgo: 5, ...s })], plan).events[0];

  it('jambes : « facile » < 45 min = 0,5 ; 45 à 59 min = jambes lourdes ; « jambes lourdes » ou « soutenue » aussi', () => {
    expect(ev({ effort: 'facile', durationMin: 30 }).legs).toBe('half');
    expect(ev({ effort: 'facile', durationMin: 44 }).legs).toBe('half');
    expect(ev({ effort: 'facile', durationMin: 45 }).legs).toBe('heavy');
    expect(ev({ effort: 'facile', durationMin: 59 }).legs).toBe('heavy');
    expect(ev({ effort: 'facile', durationMin: 30, feelings: ['jambes_lourdes'] }).legs).toBe('heavy');
    expect(ev({ effort: 'soutenue', durationMin: 20 }).legs).toBe('heavy');
  });
  it('sévère : match, « très dur » ou 90 min et plus', () => {
    expect(ev({ effort: 'soutenue', durationMin: 60 }).severe).toBe(false);
    expect(ev({ effort: 'tres_dur', durationMin: 30 }).severe).toBe(true);
    expect(ev({ effort: 'soutenue', durationMin: 90 }).severe).toBe(true);
    expect(ev({ effort: 'soutenue', durationMin: 60, match: true }).severe).toBe(true);
  });
  it('contacts : x2 / x3 / x4 par minute, plafond 400 ; foot et raquette seulement avec des sauts', () => {
    expect(ev({ sport: 'volley', effort: 'facile', durationMin: 60 }).contacts).toBe(120);
    expect(ev({ sport: 'volley', effort: 'soutenue', durationMin: 60 }).contacts).toBe(180);
    expect(ev({ sport: 'basket', effort: 'tres_dur', durationMin: 60 }).contacts).toBe(240);
    expect(ev({ sport: 'hand', effort: 'tres_dur', durationMin: 200 }).contacts).toBe(400);
    expect(ev({ sport: 'foot', effort: 'soutenue', durationMin: 60 }).contacts).toBe(0);
    expect(ev({ sport: 'foot', effort: 'soutenue', durationMin: 60, jumps: true }).contacts).toBe(180);
    expect(ev({ sport: 'raquette', effort: 'soutenue', durationMin: 60 }).contacts).toBe(0);
    expect(ev({ sport: 'volley', effort: 'facile', durationMin: 60 }).jumpSession).toBe(false);
    expect(ev({ sport: 'volley', effort: 'soutenue', durationMin: 60 }).jumpSession).toBe(true);
  });
  it('sport « autre » : jambes et sauts par défaut ; épaule seulement avec « bras au-dessus de la tête » ou « épaule fatiguée »', () => {
    expect(ev({ sport: 'autre', effort: 'soutenue', durationMin: 60 }).contacts).toBe(180);
    expect(ev({ sport: 'autre', effort: 'soutenue', durationMin: 60 }).shoulder).toBe(false);
    expect(ev({ sport: 'autre', effort: 'soutenue', durationMin: 60, overhead: true }).shoulder).toBe(true);
    expect(ev({ sport: 'autre', effort: 'facile', durationMin: 20, feelings: ['epaule_fatiguee'] }).shoulder).toBe(true);
  });
  it('jour habituel non noté : « soutenue » 60 min, fin de journée ; jour de match : « très dur »', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', weekdays: [3], matchWeekday: 1 }]; // jeudi = aujourd'hui, mardi = match (il y a 2 jours)
    const l = load([], plan);
    const today = l.events.find((e) => e.severe === false)!;
    expect(today.source).toBe('habitual');
    expect(today.effort).toBe('soutenue');
    expect(today.durationMin).toBe(60);
    expect(today.endMs).toBeGreaterThan(NOW.getTime()); // fin de journée : pas encore finie
    expect(l.events.find((e) => e.match)?.effort).toBe('tres_dur');
  });
  it('séance notée du même jour : remplace le jour habituel seulement si elle est au moins aussi chargée, sinon on garde les deux', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', weekdays: [3] }];
    const strong = load([ss({ endedHoursAgo: 1, effort: 'soutenue', durationMin: 60 })], plan);
    expect(strong.events.filter((e) => e.source === 'habitual')).toHaveLength(0);
    const weak = load([ss({ endedHoursAgo: 1, effort: 'facile', durationMin: 30 })], plan);
    expect(weak.events.filter((e) => e.source === 'habitual')).toHaveLength(1);
  });
  it('une séance datée dans le futur est ramenée à maintenant', () => {
    const l = load([ss({ startedAt: '2099-01-01T10:00:00.000Z', durationMin: 5, effort: 'facile' })]);
    expect(l.events[0].endMs).toBeLessThanOrEqual(NOW.getTime() + 5 * 60_000);
  });
  it('épaule : volley / hand / raquette ≥ soutenue ou 60 min ; jour même et lendemain, « très dur » 48 h ; « épaule fatiguée » = aucun bloc', () => {
    const g = (s: Partial<SportSession> & { endedHoursAgo?: number }) => sportGate(load([ss({ sport: 'raquette', ...s })]), 'intermediaire', 60);
    expect(g({ endedHoursAgo: 5, effort: 'facile', durationMin: 30 }).shoulder).toBe('free');
    expect(g({ endedHoursAgo: 5, effort: 'soutenue' }).shoulder).toBe('light');
    expect(g({ endedHoursAgo: 5, effort: 'soutenue' }).noUpperPush).toBe(true);
    expect(g({ endedHoursAgo: 5, effort: 'soutenue', feelings: ['epaule_fatiguee'] }).shoulder).toBe('none');
    expect(g({ endedHoursAgo: 5, effort: 'tres_dur' }).shoulder).toBe('none');
    expect(g({ endedHoursAgo: 40, effort: 'soutenue' }).noUpperPush).toBe(false); // avant-hier : libre
    expect(g({ endedHoursAgo: 30, effort: 'tres_dur' }).noUpperPush).toBe(true); // hier, très dur : encore bloqué
  });
  it('cardio dédié : pas le même jour qu\'un sport « soutenue », ni dans les 24 h après un « très dur »', () => {
    expect(cardioBlocked(load([ss({ endedHoursAgo: 2, effort: 'soutenue' })]))).toBe(true);
    expect(cardioBlocked(load([ss({ endedHoursAgo: 2, effort: 'facile', durationMin: 30 })]))).toBe(false);
    expect(cardioBlocked(load([ss({ endedHoursAgo: 20, effort: 'tres_dur' })]))).toBe(true);
    expect(cardioBlocked(load([ss({ endedHoursAgo: 30, effort: 'tres_dur' })]))).toBe(false);
  });
  it('gêne : 2 séances de suite, ou signe d\'alerte -> renvoi et zone retirée ; malaise = journée sans charge ; reprise après 14 jours', () => {
    const g = (endedHoursAgo: number, o: Partial<SportSession> = {}) => ss({ endedHoursAgo, feelings: ['gene_douleur'], painZone: 'genou', effort: 'facile', durationMin: 30, ...o });
    expect(load([g(60)]).consult).toBeNull();
    const two = load([g(60), g(20)]);
    expect(two.consult).toMatchObject({ reason: 'deux_seances', zones: ['genou'] });
    expect(load([g(20, { signs: ['gonflement'] })]).consult?.reason).toBe('signes');
    expect(load([g(60), ss({ endedHoursAgo: 40, effort: 'facile', durationMin: 30 }), g(20)]).consult).toBeNull();
    expect(load([g(2, { painZone: 'epaule' })]).tempPainZones).toEqual(['epaule']);
    expect(load([ss({ endedHoursAgo: 2, feelings: ['malaise_vertige'] })]).malaiseToday).toBe(true);
    expect(load([ss({ endedHoursAgo: 20 * 24 })]).pauseOver14).toBe(true);
    expect(load([ss({ endedHoursAgo: 5 * 24 })]).pauseOver14).toBe(false);
    expect(load([]).pauseOver14).toBe(false);
  });
  it('espacement des jambes : < 24 h refusé ; 24-48 h légères ; 48-72 h avancé à pleine dose, autres légères ; sévère : légères jusqu\'à 72 h pour tous', () => {
    const lv = (h: number, level: 'debutant' | 'intermediaire' | 'avance', o: Partial<SportSession> & { endedHoursAgo?: number } = {}) => sportGate(load([ss({ endedHoursAgo: h, ...o })]), level, 60).legs;
    expect(lv(10, 'avance')).toBe('refuse');
    expect(lv(30, 'avance')).toBe('soften');
    expect(lv(60, 'avance')).toBe('warn');
    expect(lv(60, 'intermediaire')).toBe('soften');
    expect(lv(60, 'debutant')).toBe('soften');
    expect(lv(60, 'avance', { effort: 'tres_dur' })).toBe('soften');
    expect(lv(60, 'avance', { match: true })).toBe('soften');
    expect(lv(60, 'avance', { effort: 'soutenue', durationMin: 90 })).toBe('soften');
    expect(lv(80, 'debutant')).toBe('ok');
    expect(lv(10, 'avance', { effort: 'facile', durationMin: 30 })).toBe('ok'); // 0,5 : seul effet = pas de saut
  });
});

// ---------------------------------------------------------------------------------------------------------------------------------
describe('D28 : la charge du sport refuse, allège ou décale (jamais ne relève)', () => {
  it('jambes < 24 h après un match : refusées, avec suggestions haut / tronc', () => {
    const r = run(HOME(), req(), withSport([ss({ endedHoursAgo: 8, match: true, effort: 'tres_dur' })]));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe('sport-jambes-trop-proches');
      expect(r.suggestions).toEqual(['haut', 'tronc']);
    }
    expect(run(HOME(), req({ zone: 'haut' }), withSport([ss({ endedHoursAgo: 8, match: true, effort: 'tres_dur' })])).ok).toBe(true);
  });
  it('un jour habituel non noté d\'aujourd\'hui refuse aussi les jambes ; le noter plus doucement ne change rien (la plus forte s\'applique)', () => {
    const plan: SportPlanEntry[] = [{ sport: 'foot', weekdays: [3] }];
    expect(run(HOME(), req({ sport: 'foot' }), withSport([], plan)).ok).toBe(false);
    expect(run(HOME(), req({ sport: 'foot' }), withSport([ss({ sport: 'foot', endedHoursAgo: 1, effort: 'facile', durationMin: 30 })], plan)).ok).toBe(false);
  });
  it('24 à 48 h : séance adoucie ; match, « très dur » : adoucie jusqu\'à 72 h même pour un avancé', () => {
    const s = ok(HOME(), req({ intensity: 'soutenue' }), withSport([ss({ endedHoursAgo: 30 })]));
    expect(s.softened).toBe(true);
    expect(s.intensity).toBe('douce');
    expect(s.jumps).toBeNull();
    const adv = ok(HOME({ level: 'avance' }), req({ intensity: 'soutenue' }), withSport([ss({ endedHoursAgo: 60, effort: 'tres_dur' })]));
    expect(adv.softened).toBe(true);
    const adv2 = ok(HOME({ level: 'avance' }), req({ sport: 'foot' }), withSport([ss({ sport: 'foot', endedHoursAgo: 60 })]));
    expect(adv2.softened).toBe(false);
    expect(texts(adv2)).toMatch(/72 h/);
    const inter = ok(HOME(), req({ sport: 'foot' }), withSport([ss({ sport: 'foot', endedHoursAgo: 60 })]));
    expect(inter.softened).toBe(true);
  });
  it('sauts refusés sous 48 h après un sport avec sauts « soutenue » ; avertissement entre 48 et 72 h', () => {
    const lock = ok(HOME({ level: 'avance' }), req({ intensity: 'moderee' }), withSport([ss({ endedHoursAgo: 40, effort: 'soutenue' })]));
    expect(lock.jumps).toBeNull();
    const warn = ok(HOME({ level: 'avance' }), req({ durationMin: 45 }), withSport([ss({ endedHoursAgo: 60, effort: 'soutenue', durationMin: 20 })]));
    expect(warn.softened).toBe(false);
    expect(warn.jumps).not.toBeNull();
    expect(texts(warn)).toMatch(/72 h/);
  });
  it('sauts refusés sous 24 h après un sport léger (0,5) ; contacts des 72 h au-dessus du départ du niveau : aucun saut dans les 48 h', () => {
    const light = ok(HOME(), req({ zone: 'corps_entier', durationMin: 45 }), withSport([ss({ sport: 'foot', endedHoursAgo: 10, effort: 'facile', durationMin: 30 })]));
    expect(light.jumps).toBeNull();
    const many = ok(HOME({ level: 'avance' }), req({ sport: 'danse', durationMin: 45 }), withSport([ss({ sport: 'danse', endedHoursAgo: 52, effort: 'facile', durationMin: 60 }), ss({ sport: 'danse', endedHoursAgo: 70, effort: 'facile', durationMin: 60 })]));
    expect(many.softened).toBe(false);
    // 120 + 120 = 240 contacts > 80 (départ avancé), la plus récente a plus de 48 h : avertissement seulement, sauts permis
    expect(many.jumps).not.toBeNull();
    const recent = ok(HOME({ level: 'avance' }), req({ sport: 'danse', durationMin: 45 }), withSport([ss({ sport: 'danse', endedHoursAgo: 44, effort: 'facile', durationMin: 60 }), ss({ sport: 'danse', endedHoursAgo: 70, effort: 'facile', durationMin: 60 })]));
    expect(recent.jumps).toBeNull();
  });
  it('la veille d\'un match : jambes adoucies, aucun saut ; match dans 2 jours : aucun saut', () => {
    const tomorrow = (NOW.getDay() + 6) % 7 + 1;
    const plan: SportPlanEntry[] = [{ sport: 'volley', matchWeekday: tomorrow % 7 }];
    const s = ok(HOME(), req(), withSport([], plan));
    expect(s.softened).toBe(true);
    expect(s.jumps).toBeNull();
    expect(texts(s)).toMatch(/match/i);
    const in2 = ok(HOME({ level: 'avance' }), req(), withSport([], [{ sport: 'volley', matchWeekday: ((NOW.getDay() + 6) % 7 + 2) % 7 }]));
    expect(in2.jumps).toBeNull();
  });
  it('malaise ou vertige noté aujourd\'hui : aucune séance proposée', () => {
    const r = run(HOME(), req({ zone: 'haut' }), withSport([ss({ endedHoursAgo: 1, feelings: ['malaise_vertige'] })]));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('sport-malaise');
  });
  it('gêne répétée : renvoi vers un professionnel affiché, zone retirée (les exercices d\'épaule disparaissent)', () => {
    const g = (h: number) => ss({ sport: 'raquette', endedHoursAgo: h, feelings: ['gene_douleur'], painZone: 'epaule', effort: 'facile', durationMin: 30 });
    const s = ok(HOME(), req({ zone: 'haut', sport: 'raquette' }), withSport([g(60), g(30)]));
    expect(s.warnings.some((w) => w.id === 'sport-consulter')).toBe(true);
    expect(s.prevention).not.toContain('rotation-externe-epaule');
    const ids = s.exercises.map((e) => e.ficheId);
    for (const id of ['rotation-externe-epaule', 'face-pull-elastique', 'ytw-sol', 'pompe-plus', 'developpe-epaules-halteres']) expect(ids).not.toContain(id);
  });
  it('épaule chargée par le sport : ni poussée verticale, dips, lancer, ni exercice d\'épaule fragile ; « épaule fatiguée » : pas de prévention d\'épaule', () => {
    const ctx = withSport([ss({ sport: 'volley', endedHoursAgo: 20, effort: 'soutenue', feelings: ['epaule_fatiguee'] })]);
    const s = ok(HOME({ level: 'avance' }), req({ zone: 'haut', sport: 'volley' }), ctx);
    for (const e of s.exercises) {
      expect(e.schema).not.toBe('poussee_v');
      expect(['dips-banc-triceps', 'ytw-sol', 'pompe-plus', 'tirage-w-allonge', 'face-pull-elastique', 'rotation-externe-epaule']).not.toContain(e.ficheId);
    }
    expect(s.prevention).not.toContain('rotation-externe-epaule');
    expect(s.warnings.some((w) => w.id === 'sport-epaule')).toBe(true);
  });
  it('grossesse : jambes refusées, aucune prévention ni liste de sport ; la saisie reste possible avec la formulation « enregistrée, pas recommandée »', () => {
    const r = run(HOME({ preg: 'enceinte' }), req(), withSport([]));
    expect(r.ok).toBe(false);
    const s = ok(HOME({ preg: 'enceinte' }), req({ zone: 'haut', sport: 'volley' }), withSport([ss()]));
    expect(s.prevention).toEqual([]);
    const m = savedMessages({ feelings: [] }, 'enceinte', null).join(' ');
    expect(m).toMatch(/enregistrée, pas recommandée/);
    expect(m).toMatch(/saignement/);
    expect(savedMessages({ feelings: [] }, 'post_partum', null).join(' ')).toMatch(/pas recommandée/);
    expect(savedMessages({ feelings: [] }, null, null).join(' ')).not.toMatch(/pas recommandée/);
    expect(savedMessages({ feelings: ['malaise_vertige'] }, null, null).join(' ')).toMatch(/professionnel de santé/);
  });
  it('sport « autre » : aucune prévention, aucun saut ni liste ; la charge compte quand même', () => {
    const s = ok(HOME({ level: 'avance' }), req({ sport: 'autre', jumps: true }));
    expect(s.jumps).toBeNull();
    expect(s.prevention).toEqual([]);
    expect(s.warnings.some((w) => w.id === 'sport-autre')).toBe(true);
    const h = run(HOME(), req({ sport: 'autre' }), withSport([ss({ sport: 'autre', endedHoursAgo: 5 })]));
    expect(h.ok).toBe(false);
  });
  it('prévention : foot / volley / danse / raquette ; raquette avec son texte et 2 fois par semaine au plus ; aucun nom de programme affiché', () => {
    const foot = ok(HOME(), req({ zone: 'haut', sport: 'foot' }));
    expect(foot.prevention.length).toBeGreaterThanOrEqual(1);
    expect(foot.prevention.length).toBeLessThanOrEqual(3);
    const rq = ok(HOME(), req({ zone: 'haut', sport: 'raquette' }));
    expect(rq.prevention.length).toBeGreaterThanOrEqual(1);
    expect(rq.warnings.find((w) => w.id === 'prevention-raquette')?.text).toBe('Prévention inspirée d’autres sports, non démontrée pour le tennis, le badminton, le padel ou le squash.');
    const twice = ok(HOME(), req({ zone: 'haut', sport: 'raquette' }), { sessions: [{ endIso: new Date(NOW.getTime() - 24 * 3600_000).toISOString(), sport: 'raquette' }, { endIso: new Date(NOW.getTime() - 72 * 3600_000).toISOString(), sport: 'raquette' }] });
    expect(twice.prevention).toEqual([]);
    expect(twice.warnings.some((w) => w.id === 'prevention-raquette')).toBe(false);
    for (const sp of ['foot', 'volley', 'danse', 'raquette', 'basket', 'hand'] as const) {
      const blob = JSON.stringify(ok(HOME(), req({ zone: 'corps_entier', sport: sp }), withSport([])));
      expect(blob).not.toMatch(/FIFA|OSTRC|11\+/i);
    }
  });
  it('listes fermées : ids existants, lancer-rotation-mur et nordique absents, montée rapide sur chaise en début de séance (jamais en soutenue, ni après des sauts)', () => {
    for (const l of Object.values(SPORT_LISTS)) {
      for (const e of [...l.legs, ...l.upper]) {
        const f = FICHES.find((x) => x.id === e.id);
        expect(f, e.id).toBeDefined();
        for (const v of e.variants) expect(f!.variantes.some((x) => x.id === v), `${e.id}/${v}`).toBe(true);
      }
      for (const id of l.prevention) expect(FICHES.some((x) => x.id === id), id).toBe(true);
    }
    const all = JSON.stringify(SPORT_LISTS);
    expect(all).not.toMatch(/lancer-rotation-mur|nordique/);
    const calm = ok(HOME(), req({ sport: 'volley', jumps: false, intensity: 'moderee' }));
    expect(calm.exercises[0].ficheId).toBe('montee-rapide-chaise');
    expect(ok(HOME(), req({ sport: 'volley', jumps: false, intensity: 'soutenue' })).exercises.some((e) => e.ficheId === 'montee-rapide-chaise')).toBe(false);
    expect(ok(HOME(), req({ sport: 'volley', jumps: true, intensity: 'moderee' })).exercises[0]?.ficheId).not.toBe('montee-rapide-chaise');
    expect(ok(HOME({ level: 'debutant' }), req({ sport: 'volley', jumps: false })).exercises.some((e) => e.ficheId === 'montee-rapide-chaise')).toBe(false);
  });
  it('volley / basket / hand : pas de sauts en « soutenue », 2 séries au plus, pas de rebonds en reprise', () => {
    const s = ok(HOME(), req({ sport: 'basket', intensity: 'soutenue' }));
    expect(s.jumps).toBeNull();
    const m = ok(HOME(), req({ sport: 'basket', intensity: 'moderee' }));
    for (const j of m.jumps?.items ?? []) expect(j.sets).toBeLessThanOrEqual(2);
    const reprise = ok(HOME(), req({ sport: 'hand', durationMin: 60 }), { pauseOver2Weeks: true });
    expect((reprise.jumps?.items ?? []).some((j) => j.ficheId === 'rebonds-chevilles')).toBe(false);
  });
  it('jamais plus que sans sport : balayage 0 à 80 h, niveaux x efforts x (match / jour habituel / veille de match), sans tolérance', () => {
    const rank = { douce: 0, moderee: 1, soutenue: 2 } as const;
    const dow = (NOW.getDay() + 6) % 7;
    let compared = 0;
    for (const level of ['debutant', 'intermediaire', 'avance'] as const) {
      for (const intensity of ['douce', 'moderee', 'soutenue'] as const) {
        const r = req({ durationMin: 45, intensity });
        const none = run(HOME({ level }), r);
        if (!none.ok) continue;
        const scenarios: { ctx: (h: number, e: 'facile' | 'soutenue' | 'tres_dur') => CreateContext }[] = [
          { ctx: (h, e) => withSport([ss({ endedHoursAgo: h, effort: e, durationMin: 90 })]) },
          { ctx: (h, e) => withSport([ss({ endedHoursAgo: h, effort: e, durationMin: 60, match: true })]) },
          { ctx: () => withSport([], [{ sport: 'volley', weekdays: [(dow + 7 - Math.floor(Math.random() * 0)) % 7] }]) },
          { ctx: () => withSport([], [{ sport: 'volley', matchWeekday: (dow + 1) % 7 }]) },
          { ctx: (h) => withSport([], [{ sport: 'volley', weekdays: [(dow + 6) % 7, (dow + 5) % 7], matchWeekday: (dow + 2) % 7 }, ...(h > 0 ? [] : [])]) },
        ];
        for (const sc of scenarios) {
          for (let h = 0; h <= 80; h += 4) {
            for (const e of ['facile', 'soutenue', 'tres_dur'] as const) {
              const res = run(HOME({ level }), r, sc.ctx(h, e));
              if (!res.ok) continue; // un refus compte comme « pas plus »
              compared++;
              const s = res.session;
              const n = none.session;
              expect(s.contacts).toBeLessThanOrEqual(n.contacts);
              expect(s.totalSets).toBeLessThanOrEqual(n.totalSets);
              expect(rank[s.intensity]).toBeLessThanOrEqual(rank[n.intensity]);
              expect(s.exercises.length + (s.jumps?.items.length ?? 0)).toBeLessThanOrEqual(n.exercises.length + (n.jumps?.items.length ?? 0));
              expect(s.estimatedMin).toBeLessThanOrEqual(n.estimatedMin);
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(100);
  });
  it("gêne d'épaule (profil ou notée) avec volley / hand / raquette : rotation externe seule, aucun exercice fragile ni pullover, message d'arrêt", () => {
    const bad = ['ytw-sol', 'face-pull-elastique', 'tirage-w-allonge', 'pompe-plus', 'pullover-haltere-au-sol', 'planche-touche-epaule', 'glissement-mur-epaules'];
    const g = ss({ sport: 'volley', endedHoursAgo: 30, feelings: ['gene_douleur'], painZone: 'epaule', effort: 'facile', durationMin: 30 });
    const cases: [GeneratorInput, CreateContext][] = [
      [HOME({ injuries: [['epaule', 1]] }), withSport([])],
      [HOME(), withSport([g])],
    ];
    for (const sp of ['volley', 'hand', 'raquette'] as const) {
      for (const [input, ctx] of cases) {
        for (const zone of ['haut', 'corps_entier'] as const) {
          const s = ok(input, req({ zone, sport: sp }), ctx);
          const ids = s.exercises.map((e) => e.ficheId);
          for (const id of bad) expect(ids, `${sp} ${zone} ${id}`).not.toContain(id);
          expect(s.warnings.some((w) => w.id === 'sport-epaule-gene' && /si la gêne augmente/.test(w.text))).toBe(true);
          // aucune prévention d'épaule autre que la rotation externe
          for (const p of s.prevention) expect(['rotation-externe-epaule'].includes(p) || !bad.includes(p)).toBe(true);
        }
      }
    }
  });
  it("pullover-haltere-au-sol est exclu quand l'épaule est chargée par le sport", () => {
    const s = ok(HOME({ level: 'avance' }), req({ zone: 'haut', sport: 'volley' }), withSport([ss({ endedHoursAgo: 5, effort: 'soutenue' })]));
    expect(s.exercises.map((e) => e.ficheId)).not.toContain('pullover-haltere-au-sol');
    expect(UPPER_PUSH_IDS).toContain('pullover-haltere-au-sol');
  });
  it('gêne notée sans zone : aucun saut et message de prudence pendant 2 jours (et pas au-delà)', () => {
    const g = (h: number) => ss({ sport: 'danse', endedHoursAgo: h, feelings: ['gene_douleur'], effort: 'facile', durationMin: 30 });
    expect(sportLoad([g(30)], [], NOW).unknownPainRecent).toBe(true);
    expect(sportLoad([g(30 + 24 * 4)], [], NOW).unknownPainRecent).toBe(false);
    const s = ok(HOME({ level: 'avance' }), req({ sport: 'danse', durationMin: 45 }), withSport([g(30)]));
    expect(s.jumps).toBeNull();
    expect(s.warnings.some((w) => w.id === 'sport-gene-inconnue' && /pas de progression/.test(w.text))).toBe(true);
    const later = ok(HOME({ level: 'avance' }), req({ sport: 'danse', durationMin: 45 }), withSport([g(24 * 5)]));
    expect(later.warnings.some((w) => w.id === 'sport-gene-inconnue')).toBe(false);
  });
  it('une séance sans aucun sport connu se compose comme avant (aucun avertissement de sport)', () => {
    const s = ok(HOME(), req({ sport: null, jumps: true }), {});
    expect(s.warnings.some((w) => w.id.startsWith('sport'))).toBe(false);
    expect(s.prevention).toEqual([]);
  });
});
