// Export N15 : choisir les jours et le contenu, option « Pour 2 personnes », texte à copier ou fichier JSON. Rien n'est envoyé par l'app.
import { useMemo, useState } from 'preact/hooks';
import { ALLERGEN_LABELS, ALLERGENS, type AllergenKey } from '../../nutrition/allergens';
import type { DayTarget } from '../../nutrition/day-targets';
import { buildExport, checkPerson2, type Person2 } from '../../nutrition/export-plan';
import type { Recipe } from '../../nutrition/plan';
import type { PurchaseUnit } from '../../nutrition/shopping';
import type { WeekPlanResult } from '../../nutrition/week-plan';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

async function saveFile(name: string, text: string): Promise<void> {
  const file = new File([text], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExportCard({ plan, recipes, units, targets, allergens, diet, severe, aiEnabled }: {
  plan: WeekPlanResult;
  recipes: ReadonlyMap<string, Recipe>;
  units: Readonly<Record<string, PurchaseUnit>>;
  targets: readonly DayTarget[];
  allergens: AllergenKey[];
  diet: string[];
  severe: boolean;
  aiEnabled: boolean;
}) {
  const [days, setDays] = useState<boolean[]>(Array(7).fill(true));
  const [shopping, setShopping] = useState(true);
  const [meals, setMeals] = useState(true);
  const [withTargets, setWithTargets] = useState(true);
  const [withExcl, setWithExcl] = useState(true);
  const [two, setTwo] = useState(false);
  const [p2, setP2] = useState({ kcal: '', prot: '', gluc: '', lip: '' });
  const [p2All, setP2All] = useState<AllergenKey[]>([]);
  const [ai, setAi] = useState(false);
  const [done, setDone] = useState('');

  const num = (s: string) => (s.trim() === '' ? NaN : Number(s.replace(',', '.')));
  const person2: Person2 | null = two ? { kcal: num(p2.kcal), prot: num(p2.prot), gluc: num(p2.gluc), lip: num(p2.lip), allergens: p2All } : null;
  const check = person2 ? checkPerson2(person2) : null;
  const res = useMemo(
    () => (days.some(Boolean) && (!check || check.ok) ? buildExport(plan, recipes, units, { days, shopping, meals, targets: withTargets, exclusions: withExcl, person2, aiTemplate: aiEnabled && ai }, targets, { allergens, diet, severeAllergy: severe }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan, days, shopping, meals, withTargets, withExcl, two, p2, p2All, ai, aiEnabled],
  );

  const copy = async () => {
    if (!res) return;
    try {
      await navigator.clipboard.writeText(res.text);
      setDone('Texte copié.');
    } catch {
      setDone('La copie a échoué : utilise « Enregistrer le fichier ».');
    }
  };
  const share = async () => {
    if (!res) return;
    await saveFile('plan-repas.json', JSON.stringify(res.json, null, 2));
    setDone('Fichier prêt.');
  };

  const shares = [
    days.some(Boolean) ? `${days.filter(Boolean).length} jour(s) de repas` : '',
    shopping ? 'la liste de courses' : '',
    meals ? 'les recettes (grammes, étapes, macros)' : '',
    withTargets ? 'tes cibles du jour (calories, protéines, glucides, lipides)' : '',
    withExcl && (allergens.length || diet.length) ? 'tes allergies et régimes à exclure' : '',
    person2 && check?.ok ? 'les cibles de la personne 2' : '',
  ].filter(Boolean);

  return (
    <details class="card nut-details">
      <summary>Exporter mes repas (proche ou IA)</summary>
      <p class="dim small">L’app n’envoie rien : tu copies le texte ou tu enregistres un fichier, puis tu le colles toi-même où tu veux. L’export ne contient ni ton nom, ni ton poids, ni ton objectif.</p>
      <fieldset class="create-group">
        <legend>Jours</legend>
        <div class="chips" role="group" aria-label="Jours à exporter">
          {DAYS.map((d, i) => <button type="button" key={i} class="chip nut-day-chip" aria-label={`Exporter ${DAYS_LONG[i]}`} aria-pressed={days[i]} onClick={() => setDays(days.map((v, k) => (k === i ? !v : v)))}>{d}</button>)}
        </div>
      </fieldset>
      <fieldset class="create-group">
        <legend>Contenu</legend>
        <label class="check-row"><input type="checkbox" checked={shopping} onChange={(e) => setShopping(e.currentTarget.checked)} /><span>Liste de courses</span></label>
        <label class="check-row"><input type="checkbox" checked={meals} onChange={(e) => setMeals(e.currentTarget.checked)} /><span>Repas et recettes complètes</span></label>
        <label class="check-row"><input type="checkbox" checked={withTargets} onChange={(e) => setWithTargets(e.currentTarget.checked)} /><span>Mes cibles du jour</span></label>
        <label class="check-row"><input type="checkbox" checked={withExcl} onChange={(e) => setWithExcl(e.currentTarget.checked)} /><span>Mes allergies et régimes à exclure</span></label>
        {aiEnabled && <label class="check-row"><input type="checkbox" checked={ai} onChange={(e) => setAi(e.currentTarget.checked)} /><span>Ajouter un modèle de demande pour une IA</span></label>}
      </fieldset>
      <fieldset class="create-group">
        <legend>Pour 2 personnes</legend>
        <label class="check-row"><input type="checkbox" checked={two} onChange={(e) => setTwo(e.currentTarget.checked)} /><span>Ajouter les cibles d’une 2e personne (non enregistrées)</span></label>
        {two && (
          <>
            <p class="notice small">La personne 2 doit avoir fait ses propres vérifications (grossesse, maladie, rapport à l’alimentation) ; sinon, qu’elle consulte un professionnel de santé. L’app ne calcule aucun déficit pour elle.</p>
            {([['kcal', 'Calories par jour'], ['prot', 'Protéines (g)'], ['gluc', 'Glucides (g)'], ['lip', 'Lipides (g)']] as const).map(([k, l]) => (
              <label class="field" key={k}>{l}<input type="text" inputMode="decimal" value={p2[k]} onInput={(e) => setP2({ ...p2, [k]: e.currentTarget.value })} /></label>
            ))}
            <div class="chips" role="group" aria-label="Allergènes de la personne 2">
              {ALLERGENS.map((a) => <button type="button" key={a} class="chip" aria-pressed={p2All.includes(a)} onClick={() => setP2All(p2All.includes(a) ? p2All.filter((x) => x !== a) : [...p2All, a])}>{ALLERGEN_LABELS[a].label}</button>)}
            </div>
            {check?.errors.map((e, i) => <p class="notice notice-urgent small" role="alert" key={i}>{e}</p>)}
            {check?.warnings.map((e, i) => <p class="notice small" role="status" key={i}>{e}</p>)}
          </>
        )}
      </fieldset>
      {res?.conflicts.length ? <p class="notice notice-urgent small" role="alert">Des repas contiennent un allergène de la personne 2 : ils sont listés dans l’export, à remplacer.</p> : null}
      <p class="notice small">{severe ? 'Allergie grave : ne te fie pas à une IA pour tes allergènes, vérifie toi-même chaque étiquette. ' : ''}Tu envoies ces données à un service tiers, hors de l’app. Vérifie toujours les allergènes toi-même : une IA peut se tromper.</p>
      <p class="dim small">Tu partages : {shares.length ? shares.join(', ') : 'rien (choisis au moins un jour)'}.</p>
      <button type="button" class="btn" disabled={!res} onClick={() => void copy()}>Copier le texte</button>
      <button type="button" class="btn" disabled={!res} onClick={() => void share()}>Enregistrer le fichier</button>
      {done && <p class="dim small" role="status">{done}</p>}
    </details>
  );
}
