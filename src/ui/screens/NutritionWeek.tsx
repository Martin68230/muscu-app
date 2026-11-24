// Onglet « Semaine » (docs/nutrition-spec.md, annexe du 14/11/2026 ; semaine validée : docs/nutrition-reprise.md) : plan des 7 jours, repas optionnels,
// lots, liste de courses cochable, changement de repas / d'aliment, verrous, validation (calendrier + historique).
// Les calories et macros viennent UNIQUEMENT de la cible finale (src/nutrition/final-needs.ts), jamais d'un calcul refait ici.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { MealPlan, NutritionProfile } from '../../data/model';
import { ALLERGEN_LABELS, ALLERGENS, type AllergenKey } from '../../nutrition/allergens';
import { loadCatalog, type Catalog } from '../../nutrition/catalog';
import type { FinalNeeds, Refused } from '../../nutrition/final-needs';
import { NUTRITION_VERSION, SEUIL_ECART_KCAL } from '../../nutrition/config';
import { addDaysKey } from '../../nutrition/meals-calendar';
import { recipeAllowed, type PlanPrefs } from '../../nutrition/plan';
import { confirmMealPlan, getMealPlan, reopenMealPlan, saveEditedPlan, saveGeneratedPlan, saveNutritionProfile, undoLastChange } from '../../nutrition/store';
import { assembleWeek, normalizePlan, slotUsable, usableFixed, type EditCtx } from '../../nutrition/week-edit';
import { generateWeekPlan, sanitizeMealConfig, slotKeyOf, repasOf, type MealConfig, type SlotKind, type WeekPlanResult } from '../../nutrition/week-plan';
import { ExportCard } from './NutritionExport';
import { ShoppingListCard } from './NutritionShopping';
import { PlanDays } from './NutritionPlanView';
import { dateKey } from '../../session/calendar';
import { weekStartOf } from '../../nutrition/weight-trend';

const NOT_MEDICAL = 'Ce n’est pas un avis médical.';
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const IMPOSE_KINDS: [SlotKind, string][] = [['petit-dej', 'Petit-déj'], ['dejeuner', 'Déjeuner'], ['gouter', 'Goûter'], ['diner', 'Dîner']];
const DIETS: [string, string][] = [['vegetarien', 'Végétarien'], ['vegetalien', 'Végétalien'], ['sans_porc', 'Sans porc'], ['sans_lactose', 'Sans lactose'], ['sans_gluten', 'Sans gluten']];
const APPLIANCES: [string, string][] = [['four', 'Four'], ['micro-ondes', 'Micro-ondes'], ['plaques', 'Plaques'], ['blender', 'Blender']];

export function WeekTab({ np, fin, aiEnabled = false }: { np: NutritionProfile; fin: FinalNeeds | Refused; aiEnabled?: boolean }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [cfg, setCfg] = useState<MealConfig>(() => sanitizeMealConfig(np.mealConfig as Partial<MealConfig> | undefined));
  const [allergens, setAllergens] = useState<AllergenKey[]>((np.allergens as AllergenKey[]) ?? []);
  const [diet, setDiet] = useState<string[]>(np.diet ?? []);
  const [appliances, setAppliances] = useState<string[]>(np.appliances?.length ? np.appliances : ['four', 'micro-ondes', 'plaques']);
  const [maxCook, setMaxCook] = useState<number | null>(np.maxCookMin);
  const [optimize, setOptimize] = useState(np.optimizeShopping !== false);
  const [severe, setSevere] = useState(!!np.severeAllergy);
  const [celiac, setCeliac] = useState(!!np.glutenStrict);
  const [disliked, setDisliked] = useState<string[]>(np.dislikedFoods ?? []);
  const [dq, setDq] = useState('');
  const [genErr, setGenErr] = useState('');
  const thisMonday = weekStartOf(dateKey(new Date()));
  const [next, setNext] = useState(false);
  const weekStart = next ? addDaysKey(thisMonday, 7) : thisMonday;
  const [row, setRow] = useState<MealPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [toast, setToast] = useState('');
  const [imposed, setImposed] = useState<Record<string, string>>({});
  const [impDay, setImpDay] = useState(0);
  const [impKind, setImpKind] = useState<SlotKind>('dejeuner');
  const [impQ, setImpQ] = useState('');

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setLoadErr('Les recettes ne se chargent pas (hors ligne ?). Réessaie quand le réseau revient.'));
  }, []);
  useEffect(() => {
    setRow(null);
    setToast('');
    setConfirmRegen(false);
    setImposed({});
    void getMealPlan(weekStart).then(setRow).catch(() => setRow(null));
  }, [weekStart]);

  const persist = (patch: Parameters<typeof saveNutritionProfile>[0]) => void saveNutritionProfile(patch);
  const upCfg = (c: MealConfig) => { setCfg(c); persist({ mealConfig: c as unknown as Record<string, unknown> }); };
  const toggleDay = (k: 'petitDej' | 'gouter', d: number) => upCfg({ ...cfg, [k]: cfg[k].map((v, i) => (i === d ? !v : v)) });
  const cycleEncas = (d: number) => upCfg({ ...cfg, encas: cfg.encas.map((v, i) => (i === d ? (v + 1) % 3 : v)) });

  const recipeById = useMemo(() => new Map((catalog?.recipes ?? []).map((r) => [r.id, r])), [catalog]);

  // Réglages COURANTS (pas ceux de la génération) : cœliaque = sans gluten strict ; allergie grave ou cœliaque = recettes relues seulement.
  const prefsOf = (): Omit<PlanPrefs, 'mealsPerDay'> | null => {
    if (fin.status !== 'ok') return null;
    return { goal: fin.goal, allergens, allergenFree: np.allergenFree ?? [], diet: celiac && !diet.includes('sans_gluten') ? [...diet, 'sans_gluten'] : diet, dislikedFoods: disliked, maxCookMin: maxCook, appliances, optimizeShopping: optimize, strictControle: severe || celiac };
  };
  const prefs = prefsOf();
  const ctx: EditCtx | null = catalog && prefs && fin.status === 'ok' && fin.week ? { recipes: catalog.recipes, foods: catalog.foods, info: catalog.info, prefs, days: fin.week, cfg, floorKcal: fin.needs.floor } : null;

  const validated = row?.status === 'valide';
  const todayKey = dateKey(new Date());
  const plan = (row?.result as unknown as WeekPlanResult | undefined) ?? null;
  // Un plan enregistré est montré s'il a la bonne forme (et, pour un brouillon, la version actuelle). Chaque repas qui ne respecte plus les réglages
  // d'aujourd'hui est signalé « à changer » et n'est jamais détaillé ; la validation est refusée tant qu'il en reste.
  const planState = useMemo((): 'aucun' | 'ok' | 'perime' | 'invalide' => {
    if (!row || !plan) return 'aucun';
    const p = plan as Partial<WeekPlanResult>;
    if (!Array.isArray(p.slots) || !Array.isArray(p.days) || p.days.length !== 7 || !Array.isArray(p.lots) || !Array.isArray(p.ingredients)) return 'invalide';
    if (!validated && p.version !== NUTRITION_VERSION) return 'perime';
    return 'ok';
  }, [row, plan, validated]);
  const shown = useMemo(() => (planState === 'ok' && plan ? (catalog ? normalizePlan(plan, catalog.info) : plan) : null), [planState, plan, catalog]);
  const locks = row?.locks ?? [];
  // Échec sûr : tant que le catalogue ou les réglages ne sont pas chargés, un repas n'est pas jugé utilisable.
  const usable = (s: WeekPlanResult['slots'][number]) => (!catalog || !prefs ? false : slotUsable(s, recipeById, catalog.info, prefs));
  const unusableCount = shown ? shown.slots.filter((s) => !usable(s)).length : 0;
  useEffect(() => {
    if (location.hash === '#/nutrition/courses' && shown && catalog) document.getElementById('courses')?.scrollIntoView?.({ block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!shown, !!catalog]);

  // Jours recalculés avec le plancher d'aujourd'hui (jamais les contrôles stockés dans un plan enregistré ou importé).
  const checkedDays = shown ? (ctx ? assembleWeek(shown.slots, ctx, shown.version).days : shown.days) : [];
  const badDay = shown ? checkedDays.find((d) => d.belowFloor || d.status === 'incomplet' || d.status === 'sous_plancher') : undefined;

  const generate = async () => {
    if (!catalog || !prefs || !ctx || fin.status !== 'ok' || !fin.week) return;
    setBusy(true);
    setGenErr('');
    setConfirmRegen(false);
    try {
      const seed = Math.floor(Math.random() * 1e9) + 1;
      const old = shown;
      const fixed = old ? usableFixed(old, locks, ctx) : new Map();
      const prev = old ? old.slots.filter((s) => s.recipeId && !fixed.has(slotKeyOf(s))).map((s) => s.recipeId as string) : [];
      const res = generateWeekPlan(fin.week, catalog.recipes, catalog.foods, prefs, { ...cfg, imposed }, seed, prev, fin.needs.floor, fixed);
      // Les repas gardés (verrouillés) et les repas imposés réussis restent verrouillés pour les prochaines régénérations.
      const keep = res.slots.filter((s) => s.recipeId && ((fixed.get(slotKeyOf(s))?.recipeId === s.recipeId) || imposed[slotKeyOf(s)] === s.recipeId)).map(slotKeyOf);
      await saveNutritionProfile({ allergens, diet, dislikedFoods: disliked, appliances, maxCookMin: maxCook, optimizeShopping: optimize, severeAllergy: severe, glutenStrict: celiac, mealConfig: cfg as unknown as Record<string, unknown> });
      setRow(await saveGeneratedPlan(weekStart, res.version, fin.week as unknown[], res as unknown as Record<string, unknown>, seed, { allergens, diet, appliances, maxCook, severe, celiac, floor: fin.needs.floor }, keep));
      setImposed({});
      setToast(fixed.size ? `Semaine régénérée : ${fixed.size} repas verrouillé${fixed.size > 1 ? 's' : ''} gardé${fixed.size > 1 ? 's' : ''}.` : '');
    } catch (e) {
      setGenErr(`Impossible de construire la semaine (${e instanceof Error ? e.message : 'erreur'}). Vérifie tes besoins puis réessaie.`);
    }
    setBusy(false);
  };

  const commit = async (nextPlan: WeekPlanResult, nextLocks: string[], message: string) => {
    try {
      setRow(await saveEditedPlan(weekStart, nextPlan as unknown as Record<string, unknown>, nextLocks));
      setToast(message);
    } catch {
      setGenErr('Impossible d’enregistrer ce changement. Réessaie.');
    }
  };
  const undo = async () => {
    try {
      if (await undoLastChange(weekStart)) { setRow(await getMealPlan(weekStart)); setToast('Dernier changement annulé.'); }
    } catch { setGenErr('Impossible d’annuler. Réessaie.'); }
  };
  const validate = async () => {
    try { setRow(await confirmMealPlan(weekStart)); setToast('Semaine validée : elle est dans ton calendrier et ton historique.'); } catch { setGenErr('Impossible de valider. Réessaie.'); }
  };
  const reopen = async () => {
    try { setRow(await reopenMealPlan(weekStart)); setToast('Semaine rouverte : tu peux tout modifier.'); } catch { setGenErr('Impossible de rouvrir. Réessaie.'); }
  };

  const servesMeals = useMemo(() => {
    const m = new Map<string, number>();
    if (!shown) return m;
    for (const s of shown.slots) {
      const r = s.recipeId ? recipeById.get(s.recipeId) : null;
      if (!r) continue;
      for (const i of r.ingredients) m.set(i.code, (m.get(i.code) ?? 0) + 1);
      for (const sw of s.swaps ?? []) m.set(sw.to, (m.get(sw.to) ?? 0) + 1);
    }
    return m;
  }, [shown, recipeById]);

  if (fin.status !== 'ok' || !fin.week) {
    return (
      <section class="card">
        <h2>Ma semaine de repas</h2>
        <p>Pour construire ta semaine, l’app a besoin de tes besoins en calories : ouvre l’onglet « Mes besoins » pour voir ce qui manque. {NOT_MEDICAL}</p>
      </section>
    );
  }

  const nPublished = catalog?.recipes.length ?? 0;
  const imposeChoices = catalog && prefs
    ? catalog.recipes.filter((r) => r.repas === repasOf(impKind) && !r.lot && recipeAllowed(r, { ...prefs, mealsPerDay: 3 }) && (impQ.trim().length < 2 || r.nom.toLowerCase().includes(impQ.trim().toLowerCase()))).slice(0, 6)
    : [];
  const impKey = `${impDay}-${impKind}-0`;
  const impSlotOff = (impKind === 'petit-dej' && !cfg.petitDej[impDay]) || (impKind === 'gouter' && !cfg.gouter[impDay]);
  return (
    <>
      <section class="card">
        <h2>Ma semaine de repas</h2>
        <p class="dim small">Un plan pour 7 jours d’un coup, construit sur tes besoins de chaque jour (jours lourds, légers, repos) : tu fais tes courses une fois pour la semaine. {NOT_MEDICAL}</p>
        <div class="chips" role="group" aria-label="Semaine">
          <button type="button" class="chip" aria-pressed={!next} onClick={() => setNext(false)}>Cette semaine</button>
          <button type="button" class="chip" aria-pressed={next} onClick={() => setNext(true)}>Semaine prochaine</button>
        </div>
        <p class="notice small">Vérifie toujours l’étiquette des produits que tu achètes : les recettes de l’app ne remplacent pas l’étiquetage ni l’avis d’un médecin.</p>
        {loadErr && <p class="notice notice-urgent" role="alert">{loadErr}</p>}
        {genErr && <p class="notice notice-urgent" role="alert">{genErr}</p>}
        {planState === 'invalide' && <p class="notice" role="status">Ta semaine enregistrée est abîmée : régénère-la.</p>}
        {planState === 'perime' && <p class="notice" role="status">Ta semaine enregistrée vient d’une ancienne version de l’app : régénère-la.</p>}
        {catalog && nPublished === 0 && <p class="notice">Aucune recette n’est encore disponible dans l’app.</p>}
        {shown && unusableCount === 0 && <button type="button" class="btn" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Mes courses</button>}
        {validated ? (
          <div class="notice" role="status">
            <p><strong>✓ Semaine validée.</strong> Elle est dans ton calendrier et ton historique.</p>
            <a class="btn btn-primary" href="#/calendrier">Voir au calendrier</a>
            <button type="button" class="btn" onClick={() => void reopen()}>Rouvrir pour tout modifier</button>
          </div>
        ) : confirmRegen ? (
          <div class="notice" role="alertdialog" aria-label="Confirmer la régénération">
            <p><strong>Régénérer cette semaine ?</strong> Les repas non verrouillés sont remplacés{locks.length ? `, les ${locks.length} repas verrouillés restent` : ''}. Tu pourras annuler.</p>
            <button type="button" class="btn btn-primary" disabled={busy} onClick={() => void generate()}>Oui, régénérer</button>
            <button type="button" class="btn" onClick={() => setConfirmRegen(false)}>Garder ma semaine</button>
          </div>
        ) : (
          <button type="button" class="btn btn-primary" disabled={!catalog || busy || nPublished === 0} onClick={() => (shown ? setConfirmRegen(true) : void generate())}>{shown ? 'Régénérer ma semaine' : 'Générer ma semaine'}</button>
        )}
      </section>

      {!validated && (
        <details class="card nut-details" open={!shown}>
          <summary>Avant de générer : préférences rapides</summary>
          <fieldset class="create-group">
            <legend>Aliments que je ne veux pas</legend>
            <label class="field">Chercher un aliment<input type="text" autocomplete="off" value={dq} onInput={(e) => setDq(e.currentTarget.value)} /></label>
            {dq.trim().length >= 2 && catalog && (
              <div class="chips" role="group" aria-label="Résultats">
                {[...catalog.info.values()].filter((f) => f.nom.toLowerCase().includes(dq.trim().toLowerCase()) && !disliked.includes(f.code)).slice(0, 6).map((f) => (
                  <button type="button" key={f.code} class="chip" onClick={() => { const n = [...disliked, f.code]; setDisliked(n); persist({ dislikedFoods: n }); setDq(''); }}>Exclure : {f.nom}</button>
                ))}
              </div>
            )}
            {disliked.length > 0 && (
              <div class="chips" role="group" aria-label="Aliments exclus">
                {disliked.map((c) => (
                  <button type="button" key={c} class="chip" aria-pressed="true" onClick={() => { const n = disliked.filter((x) => x !== c); setDisliked(n); persist({ dislikedFoods: n }); }}>{catalog?.info.get(c)?.nom ?? c} ✕</button>
                ))}
              </div>
            )}
            <p class="dim small">Les recettes qui contiennent un de ces aliments ne sont jamais proposées.</p>
          </fieldset>
          <fieldset class="create-group">
            <legend>Imposer un repas</legend>
            <div class="chips" role="group" aria-label="Jour">
              {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={DAYS_LONG[i]} aria-pressed={impDay === i} onClick={() => setImpDay(i)}>{d}</button>)}
            </div>
            <div class="chips" role="group" aria-label="Repas">
              {IMPOSE_KINDS.map(([k, l]) => <button type="button" key={k} class="chip" aria-pressed={impKind === k} onClick={() => setImpKind(k)}>{l}</button>)}
            </div>
            {impSlotOff && <p class="dim small">Ce repas n’est pas activé ce jour-là : coche-le dans « Repas, allergies et préférences ».</p>}
            <label class="field">Chercher une recette (2 lettres)<input type="text" autocomplete="off" value={impQ} onInput={(e) => setImpQ(e.currentTarget.value)} /></label>
            <div class="chips" role="group" aria-label="Recettes proposées">
              {imposeChoices.map((r) => <button type="button" key={r.id} class="chip" disabled={impSlotOff} onClick={() => setImposed({ ...imposed, [impKey]: r.id })}>{r.nom}</button>)}
            </div>
            {Object.keys(imposed).length > 0 && (
              <div class="chips" role="group" aria-label="Repas imposés">
                {Object.entries(imposed).map(([k, id]) => {
                  const [d, kind] = k.split('-');
                  return <button type="button" key={k} class="chip" aria-pressed="true" onClick={() => { const n = { ...imposed }; delete n[k]; setImposed(n); }}>{DAYS_LONG[Number(d)]} · {recipeById.get(id)?.nom ?? id} ({kind === 'petit' ? 'petit-déj' : kind}) ✕</button>;
                })}
              </div>
            )}
            <p class="dim small">Le repas imposé est placé à la prochaine génération (s’il respecte tes allergies et ton régime), puis verrouillé. Après la génération, tu peux aussi verrouiller un repas ou un jour entier, ou changer un repas ou un aliment.</p>
          </fieldset>
        </details>
      )}

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
          <legend>Atteindre ta cible</legend>
          <label class="check-row"><input type="checkbox" checked={cfg.completerAuto} onChange={(e) => upCfg({ ...cfg, completerAuto: e.currentTarget.checked })} /><span>Ajouter un goûter ou un en-cas quand il manque plus de {SEUIL_ECART_KCAL} kcal</span></label>
          <p class="dim small">Les portions des repas principaux montent d’abord jusqu’à +30 % ; si ce n’est pas assez, l’app propose un goûter puis un en-cas, jamais au-dessus de ta cible du jour. Décoche pour garder exactement les repas choisis ci-dessus.</p>
        </fieldset>
        <fieldset class="create-group">
          <legend>Allergies et intolérances (exclues strictement)</legend>
          <div class="chips" role="group" aria-label="Allergènes à exclure">
            {ALLERGENS.map((a) => (
              <button type="button" key={a} class="chip" aria-pressed={allergens.includes(a)} onClick={() => setAllergens(allergens.includes(a) ? allergens.filter((x) => x !== a) : [...allergens, a])} title={ALLERGEN_LABELS[a].hint}>{ALLERGEN_LABELS[a].label}</button>
            ))}
          </div>
          <label class="check-row"><input type="checkbox" checked={severe} onChange={(e) => setSevere(e.currentTarget.checked)} /><span>Allergie grave : seules les recettes relues sont proposées</span></label>
          <label class="check-row"><input type="checkbox" checked={celiac} onChange={(e) => setCeliac(e.currentTarget.checked)} /><span>Maladie cœliaque : sans gluten, recettes relues seulement</span></label>
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
        <fieldset class="create-group">
          <legend>Mon jour de courses (rappel sur l’Accueil)</legend>
          <div class="chips" role="group" aria-label="Jour des courses">
            <button type="button" class="chip" aria-pressed={cfg.shoppingDay === null} onClick={() => upCfg({ ...cfg, shoppingDay: null })}>Aucun</button>
            {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={`Courses le ${DAYS_LONG[i].toLowerCase()}`} aria-pressed={cfg.shoppingDay === i} onClick={() => upCfg({ ...cfg, shoppingDay: i })}>{d}</button>)}
          </div>
        </fieldset>
        <p class="dim small">Régénère ta semaine pour appliquer ces réglages.</p>
      </details>

      {shown && catalog && ctx && (
        <>
          <section class="card">
            <h2>Mes 7 jours</h2>
            {toast && <p class="notice small" role="status">{toast}</p>}
            {row?.previous && <button type="button" class="btn btn-quiet" onClick={() => void undo()}>Annuler le dernier changement</button>}
            <PlanDays
              plan={shown} locks={locks} catalog={catalog} ctx={ctx} weekStart={weekStart}
              canEditDay={(d) => !validated || addDaysKey(weekStart, d) >= todayKey}
              usable={usable}
              onChange={(p, l, m) => void commit(p, l, m)}
            />
            {shown.lots.length > 0 && (
              <div class="notice small">
                <strong>À préparer en lot :</strong>{' '}
                {shown.lots.map((l) => `${l.pieces} ${l.piece}${l.pieces > 1 ? 's' : ''} (${recipeById.get(l.recipeId)?.nom ?? l.recipeId})`).join(' ; ')}
              </div>
            )}
            {!validated && (
              <div class="validate-box">
                {unusableCount > 0 && <p class="notice small" role="status">{unusableCount} repas ne correspond{unusableCount > 1 ? 'ent' : ''} plus à tes réglages (allergies, régime) : change-le{unusableCount > 1 ? 's' : ''} avant de valider.</p>}
                {badDay && unusableCount === 0 && <p class="notice small" role="status">{DAYS_LONG[badDay.day]} est incomplet ou sous ton plancher de sécurité : change un repas ou régénère avant de valider.</p>}
                <button type="button" class="btn btn-primary" disabled={!ctx || unusableCount > 0 || !!badDay} onClick={() => void validate()}>Valider la semaine</button>
                <p class="dim small">Valider fige la semaine et l’ajoute à ton calendrier (repas à côté de la séance du jour) et à ton historique.</p>
              </div>
            )}
          </section>

          {unusableCount > 0 && <section class="card"><p class="notice" role="status">La liste de courses et l’export reviennent dès que les repas signalés « À changer » sont changés (ils ne correspondent plus à tes allergies ou à ton régime).</p></section>}
          {unusableCount === 0 && <>
          <ShoppingListCard weekStart={weekStart} ingredients={shown.ingredients} catalog={catalog} serves={servesMeals} />
          <ExportCard plan={shown} recipes={recipeById} units={catalog.units} targets={fin.week} allergens={allergens} diet={diet} severe={severe || celiac} aiEnabled={aiEnabled} />
          </>}
        </>
      )}
    </>
  );
}
