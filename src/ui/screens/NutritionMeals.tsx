// Repas d'une semaine validée : « Mes repas du jour » (Accueil, Calendrier, Historique). Un geste pour « fait » / « pas fait », une ligne pour l'écart.
// Aucun calcul de besoins ici : les valeurs viennent du plan figé (src/nutrition/week-plan.ts) et de ses recettes.
import { useEffect, useState } from 'preact/hooks';
import type { MealLog, MealPlan, NutritionProfile } from '../../data/model';
import { ALLERGEN_LABELS } from '../../nutrition/allergens';
import { loadCatalog, type Catalog } from '../../nutrition/catalog';
import type { DayTarget } from '../../nutrition/day-targets';
import { dayStats, mealsForDate } from '../../nutrition/meals-calendar';
import type { GoalKind } from '../../nutrition/needs';
import { buildShoppingList, type PlannedIngredient } from '../../nutrition/shopping';
import { weekStartOf } from '../../nutrition/weight-trend';
import { customKey, getActiveGoal, getNutritionProfile, getShoppingState, listMealLogs, listPlans, listValidatedPlans, saveEditedPlan, setMealLog, undoLastChange } from '../../nutrition/store';
import { applyMealChange, applySwap, prefsFromProfile, setSlotOut, slotAllergens, slotUsable, toggleLock, type EditCtx } from '../../nutrition/week-edit';
import { composeSlot, sanitizeMealConfig, slotKeyOf, type SlotKind, type SlotOut, type WeekPlanResult, type WeekSlot } from '../../nutrition/week-plan';
import { MealPanel, outMessage, type Panel } from './NutritionPlanView';
import { dateKey } from '../../session/calendar';

export const KIND_LABEL: Record<SlotKind, string> = { 'petit-dej': 'Petit-déjeuner', dejeuner: 'Déjeuner', diner: 'Dîner', gouter: 'Goûter', encas: 'En-cas' };
export const slotLabel = (s: Pick<WeekSlot, 'kind' | 'index'>): string => (s.kind === 'encas' ? `En-cas ${s.index + 1}` : KIND_LABEL[s.kind]);
/** Étiquette courte d'un repas pris ailleurs (les kcal sont toujours présentées comme une estimation). */
export const outTitle = (o: SlotOut): string => (o.mode === 'saute' ? 'Repas sauté' : o.mode === 'resto' ? `Resto · environ ${Math.round(o.kcal)} kcal (estimation)` : `Fait autrement · environ ${Math.round(o.kcal)} kcal (estimation)`);
export const fmtN = (n: number, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });

/** Catalogue des recettes (fichier statique précaché) : null tant qu'il charge, 'erreur' si hors ligne sans cache. */
export function useCatalog(): Catalog | null | 'erreur' {
  const [c, setC] = useState<Catalog | null | 'erreur'>(null);
  useEffect(() => {
    let alive = true;
    loadCatalog().then((x) => alive && setC(x)).catch(() => alive && setC('erreur'));
    return () => { alive = false; };
  }, []);
  return c;
}

/** Détail d'un repas : allergènes, ingrédients en grammes (aliments remplacés compris), étapes. */
export function MealDetail({ slot, catalog }: { slot: WeekSlot; catalog: Catalog }) {
  const r = catalog.recipes.find((x) => x.id === slot.recipeId);
  if (!r) return null;
  const comp = composeSlot(r, slot, catalog.foods);
  const al = slotAllergens(r, { swaps: slot.swaps?.map((sw) => ({ ...sw, allergenes: catalog.info.get(sw.to)?.allergenes ?? sw.allergenes })) });
  return (
    <div class="meal-detail">
      <p class="small">P {fmtN(slot.prot)} g · G {fmtN(slot.gluc)} g · L {fmtN(slot.lip)} g</p>
      {al.length > 0 && <p class="small"><strong>Allergènes :</strong> {al.map((a) => ALLERGEN_LABELS[a].label).join(', ')}</p>}
      <ul class="small">
        {r.lot
          ? r.ingredients.map((i, k) => <li key={k}>{i.nom} : {fmtN(Math.ceil((i.grammes * slot.pieces) / 5) * 5)} g</li>)
          : (comp?.lines ?? []).map((l, k) => <li key={k}>{l.nom} : {fmtN(l.grammes)} g{l.swapped ? ' (remplacé)' : ''}</li>)}
      </ul>
      <ol class="small">{(r.etapes ?? []).map((e, k) => <li key={k}>{e}</li>)}</ol>
    </div>
  );
}

interface Loaded { plans: MealPlan[]; logs: MealLog[]; np: NutritionProfile | null; goal: GoalKind }

async function loadAll(includeDraft: boolean): Promise<Loaded> {
  const [plans, logs, np, goal] = await Promise.all([includeDraft ? listPlans() : listValidatedPlans(), listMealLogs(), getNutritionProfile(), getActiveGoal()]);
  return { plans, logs, np, goal: (goal?.kind as GoalKind | undefined) ?? 'maintien' };
}

/**
 * Repas d'un jour (semaine validée seulement). Ne montre rien s'il n'y en a pas, sauf `emptyHint`.
 * Un repas qui ne respecte plus les réglages d'aujourd'hui (allergie ajoutée depuis) est signalé « à changer » et n'est pas détaillé : jamais proposé.
 */
const DAY_TYPE_TEXT: Record<DayTarget['type'], string> = { repos: 'jour de repos', leger: 'jour léger', moyen: 'jour de séance', lourd: 'jour de séance lourde', intense: 'jour intense' };

function ctxOf(plan: MealPlan, catalog: Catalog, np: NutritionProfile | null, goal: GoalKind): EditCtx | null {
  const floor = (plan.result as { prefs?: { floor?: unknown } } | undefined)?.prefs?.floor;
  const days = plan.dayTargets as DayTarget[];
  if (!np || typeof floor !== 'number' || !Number.isFinite(floor) || !Array.isArray(days) || days.length !== 7) return null;
  return { recipes: catalog.recipes, foods: catalog.foods, info: catalog.info, prefs: prefsFromProfile(np, goal), days, cfg: sanitizeMealConfig(np.mealConfig as never), floorKcal: floor };
}

export function DayMeals({ date, heading, emptyHint, compact = false, onChanged, includeDraft = false, showTargets = false, editable = false }: { date: string; heading?: string; emptyHint?: string; compact?: boolean; onChanged?: () => void; includeDraft?: boolean; showTargets?: boolean; editable?: boolean }) {
  const catalog = useCatalog();
  const [data, setData] = useState<Loaded | null>(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [gap, setGap] = useState<{ key: string; note: string; kcal: string } | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [msg, setMsg] = useState('');
  const reload = () => loadAll(includeDraft).then(setData).catch(() => setErr('Les repas ne se chargent pas.'));
  useEffect(() => { void reload(); }, [date]);

  if (err) return <p class="notice" role="alert">{err}</p>;
  if (!data || !catalog || catalog === 'erreur') return null;
  const dm = mealsForDate(data.plans, date, includeDraft);
  if (!dm) return emptyHint ? <section class="card meals-card"><h2>{heading ?? 'Repas du jour'}</h2><p class="dim">{emptyHint}</p></section> : null;

  const today = dateKey(new Date());
  const undoDay = async () => {
    try { await undoLastChange(dm.plan.weekStart); setMsg('Dernier changement annulé.'); setPanel(null); await reload(); onChanged?.(); } catch { setErr('Impossible d’annuler.'); }
  };
  const canMark = date <= today;
  const recipeById = new Map(catalog.recipes.map((r) => [r.id, r]));
  const prefs = data.np ? prefsFromProfile(data.np, data.goal) : null;
  const stats = dayStats(dm.slots, data.logs, date);
  const logOf = (s: WeekSlot) => data.logs.find((l) => l.date === date && l.slotKey === slotKeyOf(s));
  const mark = async (s: WeekSlot, state: MealLog['state'] | null, note = '', kcal: number | null = null) => {
    try {
      await setMealLog(date, slotKeyOf(s), state, note, kcal);
      setGap(null);
      await reload();
      onChanged?.();
    } catch {
      setErr('Impossible d’enregistrer. Réessaie.');
    }
  };

  return (
    <section class="card meals-card" aria-label={heading ?? 'Repas du jour'}>
      <h2>{heading ?? 'Repas du jour'}</h2>
      {dm.draft && <p class="notice small" role="status"><strong>Plan proposé, à valider.</strong> Il apparaîtra définitivement au calendrier une fois la semaine validée. <a href="#/nutrition/semaine">Valider dans Nutrition</a></p>}
      {msg && <p class="notice small" role="status">{msg}</p>}
      {editable && date >= today && dm.plan.previous && <button type="button" class="btn btn-quiet" onClick={() => void undoDay()}>Annuler le dernier changement</button>}
      {(() => {
        const dc = (dm.plan.result as unknown as WeekPlanResult | undefined)?.days?.[dm.day];
        if (!dc) return null;
        const hasOut = dm.slots.some((s) => s.out);
        if (dc.belowFloor) return <p class="notice small" role="status">Ce jour passe sous le plancher de sécurité de l’app : ajoute un repas ou remets un repas à la maison.</p>;
        if (dc.targetKcal > 0 && Math.abs(dc.kcal - dc.targetKcal) / dc.targetKcal > 0.05) return <p class="dim small" role="status">{hasOut ? 'Avec les repas pris ailleurs (estimation), ' : ''}ce jour est {fmtN(Math.abs(dc.kcal - dc.targetKcal))} kcal {dc.kcal < dc.targetKcal ? 'sous' : 'au-dessus de'} ta cible.</p>;
        return null;
      })()}
      <p class="meals-total" role="status">
        <strong>{fmtN(stats.plannedKcal)} kcal</strong> · {fmtN(stats.plannedProt)} g de protéines prévus
        {canMark && stats.done > 0 && <span class="dim small"> · mangé : {fmtN(stats.eatenKcal)} kcal ({stats.done}/{stats.meals} repas)</span>}
      </p>
      {showTargets && (() => {
        const t = (dm.plan.dayTargets as DayTarget[])?.[dm.day];
        const tot = dm.slots.reduce((a, s) => ({ g: a.g + s.gluc, l: a.l + s.lip }), { g: 0, l: 0 });
        if (!t || typeof t.kcal !== 'number') return null;
        return <p class="small">Glucides {fmtN(tot.g)} g · lipides {fmtN(tot.l)} g. <span class="dim">Ta cible ({DAY_TYPE_TEXT[t.type] ?? 'jour'}) : {fmtN(t.kcal)} kcal · protéines {fmtN(t.protG)} g · glucides {fmtN(t.glucG)} g · lipides {fmtN(t.lipG)} g.</span></p>;
      })()}
      <ul class="meals-list">
        {dm.slots.map((s) => {
          const r = recipeById.get(s.recipeId as string);
          const ctx = editable && date >= today ? ctxOf(dm.plan, catalog, data.np, data.goal) : null;
          const planRes = dm.plan.result as unknown as WeekPlanResult;
          const locks = dm.plan.locks ?? [];
          const commit = async (next: WeekPlanResult, l: string[], m: string) => {
            try { await saveEditedPlan(dm.plan.weekStart, next as unknown as Record<string, unknown>, l); setMsg(m); setPanel(null); await reload(); onChanged?.(); } catch { setErr('Impossible d’enregistrer ce changement.'); }
          };
          const key = slotKeyOf(s);
          const log = logOf(s);
          const usable = !prefs || date < today || !r ? true : slotUsable(s, recipeById, catalog.info, prefs);
          return (
            <li key={key} class={`meal-row${log ? ` is-${log.state}` : ''}`}>
              <button type="button" class="meal-head" aria-expanded={open === key} onClick={() => setOpen(open === key ? null : key)}>
                <span class="dim small">{slotLabel(s)}{s.auto ? ' (ajouté pour ta cible)' : ''}</span>
                <strong>{s.out ? outTitle(s.out) : (r?.nom ?? 'Repas')}</strong>
                {s.out && r && <span class="dim small">Prévu à la maison : {r.nom}</span>}
                <span class="dim small">{fmtN(s.kcal)} kcal · P {fmtN(s.prot)} g{log?.state === 'fait' ? ' · ✓ fait' : log?.state === 'pas_fait' ? ' · pas fait' : log?.state === 'ecart' ? ' · fait autrement' : ''}</span>
              </button>
              {!usable && <p class="notice small" role="status">À changer : ce repas ne correspond plus à tes réglages (allergies, régime). Ouvre Nutrition, onglet Semaine.</p>}
              {usable && !s.out && open === key && !compact && <MealDetail slot={s} catalog={catalog} />}
              {usable && log?.state === 'ecart' && log.note && <p class="small">Mangé : {log.note}{log.kcal != null ? ` (${fmtN(log.kcal)} kcal)` : ''}</p>}
              {usable && canMark && !dm.draft && !s.out && (
                <div class="meal-actions" role="group" aria-label={`Noter : ${r?.nom ?? 'repas'}`}>
                  <button type="button" class="btn meal-btn" aria-pressed={log?.state === 'fait'} onClick={() => void mark(s, log?.state === 'fait' ? null : 'fait')}>Fait</button>
                  <button type="button" class="btn meal-btn" aria-pressed={log?.state === 'pas_fait'} onClick={() => void mark(s, log?.state === 'pas_fait' ? null : 'pas_fait')}>Pas fait</button>
                  <button type="button" class="btn meal-btn" aria-pressed={log?.state === 'ecart' || gap?.key === key} onClick={() => setGap(gap?.key === key ? null : { key, note: log?.note ?? '', kcal: log?.kcal != null ? String(log.kcal) : '' })}>Autre chose</button>
                </div>
              )}
              {usable && ctx && (
                <button type="button" class="btn meal-btn" aria-expanded={panel?.key === key} onClick={() => setPanel(panel?.key === key ? null : { key, mode: 'menu', page: 0 })}>Changer ce repas</button>
              )}
              {usable && ctx && panel?.key === key && (
                <MealPanel
                  slot={s} panel={panel} setPanel={setPanel} plan={planRes} ctx={ctx} locked={locks.includes(key)}
                  onMeal={(alt) => void commit(applyMealChange(planRes, key, alt, ctx), locks, `Repas changé : ${alt.recipe.nom}.`)}
                  onFood={(sw) => void commit(applySwap(planRes, key, sw, ctx), locks, sw.to === sw.from ? 'Aliment d’origine remis.' : `Aliment changé : ${sw.nom}.`)}
                  onLock={() => void commit(planRes, toggleLock(locks, key), locks.includes(key) ? 'Repas déverrouillé.' : 'Repas verrouillé.')}
                  onOut={(o) => void commit(setSlotOut(planRes, key, o, ctx), locks, outMessage(slotLabel(s), o))}
                />
              )}
              {usable && canMark && !dm.draft && gap?.key === key && (
                <form class="meal-gap" onSubmit={(e) => { e.preventDefault(); void mark(s, 'ecart', gap.note, gap.kcal.trim() === '' ? null : Number(gap.kcal.replace(',', '.'))); }}>
                  <label class="field">Ce que j’ai mangé
                    <input type="text" maxLength={300} autocomplete="off" value={gap.note} onInput={(e) => setGap({ ...gap, note: e.currentTarget.value })} />
                  </label>
                  <label class="field">Calories (facultatif)
                    <input type="text" inputMode="numeric" autocomplete="off" value={gap.kcal} onInput={(e) => setGap({ ...gap, kcal: e.currentTarget.value })} />
                  </label>
                  <button type="submit" class="btn btn-primary" disabled={!gap.note.trim()}>Enregistrer</button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      {!canMark && !dm.draft && <p class="dim small">Tu pourras noter tes repas le jour même.</p>}
    </section>
  );
}

/** Jour des courses (réglage « Mon jour de courses ») : carte d'accueil avec le nombre d'articles restant à cocher cette semaine. */
export function ShoppingDayCard() {
  const catalog = useCatalog();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!catalog || catalog === 'erreur') return;
    (async () => {
      const np = await getNutritionProfile();
      const day = sanitizeMealConfig(np?.mealConfig as never).shoppingDay;
      const now = new Date();
      if (day === null || day !== (now.getDay() + 6) % 7) return;
      const ws = weekStartOf(dateKey(now));
      const plan = (await listPlans()).find((p) => p.weekStart === ws);
      const ing = (plan?.result as { ingredients?: PlannedIngredient[] } | undefined)?.ingredients;
      if (!Array.isArray(ing)) return;
      const st = await getShoppingState(ws);
      const items = buildShoppingList(ing, catalog.units).filter((i) => !i.pantry && !(st?.pantry ?? []).includes(i.code));
      setLeft(items.filter((i) => !(st?.checked ?? []).includes(i.code)).length + (st?.custom ?? []).filter((c) => !(st?.checked ?? []).includes(customKey(c.name))).length);
    })().catch(() => setLeft(null));
  }, [catalog]);
  if (left === null) return null;
  return (
    <a class="lib-nutrition" href="#/nutrition/courses">
      <span class="nut-entry-text">
        <span class="nut-entry-name">C’est ton jour de courses</span>
        <span class="dim small">{left === 0 ? 'Tout est dans le caddie.' : `${left} article${left > 1 ? 's' : ''} à acheter. Tes cases sont gardées.`}</span>
      </span>
      <span class="nut-entry-chevron" aria-hidden="true">›</span>
    </a>
  );
}

/** Carte d'accueil : les repas d'aujourd'hui si une semaine est validée, sinon un accès discret à la semaine (seulement si la nutrition est configurée). */
export function TodayMeals() {
  const [state, setState] = useState<'chargement' | 'repas' | 'brouillon' | 'rien'>('chargement');
  useEffect(() => {
    (async () => {
      const [plans, np] = await Promise.all([listValidatedPlans(), getNutritionProfile()]);
      if (mealsForDate(plans, dateKey(new Date()))) return setState('repas');
      setState(np && np.screeningResult ? 'brouillon' : 'rien');
    })().catch(() => setState('rien'));
  }, []);
  if (state === 'chargement' || state === 'rien') return null;
  if (state === 'repas') return <DayMeals date={dateKey(new Date())} heading="Mes repas du jour" />;
  return (
    <a class="lib-nutrition" href="#/nutrition/semaine">
      <span class="nut-entry-text">
        <span class="nut-entry-name">Mes repas de la semaine</span>
        <span class="dim small">Prépare ta semaine, valide-la : elle apparaît ici et au calendrier.</span>
      </span>
      <span class="nut-entry-chevron" aria-hidden="true">›</span>
    </a>
  );
}
