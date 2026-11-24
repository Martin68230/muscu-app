// Liste de courses d'une semaine, MÉMORISÉE : cases cochées, lignes ajoutées à la main, lignes retirées (déjà à la maison), « tout décocher ».
// Les quantités viennent du plan (recalculées à chaque changement de repas) ; les coches sont gardées par produit, donc un repas changé
// après coup conserve les lignes déjà cochées. Tout est enregistré à chaque geste : on peut fermer l'appli au supermarché.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { ShoppingState } from '../../data/model';
import type { Catalog } from '../../nutrition/catalog';
import { buildShoppingList, RAYON_LABELS, RAYON_ORDER, shoppingToText, type PlannedIngredient } from '../../nutrition/shopping';
import { addCustomItem, customKey, getShoppingState, hideItem, removeCustomItem, setChecked, uncheckAll } from '../../nutrition/store';
import { fmtN } from './NutritionMeals';

export function ShoppingListCard({ weekStart, ingredients, catalog, serves, title = 'Mes courses de la semaine' }: { weekStart: string; ingredients: readonly PlannedIngredient[]; catalog: Catalog; serves?: ReadonlyMap<string, number>; title?: string }) {
  const [st, setSt] = useState<ShoppingState | null>(null);
  const [err, setErr] = useState('');
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { void getShoppingState(weekStart).then(setSt).catch(() => setErr('La liste ne se charge pas.')); }, [weekStart]);
  const checked = st?.checked ?? [];
  const hidden = st?.pantry ?? [];
  const custom = st?.custom ?? [];
  const list = useMemo(() => buildShoppingList(ingredients, catalog.units), [ingredients, catalog]);
  const run = async (p: Promise<ShoppingState>) => {
    try { setSt(await p); setErr(''); } catch { setErr('Impossible d’enregistrer. Réessaie.'); }
  };
  const visible = list.filter((i) => !i.pantry && !hidden.includes(i.code));
  const hiddenItems = list.filter((i) => !i.pantry && hidden.includes(i.code));
  const total = visible.length + custom.length;
  const done = visible.filter((i) => checked.includes(i.code)).length + custom.filter((c) => checked.includes(customKey(c.name))).length;
  const toggle = (key: string, on: boolean) => {
    setSt((s) => (s ? { ...s, checked: on ? [...s.checked, key] : s.checked.filter((k) => k !== key) } : s)); // retour immédiat, puis enregistrement
    void setChecked(weekStart, key, on).then(() => getShoppingState(weekStart)).then(setSt).catch(() => setErr('Impossible d’enregistrer cette case.'));
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(shoppingToText(visible)); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <section class="card" id="courses" aria-label={title}>
      <h2>{title}</h2>
      <p class="dim small" role="status">{total === 0 ? 'Rien à acheter.' : `${done} sur ${total} article${total > 1 ? 's' : ''} dans le caddie.`} Quantités additionnées pour les 7 jours, arrondies au conditionnement. Tes cases sont gardées.</p>
      {err && <p class="notice notice-urgent" role="alert">{err}</p>}
      {RAYON_ORDER.map((ray) => {
        const items = visible.filter((i) => i.rayon === ray);
        if (!items.length) return null;
        return (
          <div key={ray}>
            <h3>{RAYON_LABELS[ray]}</h3>
            <ul class="nut-shop">
              {items.map((i) => (
                <li key={i.code} class="shop-line">
                  <label class="check-row">
                    <input type="checkbox" checked={checked.includes(i.code)} onChange={(e) => toggle(i.code, e.currentTarget.checked)} />
                    <span>
                      <strong>{i.name}</strong> : {i.units ? `${i.units.count} × ${i.units.label}` : `${fmtN(i.buyGrams)} g`}
                      {serves && <span class="dim small"> · sert à {serves.get(i.code) ?? 1} repas</span>}
                    </span>
                  </label>
                  <button type="button" class="shop-remove" aria-label={`Retirer ${i.name} de la liste`} onClick={() => void run(hideItem(weekStart, i.code, true))}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {custom.length > 0 && (
        <div>
          <h3>Ajoutés par moi</h3>
          <ul class="nut-shop">
            {custom.map((c) => (
              <li key={customKey(c.name)} class="shop-line">
                <label class="check-row">
                  <input type="checkbox" checked={checked.includes(customKey(c.name))} onChange={(e) => toggle(customKey(c.name), e.currentTarget.checked)} />
                  <span><strong>{c.name}</strong>{c.qty ? ` : ${c.qty}` : ''}</span>
                </label>
                <button type="button" class="shop-remove" aria-label={`Supprimer ${c.name}`} onClick={() => void run(removeCustomItem(weekStart, c.name))}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form class="shop-add" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; void run(addCustomItem(weekStart, name, qty)); setName(''); setQty(''); }}>
        <label class="field">Ajouter une ligne
          <input type="text" autocomplete="off" maxLength={80} value={name} onInput={(e) => setName(e.currentTarget.value)} />
        </label>
        <label class="field">Quantité (facultatif)
          <input type="text" autocomplete="off" maxLength={40} value={qty} onInput={(e) => setQty(e.currentTarget.value)} />
        </label>
        <button type="submit" class="btn" disabled={!name.trim()}>Ajouter</button>
      </form>
      <button type="button" class="btn" disabled={checked.length === 0} onClick={() => void run(uncheckAll(weekStart))}>Tout décocher</button>
      <button type="button" class="btn" onClick={() => void copy()}>Copier la liste</button>
      {copied && <p class="dim small" role="status">Liste copiée.</p>}
      {hiddenItems.length > 0 && (
        <details class="nut-details">
          <summary>Retirés de la liste ({hiddenItems.length})</summary>
          {hiddenItems.map((i) => <button type="button" class="btn" key={i.code} onClick={() => void run(hideItem(weekStart, i.code, false))}>Remettre : {i.name}</button>)}
        </details>
      )}
      {list.some((i) => i.pantry) && <p class="dim small">Déjà dans ton placard (sel, huile, épices) : {list.filter((i) => i.pantry).map((i) => i.name).join(', ')}.</p>}
      <p class="notice small">Vérifie toujours l’étiquette des produits que tu achètes : les recettes de l’app ne remplacent pas l’étiquetage ni l’avis d’un médecin. Valeurs nutritionnelles : Ciqual (ANSES), Licence Ouverte 2.0.</p>
    </section>
  );
}
