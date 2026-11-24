// Historique des semaines de repas validées : liste (dates, kcal moyennes, recettes), détail par jour (marquer fait / pas fait), courses mémorisées,
// « Refaire cette semaine » (copie le plan vers la semaine prochaine) et « Reprendre les mêmes courses ».
import { useEffect, useState } from 'preact/hooks';
import type { MealLog, MealPlan } from '../../data/model';
import { addDaysKey, planSlots, weekStats } from '../../nutrition/meals-calendar';
import { copyPlanToWeek, copyShoppingExtras, getMealPlan, isValidated, listMealLogs, listValidatedPlans } from '../../nutrition/store';
import type { WeekPlanResult } from '../../nutrition/week-plan';
import { weekStartOf } from '../../nutrition/weight-trend';
import { dateKey, frDate } from '../../session/calendar';
import { ShoppingListCard } from './NutritionShopping';
import { DayMeals, fmtN, useCatalog } from './NutritionMeals';

const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const weekTitle = (ws: string) => `Semaine du ${frDate(ws).replace(/^\S+\s/, '')}`;

export function HistoryTab({ onOpenWeek }: { onOpenWeek: () => void }) {
  const catalog = useCatalog();
  const [plans, setPlans] = useState<MealPlan[] | null>(null);
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [info, setInfo] = useState('');
  const load = () => Promise.all([listValidatedPlans(), listMealLogs()]).then(([p, l]) => { setPlans(p); setLogs(l); }).catch(() => setErr('L’historique ne se charge pas.'));
  useEffect(() => { void load(); }, []);

  if (err) return <p class="notice notice-urgent" role="alert">{err}</p>;
  if (!plans) return <p class="dim" role="status">Chargement…</p>;
  if (plans.length === 0) {
    return (
      <section class="card">
        <h2>Mon historique de repas</h2>
        <p class="dim">Rien ici pour l’instant. Génère ta semaine, puis touche « Valider la semaine » : elle s’ajoute au calendrier et reste consultable ici, avec ses courses.</p>
        <button type="button" class="btn btn-primary" onClick={onOpenWeek}>Préparer ma semaine</button>
      </section>
    );
  }
  const today = dateKey(new Date());
  const nextWeek = addDaysKey(weekStartOf(today), 7);
  const plan = sel ? plans.find((p) => p.weekStart === sel) : undefined;

  const redo = async (withPlan: boolean) => {
    if (!plan) return;
    setConfirm(false);
    try {
      const dst = await getMealPlan(nextWeek);
      if (dst && isValidated(dst)) { setInfo('La semaine prochaine est déjà validée : rien n’a été copié.'); return; }
      if (withPlan) await copyPlanToWeek(plan.weekStart, nextWeek);
      await copyShoppingExtras(plan.weekStart, nextWeek);
      setInfo(withPlan ? 'Semaine copiée en brouillon pour la semaine prochaine. Vérifie-la dans l’onglet Semaine, puis valide-la.' : 'Lignes ajoutées et lignes retirées reprises pour la semaine prochaine.');
    } catch {
      setInfo('Impossible de copier. Réessaie.');
    }
  };

  if (plan) {
    const slots = planSlots(plan);
    const result = plan.result as unknown as WeekPlanResult;
    const days = [...new Set(slots.filter((s) => s.recipeId).map((s) => s.day))].sort((a, b) => a - b);
    return (
      <>
        <button type="button" class="btn btn-quiet" onClick={() => { setSel(null); setInfo(''); setConfirm(false); }}>‹ Toutes les semaines</button>
        <h2>{weekTitle(plan.weekStart)}</h2>
        {days.map((d) => {
          const date = addDaysKey(plan.weekStart, d);
          return <DayMeals key={date} date={date} heading={`${DAYS_LONG[d]} ${frDate(date).replace(/^\S+\s/, '')}`} onChanged={() => void load()} />;
        })}
        {catalog && catalog !== 'erreur' && Array.isArray(result?.ingredients) && <ShoppingListCard weekStart={plan.weekStart} ingredients={result.ingredients} catalog={catalog} title="Courses de cette semaine" />}
        <section class="card">
          <h2>Refaire cette semaine</h2>
          {info && <p class="notice small" role="status">{info}</p>}
          {confirm ? (
            <div class="notice" role="alertdialog" aria-label="Confirmer la copie">
              <p><strong>Copier ces repas vers la semaine du {frDate(nextWeek).replace(/^\S+\s/, '')} ?</strong> S’il y a déjà un brouillon cette semaine-là, il est remplacé. Tu pourras tout modifier avant de valider.</p>
              <button type="button" class="btn btn-primary" onClick={() => void redo(true)}>Oui, refaire cette semaine</button>
              <button type="button" class="btn" onClick={() => setConfirm(false)}>Annuler</button>
            </div>
          ) : (
            <>
              <button type="button" class="btn btn-primary" onClick={() => setConfirm(true)}>Refaire cette semaine</button>
              <button type="button" class="btn" onClick={() => void redo(false)}>Reprendre les mêmes courses</button>
              <p class="dim small">« Reprendre les mêmes courses » garde tes lignes ajoutées et retirées pour la semaine prochaine ; les cases repartent à zéro.</p>
            </>
          )}
        </section>
      </>
    );
  }
  return (
    <section class="card">
      <h2>Mon historique de repas</h2>
      <ul class="hist-list" aria-label="Semaines validées">
        {plans.map((p) => {
          const st = weekStats(p, logs);
          const current = p.weekStart <= today && today <= addDaysKey(p.weekStart, 6);
          const names = catalog && catalog !== 'erreur'
            ? [...new Set(planSlots(p).filter((s) => s.recipeId && (s.kind === 'dejeuner' || s.kind === 'diner')).map((s) => catalog.recipes.find((r) => r.id === s.recipeId)?.nom).filter((n): n is string => !!n))].slice(0, 3)
            : [];
          return (
            <li key={p.id}>
              <button type="button" class="hist-row" onClick={() => setSel(p.weekStart)}>
                <span class="hist-date">{weekTitle(p.weekStart)}{current ? ' · en cours' : ''}</span>
                <span class="hist-info dim small">{st.done} repas faits sur {st.meals} · en moyenne {fmtN(st.avgKcal)} kcal et {fmtN(st.avgProt)} g de protéines par jour</span>
                {names.length > 0 && <span class="hist-info dim small">{names.join(', ')}…</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
