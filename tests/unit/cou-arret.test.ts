// Cou placé automatiquement : bloquants du relecteur (07/11/2026). (1) message d'arrêt copié dans le plan stocké et écrit dans la fiche ;
// (2) malaise ou douleur sur l'exercice du cou : retrait du cou (neckScreen -> 'oui', relu par le générateur).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plannedOf } from '../../src/generator';
import { CORRECTIF_COU } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { neckMustBeRemoved, profileAfterNeckStop, NECK_FICHE_ID } from '../../src/session/neck-stop';
import { mk } from './generator-helpers';

describe('Cou : message d’arrêt', () => {
  it('plannedOf copie le message pour le cou et pour lui seul', () => {
    const base = { movementId: 'x', variantId: 'v', sets: 1, repsMin: 1, repsMax: 1, restSec: 30, supersetGroup: null, rirTarget: 0, unit: 'sec', holdSec: 3, warmupSets: [], role: 'autre', slot: 'correctif', startLoadKg: null, capped: true, adaptation: null, substitut: false };
    const neck: any = { ...base, ficheId: CORRECTIF_COU.ficheId, cappedLabel: CORRECTIF_COU.stopMessage };
    const other: any = { ...base, ficheId: 'autre-fiche', cappedLabel: 'Charge maintenue : gêne dos' };
    expect(plannedOf(neck).cappedLabel).toBe(CORRECTIF_COU.stopMessage);
    expect(plannedOf(other).cappedLabel).toBeUndefined();
  });
  it('la fiche demande d’arrêter tout de suite en 1re consigne', () => {
    const t = readFileSync('knowledge/exercices/vague1/lot-04-cou/renfo-cou-isometrique.md', 'utf8').replace(/\r\n/g, '\n');
    expect(t).toContain('## Consignes\n1. Arrête tout de suite si tu ressens une douleur ou un vertige.');
  });
});

describe('Cou : retrait après malaise ou douleur', () => {
  const exercises = [{ movementId: 'squat' }, { movementId: NECK_FICHE_ID }];
  it('malaise (symptome, pas_bien) ou douleur sur le cou : retrait', () => {
    expect(neckMustBeRemoved({ endReason: 'symptome', painExercises: [], exercises })).toBe(true);
    expect(neckMustBeRemoved({ endReason: 'pas_bien' })).toBe(true);
    expect(neckMustBeRemoved({ endReason: 'terminee', painExercises: [1], exercises })).toBe(true);
  });
  it('douleur sur un autre exercice, séance normale ou abandon : pas de retrait', () => {
    expect(neckMustBeRemoved({ endReason: 'terminee', painExercises: [0], exercises })).toBe(false);
    expect(neckMustBeRemoved({ endReason: 'abandon', painExercises: [], exercises })).toBe(false);
  });
  it('le profil passe de « non » à « oui » et le générateur ne l’autorise plus', () => {
    expect(profileAfterNeckStop({ neckScreen: 'non' }).neckScreen).toBe('oui');
    expect(profileAfterNeckStop({ neckScreen: 'refus' }).neckScreen).toBe('refus');
    const i = mk({ goal: 'muscle', days: 4, dur: 45, profile: 'A0' });
    const ok = (n: 'non' | 'oui') => buildCtx({ ...i, profile: { ...i.profile, neckScreen: n } } as any).neckScreenOk;
    expect(ok('non')).toBe(true);
    expect(ok('oui')).toBe(false);
  });
});
