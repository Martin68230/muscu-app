import { describe, expect, it } from 'vitest';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { list } from '../../src/data/repo';
import { addWeighIn, getActiveGoal, getNutritionProfile, listCheckins, listWeighIns, removeWeighIn, saveGoal, saveNutritionProfile } from '../../src/nutrition/store';

describe('stockage nutrition (local, privé)', () => {
  it('profil nutrition : créé une fois puis mis à jour, valeurs par défaut privées', async () => {
    await ensureLocalUser();
    expect(await getNutritionProfile()).toBeNull();
    const a = await saveNutritionProfile({ birthYear: 1992, sexForFormula: 'homme', screeningResult: 'libre' });
    const b = await saveNutritionProfile({ mealsPerDay: 4 });
    expect(b.id).toBe(a.id);
    expect(b.birthYear).toBe(1992);
    expect(b.mealsPerDay).toBe(4);
    expect(b.allergens).toEqual([]);
    expect(b.showTrendOnHome).toBe(true);
    expect(await list('nutritionProfiles')).toHaveLength(1);
  });

  it('un seul objectif actif : le précédent est clôturé et conservé', async () => {
    await ensureLocalUser();
    const base = { startDate: '2026-11-01', startKg: 80, targetKg: null, targetDate: null };
    await saveGoal({ ...base, kind: 'perte', pace: 'doux' });
    const g2 = await saveGoal({ ...base, kind: 'prise', pace: 'standard' });
    const active = await getActiveGoal();
    expect(active?.id).toBe(g2.id);
    const all = await list('nutritionGoals');
    expect(all).toHaveLength(2);
    expect(all.filter((g) => !g.endedAt)).toHaveLength(1);
  });

  it('pesée : une seule par date, bilan de semaine lié, suppression logique', async () => {
    await ensureLocalUser();
    await addWeighIn('2026-11-02', 80, 'oui', '');
    await addWeighIn('2026-11-02', 79.5, 'peu_pres', '');
    await addWeighIn('2026-11-09', 79, 'oui', '');
    const w = await listWeighIns();
    expect(w.map((x) => x.kg)).toEqual([79.5, 79]);
    const c = await listCheckins();
    expect(c.map((x) => x.weekStart)).toEqual(['2026-11-02', '2026-11-09']);
    expect(c[0].adherence).toBe('peu_pres');
    expect(c[0].kcalAdjust).toBe(0);
    await removeWeighIn(w[0].id);
    expect(await listWeighIns()).toHaveLength(1);
  });
});
