// Retour utilisateur du 13/11/2026 : « abduction sur le côté : 12 par côté mais pas de séries par côté ».
// Une fiche dont la consigne dit « toutes les répétitions d'un côté, puis de l'autre » se joue par côté (gauche puis droite),
// sans changer les doses ni les règles « unilatéral » du générateur (débutant, réserve, plancher).
import { describe, expect, it } from 'vitest';
import { isPerSideVariant, isUnilateral } from '../../src/generator/context';
import { buildSteps, withPerSide, NEUTRAL_CONTEXT } from '../../src/session/engine';
import { lineText, targetText, withSides } from '../../src/ui/session/text';
import { day, ex } from './session-helpers';
import { FICHES as GEN_FICHES } from './generator-helpers';
import type { Fiche } from '../../src/data/fiches';

const FICHES = GEN_FICHES as unknown as Fiche[];

const abduction = FICHES.filter((f) => f.id.startsWith('abduction-') && f.id !== 'abduction-hanche-machine');

describe('abduction latérale et fiches « un côté puis l’autre » : séries par côté', () => {
  it('toutes les variantes d’abduction se jouent par côté, sans devenir « unilatérales » pour le générateur', () => {
    expect(abduction.length).toBeGreaterThanOrEqual(4);
    for (const f of abduction) {
      for (const v of f.variantes) {
        expect(isPerSideVariant(v), v.id).toBe(true);
        expect(isUnilateral(v), `${v.id} : règles unilatéral du générateur inchangées`).toBe(false);
      }
    }
  });

  it('aperçu : « 3 séries × 12 répétitions de chaque côté (gauche puis droite) »', () => {
    const e = ex({ movementId: 'abduction-couchee-cote', variantId: 'abduction-couchee-cote-base', sets: 3, repsMin: 12, repsMax: 12, restSec: 60 });
    expect(e.perSide).toBeUndefined();
    const shown = withSides(FICHES, e);
    expect(shown.perSide).toBe(true);
    expect(lineText(shown)).toBe('3 séries × 12 répétitions de chaque côté (gauche puis droite) · repos 1 min');
    expect(targetText(shown)).toContain('12 répétitions de chaque côté');
  });

  it('lecteur : chaque série est jouée à gauche puis à droite, le repos vient après le côté droit', () => {
    const d = day([ex({ movementId: 'abduction-couchee-cote', variantId: 'abduction-couchee-cote-base', sets: 3, repsMin: 12, repsMax: 12, restSec: 60 })]);
    const played = withPerSide(d, { ...NEUTRAL_CONTEXT, perSideOf: (e) => isPerSideVariant({ id: e.variantId, nom: '' }) });
    expect(buildSteps(played.exercises).map((s) => `${s.set}${s.side === 'gauche' ? 'G' : 'D'}`)).toEqual(['0G', '0D', '1G', '1D', '2G', '2D']);
  });

  it('durée par côté : « 2 séries × 30 s de chaque côté (gauche puis droite) »', () => {
    const e = ex({ variantId: 'x', unit: 'sec', holdSec: 30, repsMin: 30, repsMax: 30, sets: 2, perSide: true, restSec: 45 });
    expect(lineText(e)).toBe('2 séries × 30 s de chaque côté (gauche puis droite) · repos 45 s');
    expect(targetText(e)).toBe('30 s de chaque côté');
  });

  it('cohérence : une fiche dont TOUTES les variantes sont à un seul côté par la consigne est dans la liste', () => {
    const SAID = /(toutes les répétitions|tous les mouvements) d['’]un côté, puis|Finis la série d['’]un côté, puis change|Termine (les répétitions d['’])?un côté, puis change/i;
    const missing = FICHES.filter((f) => f.consignes.some((c) => SAID.test(c)) && f.variantes.every((v) => !isPerSideVariant(v))).map((f) => f.id);
    expect(missing).toEqual([]);
  });
});
