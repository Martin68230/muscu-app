// Phase 7 « Nutrition » : dépistage, objectif, besoins par jour, pesée hebdomadaire et courbe (docs/nutrition-spec.md N2 à N9).
// Tout est local et privé. Aucun calcul ici : src/nutrition/*. Pas un avis médical.
import { useEffect, useState } from 'preact/hooks';
import type { NutritionAnswer, NutritionGoal, NutritionProfile, Profile, WeeklyCheckin } from '../../data/model';
import { list } from '../../data/repo';
import { evaluateAlerts, nextAdjust, targetAllowed, type AlertKey } from '../../nutrition/alerts';
import type { DaySession, DayType } from '../../nutrition/day-targets';
import { N_PESEES_MIN, PERTE_PCT_SEMAINE, PRISE_PCT_SEMAINE, POIDS_KG_MAX, POIDS_KG_MIN } from '../../nutrition/config';
import { ageFromBirthYear, finalNeeds, type FinalNeeds } from '../../nutrition/final-needs';
import { bmi, screenNutrition, type GoalKind, type Pace, type ScreeningAnswers, type Sex } from '../../nutrition/needs';
import { addWeighIn, getActiveGoal, getNutritionProfile, listCheckins, listWeighIns, removeWeighIn, saveGoal, saveNutritionProfile, setCheckinAdjust } from '../../nutrition/store';
import { interpretTrend, rateKgPerWeek, smoothWeights, weekStartOf, type TrendPoint, type TrendState } from '../../nutrition/weight-trend';
import { dateKey } from '../../session/calendar';
import { WeekTab } from './NutritionWeek';

const NOT_MEDICAL = 'Ce n’est pas un avis médical.';

const ANSWERS: [NutritionAnswer, string][] = [['non', 'Non'], ['oui', 'Oui'], ['refus', 'Je préfère ne pas répondre']];

const QUESTIONS: { key: keyof ScreeningAnswers; text: string; femaleOnly?: boolean }[] = [
  { key: 'grossesse', text: 'Es-tu enceinte ?', femaleOnly: true },
  { key: 'allaitement', text: 'Allaites-tu ?', femaleOnly: true },
  { key: 'postPartum', text: 'As-tu accouché il y a moins d’un an ?', femaleOnly: true },
  { key: 'maladie', text: 'As-tu une maladie suivie (diabète, reins, foie, cœur, tension élevée non contrôlée, autre) ?' },
  { key: 'rapportAlimentation', text: 'Le poids ou la nourriture occupent-ils une grande partie de tes pensées, ou as-tu déjà eu l’impression de perdre le contrôle de ce que tu manges ? (question facultative, réponse privée)' },
  { key: 'medicament', text: 'Prends-tu un traitement médicamenteux régulier ?' },
];

const TREND_TEXT: Record<TrendState, string> = {
  pas_assez: 'Pas encore assez de pesées pour lire une tendance : continue, une par semaine suffit.',
  stable: 'Ton poids lissé est stable.',
  en_avance: 'Tu es en avance sur ton rythme.',
  dans_le_rythme: 'Tu es dans le rythme que tu t’es fixé.',
  plus_lent: 'Le poids lissé évolue plus lentement que prévu.',
  plus_rapide: 'Le poids lissé évolue plus vite que prévu.',
};

const ALERT_TEXT: Record<AlertKey, string> = {
  rythme_trop_rapide: `Ton poids baisse plus vite que le rythme prudent de l’app : la cible de calories est relevée. Si ce n’est pas voulu, parles-en à un médecin. ${NOT_MEDICAL}`,
  gel_deficit: `Ton poids baisse très vite : l’app ne propose plus de déficit. Parle à un médecin ou à un diététicien avant de continuer. ${NOT_MEDICAL}`,
  perte_non_voulue: `Ton poids baisse alors que ton objectif n’est pas de perdre. Parles-en à un médecin si tu ne sais pas pourquoi. ${NOT_MEDICAL}`,
};

const WEEKDAY_LABEL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const TYPE_LABEL: Record<DayType, string> = { repos: 'Repos', leger: 'Léger', moyen: 'Séance', lourd: 'Jour lourd', intense: 'Jour intense' };

function Radios<T extends string>({ name, value, options, onChange }: { name: string; value: T | null; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <>
      {options.map(([v, label]) => (
        <label class="check-row" key={v}>
          <input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} />
          <span>{label}</span>
        </label>
      ))}
    </>
  );
}

const fmt = (n: number, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });

/** Courbe du poids : points bruts, poids lissé, ligne d'objectif. SVG maison, lisible en mode sombre, tableau accessible dessous. */
function WeightChart({ raw, trend, targetKg }: { raw: { date: string; kg: number }[]; trend: TrendPoint[]; targetKg: number | null }) {
  if (raw.length === 0) return null;
  const W = 340, H = 190, pl = 40, pr = 10, pt = 10, pb = 26;
  const vals = [...raw.map((r) => r.kg), ...trend.map((t) => t.trend), ...(targetKg ? [targetKg] : [])];
  const min = Math.floor(Math.min(...vals) - 1);
  const max = Math.ceil(Math.max(...vals) + 1);
  const t0 = Date.parse(`${raw[0].date}T00:00:00Z`);
  const t1 = Math.max(Date.parse(`${raw[raw.length - 1].date}T00:00:00Z`), t0 + 7 * 86_400_000);
  const x = (d: string) => pl + ((Date.parse(`${d}T00:00:00Z`) - t0) / (t1 - t0)) * (W - pl - pr);
  const y = (k: number) => pt + (1 - (k - min) / (max - min)) * (H - pt - pb);
  const line = trend.map((p) => `${x(p.weekStart).toFixed(1)},${y(p.trend).toFixed(1)}`).join(' ');
  const last = trend[trend.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} class="nut-chart" role="img" aria-label={`Courbe du poids : ${raw.length} pesée${raw.length > 1 ? 's' : ''}${last ? `, poids lissé ${fmt(last.trend, 1)} kg` : ''}${targetKg ? `, objectif ${fmt(targetKg, 1)} kg` : ''}`}>
      {[min, (min + max) / 2, max].map((v) => (
        <g key={v}>
          <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="currentColor" opacity="0.15" />
          <text x={pl - 6} y={y(v) + 4} text-anchor="end" font-size="11" fill="currentColor" opacity="0.7">{fmt(v, 0)}</text>
        </g>
      ))}
      {targetKg != null && <line x1={pl} x2={W - pr} y1={y(targetKg)} y2={y(targetKg)} stroke="var(--accent)" stroke-dasharray="5 4" stroke-width="2" />}
      {raw.map((r) => <circle key={r.date} cx={x(r.date)} cy={y(r.kg)} r="3" fill="currentColor" opacity="0.45" />)}
      {trend.length > 1 && <polyline points={line} fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />}
      {last && <circle cx={x(last.weekStart)} cy={y(last.trend)} r="5" fill="var(--accent)" />}
    </svg>
  );
}

interface Data {
  np: NutritionProfile | null;
  goal: NutritionGoal | null;
  weights: { id: string; date: string; kg: number }[];
  checkins: WeeklyCheckin[];
  days: DaySession[][];
  /** Taille lue dans la base (le profil gardé en mémoire par l'app peut être plus ancien). */
  heightCm: number | null;
}

async function loadData(): Promise<Data> {
  const [np, goal, weights, checkins, programs, profiles] = await Promise.all([getNutritionProfile(), getActiveGoal(), listWeighIns(), listCheckins(), list('programs'), list('profile')]);
  const prog = programs.find((p) => p.active);
  const days: DaySession[][] = Array.from({ length: 7 }, () => []);
  for (const d of prog?.days ?? []) {
    if (d.weekday === undefined || d.weekday < 0 || d.weekday > 6) continue;
    days[d.weekday].push({ kind: 'muscu', sessionType: d.sessionType, minutes: d.estimatedMin ?? 60 });
  }
  return { np, goal, weights: weights.map((w) => ({ id: w.id, date: w.date, kg: w.kg })), checkins, days, heightCm: profiles[0]?.heightCm ?? null };
}

function answersOf(np: NutritionProfile | null, profile: Profile): ScreeningAnswers {
  const s = (np?.screening ?? {}) as Record<string, NutritionAnswer>;
  const g = (k: keyof ScreeningAnswers): NutritionAnswer => (s[k] === 'non' || s[k] === 'oui' || s[k] === 'refus' ? s[k] : null);
  const a: ScreeningAnswers = { grossesse: g('grossesse'), allaitement: g('allaitement'), postPartum: g('postPartum'), maladie: g('maladie'), rapportAlimentation: g('rapportAlimentation'), medicament: g('medicament') };
  // Le profil sportif connaît déjà la grossesse : une réponse « oui » ici ne peut pas être contredite.
  if (profile.pregnancy === 'enceinte') a.grossesse = 'oui';
  if (profile.pregnancy === 'post_partum') a.postPartum = 'oui';
  return a;
}

export function NutritionScreen({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<'besoins' | 'semaine' | 'poids'>('besoins');
  const [editing, setEditing] = useState(false);
  const reload = () => loadData().then(setData);
  useEffect(() => void reload(), []);

  if (!data) return <div class="nut"><p class="dim">Chargement…</p></div>;
  const { np } = data;
  const setupDone = !!np && np.screeningResult !== null && !editing;

  return (
    <div class="nut">
      <button type="button" class="btn btn-link btn-back" onClick={onBack}>‹ Retour à la bibliothèque</button>
      <h1>Nutrition</h1>
      <p class="dim small">Des estimations pour t’aider à manger selon ton entraînement. {NOT_MEDICAL} Tout reste sur ton téléphone.</p>
      {!setupDone ? (
        <Setup profile={profile} data={data} onDone={() => { setEditing(false); void reload(); }} onCancel={np?.screeningResult ? () => setEditing(false) : undefined} />
      ) : (
        <>
          <div class="chips" role="group" aria-label="Section">
            <button type="button" class="chip" aria-pressed={tab === 'besoins'} onClick={() => setTab('besoins')}>Mes besoins</button>
            <button type="button" class="chip" aria-pressed={tab === 'semaine'} onClick={() => setTab('semaine')}>Semaine</button>
            <button type="button" class="chip" aria-pressed={tab === 'poids'} onClick={() => setTab('poids')}>Poids et courbe</button>
          </div>
          {tab === 'besoins' ? (
            <Needs profile={profile} data={data} onEdit={() => setEditing(true)} />
          ) : tab === 'semaine' ? (
            <WeekTab np={np!} fin={finalFor(profile, data).result} />
          ) : (
            <Weight profile={profile} data={data} onChanged={reload} />
          )}
        </>
      )}
    </div>
  );
}

/** Données du corps pour les calculs (âge à partir de l'année de naissance, dernier poids). */
function bodyOf(np: NutritionProfile, heightCm: number | null, weights: Data['weights']) {
  return {
    sex: np.sexForFormula as Sex,
    kg: weights.length ? weights[weights.length - 1].kg : null,
    cm: heightCm,
    age: np.birthYear ? ageFromBirthYear(np.birthYear) : null,
  };
}

function Setup({ profile, data, onDone, onCancel }: { profile: Profile; data: Data; onDone: () => void; onCancel?: () => void }) {
  const np = data.np;
  const lastKg = data.weights.length ? data.weights[data.weights.length - 1].kg : null;
  const [sex, setSex] = useState<Sex>((np?.sexForFormula as Sex) ?? null);
  const [year, setYear] = useState(np?.birthYear ? String(np.birthYear) : '');
  const [cm, setCm] = useState((data.heightCm ?? profile.heightCm) ? String(data.heightCm ?? profile.heightCm) : '');
  const [kg, setKg] = useState(lastKg ? String(lastKg) : '');
  // Les réponses réservées aux femmes ne sont jamais préremplies si le sexe enregistré n'était pas « femme ».
  const [ans, setAns] = useState<Record<string, NutritionAnswer>>(() => {
    const s = { ...(np?.screening as Record<string, NutritionAnswer>) };
    if (np?.sexForFormula !== 'femme') for (const k of ['grossesse', 'allaitement', 'postPartum']) delete s[k];
    return s;
  });
  const chooseSex = (v: Sex) => {
    if (v === 'femme' && sex !== 'femme') setAns((a) => { const n = { ...a }; for (const k of ['grossesse', 'allaitement', 'postPartum']) delete n[k]; return n; });
    setSex(v);
  };
  const [kind, setKind] = useState<GoalKind>(data.goal?.kind ?? 'maintien');
  const [pace, setPace] = useState<Pace>(data.goal?.pace ?? 'standard');
  const [target, setTarget] = useState(data.goal?.targetKg ? String(data.goal.targetKg) : '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const female = sex === 'femme';
  const questions = QUESTIONS.filter((q) => !q.femaleOnly || female);

  const submit = async () => {
    try {
      await submitInner();
    } catch (e) {
      setBusy(false);
      setErr(`Impossible d’enregistrer pour le moment (${e instanceof Error ? e.message : 'erreur inconnue'}). Réessaie ; tes données restent sur ton téléphone.`);
    }
  };
  const submitInner = async () => {
    setErr('');
    const num = (s: string) => Number(s.replace(',', '.'));
    const kgN = num(kg), cmN = num(cm), yearN = num(year);
    if (!sex) return setErr('Choisis une option pour le calcul (même « ne pas préciser »).');
    if (!(yearN >= 1900 && yearN <= new Date().getFullYear())) return setErr('Indique ton année de naissance (4 chiffres).');
    if (!(kgN >= POIDS_KG_MIN && kgN <= POIDS_KG_MAX)) return setErr(`Poids entre ${POIDS_KG_MIN} et ${POIDS_KG_MAX} kg.`);
    if (!(cmN >= 120 && cmN <= 230)) return setErr('Taille entre 120 et 230 cm.');
    for (const q of questions) if (!ans[q.key]) return setErr('Réponds à toutes les questions (« Je préfère ne pas répondre » est permis).');
    const tgt = target ? num(target) : null;
    if (kind !== 'maintien' && tgt != null && (!(tgt > 0) || !targetAllowed(tgt, cmN))) return setErr('Ce poids cible donnerait un IMC trop bas : l’app ne le propose pas. Parles-en à un professionnel.');
    setBusy(true);
    const full: Record<string, NutritionAnswer> = { grossesse: 'non', allaitement: 'non', postPartum: 'non', ...ans };
    if (!female) { full.grossesse = 'non'; full.allaitement = 'non'; full.postPartum = 'non'; }
    const answers = { ...(full as unknown as ScreeningAnswers) };
    const result = screenNutrition(answers, { sex, kg: kgN, cm: cmN, age: ageFromBirthYear(yearN) });
    await saveNutritionProfile({ birthYear: yearN, sexForFormula: sex, screening: full, screeningResult: result, screenedAt: new Date().toISOString() });
    // La taille vit dans le profil (une seule source) ; le poids dans le suivi existant.
    const { update } = await import('../../data/repo');
    if (profile.heightCm !== cmN) await update('profile', profile.id, { heightCm: cmN });
    if (lastKg !== kgN) await addWeighIn(dateKey(new Date()), kgN, null, '');
    // Aucun objectif de perte ou de prise pour un profil « repères seulement ».
    await saveGoal({ kind: result === 'reperes' ? 'maintien' : kind, startDate: dateKey(new Date()), startKg: kgN, targetKg: result === 'reperes' ? null : tgt, targetDate: null, pace });
    setBusy(false);
    onDone();
  };

  return (
    <form class="nut-form" onSubmit={(e) => { e.preventDefault(); void submit(); }} noValidate>
      <div class="notice">
        <p><strong>Avant de commencer.</strong> L’app donne des estimations à partir de règles publiées. Elle ne remplace pas un médecin, un diététicien ou un coach. {NOT_MEDICAL}</p>
        <p class="small">Les questions ci-dessous servent à ta sécurité. Tes réponses restent sur ton téléphone et ne sont jamais partagées.</p>
      </div>

      <fieldset class="create-group">
        <legend>Pour le calcul, je suis</legend>
        <Radios<Exclude<Sex, null>> name="sexe" value={sex} onChange={chooseSex} options={[['homme', 'Un homme'], ['femme', 'Une femme'], ['non_precise', 'Je préfère ne pas préciser']]} />
        {sex === 'non_precise' && <p class="dim small">Sans cette information, l’app ne peut donner que des repères généraux, pas de chiffres.</p>}
      </fieldset>
      <label class="field">Année de naissance
        <input type="text" inputmode="numeric" autocomplete="off" value={year} onInput={(e) => setYear(e.currentTarget.value)} placeholder="1995" />
      </label>
      <label class="field">Taille (cm)
        <input type="text" inputmode="numeric" autocomplete="off" value={cm} onInput={(e) => setCm(e.currentTarget.value)} placeholder="175" />
      </label>
      <label class="field">Poids actuel (kg)
        <input type="text" inputmode="decimal" autocomplete="off" value={kg} onInput={(e) => setKg(e.currentTarget.value)} placeholder="72,5" />
      </label>

      {sex && questions.map((q) => (
        <fieldset class="create-group" key={q.key}>
          <legend>{q.text}</legend>
          <Radios<Exclude<NutritionAnswer, null>> name={q.key} value={(ans[q.key] as Exclude<NutritionAnswer, null>) ?? null} onChange={(v) => setAns({ ...ans, [q.key]: v })} options={ANSWERS as [Exclude<NutritionAnswer, null>, string][]} />
        </fieldset>
      ))}

      <fieldset class="create-group">
        <legend>Mon objectif</legend>
        <Radios<GoalKind> name="objectif" value={kind} onChange={setKind} options={[['maintien', 'Garder mon poids'], ['perte', 'Perdre du gras'], ['prise', 'Prendre du muscle']]} />
      </fieldset>
      {kind !== 'maintien' && (
        <>
          <fieldset class="create-group">
            <legend>Rythme</legend>
            <Radios<Pace> name="rythme" value={pace} onChange={setPace} options={[['doux', 'Doux'], ['standard', 'Standard'], ['ferme', 'Ferme']]} />
            <p class="dim small">Le rythme reste toujours sous un plafond de prudence, même sur « Ferme ».</p>
          </fieldset>
          <label class="field">Poids visé (kg), facultatif
            <input type="text" inputmode="decimal" autocomplete="off" value={target} onInput={(e) => setTarget(e.currentTarget.value)} />
          </label>
        </>
      )}
      {err && <p class="notice notice-urgent" role="alert">{err}</p>}
      <button type="submit" class="btn btn-primary" disabled={busy}>Enregistrer</button>
      {onCancel && <button type="button" class="btn btn-link" onClick={onCancel}>Annuler</button>}
    </form>
  );
}

/**
 * UNE SEULE source de vérité : src/nutrition/final-needs.ts. L'écran « Mes besoins », le plan de repas et la liste de courses lisent ce résultat
 * (calories, macros, jours de la semaine), jamais un calcul refait ailleurs.
 */
export function finalFor(profile: Profile, data: Data) {
  const np = data.np!;
  const body = bodyOf(np, data.heightCm, data.weights);
  const goal = data.goal;
  const kind: GoalKind = goal?.kind ?? 'maintien';
  const gel = kind === 'perte' && evaluateAlerts({ trend: smoothWeights(data.weights), goal: 'perte' }).includes('gel_deficit');
  const adjust = data.checkins.length ? data.checkins[data.checkins.length - 1].kcalAdjust : 0;
  const result = finalNeeds({ answers: answersOf(np, profile), body, sessionsPerWeek: profile.daysPerWeek ?? 3, goal: kind, pace: goal?.pace ?? 'standard', adjust, gel, days: data.days });
  return { body, goal, gel, result };
}

function Needs({ profile, data, onEdit }: { profile: Profile; data: Data; onEdit: () => void }) {
  const { gel, result } = finalFor(profile, data);
  if (result.status === 'reperes') {
    return (
      <>
        <section class="card">
          <h2>Pourquoi je n’affiche pas de chiffres</h2>
          <p class="small">Pour ta sécurité, l’app ne donne pas de calories ni de macros tant que ces points ne sont pas réglés. {NOT_MEDICAL}</p>
          <ul class="nut-reasons">
            {result.reasons.map((r) => (
              <li key={r.code + r.text}>
                <strong>{r.fixable ? 'À compléter : ' : 'À voir avec un professionnel : '}</strong>
                {r.text}
              </li>
            ))}
          </ul>
        </section>
        <button type="button" class="btn btn-primary" onClick={onEdit}>{result.reasons.some((r) => r.fixable) ? 'Compléter mes informations' : 'Refaire le questionnaire'}</button>
      </>
    );
  }
  return <NeedsView data={data} fin={result} gel={gel} onEdit={onEdit} />;
}

function NeedsView({ data, fin, gel, onEdit }: { data: Data; fin: FinalNeeds; gel: boolean; onEdit: () => void }) {
  const kind = fin.goal; // objectif réellement appliqué (le gel ou l'IMC peuvent le ramener au maintien)
  const goalText = kind === 'perte' ? 'Perdre du gras' : kind === 'prise' ? 'Prendre du muscle' : 'Garder mon poids';
  const hasProgram = data.days.some((d) => d.length);
  const today = (new Date().getDay() + 6) % 7;
  const td = fin.week?.[today];
  const pace = fin.effectiveKgPerWeek;
  return (
    <>
      <section class="card">
        <h2>Aujourd’hui ({WEEKDAY_LABEL[today].toLowerCase()})</h2>
        {td ? (
          <>
            <p class="nut-big">{fmt(td.kcal)} kcal</p>
            <p class="dim small">{TYPE_LABEL[td.type]}</p>
            <ul class="nut-macros">
              <li><strong>{fmt(td.protG)} g</strong> protéines</li>
              <li><strong>{fmt(td.glucG)} g</strong> glucides</li>
              <li><strong>{fmt(td.lipG)} g</strong> lipides</li>
            </ul>
          </>
        ) : <p class="dim small">Pas de répartition par jour possible avec ces valeurs : voir la moyenne ci-dessous.</p>}
        <p class="small">Eau : repère général pour un adulte, environ <strong>{fmt(fin.waterL, 1)} L</strong> par jour au total, boissons et aliments compris (apport adéquat EFSA). Bois selon ta soif, plus s’il fait chaud ou si tu t’entraînes beaucoup. {NOT_MEDICAL}</p>
      </section>
      <section class="card">
        <h2>Ma journée moyenne</h2>
        <p class="nut-big">{fmt(fin.kcal)} kcal</p>
        <p class="dim small">{goalText}. Estimation, recalée avec ta courbe de poids.</p>
        <ul class="nut-macros">
          <li><strong>{fmt(fin.protG)} g</strong> protéines</li>
          <li><strong>{fmt(fin.glucG)} g</strong> glucides</li>
          <li><strong>{fmt(fin.lipG)} g</strong> lipides</li>
        </ul>
        {kind === 'maintien' || Math.abs(pace) < 0.005 ? <p class="small">Rythme de poids visé : stable.</p> : <p class="small">Rythme de poids visé : <strong>environ {fmt(Math.abs(pace), 2)} kg par semaine</strong> {pace < 0 ? 'de perte' : 'de prise'}, sous le plafond de prudence de l’app.</p>}
        {gel && <p class="notice">Ton poids baisse très vite : l’app ne propose plus de déficit. Parle à un médecin ou à un diététicien avant de continuer. {NOT_MEDICAL}</p>}
        {fin.needs.floorBinding && <p class="dim small">Le plancher de sécurité de l’app a réduit, voire annulé, le déficit.</p>}
        {fin.kcal > fin.needs.tdee + 1 && <p class="dim small">Ta cible est relevée au plancher de sécurité de l’app, un peu au-dessus de ton besoin estimé.</p>}
        {fin.needs.noDeficitReason === 'imc' && <p class="dim small">Avec ton IMC, l’app ne propose pas de déficit chiffré.</p>}
        {fin.screen === 'prudent' && <p class="dim small">À partir de 65 ans, les changements sont plus doux : demande l’avis d’un médecin. {NOT_MEDICAL}</p>}
        <details class="nut-details">
          <summary>Comment c’est calculé</summary>
          <p class="small">Besoin estimé (formule de Mifflin-St Jeor × activité) : <strong>{fmt(fin.needs.tdee)} kcal</strong>. Métabolisme de repos : {fmt(fin.needs.resting)} kcal. Plancher de sécurité : {fmt(fin.needs.floor)} kcal. Écart appliqué : {fmt(fin.needs.deltaKcal)} kcal. Cible finale après plancher et plafonds : <strong>{fmt(fin.kcal)} kcal</strong>. C’est la même valeur pour tes repas et ta liste de courses.</p>
        </details>
      </section>
      <section class="card">
        <h2>Ma semaine</h2>
        {!hasProgram && <p class="dim small">Pas de programme actif : tous les jours sont comptés comme du repos. Crée ton programme depuis l’Accueil pour adapter les jours.</p>}
        {fin.week ? (
          <ul class="nut-week">
            {fin.week.map((d, i) => (
              <li key={i} class={i === today ? 'nut-today' : ''}>
                <span class="nut-day"><strong>{WEEKDAY_LABEL[i]}</strong> <span class="dim small">{TYPE_LABEL[d.type]}</span></span>
                <span>{fmt(d.kcal)} kcal</span>
                <span class="dim small">P {fmt(d.protG)} · G {fmt(d.glucG)} · L {fmt(d.lipG)}</span>
              </li>
            ))}
          </ul>
        ) : <p class="dim small">Pas de répartition possible avec ces valeurs.</p>}
        <p class="dim small">La moyenne de la semaine égale ta cible : plus de glucides les jours lourds, moins les jours de repos.</p>
      </section>
      <button type="button" class="btn" onClick={onEdit}>Modifier mes informations ou mon objectif</button>
      <p class="dim small">Données de composition : Ciqual (ANSES), Licence Ouverte 2.0. Estimations générales, {NOT_MEDICAL.toLowerCase()}</p>
    </>
  );
}

function Weight({ profile, data, onChanged }: { profile: Profile; data: Data; onChanged: () => void }) {
  const np = data.np!;
  const goal = data.goal;
  const today = dateKey(new Date());
  const [date, setDate] = useState(today);
  const [kg, setKg] = useState('');
  const [adh, setAdh] = useState<Exclude<WeeklyCheckin['adherence'], null> | null>(null);
  const [msg, setMsg] = useState<string[]>([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const trend = smoothWeights(data.weights);
  const rate = rateKgPerWeek(trend);
  const body = bodyOf(np, data.heightCm, data.weights);
  const targetPerWeek = goal && body.kg ? (goal.kind === 'perte' ? -(body.kg * PERTE_PCT_SEMAINE[goal.pace]) / 100 : goal.kind === 'prise' ? (body.kg * PRISE_PCT_SEMAINE) / 100 : 0) : 0;
  const state = interpretTrend(rate, targetPerWeek);
  const alerts = goal ? evaluateAlerts({ trend, goal: goal.kind }) : [];
  const last = trend[trend.length - 1];

  const save = async () => {
    setErr('');
    const v = Number(kg.replace(',', '.'));
    if (!(v >= POIDS_KG_MIN && v <= POIDS_KG_MAX)) return setErr(`Poids entre ${POIDS_KG_MIN} et ${POIDS_KG_MAX} kg.`);
    if (!date || date > today) return setErr('Choisis une date qui n’est pas dans le futur.');
    setBusy(true);
    await addWeighIn(date, v, adh, '');
    const after = await loadData();
    const t2 = smoothWeights(after.weights);
    const rate2 = rateKgPerWeek(t2);
    const wk = weekStartOf(date);
    const cur = after.checkins.find((c) => c.weekStart === wk);
    const out: string[] = [];
    if (goal && rate2 && cur) {
      // Recalage hebdomadaire borné ; la cible affichée passe ensuite par adjustedTarget (plancher, déficit et surplus maximaux).
      const fin = finalFor(profile, after);
      const n = fin.result.status === 'ok' ? fin.result.needs : null;
      if (n && fin.result.status === 'ok') {
        const tgt = fin.result.targetKgPerWeek;
        const al = evaluateAlerts({ trend: t2, goal: goal.kind });
        let adj = nextAdjust({ currentAdjust: cur.kcalAdjust, tdeeInitial: n.tdee, goal: goal.kind, rateKgPerWeek: rate2.kgPerWeek, targetKgPerWeek: tgt, adherence: adh, weeksOfData: t2.length });
        // Perte trop rapide ou gel : la cible monte, jamais l'inverse.
        if (al.includes('rythme_trop_rapide') || al.includes('gel_deficit')) adj = Math.min(n.tdee * 0.15, Math.max(adj, cur.kcalAdjust + 150));
        if (adj !== cur.kcalAdjust) {
          await setCheckinAdjust(wk, adj, t2[t2.length - 1]?.trend ?? null);
          out.push(adj > cur.kcalAdjust ? 'Ta cible de calories a été relevée un peu.' : 'Ta cible de calories a été ajustée un peu.');
        }
        for (const a of al) out.push(ALERT_TEXT[a]);
      }
    }
    out.unshift(TREND_TEXT[interpretTrend(rate2, targetPerWeek)]);
    setMsg(out);
    setKg('');
    setBusy(false);
    onChanged();
  };

  const remove = async (id: string) => {
    await removeWeighIn(id);
    onChanged();
  };

  return (
    <>
      <section class="card">
        <h2>Pesée de la semaine</h2>
        <p class="dim small">Une pesée par semaine suffit : même jour, au réveil, avant de manger. Les écarts d’un jour à l’autre sont normaux (eau, sel, digestion) : regarde la tendance.</p>
        <label class="field">Date
          <input type="date" value={date} max={today} onInput={(e) => setDate(e.currentTarget.value)} />
        </label>
        <label class="field">Poids (kg)
          <input type="text" inputmode="decimal" autocomplete="off" value={kg} onInput={(e) => setKg(e.currentTarget.value)} placeholder="72,5" />
        </label>
        <fieldset class="create-group">
          <legend>Cette semaine, j’ai suivi le plan</legend>
          <Radios<Exclude<WeeklyCheckin['adherence'], null>> name="adh" value={adh} onChange={setAdh} options={[['oui', 'Oui'], ['peu_pres', 'À peu près'], ['non', 'Pas vraiment']]} />
        </fieldset>
        {err && <p class="notice notice-urgent" role="alert">{err}</p>}
        <button type="button" class="btn btn-primary" onClick={() => void save()} disabled={busy}>Enregistrer la pesée</button>
        {msg.length > 0 && (
          <div class="notice" role="status">
            {msg.map((m, i) => <p key={i}>{m}</p>)}
          </div>
        )}
      </section>

      <section class="card">
        <h2>Ma courbe</h2>
        {data.weights.length === 0 ? <p class="dim">Aucune pesée pour l’instant.</p> : (
          <>
            <WeightChart raw={data.weights} trend={trend} targetKg={goal?.targetKg ?? null} />
            <p class="small">
              {last ? <>Poids lissé : <strong>{fmt(last.trend, 1)} kg</strong>. </> : null}
              {TREND_TEXT[state]}
              {trend.length < N_PESEES_MIN && ' La tendance apparaît à partir de 3 pesées.'}
            </p>
            {alerts.map((a) => <p class="notice" key={a}>{ALERT_TEXT[a]}</p>)}
            <p class="dim small">Trait épais : poids lissé. Petits points : pesées brutes.{goal?.targetKg ? ' Pointillés : poids visé.' : ''}</p>
          </>
        )}
      </section>

      {data.weights.length > 0 && (
        <section class="card">
          <h2>Mes pesées</h2>
          <ul class="nut-weights">
            {[...data.weights].reverse().slice(0, 12).map((w) => {
              const t = trend.find((p) => p.weekStart === weekStartOf(w.date));
              return (
                <li key={w.id}>
                  <span>{new Date(`${w.date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  <strong>{fmt(w.kg, 1)} kg</strong>
                  <span class="dim small">{t ? `lissé ${fmt(t.trend, 1)}` : ''}</span>
                  <button type="button" class="btn btn-link" aria-label={`Supprimer la pesée du ${w.date}`} onClick={() => void remove(w.id)}>Supprimer</button>
                </li>
              );
            })}
          </ul>
          {goal && body.kg && <p class="dim small">IMC actuel : {fmt(bmi(body.kg, data.heightCm ?? 170), 1)} (indicatif).</p>}
        </section>
      )}
    </>
  );
}
