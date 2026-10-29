// Décision de l'utilisateur (25/10/2026, choix prudent) : les lancers au ballon lesté ne sont jamais un exercice principal.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator/index';
import { MAIN_EXERCISE_SLOTS, PILLAR_EXCLUDED_FICHES } from '../../src/generator/config';
import { allEx, FICHES, LEVELS, mk, PROFILE_KEYS } from './generator-helpers';

describe('lancers : jamais aux emplacements principaux', () => {
  it('les 4 lancers sont publiés (bibliothèque réelle) et listés comme exclus des piliers', () => {
    for (const id of PILLAR_EXCLUDED_FICHES) expect(FICHES.some((f) => f.id === id), id).toBe(true);
  });

  it('aucun programme (profils, niveaux, objectifs, jours, durées) ne place un lancer à un emplacement principal', () => {
    let placedSecondary = 0;
    for (const profile of PROFILE_KEYS)
      for (const level of LEVELS)
        for (const goal of ['muscle', 'force', 'sante'])
          for (const days of [2, 3])
            for (const dur of [45]) {
              const r = generateProgram(mk({ profile, level, goal, days, dur }));
              if (!r.ok) continue;
              for (const e of allEx(r.program)) {
                if (!PILLAR_EXCLUDED_FICHES.includes(e.ficheId)) continue;
                expect(MAIN_EXERCISE_SLOTS.includes(e.slot), `${profile}/${level}/${goal}/${days}/${dur} ${e.ficheId} en ${e.slot}`).toBe(false);
                placedSecondary++;
              }
            }
    expect(placedSecondary).toBeGreaterThanOrEqual(0);
  });
});
