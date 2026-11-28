// « Créer une séance », mode « Je choisis mes exercices » (idée 2) : liste filtrée par le profil, ordre, séries / repos à la baisse, supersets.
// Toutes les règles sont dans src/session/manual-session.ts (avis kiné du 27/11/2026) ; cet écran n'en ajoute ni n'en retire aucune.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { CreateContext, CreatedSession } from '../../generator';
import type { CreateIntensity } from '../../generator/config';
import type { GeneratorInput, GenExercise } from '../../generator/types';
import { addProblem, adjust, buildManual, doseFor, manualEnv, pairProblem, MANUAL_TEXT, type ManualOption, type ManualPick } from '../../session/manual-session';
import { lineText } from '../session/text';
import { plannedOf } from '../../generator';
import { ExoThumbById } from '../../images/ExoThumb';

const GROUPS: { id: ManualOption['group'] | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous' }, { id: 'jambes', label: 'Jambes' }, { id: 'poussee', label: 'Poussée' }, { id: 'tirage', label: 'Tirage' }, { id: 'tronc', label: 'Tronc' },
];
const REST_STEP = 15;

export const PICK_TEXT = {
  intro: 'Choisis tes exercices dans l’ordre où tu veux les faire. Seuls ceux qui conviennent à ton profil (matériel, niveau, zones sensibles) sont proposés ; les séries et le repos proposés sont un maximum : tu peux les baisser, pas les monter.',
  search: 'Chercher un exercice',
  mine: 'Ta séance',
  none: 'Aucun exercice choisi pour l’instant.',
  add: 'Ajouter',
  added: 'Ajouté',
  remove: 'Retirer',
  up: 'Monter',
  down: 'Descendre',
  sets: 'Séries',
  rest: 'Repos',
  pair: 'Superset avec le suivant',
  pairHelp: 'Superset : les deux exercices s’enchaînent, puis un seul repos.',
  noPairBeginner: MANUAL_TEXT.pairBeginner,
  adapted: 'adapté à ton profil',
  replaces: 'à la place d’un exercice qui ne te convient pas',
  legsBlocked: 'Exercices de jambes indisponibles aujourd’hui :',
  compose: 'Voir la séance',
  noMatch: 'Aucun exercice ne correspond.',
} as const;

export interface PickerProps {
  input: GeneratorInput;
  context: CreateContext;
  intensity: CreateIntensity;
  chairStable: boolean;
  now: () => Date;
  /** Choix déjà faits (retour depuis la séance affichée). */
  initial?: ManualPick[] | null;
  onCompose: (session: CreatedSession, picks: ManualPick[]) => void;
}

interface Row extends ManualPick { base: GenExercise }

export function ManualPicker({ input, context, intensity, chairStable, now, initial = null, onCompose }: PickerProps) {
  const env = useMemo(() => manualEnv(input, { intensity, chairStable, todayIso: now().toISOString() }, context), [input, context, intensity, chairStable]);
  const [rows, setRows] = useState<Row[]>(() => (initial ?? []).map((p) => ({ ...p, base: p.ex })));
  const [group, setGroup] = useState<(typeof GROUPS)[number]['id']>('tous');
  const [query, setQuery] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  // Intensité ou chaise changées : chaque exercice reprend sa dose du moment (les baisses sont gardées) ; un exercice qui ne convient plus est retiré.
  useEffect(() => {
    setRows((prev) => prev.flatMap((r) => {
      const o = env.options.find((x) => x.ficheId === r.ex.ficheId && x.variantId === r.ex.variantId);
      if (!o) return [];
      const base = doseFor(o, env);
      return [{ base, ex: adjust(base, { sets: r.ex.sets, restSec: r.ex.restSec }), pairNext: r.pairNext }];
    }));
  }, [env]);

  const beginner = env.ctx.level === 'debutant';
  const noPairs = beginner || env.ctx.pregnant || env.ctx.postPartum;
  const chosen = new Set(rows.map((r) => r.ex.ficheId));
  const q = query.trim().toLowerCase();
  const shown = env.options.filter((o) => (group === 'tous' || o.group === group) && (!q || o.nom.toLowerCase().includes(q)));

  const add = (o: ManualOption) => {
    const base = doseFor(o, env);
    const why = addProblem(rows.map((r) => r.ex), base, env);
    if (why) return setMsg(why);
    setMsg(null);
    setRows([...rows, { base, ex: base, pairNext: false }]);
  };
  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    // Un déplacement défait les supersets touchés (ils ne sont plus côte à côte).
    setRows(next.map((r) => ({ ...r, pairNext: false })));
    setMsg(null);
  };
  const remove = (i: number) => {
    setRows(rows.filter((_, j) => j !== i).map((r, j) => (j === i - 1 ? { ...r, pairNext: false } : r)));
    setMsg(null);
  };
  const togglePair = (i: number) => {
    if (rows[i].pairNext) return set(i, { pairNext: false });
    if (i > 0 && rows[i - 1].pairNext) return setMsg('Cet exercice est déjà en superset avec le précédent.');
    if (rows[i + 1]?.pairNext) return setMsg('L’exercice suivant est déjà en superset avec un autre.');
    const why = pairProblem(rows[i].ex, rows[i + 1].ex, env);
    if (why) return setMsg(why);
    setMsg(null);
    set(i, { pairNext: true });
  };
  const changeSets = (i: number, d: number) => set(i, { ex: adjust(rows[i].base, { sets: rows[i].ex.sets + d, restSec: rows[i].ex.restSec }) });
  const changeRest = (i: number, d: number) => set(i, { ex: adjust(rows[i].base, { sets: rows[i].ex.sets, restSec: rows[i].ex.restSec + d }) });
  const compose = () => {
    const picks = rows.map((r) => ({ ex: r.ex, pairNext: r.pairNext }));
    const res = buildManual(picks, env);
    if (!res.ok) return setMsg(res.message);
    setMsg(null);
    onCompose(res.session, picks);
  };

  if (env.allBlocked) return <p class="notice" role="status">{env.allBlocked}</p>;
  return (
    <>
      <p class="dim small">{PICK_TEXT.intro}</p>
      {env.legsBlocked && <p class="info-line" role="note">{PICK_TEXT.legsBlocked} {env.legsBlocked}</p>}
      {[...env.warnings, ...env.legWarnings].map((w) => <p key={w.id} class="info-line">{w.text}</p>)}
      <section class="card" aria-label={PICK_TEXT.mine}>
        <h2>{PICK_TEXT.mine}</h2>
        {!rows.length && <p class="dim small">{PICK_TEXT.none}</p>}
        {noPairs && rows.length > 1 && <p class="dim small">{env.ctx.pregnant || env.ctx.postPartum ? MANUAL_TEXT.pairPregnant : PICK_TEXT.noPairBeginner}</p>}
        <ol class="plain-list manual-list">
          {rows.map((r, i) => (
            <li key={r.ex.ficheId} class={r.pairNext || rows[i - 1]?.pairNext ? 'manual-row manual-paired' : 'manual-row'}>
              <div class="prev-row">
                <ExoThumbById ficheId={r.ex.ficheId} variantId={r.ex.variantId} size={44} />
                <div class="prev-body"><strong>{i + 1}. {r.ex.nom}{r.ex.variantNom && r.ex.variantNom !== r.ex.nom ? ` (${r.ex.variantNom})` : ''}</strong>
                  <div class="dim small">{lineText(plannedOf(r.ex))}</div></div>
              </div>
              <div class="manual-steppers">
                <span class="manual-step" role="group" aria-label={`${PICK_TEXT.sets} : ${r.ex.sets}`}>
                  <span class="small">{PICK_TEXT.sets}</span>
                  <button type="button" class="btn step-btn" aria-label="Une série de moins" disabled={r.ex.sets <= 1} onClick={() => changeSets(i, -1)}>−</button>
                  <strong>{r.ex.sets}</strong>
                  <button type="button" class="btn step-btn" aria-label="Une série de plus" disabled={r.ex.sets >= r.base.sets} onClick={() => changeSets(i, 1)}>+</button>
                </span>
                <span class="manual-step" role="group" aria-label={`${PICK_TEXT.rest} : ${r.ex.restSec} secondes`}>
                  <span class="small">{PICK_TEXT.rest}</span>
                  <button type="button" class="btn step-btn" aria-label="Repos plus court" disabled={r.ex.restSec <= r.base.restSec} onClick={() => changeRest(i, -REST_STEP)}>−</button>
                  <strong>{r.ex.restSec} s</strong>
                  <button type="button" class="btn step-btn" aria-label="Repos plus long" disabled={r.ex.restSec >= r.base.restSec + 120} onClick={() => changeRest(i, REST_STEP)}>+</button>
                </span>
              </div>
              <div class="manual-actions">
                <button type="button" class="btn" disabled={i === 0} onClick={() => move(i, -1)}>{PICK_TEXT.up}</button>
                <button type="button" class="btn" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>{PICK_TEXT.down}</button>
                <button type="button" class="btn" onClick={() => remove(i)}>{PICK_TEXT.remove}</button>
              </div>
              {!noPairs && i < rows.length - 1 && (
                <button type="button" class="chip manual-pair" aria-pressed={r.pairNext} onClick={() => togglePair(i)}>{PICK_TEXT.pair}</button>
              )}
            </li>
          ))}
        </ol>
        {!noPairs && rows.length > 1 && <p class="dim small">{PICK_TEXT.pairHelp}</p>}
      </section>
      {msg && <p role="alert" class="notice">{msg}</p>}
      <fieldset class="create-group">
        <legend>Exercices proposés</legend>
        <div class="chips">
          {GROUPS.map((g) => <button key={g.id} type="button" class="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>)}
        </div>
      </fieldset>
      <label for="manual-search" class="small">{PICK_TEXT.search}</label>
      <input id="manual-search" class="field" type="search" value={query} onInput={(ev) => setQuery((ev.currentTarget as HTMLInputElement).value)} />
      <ul class="plain-list manual-options" aria-label="Exercices proposés">
        {!shown.length && <li class="dim small">{PICK_TEXT.noMatch}</li>}
        {shown.map((o) => (
          <li key={o.ficheId} class="prev-row">
            <ExoThumbById ficheId={o.ficheId} variantId={o.variantId} size={44} />
            <div class="prev-body"><strong>{o.nom}</strong>
              {(o.adapted || o.replaces) && <div class="dim small">{o.replaces ? PICK_TEXT.replaces : PICK_TEXT.adapted}</div>}</div>
            <button type="button" class="btn" disabled={chosen.has(o.ficheId)} onClick={() => add(o)}>{chosen.has(o.ficheId) ? PICK_TEXT.added : PICK_TEXT.add}</button>
          </li>
        ))}
      </ul>
      <div class="thumb-zone">
        <button type="button" class="btn btn-primary" disabled={!rows.length} onClick={compose}>{PICK_TEXT.compose}</button>
      </div>
    </>
  );
}
