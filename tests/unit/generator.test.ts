// Tests du générateur v1 : T1-T47 de knowledge/generateur-v1.md §11 (chaque test cite sa règle), plus propriétés.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NECK_DEDICATED_IDS, neckFicheAllowed } from '../../src/data/injury-rules';
import { DOSE, PREGNANCY, TEMPS, WARMUP } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { chooseDays } from '../../src/generator/days';
import { buildExercise } from '../../src/generator/dose';
import { ajusterDuree, estimerDuree, type DurExercise, type DurSession } from '../../src/generator/duration';
import { generateProgram, nextCalibrationStep, painProposals, toProgramDays } from '../../src/generator/index';
import { allowedVariants, caseFor, chooseVariant, isCappedFiche, resolveFiche } from '../../src/generator/safety';
import type { Fiche, GeneratorInput, GenProgram, GenerateResult } from '../../src/generator/types';
import { allEx, byId, FICHES, LEVELS, mk, msgIds, PROFILE_KEYS, ZONES, type MkOpts } from './generator-helpers';

const ok = (r: GenerateResult): GenProgram => {
  if (!r.ok) throw new Error(`pas de programme : ${r.code} ${r.messages.map((m) => m.text).join(' / ')}`);
  return r.program;
};

/** Propriétés communes (V-ADM, V-MAT, V-BLESS, V-COU, V-GROS, P-CAP, V-DUREE, déterminisme) : liste des écarts (vide = OK). */
const FICHE_BY_ID = new Map(FICHES.map((f) => [f.id, f]));
const LOADED = ['halteres', 'kettlebell', 'machine', 'poulie', 'sac_a_dos', 'bidons_ou_sacs', 'lest'];
function violations(input: GeneratorInput, r: GenerateResult, determinism = true): string[] {
  const bad: string[] = [];
  const err = (cond: boolean, m: string) => { if (!cond) bad.push(m); };
  if (determinism) err(JSON.stringify(generateProgram(input)) === JSON.stringify(r), 'déterminisme');
  if (!r.ok) return bad;
  const p = r.program;
  const ctx = buildCtx(input);
  const fiche = (id: string) => FICHE_BY_ID.get(id) ?? input.fiches.find((f) => f.id === id)!;
  for (const s of p.sessions) {
    // V-DUREE : T <= D sauf séance réduite aux piliers (et au tronc du plancher, D26 CORE-TPS-1) qui dépasse encore (T3bis)
    if (s.overBudget) {
      err(s.removedCore.includes('charniere') && s.removedCore.includes('tirage_1'), `${s.label} dépasse sans être réduite aux piliers`);
      err(!s.exercises.some((e) => ['poussee_2', 'tirage_2', 'jambes_2', 'fonctionnel'].includes(e.slot)), `${s.label} dépasse avec des accessoires`);
    }
    else err(s.estimatedSec <= p.durationMin * 60, `${s.label} durée ${s.estimatedSec}`);
    const items = [...s.exercises.map((e) => [e.ficheId, e.variantId] as const), ...[s.warmup.general, ...s.warmup.mobility, s.warmup.cooldown].filter((w) => !!w).map((w) => [w!.ficheId, w!.variantId] as const)];
    for (const [fid, vid] of items) {
      const f = fiche(fid);
      err(['utilisable', 'verifie'].includes(f.statut), `statut ${fid}`); // V-ADM 1
      const v = f.variantes.find((x) => x.id === vid);
      if (!v) { bad.push(`variante ${vid}`); continue; }
      for (const t of v.tags) err(ctx.available.has(t), `${vid} : matériel ${t}`); // V-MAT
      if (ctx.specialiseForbidden) err(!v.tags.includes('materiel_specialise'), `${vid} spécialisé`); // règle 23
      err(neckFicheAllowed({ id: f.id, douxPour: f.douxPour }, ctx.neckLevel), `${fid} cou`); // V-COU
      for (const e of ctx.zones) {
        const c = caseFor(f, e);
        if (c.action === 'retirer') err(c.sansZone === vid, `${fid} retiré par ${e.key}`); // aucune case retirer violée
        if (c.sansCharge) err(!v.tags.some((t) => LOADED.includes(t)), `${vid} sans-charge`);
      }
    }
    for (const e of s.exercises) {
      err(!NECK_DEDICATED_IDS.includes(e.ficheId), `${e.ficheId} dédié cou`); // C2
      err(e.rirTarget > 0, `${e.ficheId} RIR 0`); // T32
      if (e.capped) {
        // jamais de hausse sous plafond : pas de 2e série E3, pas de série ajoutée par V-VOL
        err(!e.warmupSets.some((w) => w.percent === WARMUP.e3HeavyPercent), `${e.ficheId} E3 75 % sous plafond`);
        const base = TEMPS[e.schema]?.sets ?? (e.role === 'pilier' ? DOSE[p.family][p.level].setsPilier : DOSE[p.family][p.level].setsAutre);
        err(e.sets <= base, `${e.ficheId} séries au-dessus de la base sous plafond`);
      }
      if (p.pregnancy) {
        err(e.capped && e.sets <= (p.level === 'debutant' ? 1 : 2) && e.rirTarget >= 3 && e.supersetGroup === null, `${e.ficheId} P-GROS`);
        if (e.unit === 'reps' && e.rirAsked) err(e.repsMin === 10 && e.repsMax === 15, `${e.ficheId} répétitions grossesse`);
      }
    }
  }
  err(p.explanation.length === 2, 'explication');
  return bad;
}
function checkProgram(input: GeneratorInput, r: GenerateResult, determinism = true) {
  const v = violations(input, r, determinism);
  if (v.length) expect(v).toEqual([]);
}

const run = (o: MkOpts, determinism = true) => {
  const input = mk(o);
  const r = generateProgram(input);
  checkProgram(input, r, determinism);
  return r;
};

// ------------------------------------------------------------------------------------------------
describe('T1-T2 balayage : matériel, statut, durée, couverture, déterminisme (V-ADM, V-MAT, V-DUREE, V-FREQ)', () => {
  it('T1/T2 : A0, A-F x maison/salle x 2-3 jours x 3 niveaux x 3 familles x 30/45/60 min', () => {
    let n = 0;
    for (const profile of PROFILE_KEYS)
      for (const place of ['maison', 'salle'] as const)
        for (const days of [2, 3])
          for (const level of LEVELS)
            for (const goal of ['muscle', 'force', 'sante'])
              for (const dur of [30, 45, 60]) {
                const p = ok(run({ profile, place, days, level, goal, dur }));
                n++;
                // T2 : chaque GG >= 2 fois, ou V-MSG-FREQ si et seulement si un groupe < 2
                const low = Object.values(p.coverage).some((c) => c < 2);
                expect(msgIds(p).includes('V-MSG-FREQ')).toBe(low);
                if (days === 3 && dur >= 30) for (const c of Object.values(p.coverage)) expect(c >= 2 || low).toBe(true);
              }
    expect(n).toBe(7 * 2 * 2 * 3 * 3 * 3);
  }, 300000);
  it('seules les fiches utilisable/verifie sont lues, même si le JSON en contenait d\'autres (V-ADM 1)', () => {
    const brouillon = FICHES.map((f) => ({ ...f, id: `${f.id}-brouillon`, statut: 'brouillon_coach', variantes: f.variantes.map((v) => ({ ...v, id: `${v.id}-b` })) }));
    const p = ok(generateProgram(mk({ fiches: [...FICHES, ...brouillon] })));
    for (const e of allEx(p)) expect(e.ficheId.endsWith('-brouillon')).toBe(false);
    expect(FICHES.every((f) => ['utilisable', 'verifie'].includes(f.statut))).toBe(true);
  });
});

// ------------------------------------------------------------------------------------------------
type DE = DurExercise;
const ex = (slot: DE['slot'], o: Partial<DE> = {}): DE => ({
  slot, role: slot === 'jambes_genou' || slot === 'poussee_1' ? 'pilier' : slot === 'tronc' ? 'tronc' : 'autre', sets: 3, repsMin: 10, repsMax: 10,
  unit: 'reps', holdSec: null, restSec: 90, unilateral: false, capped: false, adaptations: [], chargeable: true, musclesPrincipaux: [slot],
  warmupSets: [], supersetGroup: null, ...o,
});
const exemple1 = (): DurSession => ({
  label: 'A', days: 3, level: 'intermediaire', pregnant: false, e1Sec: 120, e2Count: 2,
  exercises: [
    ex('jambes_genou', { restSec: 120, warmupSets: [{ reps: 8, percent: 50, echelon: null }] }),
    ex('poussee_1', { restSec: 120, warmupSets: [{ reps: 8, percent: 50, echelon: null }] }),
    ex('tirage_1'), ex('charniere'), ex('tronc'),
    ex('poussee_2', { musclesPrincipaux: ['deltoides_anterieurs'] }),
  ],
});

describe('T3, T25 : durée estimée et ajustement (V-DUREE, V-SUP)', () => {
  it('T25a : estimerDuree(exemple 1) = 2 644 s', () => {
    expect(estimerDuree(exemple1())).toBe(2644);
  });
  it('T25b : ajusterDuree(exemple 2, 45 min) : P1 (2 809 s) puis retrait de tirage_2 (2 644 s), aucune paire', () => {
    const s = exemple1();
    // D26 (SUP-0) : le matériel et le schéma doivent être connus pour former une paire (haltères légers : permis).
    const known = { tags: ['halteres'], backLoaded: false, niveau: 'intermediaire' as const };
    s.exercises = s.exercises.map((e) => (e.slot === 'poussee_2' ? { ...e, ...known, schema: 'poussee_h' } : e));
    s.exercises.push(ex('tirage_2', { musclesPrincipaux: ['grand_dorsal'], ...known, schema: 'tirage_v' }));
    const r = ajusterDuree(s, 2700);
    expect(r.trace).toEqual([3004, 2809, 2644]);
    expect(r.actions).toEqual(['paire:P1', 'retrait:tirage_2']);
    expect(r.session.exercises.every((e) => e.supersetGroup === null)).toBe(true);
  });
  // D26 (CORE-TPS-1) : un tronc au-delà du plancher est d'abord raccourci (2 -> 1 série) puis retiré ; au plancher, jamais retiré.
  it('T3c : exemple 3 construit à la main : 1 456 -> action 5 (1 351) -> tronc à 1 série (1 271) -> retrait de tronc (1 191)', () => {
    const s: DurSession = {
      label: 'A', days: 2, level: 'debutant', pregnant: false, e1Sec: 120, e2Count: 2,
      exercises: [
        ex('jambes_genou', { sets: 2, repsMin: 10, repsMax: 15, chargeable: false, warmupSets: [{ reps: 6, percent: null, echelon: 1 }] }),
        ex('poussee_1', { sets: 2, repsMin: 10, repsMax: 15, warmupSets: [{ reps: 8, percent: 50, echelon: null }] }),
        ex('tirage_1', { sets: 2, repsMin: 10, repsMax: 15, restSec: 60 }),
        ex('charniere', { sets: 2, repsMin: 10, repsMax: 15, restSec: 60 }),
        ex('tronc', { sets: 2, unit: 'sec', holdSec: 20, repsMin: 0, repsMax: 0, restSec: 60 }),
      ].map((e) => (e.role === 'pilier' ? { ...e, restSec: 90 } : e)),
    };
    const r = ajusterDuree(s, 1200);
    expect(r.trace).toEqual([1456, 1351, 1271, 1191]);
    expect(r.actions).toEqual(['echauffement:court', 'tronc:1serie', 'retrait:tronc']);
    expect(r.removedCore).toEqual(['tronc']);
    // Tronc du plancher protégé : la charnière part à sa place.
    const p = ajusterDuree(s, 1200, { coreProtected: true });
    expect(p.actions).toEqual(['echauffement:court', 'retrait:charniere']);
    expect(p.session.exercises.some((e) => e.slot === 'tronc')).toBe(true);
  });
  it('T3 : 2 jours, 20 min, débutant, santé, profil C : séance A de l\'exemple 3 (bibliothèque du 23/10/2026)', () => {
    // D26 (CORE-TPS-1, E1) : en 2 jours, le tronc fait partie du plancher (2 séances) et n'est plus retiré : la charnière part à sa place.
    const p = ok(run({ profile: 'C', days: 2, dur: 20, level: 'debutant', goal: 'sante' }));
    const A = p.sessions[0];
    expect(A.exercises.map((e) => e.ficheId)).toEqual(['assis-debout-mains-cuisses', 'developpe-au-sol-halteres', 'rowing-buste-penche-halteres', 'gainage-creux']);
    expect(A.removedCore).toEqual(['charniere']);
    expect(A.estimatedSec).toBeLessThanOrEqual(1200);
    expect(msgIds(p)).toContain('V-MSG-DUREE');
    expect(p.coverage.GG5).toBe(2);
    expect(p.messages.some((m) => m.id === 'V-MSG-FREQ' && m.data?.gg === 'GG5')).toBe(false);
  });
  it('T3bis : 3 jours, 20 min : ordre de retrait tourné ; un groupe retiré une seule fois reste à 2 et sans V-MSG-FREQ', () => {
    const p = ok(run({ profile: 'C', days: 3, dur: 20, level: 'debutant', goal: 'sante' }));
    const [A, B, C] = p.sessions;
    // D26 : au-delà du plancher, une seule séance (dans l'ordre A, C, B) peut perdre son tronc ; les autres retraits gardent la rotation.
    expect(p.sessions.filter((s) => s.removedCore.includes('tronc')).length).toBeLessThanOrEqual(1);
    if (B.removedCore.length) expect(B.removedCore[0]).toBe('charniere');
    if (C.removedCore.filter((x) => x !== 'tronc').length) expect(C.removedCore.filter((x) => x !== 'tronc')[0]).toBe('tirage_1');
    expect(A.removedCore.filter((x) => x !== 'tronc')[0] ?? 'charniere').toBe('charniere');
    const gg = { tronc: 'GG5', charniere: 'GG2', tirage_1: 'GG4' } as const;
    for (const slot of ['tronc', 'charniere', 'tirage_1'] as const) {
      const removedIn = p.sessions.filter((s) => s.removedCore.includes(slot)).length;
      if (removedIn === 1) {
        expect(p.coverage[gg[slot]]).toBe(2);
        expect(p.messages.some((m) => m.id === 'V-MSG-FREQ' && m.data?.gg === gg[slot])).toBe(false);
      }
    }
    for (const s of p.sessions) if (s.overBudget) expect(p.messages.some((m) => m.id === 'V-MSG-DUREE' && m.session === s.label && /minimale dure/.test(m.text))).toBe(true);
  });
});

// ------------------------------------------------------------------------------------------------
describe('T4-T7 : replis, achat, niveau, règle 23 (V-IMPOS, V-ACHAT, V-ADM, V-ECHELON)', () => {
  it('T4 : profil A0, 3 jours, intermédiaire, muscle, 45 min : substitut en tirage H, un seul achat (sac à dos)', () => {
    const p = ok(run({ profile: 'A0', days: 3, level: 'intermediaire', goal: 'muscle', dur: 45 }));
    const t = p.sessions[0].exercises.find((e) => e.slot === 'tirage_1')!;
    expect(['retraction-omoplates', 'ecartement-serviette', 'ytw-sol']).toContain(t.ficheId);
    expect(t.substitut).toBe(true);
    expect(msgIds(p)).toContain('V-MSG-SUBST');
    expect(p.messages.filter((m) => m.id === 'V-MSG-ACHAT' || m.id === 'V-MSG-OBJET')).toHaveLength(1);
    expect(p.achat).toEqual({ tag: 'sac_a_dos', gain: 3 });
    expect(p.messages.find((m) => m.id === 'V-MSG-OBJET')!.text).toContain('sac à dos');
  });
  it('T5 : débutant avec barre de traction : traction-barre jamais proposée', () => {
    for (const days of [2, 3]) {
      const p = ok(run({ profile: 'A0', extraTags: ['barre_traction'], level: 'debutant', days }));
      expect(allEx(p).some((e) => e.ficheId === 'traction-barre')).toBe(false);
    }
  });
  it('T6 : débutant : échelon le plus bas disponible, aucune fiche au-dessus de debutant', () => {
    for (const profile of PROFILE_KEYS)
      for (const goal of ['muscle', 'force', 'sante']) {
        const input = mk({ profile, level: 'debutant', goal });
        const p = ok(generateProgram(input));
        const ctx = buildCtx(input);
        for (const e of allEx(p)) {
          const f = byId(e.ficheId);
          expect(f.niveauMin).toBe('debutant');
          if (!e.adaptations.length && !e.replaces) expect(e.echelon).toBe(Math.min(...allowedVariants(f, ctx).map((v) => v.echelon)));
        }
      }
  }, 300000);
  it('T7 : maison ou débutant : aucune variante materiel_specialise (fiche de test ajoutée)', () => {
    const fake: Fiche = {
      ...byId('squat-gobelet'), id: 'aaa-test-sled', niveauMin: 'debutant',
      variantes: [{ id: 'aaa-sled', nom: 'Sled', echelon: 1, niveau: 'debutant', tags: ['materiel_specialise'] }],
    };
    const fiches = [fake, ...FICHES];
    for (const [place, level] of [['maison', 'avance'], ['salle', 'debutant'], ['maison', 'debutant']] as const) {
      const p = ok(run({ profile: 'F', place, level, fiches, extraTags: ['materiel_specialise'] }));
      expect(allEx(p).some((e) => e.variantId === 'aaa-sled')).toBe(false);
    }
    // salle + avancé : permis (contrôle que le filtre ne retire pas tout)
    const ctx = buildCtx(mk({ profile: 'F', place: 'salle', level: 'avance', fiches }));
    expect(allowedVariants(fake, ctx)).toHaveLength(1);
  });
});

// ------------------------------------------------------------------------------------------------
describe('T8-T16 : blessures et cou (V-BLESS, V-COU)', () => {
  it('T8 : genou niveau 3 : aucune case retirer violée, sans-zone respectée, message R3', () => {
    for (const profile of PROFILE_KEYS) {
      const r = run({ profile, injuries: [['genou', 3]] });
      const p = ok(r);
      expect(p.messages.some((m) => m.id === 'R3' && m.data?.zone === 'genou')).toBe(true);
    }
    const ctx = buildCtx(mk({ injuries: [['genou', 3]] }));
    const res = resolveFiche(byId('pompe'), ctx); // genou n3 : sans-zone:pompe-chaise
    expect(res.candidates[0].variant.id).toBe('pompe-chaise');
  });
  it('T9 : épaule n1 sur pompe = garder ; poignet n1 sur pompe = adapter variante pompe-chaise', () => {
    const pompe = byId('pompe');
    const ep = resolveFiche(pompe, buildCtx(mk({ level: 'intermediaire', injuries: [['epaule', 1]] })));
    expect(caseFor(pompe, { key: 'epaule', level: 1, isG: false }).action).toBe('garder');
    expect(ep.candidates[0].variant.id).toBe('pompe-sol');
    const po = resolveFiche(pompe, buildCtx(mk({ level: 'intermediaire', injuries: [['poignet', 1]] })));
    expect(po.candidates[0].variant.id).toBe('pompe-chaise');
    expect(po.candidates[0].adapted).toBe(true);
  });
  it('T10 : genou n1 -> variante X et dos n2 -> variante Y : Y (niveau le plus élevé), sinon la suivante', () => {
    const base = byId('pompe');
    const f: Fiche = {
      ...base, id: 'aaa-t10',
      securite: { ...base.securite, zones: { genou: [{ action: 'adapter', variante: 'pompe-genoux' }, { action: 'garder' }, { action: 'retirer' }], dos: [{ action: 'garder' }, { action: 'adapter', variante: 'pompe-chaise' }, { action: 'retirer' }] } },
      variantes: base.variantes.map((v) => ({ ...v })),
    };
    const ctx = buildCtx(mk({ fiches: [f, ...FICHES], injuries: [['genou', 1], ['dos', 2]] }));
    expect(resolveFiche(f, ctx).candidates[0].variant.id).toBe('pompe-chaise');
    // Y incompatible (pas de chaise) : la variante X du genou est retenue
    const input = mk({ fiches: [f, ...FICHES], injuries: [['genou', 1], ['dos', 2]] });
    input.equipment.disabledImplicit = ['chaise'];
    expect(resolveFiche(f, buildCtx(input)).candidates[0].variant.id).toBe('pompe-genoux');
  });
  it('T11/T33 : zone niveau 2 : capped sur toute fiche qui a une ligne pour la zone, y compris une ligne garder', () => {
    for (const zone of ZONES) {
      const p = ok(run({ profile: 'E', injuries: [[zone, 2]] }));
      for (const e of allEx(p)) if (byId(e.ficheId).securite.zones[zone]) expect(e.capped, `${zone} ${e.ficheId}`).toBe(true);
    }
    const zone = ZONES.find((z) => FICHES.some((f) => f.securite.zones[z]?.[1]?.action === 'garder'))!;
    const garder = FICHES.find((f) => f.securite.zones[zone]?.[1]?.action === 'garder')!;
    expect(garder).toBeTruthy();
    expect(isCappedFiche(garder, buildCtx(mk({ injuries: [[zone, 2]] })))).toBe(true);
  });
  it('T12 : adapter charge:legere -> capped, charge de départ = plus petit poids du profil', () => {
    let tested = 0;
    for (const f of FICHES) for (const zone of ZONES) for (const lvl of [1, 2] as const) {
      if (f.securite.zones[zone]?.[lvl - 1]?.charge !== 'legere') continue;
      const ctx = buildCtx(mk({ profile: 'E', level: 'avance', injuries: [[zone, lvl]], options: { habitualLoadsKg: { [f.id]: 20 } } }));
      const c = resolveFiche(f, ctx).candidates[0];
      if (!c || c.fiche.id !== f.id) continue;
      expect(c.capped).toBe(true);
      const e = buildExercise(c, 'tirage_1', 'a', ctx);
      if (c.variant.tags.includes('halteres')) expect(e.startLoadKg).toBe(2);
      tested++;
    }
    expect(tested).toBeGreaterThan(0);
  });
  it('T13 : remplaçant lui-même retiré (dead-bug en grossesse) : jamais proposé', () => {
    const ctx = buildCtx(mk({ injuries: [['poignet', 3]], preg: 'enceinte' }));
    expect(resolveFiche(byId('bird-dog'), ctx).candidates).toHaveLength(0);
    const p = ok(run({ injuries: [['poignet', 3]], preg: 'enceinte' }));
    expect(allEx(p).some((e) => e.ficheId === 'dead-bug')).toBe(false);
  });
  it('T14 : cou niveau 1 ou 2 : au plus 1 fiche douce cou en échauffement, aucune fiche dédiée dans un emplacement', () => {
    for (const lvl of [1, 2] as const) {
      const p = ok(run({ injuries: [['cou', lvl]] }));
      for (const s of p.sessions) {
        const douces = s.warmup.mobility.filter((w) => byId(w.ficheId).douxPour.includes('cou') && NECK_DEDICATED_IDS.includes(w.ficheId));
        expect(douces.length).toBeLessThanOrEqual(1);
        expect(douces.length).toBe(1);
        for (const e of s.exercises) expect(NECK_DEDICATED_IDS).not.toContain(e.ficheId);
      }
    }
  });
  it('T15 : cou niveau 3 ou après un choc : aucune fiche douce ni dédiée ; message C3 ou R3', () => {
    for (const inj of [[['cou', 3]], [['cou', 1, { afterShock: true }]]] as MkOpts['injuries'][]) {
      const p = ok(run({ injuries: inj }));
      for (const s of p.sessions)
        for (const id of [...s.exercises.map((e) => e.ficheId), ...s.warmup.mobility.map((w) => w.ficheId)]) {
          expect(byId(id).douxPour).not.toContain('cou');
          expect(NECK_DEDICATED_IDS).not.toContain(id);
        }
      expect(msgIds(p).some((id) => id === 'C3' || id === 'R3')).toBe(true);
    }
    expect(msgIds(ok(run({ injuries: [['cou', 1, { afterShock: true }]] })))).toContain('C3');
  });
  it('T16 : aucune blessure au cou : aucune fiche dédiée nulle part', () => {
    for (const profile of PROFILE_KEYS) {
      const p = ok(run({ profile }));
      for (const s of p.sessions) for (const id of [...s.exercises.map((e) => e.ficheId), ...s.warmup.mobility.map((w) => w.ficheId)]) expect(NECK_DEDICATED_IDS).not.toContain(id);
    }
  });
});

// ------------------------------------------------------------------------------------------------
describe('T17-T18, T37, T43-T44 : grossesse et post-partum (V-PRIO, P-GROS, V-GROS)', () => {
  it('T17 : chaque famille x chaque niveau (et niveau absent) : dose santé plafonnée, 1 ou 2 séries, pas de superset ni V-MSG-FORCE', () => {
    for (const goal of ['muscle', 'force', 'sante'])
      for (const level of [...LEVELS, null])
        for (const profile of ['A0', 'C', 'F']) {
          const p = ok(run({ profile, goal, level, preg: 'enceinte', dur: 75, options: { gagnerDuTemps: true } }));
          expect(p.family).toBe('sante');
          for (const e of allEx(p)) {
            expect(e.sets).toBe(level === null || level === 'debutant' ? 1 : 2);
            if (e.role === 'pilier') {
              expect(e.warmupSets.length).toBeLessThanOrEqual(1);
              if (e.chargeable) expect(e.warmupSets[0].percent).toBe(50);
            }
            expect(['dead-bug', 'pont-fessier']).not.toContain(e.ficheId);
            if (e.unit === 'reps' && e.rirAsked) expect(e.repsMin).toBeGreaterThanOrEqual(10);
            if (e.isCalibration && e.chargeable && e.variantId.includes('halteres')) expect(e.startLoadKg).toBe(2);
          }
          expect(p.explanation[1]).toMatch(/^Grossesse/);
          expect(p.explanation.join(' ')).not.toMatch(/charges lourdes/);
          expect(msgIds(p)).not.toContain('V-MSG-FORCE');
          expect(msgIds(p)).not.toContain('V-MSG-VOL');
          for (const s of p.sessions) expect(s.estimatedSec).toBeLessThanOrEqual(60 * 60);
        }
  }, 300000);
  it('T18 : post-partum : aucune fiche saut, E1 sans saut', () => {
    const p = ok(run({ profile: 'F', place: 'salle', preg: 'post_partum' }));
    for (const s of p.sessions) {
      expect(s.exercises.every((e) => byId(e.ficheId).schema !== 'saut')).toBe(true);
      expect(s.warmup.general?.variantId ?? '').not.toMatch(/saut/);
    }
  });
  it('T37 : grossesse + « sans limite », puis + 75 min : séances <= 60 min et V-MSG-GROS-DUREE', () => {
    for (const dur of [null, 75]) {
      const p = ok(run({ preg: 'enceinte', dur }));
      expect(p.durationMin).toBe(60);
      for (const s of p.sessions) expect(s.estimatedSec).toBeLessThanOrEqual(3600);
      expect(msgIds(p)).toContain('V-MSG-GROS-DUREE');
    }
  });
  it('T43 : grossesse, étalonnage, réserve 4+ au haut de la fourchette : aucune hausse (capped)', () => {
    const p = ok(run({ preg: 'enceinte' }));
    const e = allEx(p).find((x) => x.chargeable)!;
    expect(e.capped).toBe(true);
    const r = nextCalibrationStep({ rir: 4, reps: 15, repsMin: 10, repsMax: 15, rirTarget: 3, capped: e.capped, pain: false, loadKg: 2, availableLoadsKg: [2, 4, 6] });
    expect(r.action).toBe('garder');
    expect(r.loadKg).toBe(2);
  });
  it('T44 : grossesse ou capped, variante AVEC historique : variante et dernière charge sans douleur conservées', () => {
    const history = [
      { variantId: 'squat-gobelet-haltere', loadKg: 6, completedAt: '2026-10-01T10:00:00Z', pain: false },
      { variantId: 'squat-gobelet-haltere', loadKg: 8, completedAt: '2026-10-03T10:00:00Z', pain: true },
    ];
    for (const o of [{ preg: 'enceinte' as const }, { injuries: [['genou', 2]] as MkOpts['injuries'] }]) {
      const ctx = buildCtx(mk({ profile: 'C', level: 'avance', history, ...o }));
      const f = byId('squat-gobelet');
      const v = chooseVariant(f, allowedVariants(f, ctx), ctx, true);
      expect(v.id).toBe('squat-gobelet-haltere');
      const c = { fiche: f, variant: v, origin: f, adapted: false, capped: true, adaptations: [], notes: [], replaces: null };
      const e = buildExercise(c, 'jambes_genou', 'a', ctx);
      expect(e.startLoadKg).toBe(6);
      expect(e.isCalibration).toBe(false);
    }
  });
});

// ------------------------------------------------------------------------------------------------
describe('T19-T21, T41 : jours (V-JOURS, V-PER)', () => {
  it('T19 : 3 jours sans jour bloqué : lundi, mercredi, vendredi ; 2 jours : lundi, jeudi', () => {
    expect(ok(run({ days: 3 })).sessions.map((s) => s.weekday)).toEqual([0, 2, 4]);
    expect(ok(run({ days: 2 })).sessions.map((s) => s.weekday)).toEqual([0, 3]);
  });
  it('T20 : 3 jours, seuls lundi-jeudi libres : 2 séances (lundi, jeudi) et V-MSG-JOURS', () => {
    const p = ok(run({ days: 3, blocked: [4, 5, 6] }));
    expect(p.sessions.map((s) => s.weekday)).toEqual([0, 3]);
    expect(msgIds(p)).toContain('V-MSG-JOURS');
  });
  // D25 (structure-programmes.md, E-1, E-14) : 1 à 6 jours sont générés ; seul un nombre absent ou hors 1-6 donne V-MSG-HORS.
  it('T21 (D25) : nombre de jours absent ou hors 1-6 : aucun programme, V-MSG-HORS ; 1, 4, 5, 6 jours : un programme', () => {
    for (const days of [0, 7, null]) {
      const r = run({ days });
      expect(r.ok).toBe(false);
      expect(msgIds(r)).toEqual(['V-MSG-HORS']);
    }
    for (const days of [1, 4, 5, 6]) expect(run({ days }).ok).toBe(true);
  });
  // D25 (STR-REP-8, E-14) : repli N -> 1, jamais « aucun programme » ; à 1 séance, avertissement STR-REP-1 (V-MSG-UN-JOUR).
  it('T41 (D25) : samedi-dimanche seuls, puis un seul jour libre : 1 séance corps entier, V-MSG-JOURS et V-MSG-UN-JOUR', () => {
    for (const [days, blocked] of [[2, [0, 1, 2, 3, 4]], [2, [0, 1, 2, 3, 4, 5]], [3, [0, 1, 2, 3, 4, 5]]] as const) {
      const r = run({ days, blocked: [...blocked] });
      expect(r.ok).toBe(true);
      if (!r.ok) continue;
      expect(r.program.sessions.map((s) => s.label)).toEqual(['A']);
      expect(msgIds(r.program)).toEqual(expect.arrayContaining(['V-MSG-JOURS', 'V-MSG-UN-JOUR']));
    }
  });
  it('T41 (3e cas) : 3 jours, vendredi-samedi-dimanche : vendredi et dimanche sont à 48 h -> 2 séances (lecture de la règle §2.4, voir notes)', () => {
    const c = chooseDays([0, 1, 2, 3], 3);
    expect(c).toEqual({ ok: true, days: [4, 6], reduced: true });
  });
});

// ------------------------------------------------------------------------------------------------
describe('T22-T26 : dose, supersets, volume (V-DOSE, V-ORDRE, V-SUP, V-VOL, V-PLAF)', () => {
  it('T22 : force, intermédiaire, profil C : piliers en tête, 4-6 répétitions, repos 180 s, variante haltères', () => {
    const p = ok(run({ profile: 'C', goal: 'force', level: 'intermediaire' }));
    for (const s of p.sessions) {
      expect(s.exercises.slice(0, 2).map((e) => e.role)).toEqual(['pilier', 'pilier']);
      for (const e of s.exercises.filter((x) => x.role === 'pilier' && x.chargeable)) {
        expect([e.repsMin, e.repsMax]).toEqual([4, 6]);
        expect(e.restSec).toBe(180);
        expect(byId(e.ficheId).variantes.find((v) => v.id === e.variantId)!.tags).toContain('halteres');
      }
    }
    expect(p.sessions[0].exercises[0].chargeable).toBe(true);
  }, 300000);
  it('T23 : force, profil A0 : piliers à 10-15 répétitions, V-MSG-FORCE', () => {
    const p = ok(run({ profile: 'A0', goal: 'force' }));
    for (const e of allEx(p).filter((x) => x.role === 'pilier')) expect([e.repsMin, e.repsMax]).toEqual([10, 15]);
    expect(msgIds(p)).toContain('V-MSG-FORCE');
  });
  it('T24/T25c : supersets formés : aucun muscle principal commun, jamais deux jambes, jamais piliers ni charnière, repos = le plus long', () => {
    let pairs = 0;
    for (const profile of PROFILE_KEYS)
      for (const level of LEVELS)
        for (const goal of ['muscle', 'force', 'sante'])
          for (const dur of [30, 60, 75]) {
            const p = ok(run({ profile, level, goal, dur, options: { gagnerDuTemps: dur === 75 } }));
            for (const s of p.sessions) {
              const groups = new Map<string, typeof s.exercises>();
              for (const e of s.exercises) if (e.supersetGroup) groups.set(e.supersetGroup, [...(groups.get(e.supersetGroup) ?? []), e]);
              for (const [, [a, b]] of groups) {
                pairs++;
                expect(a.musclesPrincipaux.some((m) => b.musclesPrincipaux.includes(m))).toBe(false);
                expect([a.slot, b.slot].every((x) => ['jambes_genou', 'jambes_2'].includes(x))).toBe(false);
                for (const e of [a, b]) expect(['jambes_genou', 'poussee_1', 'charniere'].includes(e.slot)).toBe(false);
                expect(a.restSec).toBe(b.restSec);
                expect(level).not.toBe('debutant'); // D26 SUP-4 : aucun superset pour un débutant
                for (const e of [a, b]) expect(['poussee_2', 'tirage_2', 'jambes_2', 'tronc'].includes(e.slot)).toBe(true); // SUP-0
                expect(a.capped || b.capped).toBe(false);
              }
            }
          }
    expect(pairs).toBeGreaterThan(0);
  }, 300000);
  it('T26 : muscle intermédiaire 2 jours : <= 10 séries fractionnaires par muscle et par séance, <= 20 par semaine, V-MSG-VOL sinon', () => {
    const frac = (e: { musclesPrincipaux: string[]; musclesSecondaires: string[]; sets: number }, m: string) => e.sets * (e.musclesPrincipaux.includes(m) ? 1 : e.musclesSecondaires.includes(m) ? 0.5 : 0);
    for (const profile of PROFILE_KEYS)
      for (const dur of [30, 45, 60, 75, null]) {
        const p = ok(run({ profile, days: 2, goal: 'muscle', level: 'intermediaire', dur }));
        const muscles = [...new Set(allEx(p).flatMap((e) => [...e.musclesPrincipaux, ...e.musclesSecondaires]))];
        for (const m of muscles) {
          for (const s of p.sessions) expect(s.exercises.reduce((a, e) => a + frac(e, m), 0)).toBeLessThanOrEqual(10);
          const week = allEx(p).reduce((a, e) => a + frac(e, m), 0);
          expect(week).toBeLessThanOrEqual(20);
          if (['quadriceps', 'fessiers', 'ischios', 'pectoraux', 'grand_dorsal'].includes(m) && week < 10) expect(p.messages.some((x) => x.id === 'V-MSG-VOL')).toBe(true);
        }
        for (const e of allEx(p)) expect(e.sets).toBeLessThanOrEqual(4);
        for (const s of p.sessions) {
          expect(s.exercises.length).toBeLessThanOrEqual(8);
          expect(s.exercises.reduce((a, e) => a + e.sets, 0)).toBeLessThanOrEqual(24);
        }
      }
  });
});

// ------------------------------------------------------------------------------------------------
describe('T27-T29, T35-T36, T39-T40 : étalonnage, rotation, échelons (V-ETAL, V-ROT, V-ECHELON)', () => {
  it('T27 : variante sans historique -> isCalibration ; avec historique -> false', () => {
    const p = ok(run({}));
    const first = allEx(p)[0];
    expect(first.isCalibration).toBe(true);
    const p2 = ok(run({ history: [{ variantId: first.variantId, loadKg: null, completedAt: '2026-10-01T00:00:00Z', pain: false }] }));
    expect(allEx(p2).find((e) => e.variantId === first.variantId)!.isCalibration).toBe(false);
  });
  it('T28/T39 : réserve 4+ au haut de la fourchette : hausse ; capped : inchangé ; cible 2 et « 4+ » ; cible 1 et réserve 3', () => {
    const base = { reps: 12, repsMin: 8, repsMax: 12, pain: false, loadKg: 6, availableLoadsKg: [4, 6, 8] };
    expect(nextCalibrationStep({ ...base, rir: 4, rirTarget: 3, capped: false })).toMatchObject({ action: 'hausse', loadKg: 8 });
    expect(nextCalibrationStep({ ...base, rir: 4, rirTarget: 3, capped: true })).toMatchObject({ action: 'garder', loadKg: 6 });
    expect(nextCalibrationStep({ ...base, rir: 4, rirTarget: 2, capped: false }).action).toBe('hausse');
    expect(nextCalibrationStep({ ...base, rir: 3, rirTarget: 1, capped: false }).action).toBe('hausse');
    expect(nextCalibrationStep({ ...base, rir: 3, rirTarget: 2, capped: false }).action).toBe('garder');
    // baisse toujours permise, même capped ; douleur : arrêt
    expect(nextCalibrationStep({ ...base, rir: 0, rirTarget: 3, capped: true })).toMatchObject({ action: 'baisse', loadKg: 4 });
    expect(nextCalibrationStep({ ...base, rir: 4, rirTarget: 3, capped: false, pain: true }).action).toBe('arret');
    // poids du corps : échelon + 1
    expect(nextCalibrationStep({ ...base, loadKg: null, echelon: 2, availableEchelons: [1, 2, 3], rir: 4, rirTarget: 3, capped: false })).toMatchObject({ action: 'hausse', echelon: 3 });
  });
  it('T29 : même emplacement en A et C avec >= 2 fiches admissibles : fiches différentes, identiques chaque semaine', () => {
    const p = ok(run({ profile: 'F', place: 'salle', days: 3, level: 'intermediaire' }));
    const [A, , C] = p.sessions;
    const slotA = A.exercises.find((e) => e.slot === 'jambes_genou')!;
    const slotC = C.exercises.find((e) => e.slot === 'jambes_genou')!;
    expect(slotA.ficheId).not.toBe(slotC.ficheId);
    expect(p.weeks).toBe(4);
    expect(toProgramDays(p)).toHaveLength(3); // une semaine type, répétée pendant le bloc
  });
  it('T35 : capped sans historique, intermédiaire avec charge habituelle : plus petit poids ; poids du corps : échelon le plus bas', () => {
    const ctx = buildCtx(mk({ profile: 'C', level: 'intermediaire', injuries: [['genou', 2]], options: { habitualLoadsKg: { 'squat-gobelet': 14 } } }));
    const f = byId('squat-gobelet');
    const c = { fiche: f, variant: f.variantes[0], origin: f, adapted: false, capped: true, adaptations: [], notes: [], replaces: null };
    expect(buildExercise(c, 'jambes_genou', 'a', ctx).startLoadKg).toBe(2);
    const pompe = byId('pompe');
    expect(chooseVariant(pompe, allowedVariants(pompe, ctx), ctx, true).echelon).toBe(1);
    // sans plafond, la charge déclarée est utilisée
    const ctx2 = buildCtx(mk({ profile: 'C', level: 'intermediaire', options: { habitualLoadsKg: { 'squat-gobelet': 14 } } }));
    expect(buildExercise({ ...c, capped: false }, 'jambes_genou', 'a', ctx2).startLoadKg).toBe(14);
  });
  it('T36 : « ça fait mal » sur la même zone deux séances de suite : proposition, aucun changement automatique', () => {
    const levels = { genou: 1 } as const;
    const r = painProposals([['genou'], ['genou', 'inconnu']], levels);
    expect(r.proposals).toEqual([{ zone: 'genou', from: 1, to: 2 }]);
    expect(levels).toEqual({ genou: 1 });
    expect(painProposals([['genou'], []], levels).proposals).toEqual([]);
    expect(painProposals([['dos'], ['dos']], { dos: 2 }).proposals).toEqual([{ zone: 'dos', from: 2, to: 3 }]);
    expect(painProposals([['inconnu'], ['inconnu']], {}).s1Message).toBe(true);
  });
  it('T40 : pompe : intermédiaire -> pompe-sol (échelon 4) ; avancé -> échelon le plus haut permis', () => {
    const pompe = byId('pompe');
    const ci = buildCtx(mk({ level: 'intermediaire' }));
    expect(chooseVariant(pompe, allowedVariants(pompe, ci), ci, false).id).toBe('pompe-sol');
    const ca = buildCtx(mk({ level: 'avance' }));
    expect(chooseVariant(pompe, allowedVariants(pompe, ca), ca, false).id).toBe('pompe-pieds-sureleves');
  });
});

// ------------------------------------------------------------------------------------------------
describe('T30-T34, T38, T45-T47 : zones niveau 3, explication, plafonds', () => {
  it('T30 : genou, dos et épaule au niveau 3 : aucun programme, V-MSG-PRO', () => {
    const r = run({ injuries: [['genou', 3], ['dos', 3], ['epaule', 3]] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('PRO');
    expect(msgIds(r)).toContain('V-MSG-PRO');
  });
  it('T30bis : épaule niveau 3 (vide 1 ou 2 emplacements du noyau) : programme partiel, V-MSG-ZONE + R3 + V-MSG-FREQ, pas d\'achat', () => {
    const p = ok(run({ profile: 'C', injuries: [['epaule', 3]] }));
    expect(msgIds(p)).toEqual(expect.arrayContaining(['V-MSG-ZONE', 'R3', 'V-MSG-FREQ']));
    expect(msgIds(p).some((id) => id === 'V-MSG-ACHAT' || id === 'V-MSG-OBJET')).toBe(false);
  });
  it('T31 : explication = exactement 2 lignes, sans élément d\'IA', () => {
    for (const profile of PROFILE_KEYS) {
      const p = ok(run({ profile, goal: 'perte_gras' }));
      expect(p.explanation).toHaveLength(2);
      for (const l of p.explanation) expect(l).not.toMatch(/\bIA\b|intelligence artificielle/i);
      expect(p.explanation[1]).toMatch(/^Perte de gras : en attendant la version dédiée/);
    }
  });
  it('T32 : réserve cible jamais 0', () => {
    for (const level of LEVELS) for (const goal of ['muscle', 'force', 'sante']) for (const e of allEx(ok(run({ profile: 'F', place: 'salle', level, goal })))) expect(e.rirTarget).toBeGreaterThan(0);
  });
  it('T34 : fiche capped, muscle intermédiaire sous 10 séries : aucune série ajoutée à cette fiche, V-MSG-VOL', () => {
    const p = ok(run({ profile: 'D', days: 2, level: 'intermediaire', goal: 'muscle', injuries: [['genou', 2]] }));
    for (const e of allEx(p).filter((x) => x.capped)) expect(e.sets).toBeLessThanOrEqual(3);
    expect(msgIds(p)).toContain('V-MSG-VOL');
  });
  it('T38 : deux zones (n3 et n2) qui retirent le même schéma : V-MSG-ZONE cite les deux', () => {
    const p = ok(run({ profile: 'C', injuries: [['epaule', 3], ['coude', 2]] }));
    expect(p.messages.some((m) => m.id === 'V-MSG-ZONE' && (m.data?.zones as string[]).includes('epaule') && (m.data?.zones as string[]).includes('coude'))).toBe(true);
  });
  it('T45 : intermédiaire, genou niveau 2 : jambes_genou de niveau_min le plus bas (sous-clé « niveau de la personne » désactivée)', () => {
    const p = ok(run({ profile: 'F', place: 'salle', level: 'intermediaire', injuries: [['genou', 2]] }));
    for (const s of p.sessions) {
      const e = s.exercises.find((x) => x.slot === 'jambes_genou')!;
      expect(byId(e.ficheId).niveauMin).toBe('debutant');
    }
  });
  it('T46 : zone niveau 3 qui retire les fiches pleines mais laisse un substitut : emplacement non compté vide (P-ZONE3)', () => {
    // Bibliothèque de test : coude n3 retire toutes les fiches pleines de poussée et de tirage, pas les substituts.
    const fiches = FICHES.map((f) =>
      ['poussee_h', 'poussee_v', 'tirage_h', 'tirage_v'].includes(f.schema) && !f.couverture
        ? { ...f, securite: { ...f.securite, zones: { ...f.securite.zones, coude: [{ action: 'garder' as const }, { action: 'garder' as const }, { action: 'retirer' as const }] } } }
        : { ...f, securite: { ...f.securite, zones: { ...f.securite.zones, coude: [{ action: 'garder' as const }, { action: 'garder' as const }, { action: 'garder' as const }] } } },
    );
    const p = ok(generateProgram(mk({ profile: 'C', fiches, injuries: [['coude', 3]] })));
    const t = p.sessions[0].exercises.find((e) => e.slot === 'tirage_1')!;
    expect(t.substitut).toBe(true);
  });
  it('T47 : 3 jours, 20 min, retraits tournés : ligne 1 = « au moins 2 fois », jamais « 3 fois »', () => {
    for (const profile of ['A', 'C', 'F']) {
      const p = ok(run({ profile, days: 3, dur: 20, level: 'intermediaire' }));
      if (p.sessions.some((s) => s.removedCore.length)) expect(p.explanation[0]).not.toMatch(/3 fois/);
      if (Math.min(...Object.values(p.coverage)) === 2) expect(p.explanation[0]).toContain('au moins 2 fois');
    }
  });
  it('T42 : sources citées SRC1-SRC15 ; « S1-S3 » réservé aux signes d\'alerte', () => {
    for (const f of readdirSync('src/generator')) {
      const txt = readFileSync(`src/generator/${f}`, 'utf8');
      for (const m of txt.matchAll(/\bSRC(\d+)\b/g)) expect(Number(m[1])).toBeLessThanOrEqual(15);
      expect(txt).not.toMatch(/\bS(?:[4-9]|1\d)\b/);
    }
  });
});

// ------------------------------------------------------------------------------------------------
describe('Propriétés : profils A-F x maison/salle x 2-3 jours x niveaux x blessures n1-3 par zone, grossesse, cou', () => {
  it('aucune variante hors matériel, aucune case retirer violée, plafonds, durée, déterminisme', () => {
    let count = 0;
    const outcomes: Record<string, number> = {};
    for (const profile of PROFILE_KEYS)
      for (const place of ['maison', 'salle'] as const)
        for (const days of [2, 3])
          for (const level of LEVELS) {
            const cases: MkOpts[] = [{}, { preg: 'enceinte' }, { preg: 'post_partum' }, { injuries: [['cou', 2]] }, { injuries: [['cou', 1, { afterShock: true }]] }];
            for (const zone of ZONES) for (const lvl of [1, 2, 3] as const) cases.push({ injuries: [[zone, lvl]] });
            for (const c of cases) {
              const r = run({ profile, place, days, level, dur: 45, ...c }, count % 5 === 0); // déterminisme vérifié sur 1 cas sur 5 (et sur tout T1)
              count++;
              const k = r.ok ? (r.program.messages.some((m) => m.id === 'V-MSG-FREQ') ? 'avertissement' : 'programme') : r.code;
              outcomes[k] = (outcomes[k] ?? 0) + 1;
            }
          }
    expect(count).toBe(7 * 2 * 2 * 3 * 35);
    expect(outcomes.programme).toBeGreaterThan(0);
  }, 300000);
  it('les doses de base viennent de config (contrôle de quelques valeurs P-GROS)', () => {
    expect(PREGNANCY.reps).toEqual([10, 15]);
  });
});
