// Onglet « Semaine » (docs/nutrition-spec.md, annexe du 14/11/2026) : plan des 7 jours, repas optionnels, lots, liste de courses cochable.
// Les calories et macros viennent UNIQUEMENT de la cible finale (src/nutrition/final-needs.ts), jamais d'un calcul refait ici.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { NutritionProfile } from '../../data/model';
import { ALLERGEN_LABELS, ALLERGENS, type AllergenKey } from '../../nutrition/allergens';
import { loadCatalog, type Catalog } from '../../nutrition/catalog';
import type { FinalNeeds, Refused } from '../../nutrition/final-needs';
import type { PlanPrefs, Recipe } from '../../nutrition/plan';
import { buildShoppingList, RAYON_LABELS, RAYON_ORDER, shoppingToText } from '../../nutrition/shopping';
import { getMealPlan, getShoppingState, saveMealPlan, saveNutritionProfile, setChecked } from '../../nutrition/store';
import { generateWeekPlan, sanitizeMealConfig, type MealConfig, type SlotKind, type WeekPlanResult } from '../../nutrition/week-plan';
import { dateKey } from '../../session/calendar';
import { weekStartOf } from '../../nutrition/weight-trend';

const NOT_MEDICAL = 'Ce n’est pas un avis médical.';
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const KIND_LABEL: Record<SlotKind, string> = { 'petit-dej': 'Petit-déjeuner', dejeuner: 'Déjeuner', diner: 'Dîner', gouter: 'Goûter', encas: 'En-cas' };
const DIETS: [string, string][] = [['vegetarien', 'Végétarien'], ['vegetalien', 'Végétalien'], ['sans_porc', 'Sans porc'], ['sans_lactose', 'Sans lactose'], ['sans_gluten', 'Sans gluten']];
const APPLIANCES: [string, string][] = [['four', 'Four'], ['micro-ondes', 'Micro-ondes'], ['plaques', 'Plaques'], ['blender', 'Blender']];
const fmt = (n: number, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });

function addDays(key: string, n: number): string {
  const t = Date.parse(`${key}T00:00:00Z`) + n * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** Grammes d'un ingrédient pour un créneau : pièces x grammes d'une pièce (lot), ou grammes de base mis à l'échelle (ajustables seulement). */
function slotLines(r: Recipe, scale: number, pieces: number) {
  return r.ingredients.map((i) => ({ nom: i.nom, g: r.lot ? i.grammes * pieces : i.ajustable ? Math.round((i.grammes * scale) / 5) * 5 || 5 : i.grammes }));
}

export function WeekTab({ np, fin }: { np: NutritionProfile; fin: FinalNeeds | Refused }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [cfg, setCfg] = useState<MealConfig>(() => sanitizeMealConfig(np.mealConfig as Partial<MealConfig> | undefined));
  const [allergens, setAllergens] = useState<AllergenKey[]>((np.allergens as AllergenKey[]) ?? []);
  const [diet, setDiet] = useState<string[]>(np.diet ?? []);
  const [appliances, setAppliances] = useState<string[]>(np.appliances?.length ? np.appliances : ['four', 'micro-ondes', 'plaques']);
  const [maxCook, setMaxCook] = useState<number | null>(np.maxCookMin);
  const [optimize, setOptimize] = useState(np.optimizeShopping !== false);
  const [severe, setSevere] = useState(!!np.severeAllergy);
  const thisMonday = weekStartOf(dateKey(new Date()));
  const [next, setNext] = useState(false);
  const weekStart = next ? addDays(thisMonday, 7) : thisMonday;
  const [plan, setPlan] = useState<WeekPlanResult | null>(null);
  const [checked, setCheckedState] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setLoadErr('Les recettes ne se chargent pas (hors ligne ?). Réessaie quand le réseau revient.'));
  }, []);
  useEffect(() => {
    setPlan(null);
    void getMealPlan(weekStart).then((p) => setPlan((p?.result as unknown as WeekPlanResult) ?? null));
    void getShoppingState(weekStart).then((s) => setCheckedState(s?.checked ?? []));
  }, [weekStart]);

  const persist = (patch: Parameters<typeof saveNutritionProfile>[0]) => void saveNutritionProfile(patch);
  const upCfg = (c: MealConfig) => { setCfg(c); persist({ mealConfig: c as unknown as Record<string, unknown> }); };
  const toggleDay = (k: 'petitDej' | 'gouter', d: number) => upCfg({ ...cfg, [k]: cfg[k].map((v, i) => (i === d ? !v : v)) });
  const cycleEncas = (d: number) => upCfg({ ...cfg, encas: cfg.encas.map((v, i) => (i === d ? (v + 1) % 3 : v)) });

  const recipeById = useMemo(() => new Map((catalog?.recipes ?? []).map((r) => [r.id, r])), [catalog]);

  const prefsOf = (): Omit<PlanPrefs, 'mealsPerDay'> | null => {
    if (fin.status !== 'ok') return null;
    return { goal: fin.goal, allergens, allergenFree: np.allergenFree ?? [], diet, dislikedFoods: np.dislikedFoods ?? [], maxCookMin: maxCook, appliances, optimizeShopping: optimize, strictControle: severe };
  };

  const generate = async () => {
    const prefs = prefsOf();
    if (!catalog || !prefs || fin.status !== 'ok' || !fin.week) return;
    setBusy(true);
    const seed = Math.floor(Math.random() * 1e9) + 1;
    const res = generateWeekPlan(fin.week, catalog.recipes, catalog.foods, prefs, cfg, seed, [], fin.needs.floor);
    await saveMealPlan(weekStart, res.version, fin.week as unknown[], res as unknown as Record<string, unknown>, seed);
    await saveNutritionProfile({ allergens, diet, appliances, maxCookMin: maxCook, optimizeShopping: optimize, severeAllergy: severe, mealConfig: cfg as unknown as Record<string, unknown> });
    setPlan(res);
    setBusy(false);
  };

  const shopping = useMemo(() => (plan && catalog ? buildShoppingList(plan.ingredients, catalog.units) : []), [plan, catalog]);
  const servesMeals = useMemo(() => {
    const m = new Map<string, number>();
    if (!plan) return m;
    for (const s of plan.slots) {
      const r = s.recipeId ? recipeById.get(s.recipeId) : null;
      if (!r) continue;
      for (const i of r.ingredients) m.set(i.code, (m.get(i.code) ?? 0) + 1);
    }
    return m;
  }, [plan, recipeById]);

  const toggleChecked = async (code: string, on: boolean) => {
    setCheckedState((c) => (on ? [...c, code] : c.filter((x) => x !== code)));
    await setChecked(weekStart, code, on);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shoppingToText(shopping));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (fin.status !== 'ok' || !fin.week) {
    return (
      <section class="card">
        <h2>Ma semaine de repas</h2>
        <p>Pour construire ta semaine, l’app a besoin de tes besoins en calories : ouvre l’onglet « Mes besoins » pour voir ce qui manque. {NOT_MEDICAL}</p>
      </section>
    );
  }

  const nPublished = catalog?.recipes.length ?? 0;
  return (
    <>
      <section class="card">
        <h2>Ma semaine de repas</h2>
        <p class="dim small">Un plan pour 7 jours d’un coup, construit sur tes besoins de chaque jour (jours lourds, légers, repos) : tu fais tes courses une fois pour la semaine. {NOT_MEDICAL}</p>
        <div class="chips" role="group" aria-label="Semaine">
          <button type="button" class="chip" aria-pressed={!next} onClick={() => setNext(false)}>Cette semaine</button>
          <button type="button" class="chip" aria-pressed={next} onClick={() => setNext(true)}>Semaine prochaine</button>
        </div>
        {loadErr && <p class="notice notice-urgent" role="alert">{loadErr}</p>}
        {catalog && nPublished === 0 && <p class="notice">Aucune recette n’est encore disponible dans l’app.</p>}
        <button type="button" class="btn btn-primary" disabled={!catalog || busy || nPublished === 0} onClick={() => void generate()}>{plan ? 'Régénérer ma semaine' : 'Générer ma semaine'}</button>
      </section>

      <details class="card nut-details">
        <summary>Repas, allergies et préférences</summary>
        <fieldset class="create-group">
          <legend>Petit-déjeuner (jours choisis)</legend>
          <div class="chips" role="group" aria-label="Jours du petit-déjeuner">
            {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={DAYS_LONG[i]} aria-pressed={cfg.petitDej[i]} onClick={() => toggleDay('petitDej', i)}>{d}</button>)}
          </div>
          <label class="check-row"><input type="checkbox" checked={cfg.petitDejIdentique} onChange={(e) => upCfg({ ...cfg, petitDejIdentique: e.currentTarget.checked })} /><span>Le même petit-déjeuner toute la semaine</span></label>
        </fieldset>
        <fieldset class="create-group">
          <legend>Goûter (jours choisis)</legend>
          <div class="chips" role="group" aria-label="Jours du goûter">
            {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={DAYS_LONG[i]} aria-pressed={cfg.gouter[i]} onClick={() => toggleDay('gouter', i)}>{d}</button>)}
          </div>
        </fieldset>
        <fieldset class="create-group">
          <legend>En-cas : nombre par jour (un appui change 0, 1, 2)</legend>
          <div class="chips" role="group" aria-label="En-cas par jour">
            {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={`${DAYS_LONG[i]} : ${cfg.encas[i]} en-cas`} aria-pressed={cfg.encas[i] > 0} onClick={() => cycleEncas(i)}>{d} {cfg.encas[i]}</button>)}
          </div>
          <p class="dim small">Les barres et muffins maison se préparent en lot : la quantité à fabriquer est calculée pour la semaine et ajoutée à ta liste de courses.</p>
        </fieldset>
        <fieldset class="create-group">
          <legend>Allergies et intolérances (exclues strictement)</legend>
          <div class="chips" role="group" aria-label="Allergènes à exclure">
            {ALLERGENS.map((a) => (
              <button type="button" key={a} class="chip" aria-pressed={allergens.includes(a)} onClick={() => setAllergens(allergens.includes(a) ? allergens.filter((x) => x !== a) : [...allergens, a])} title={ALLERGEN_LABELS[a].hint}>{ALLERGEN_LABELS[a].label}</button>
            ))}
          </div>
          <label class="check-row"><input type="checkbox" checked={severe} onChange={(e) => setSevere(e.currentTarget.checked)} /><span>Allergie grave : seules les recettes relues sont proposées</span></label>
          <p class="notice small">Les allergènes affichés viennent de la composition générique des ingrédients ; les traces ne sont pas prises en compte. Vérifie toujours l’étiquette des produits. « Sans gluten » et « sans lactose » valent pour la composition générique, pas pour une allergie sévère ni pour la maladie cœliaque. {NOT_MEDICAL}</p>
        </fieldset>
        <fieldset class="create-group">
          <legend>Régime</legend>
          <div class="chips" role="group" aria-label="Régime">
            {DIETS.map(([k, l]) => <button type="button" key={k} class="chip" aria-pressed={diet.includes(k)} onClick={() => setDiet(diet.includes(k) ? diet.filter((x) => x !== k) : [...diet, k])}>{l}</button>)}
          </div>
        </fieldset>
        <fieldset class="create-group">
          <legend>Matériel de cuisine</legend>
          <div class="chips" role="group" aria-label="Matériel">
            {APPLIANCES.map(([k, l]) => <button type="button" key={k} class="chip" aria-pressed={appliances.includes(k)} onClick={() => setAppliances(appliances.includes(k) ? appliances.filter((x) => x !== k) : [...appliances, k])}>{l}</button>)}
          </div>
          <div class="chips" role="group" aria-label="Temps de cuisine maximum">
            {([[null, 'Peu importe'], [15, '15 min'], [30, '30 min'], [45, '45 min']] as [number | null, string][]).map(([v, l]) => <button type="button" key={String(v)} class="chip" aria-pressed={maxCook === v} onClick={() => setMaxCook(v)}>{l}</button>)}
          </div>
          <label class="check-row"><input type="checkbox" checked={optimize} onChange={(e) => setOptimize(e.currentTarget.checked)} /><span>Optimiser mes courses (peu d’ingrédients, réutilisés)</span></label>
        </fieldset>
        <p class="dim small">Régénère ta semaine pour appliquer ces réglages.</p>
      </details>

      {plan && catalog && (
        <>
          <section class="card">
            <h2>Mes 7 jours</h2>
            {plan.days.map((d, di) => {
              const slots = plan.slots.filter((s) => s.day === di);
              return (
                <div class="nut-plan-day" key={di}>
                  <h3>{DAYS_LONG[di]} <span class="dim small">cible {fmt(d.targetKcal)} kcal · prévu {fmt(d.kcal)} kcal</span></h3>
                  {d.status === 'incomplet' && <p class="notice small">Aucune recette ne convient à un des repas avec tes filtres : élargis tes préférences.</p>}
                  {d.status === 'sous_plancher' && <p class="notice small">Ce jour est sous le plancher de sécurité de l’app : régénère la semaine.</p>}
                  {d.status === 'ecart' && <p class="dim small">Un peu d’écart avec ta cible ce jour-là.</p>}
                  <ul class="nut-meals">
                    {slots.map((s, si) => {
                      const r = s.recipeId ? recipeById.get(s.recipeId) : undefined;
                      const label = s.kind === 'encas' ? `En-cas ${s.index + 1}` : KIND_LABEL[s.kind];
                      if (!r) return <li key={si}><span class="dim small">{label}</span> <span class="dim">Aucune recette</span></li>;
                      return (
                        <li key={si}>
                          <details class="nut-details">
                            <summary>
                              <span class="dim small">{label}</span> <strong>{r.nom}</strong>{' '}
                              <span class="dim small">{s.pieces ? `${s.pieces} ${r.piece ?? 'pièce'}${s.pieces > 1 ? 's' : ''}` : s.scale && Math.abs(s.scale - 1) > 0.05 ? `portion ×${fmt(s.scale, 1)}` : ''} · {fmt(s.kcal)} kcal</span>
                            </summary>
                            <p class="small">P {fmt(s.prot)} g · G {fmt(s.gluc)} g · L {fmt(s.lip)} g</p>
                            {r.allergenes.length > 0 && <p class="small"><strong>Allergènes :</strong> {r.allergenes.map((a) => ALLERGEN_LABELS[a].label).join(', ')}</p>}
                            <ul class="small">{slotLines(r, s.scale, s.pieces).map((l, k) => <li key={k}>{l.nom} : {fmt(l.g)} g</li>)}</ul>
                            <ol class="small">{(r.etapes ?? []).map((e, k) => <li key={k}>{e}</li>)}</ol>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {plan.lots.length > 0 && (
              <div class="notice small">
                <strong>À préparer en lot :</strong>{' '}
                {plan.lots.map((l) => `${l.pieces} ${l.piece}${l.pieces > 1 ? 's' : ''} (${recipeById.get(l.recipeId)?.nom ?? l.recipeId})`).join(' ; ')}
              </div>
            )}
          </section>

          <section class="card">
            <h2>Mes courses de la semaine</h2>
            <p class="dim small">Quantités additionnées pour les 7 jours, arrondies au conditionnement. Coche en magasin.</p>
            {RAYON_ORDER.map((ray) => {
              const items = shopping.filter((i) => i.rayon === ray && !i.pantry);
              if (!items.length) return null;
              return (
                <div key={ray}>
                  <h3>{RAYON_LABELS[ray]}</h3>
                  <ul class="nut-shop">
                    {items.map((i) => (
                      <li key={i.code}>
                        <label class="check-row">
                          <input type="checkbox" checked={checked.includes(i.code)} onChange={(e) => void toggleChecked(i.code, e.currentTarget.checked)} />
                          <span>
                            <strong>{i.name}</strong> : {i.units ? `${i.units.count} × ${i.units.label}` : `${fmt(i.buyGrams)} g`}
                            <span class="dim small"> · sert à {servesMeals.get(i.code) ?? 1} repas</span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {shopping.some((i) => i.pantry) && <p class="dim small">Déjà dans ton placard (sel, huile, épices) : {shopping.filter((i) => i.pantry).map((i) => i.name).join(', ')}.</p>}
            <button type="button" class="btn" onClick={() => void copy()}>Copier la liste</button>
            {copied && <p class="dim small" role="status">Liste copiée.</p>}
            <p class="notice small">Vérifie toujours les étiquettes (allergènes). Valeurs nutritionnelles : Ciqual (ANSES), Licence Ouverte 2.0. {NOT_MEDICAL}</p>
          </section>
        </>
      )}
    </>
  );
}
