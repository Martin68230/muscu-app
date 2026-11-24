// Les 7 jours d'une semaine générée : chaque repas se déplie, se change (autre repas, autre aliment) ou se verrouille depuis un menu « ⋯ ».
// Tout changement passe par src/nutrition/week-edit.ts (mêmes filtres que la génération) puis `onChange` (enregistrement + annulation).
import { useRef, useState } from 'preact/hooks';
import type { SlotOut } from '../../nutrition/week-plan';
import { ALLERGEN_LABELS } from '../../nutrition/allergens';
import type { Catalog } from '../../nutrition/catalog';
import { addDaysKey } from '../../nutrition/meals-calendar';
import { applyMealChange, applySwap, cleanOutKcal, dayTotals, foodAlternatives, lockDay, mealAlternatives, restoKcal, setSlotOut, slotAllergens, toggleLock, type EditCtx } from '../../nutrition/week-edit';
import { composeSlot, slotKeyOf, type WeekPlanResult, type WeekSlot } from '../../nutrition/week-plan';
import { frDate } from '../../session/calendar';
import { fmtN, MealDetail, outTitle, slotLabel } from './NutritionMeals';

const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const sign = (n: number, d = 0) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${fmtN(Math.abs(n), d)}`;

export const outMessage = (label: string, o: SlotOut | null): string => (!o ? `${label} : de retour à la maison.` : o.mode === 'saute' ? `${label} sauté : les autres repas du jour s’ajustent.` : o.mode === 'resto' ? `${label} au restaurant (environ ${Math.round(o.kcal)} kcal, estimation) : les autres repas du jour s’ajustent.` : `${label} déjà fait autrement (environ ${Math.round(o.kcal)} kcal, estimation).`);

export type Panel = { key: string; mode: 'menu' | 'meal' | 'food' | 'where'; from?: string; page: number } | null;

export interface PlanViewProps {
  plan: WeekPlanResult;
  locks: string[];
  catalog: Catalog;
  ctx: EditCtx;
  weekStart: string;
  /** Un jour est modifiable (brouillon : tous ; semaine validée : aujourd'hui et la suite). */
  canEditDay: (day: number) => boolean;
  /** Le repas respecte les réglages d'aujourd'hui (sinon : « à changer », jamais détaillé). */
  usable: (s: WeekSlot) => boolean;
  onChange: (next: WeekPlanResult, locks: string[], message: string) => void;
}

export function PlanDays({ plan, locks, catalog, ctx, weekStart, canEditDay, usable, onChange }: PlanViewProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [open, setOpen] = useState<string | null>(null);
  const press = useRef<number | null>(null);
  const recipeById = new Map(catalog.recipes.map((r) => [r.id, r]));
  const startPress = (key: string, editable: boolean) => {
    if (!editable) return;
    press.current = window.setTimeout(() => { press.current = null; setPanel({ key, mode: 'menu', page: 0 }); }, 550);
  };
  const endPress = () => { if (press.current != null) { clearTimeout(press.current); press.current = null; } };

  return (
    <>
      {plan.days.map((d, di) => {
        const slots = plan.slots.filter((s) => s.day === di);
        const tot = dayTotals(plan.slots, di);
        const editable = canEditDay(di);
        const allLocked = slots.filter((s) => s.recipeId).every((s) => locks.includes(slotKeyOf(s))) && slots.some((s) => s.recipeId);
        const date = addDaysKey(weekStart, di);
        return (
          <div class="nut-plan-day" key={di}>
            <h3>{DAYS_LONG[di]} <span class="dim small">{frDate(date).replace(/^\S+\s/, '')}</span></h3>
            <p class="dim small">Cible {fmtN(d.targetKcal)} kcal · prévu {fmtN(d.kcal)} kcal · protéines {fmtN(tot.prot)} g</p>
            {d.status === 'incomplet' && <p class="notice small">Aucune recette ne convient à un des repas avec tes filtres : élargis tes préférences.</p>}
            {d.belowFloor && <p class="notice small">Ce jour est sous le plancher de sécurité de l’app : change un repas ou régénère la semaine.</p>}
            {(d.missingKcal ?? 0) > 0 && <p class="notice small" role="status">Il manque {fmtN(d.missingKcal ?? 0)} kcal pour atteindre ta cible ce jour-là. {ctx.cfg.completerAuto ? 'L’app ne peut pas en ajouter davantage sans dépasser ta cible du jour ou sortir de tes préférences : ajoute un en-cas toi-même ou assouplis un réglage.' : 'Active « Ajouter un goûter ou un en-cas » dans les réglages, ou ajoute un en-cas toi-même.'}</p>}
            {(d.missingKcal ?? 0) === 0 && d.status === 'ecart' && <p class="dim small">{Math.abs(d.kcal - d.targetKcal) / d.targetKcal > 0.15 ? `Écart important avec ta cible (${fmtN(Math.abs(d.kcal - d.targetKcal))} kcal ${d.kcal < d.targetKcal ? 'de moins' : 'de plus'}) : change un repas ou régénère.` : 'Un peu d’écart avec ta cible ce jour-là.'}</p>}
            <ul class="nut-meals">
              {slots.map((s) => {
                const key = slotKeyOf(s);
                const r = s.recipeId ? recipeById.get(s.recipeId) : undefined;
                const label = slotLabel(s);
                if (!r) return <li key={key}><span class="dim small">{label}</span> <span class="dim">Aucune recette</span></li>;
                const locked = locks.includes(key);
                const ok = usable(s);
                const isPanel = panel?.key === key;
                return (
                  <li key={key} class="plan-meal">
                    <div class="plan-meal-line">
                      <button
                        type="button" class="meal-head" aria-expanded={open === key}
                        onClick={() => setOpen(open === key ? null : key)}
                        onPointerDown={() => startPress(key, editable)} onPointerUp={endPress} onPointerLeave={endPress} onPointerCancel={endPress}
                        onContextMenu={(e) => { if (editable) e.preventDefault(); }}
                      >
                        <span class="dim small">{label}{s.auto ? ' (ajouté pour ta cible)' : ''}{locked ? ' · 🔒 verrouillé' : ''}</span>
                        <strong>{s.out ? outTitle(s.out) : r.nom}</strong>
                        {s.out && <span class="dim small">Prévu à la maison : {r.nom}</span>}
                        <span class="dim small">{s.out ? '' : s.pieces ? `${s.pieces} ${r.piece ?? 'pièce'}${s.pieces > 1 ? 's' : ''}` : s.scale && Math.abs(s.scale - 1) > 0.05 ? `portion ×${fmtN(s.scale, 1)}` : ''}{!s.out && (s.pieces || (s.scale && Math.abs(s.scale - 1) > 0.05)) ? ' · ' : ''}{fmtN(s.kcal)} kcal · P {fmtN(s.prot)} g{s.swaps?.length ? ' · aliment changé' : ''}</span>
                      </button>
                      {editable && (
                        <button type="button" class="meal-more" aria-label={`Actions pour ${r.nom}`} aria-expanded={isPanel} onClick={() => setPanel(isPanel ? null : { key, mode: 'menu', page: 0 })}>⋯</button>
                      )}
                    </div>
                    {!ok && <p class="notice small" role="status">À changer : ce repas ne correspond plus à tes réglages (allergies, régime, aliments exclus).</p>}
                    {ok && !s.out && open === key && <MealDetail slot={s} catalog={catalog} />}
                    {isPanel && editable && (
                      <MealPanel
                        slot={s} panel={panel!} setPanel={setPanel} plan={plan} ctx={ctx} locked={locked}
                        onMeal={(alt) => { onChange(applyMealChange(plan, key, alt, ctx), locks, `${label} changé : ${alt.recipe.nom}.`); setPanel(null); }}
                        onFood={(sw) => { onChange(applySwap(plan, key, sw, ctx), locks, sw.to === sw.from ? 'Aliment d’origine remis.' : `Aliment changé : ${sw.nom}.`); setPanel(null); }}
                        onLock={() => { onChange(plan, toggleLock(locks, key), locked ? 'Repas déverrouillé.' : 'Repas verrouillé : il reste en place si tu régénères.'); setPanel(null); }}
                        onOut={(o) => { onChange(setSlotOut(plan, key, o, ctx), locks, outMessage(label, o)); setPanel(null); }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            {editable && slots.some((s) => s.recipeId) && (
              <button type="button" class="btn btn-quiet" onClick={() => onChange(plan, lockDay(locks, plan, di, !allLocked), allLocked ? `${DAYS_LONG[di]} déverrouillé.` : `${DAYS_LONG[di]} verrouillé : il reste en place si tu régénères.`)}>
                {allLocked ? `Déverrouiller ${DAYS_LONG[di].toLowerCase()}` : `Verrouiller ${DAYS_LONG[di].toLowerCase()}`}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}

export function MealPanel({ slot, panel, setPanel, plan, ctx, locked, onMeal, onFood, onLock, onOut }: {
  slot: WeekSlot; panel: NonNullable<Panel>; setPanel: (p: Panel) => void; plan: WeekPlanResult; ctx: EditCtx; locked: boolean;
  onMeal: (a: ReturnType<typeof mealAlternatives>[number]) => void; onFood: (s: ReturnType<typeof foodAlternatives>[number]['swap']) => void; onLock: () => void; onOut: (out: SlotOut | null) => void;
}) {
  const [sub, setSub] = useState<'resto' | 'autrement' | null>(null);
  const [kcalText, setKcalText] = useState('');
  const key = slotKeyOf(slot);
  const recipe = ctx.recipes.find((r) => r.id === slot.recipeId);
  const label = slotLabel(slot);
  if (panel.mode === 'menu') {
    return (
      <div class="meal-panel" role="group" aria-label={`Actions : ${recipe?.nom ?? label}`}>
        <button type="button" class="btn" disabled={locked || !!slot.out} onClick={() => setPanel({ key, mode: 'meal', page: 0 })}>Changer ce repas</button>
        <button type="button" class="btn" onClick={() => setPanel({ key, mode: 'where', page: 0 })}>Où je mange ce repas ?</button>
        <button type="button" class="btn" disabled={locked || !!slot.out || !recipe || !!recipe.lot} onClick={() => setPanel({ key, mode: 'food', page: 0 })}>Changer un aliment</button>
        <button type="button" class="btn" onClick={onLock}>{locked ? 'Déverrouiller' : 'Verrouiller'}</button>
        {locked && <p class="dim small">Déverrouille ce repas pour le changer.</p>}
        {recipe?.lot && <p class="dim small">Les recettes en lot (barres, muffins) se changent en entier.</p>}
      </div>
    );
  }
  if (panel.mode === 'where') {
    const kind = slot.kind;
    const levels: ['leger' | 'normal' | 'copieux', string][] = [['leger', 'Léger'], ['normal', 'Normal'], ['copieux', 'Copieux']];
    const parsed = kcalText.trim() === '' ? null : cleanOutKcal(Number(kcalText.replace(',', '.')));
    return (
      <div class="meal-panel" role="group" aria-label="Où je mange ce repas ?">
        <p class="small"><strong>Où je mange ce repas ?</strong> <span class="dim">Pour ce jour seulement. Les autres repas du jour s’ajustent, la liste de courses suit.</span></p>
        <button type="button" class="btn" aria-pressed={!slot.out} onClick={() => { setSub(null); onOut(null); }}>À la maison (plan normal)</button>
        <button type="button" class="btn" aria-pressed={slot.out?.mode === 'resto' || sub === 'resto'} onClick={() => { setSub('resto'); setKcalText(''); }}>Au restaurant ou à l’extérieur</button>
        {sub === 'resto' && (
          <div>
            <div class="chips" role="group" aria-label="Repas au restaurant : léger, normal ou copieux">
              {levels.map(([lv, label]) => <button type="button" key={lv} class="chip" aria-pressed={slot.out?.level === lv} onClick={() => onOut({ mode: 'resto', level: lv, kcal: restoKcal(kind, lv) })}>{label} · environ {restoKcal(kind, lv)} kcal</button>)}
            </div>
            <p class="dim small">Repères indicatifs (estimation), pas une mesure. Tu peux aussi saisir ta propre estimation :</p>
            <label class="field">Mon estimation en kcal (facultatif)<input type="text" inputMode="numeric" autocomplete="off" value={kcalText} onInput={(e) => setKcalText(e.currentTarget.value)} /></label>
            <button type="button" class="btn" disabled={parsed === null || kcalText.trim() === ''} onClick={() => onOut({ mode: 'resto', kcal: parsed ?? 0 })}>Enregistrer mon estimation</button>
          </div>
        )}
        <button type="button" class="btn" aria-pressed={slot.out?.mode === 'saute'} onClick={() => { setSub(null); onOut({ mode: 'saute', kcal: 0 }); }}>Je saute ce repas</button>
        <button type="button" class="btn" aria-pressed={slot.out?.mode === 'autrement' || sub === 'autrement'} onClick={() => { setSub('autrement'); setKcalText(''); }}>Déjà fait différemment</button>
        {sub === 'autrement' && (
          <div>
            <label class="field">Estimation en kcal (facultatif, sinon la valeur prévue)<input type="text" inputMode="numeric" autocomplete="off" value={kcalText} onInput={(e) => setKcalText(e.currentTarget.value)} /></label>
            <button type="button" class="btn btn-primary" disabled={kcalText.trim() !== '' && parsed === null} onClick={() => onOut({ mode: 'autrement', kcal: kcalText.trim() === '' ? Math.round(slot.out?.mode ? slot.out.kcal : slot.kcal) : (parsed ?? 0) })}>Enregistrer</button>
          </div>
        )}
        <button type="button" class="btn btn-quiet" onClick={() => setPanel({ key, mode: 'menu', page: 0 })}>Retour</button>
      </div>
    );
  }
  if (panel.mode === 'meal') {
    const alts = mealAlternatives(plan, slot, ctx, 3, panel.page * 3);
    const more = mealAlternatives(plan, slot, ctx, 1, panel.page * 3 + 3).length > 0;
    return (
      <div class="meal-panel" role="group" aria-label="Autres repas équivalents">
        <p class="small"><strong>Autres idées</strong> <span class="dim">(même type de repas, mêmes calories et protéines à peu près, mêmes filtres d’allergies et de régime)</span></p>
        {alts.length === 0 && <p class="notice small">Aucune autre recette équivalente avec tes filtres.</p>}
        {alts.map((a) => (
          <div class="alt-card" key={a.recipe.id}>
            <strong>{a.recipe.nom}</strong>
            <span class="dim small">{fmtN(a.kcal)} kcal ({sign(a.dKcal)}) · P {fmtN(a.prot)} g ({sign(a.dProt)}) · {a.recipe.prepMin + a.recipe.cuissonMin} min</span>
            {a.recipe.allergenes.length > 0 && <span class="dim small">Allergènes : {a.recipe.allergenes.map((x) => ALLERGEN_LABELS[x].label).join(', ')}</span>}
            <button type="button" class="btn btn-primary" onClick={() => onMeal(a)}>Choisir ce repas</button>
          </div>
        ))}
        {more && <button type="button" class="btn" onClick={() => setPanel({ ...panel, page: panel.page + 1 })}>Voir 3 autres</button>}
        <button type="button" class="btn btn-quiet" onClick={() => setPanel({ key, mode: 'menu', page: 0 })}>Retour</button>
      </div>
    );
  }
  // changer un aliment
  if (!recipe) return null;
  const comp = composeSlot(recipe, slot, ctx.foods);
  if (!panel.from) {
    return (
      <div class="meal-panel" role="group" aria-label="Quel aliment changer ?">
        <p class="small"><strong>Quel aliment changer ?</strong></p>
        {recipe.ingredients.map((i, idx) => {
          const line = comp?.lines[idx];
          const f = ctx.info.get(i.code);
          if (!line || !f || f.gardeManger) return null;
          return <button type="button" class="btn" key={i.code} onClick={() => setPanel({ ...panel, from: i.code, page: 0 })}>{line.nom} · {fmtN(line.grammes)} g</button>;
        })}
        <button type="button" class="btn btn-quiet" onClick={() => setPanel({ key, mode: 'menu', page: 0 })}>Retour</button>
      </div>
    );
  }
  const alts = foodAlternatives(recipe, slot, panel.from, ctx, 4);
  const swapped = slot.swaps?.some((s) => s.from === panel.from);
  const original = recipe.ingredients.find((i) => i.code === panel.from);
  return (
    <div class="meal-panel" role="group" aria-label="Aliments équivalents">
      <p class="small"><strong>Remplacer : {original?.nom}</strong> <span class="dim">(même famille, mêmes calories, allergènes vérifiés)</span></p>
      {alts.length === 0 && <p class="notice small">Aucun aliment équivalent avec tes filtres.</p>}
      {alts.map((a) => (
        <div class="alt-card" key={a.food.code}>
          <strong>{a.food.nom} · {fmtN(a.swap.grammes)} g</strong>
          <span class="dim small">{sign(a.dKcal)} kcal · protéines {sign(a.dProt, 1)} g · glucides {sign(a.dGluc, 1)} g · lipides {sign(a.dLip, 1)} g</span>
          {a.food.allergenes.length > 0 && <span class="dim small">Allergènes : {a.food.allergenes.map((x) => ALLERGEN_LABELS[x].label).join(', ')}</span>}
          <button type="button" class="btn btn-primary" onClick={() => onFood(a.swap)}>Choisir</button>
        </div>
      ))}
      {swapped && original && <button type="button" class="btn" onClick={() => onFood({ from: panel.from!, to: panel.from!, nom: original.nom, grammes: 0, rayon: original.rayon, allergenes: [] })}>Remettre {original.nom}</button>}
      <button type="button" class="btn btn-quiet" onClick={() => setPanel({ key, mode: 'food', page: 0 })}>Retour</button>
    </div>
  );
}

export { slotAllergens };
