import { describe, expect, it } from 'vitest';
import { getGoals, goalsSummary, OBJECTIFS, setGoals, setMainGoal } from '../../src/data/profile-setup';
import { list } from '../../src/data/repo';

describe('objectifs : un principal, des secondaires (lot B2)', () => {
  it('« Prise de muscle » remplace « Muscle général » ; le cardio existe', () => {
    expect(OBJECTIFS.find((o) => o.value === 'muscle')?.label).toBe('Prise de muscle');
    expect(OBJECTIFS.some((o) => o.label === 'Muscle général')).toBe(false);
    expect(OBJECTIFS.some((o) => o.value === 'cardio' && o.label === 'Cardio')).toBe(true);
  });

  it('enregistre le principal en rang 1 et les secondaires dans l’ordre, sans doublon', async () => {
    await setGoals('muscle', ['force', 'cardio', 'force', 'muscle']);
    expect(await getGoals()).toEqual({ main: 'muscle', others: ['force', 'cardio'] });
    expect((await list('goals')).sort((a, b) => a.rank - b.rank).map((g) => `${g.rank}:${g.goalKey}`)).toEqual(['1:muscle', '2:force', '3:cardio']);
  });

  it('retirer un secondaire ; changer de principal garde les autres et retire le doublon', async () => {
    await setGoals('muscle', ['force', 'cardio']);
    await setGoals('muscle', ['cardio']);
    expect(await getGoals()).toEqual({ main: 'muscle', others: ['cardio'] });
    await setMainGoal('cardio');
    expect(await getGoals()).toEqual({ main: 'cardio', others: [] });
    expect(await list('goals')).toHaveLength(1);
  });

  it('résumé de la carte du profil', () => {
    expect(goalsSummary('muscle', ['cardio', 'force'])).toBe('Prise de muscle + Cardio, Force');
    expect(goalsSummary('sante', [])).toBe('Santé et forme');
    expect(goalsSummary(null, [])).toBe('—');
  });
});
