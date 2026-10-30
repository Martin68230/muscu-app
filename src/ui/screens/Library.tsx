import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FICHES_ERROR, isUsable, loadFiches, searchFiches, sortByName, type Fiche } from '../../data/fiches';
import { MUSCLE_SHORT, SCHEMA_GROUPS } from '../../data/labels';
import { list } from '../../data/repo';
import { MACHINE_TAGS } from '../../generator/config';

/** machines-etiquettes.md §2 : fiche de machine = toutes ses variantes exigent une machine guidée, une poulie ou une machine de cardio. */
export const isMachineFiche = (f: Pick<Fiche, 'variantes'>): boolean =>
  f.variantes.length > 0 && f.variantes.every((v) => v.tags.some((t) => MACHINE_TAGS.includes(t)));

/** Garde la recherche, le filtre et le défilement quand on revient d'une fiche. */
const memo = { query: '', group: 'tout', scroll: 0 };

function Thumb({ fiche }: { fiche: Fiche }) {
  const [ok, setOk] = useState(true);
  const img = fiche.images[0];
  if (!img || !ok) return <span class="lib-thumb lib-thumb-empty" aria-hidden="true" />;
  const pic = (
    <img
      class={img.type === 'illustration' ? 'lib-thumb-ill' : 'lib-thumb'}
      src={img.src}
      alt=""
      width={56}
      height={56}
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
  // Les illustrations ont deux panneaux côte à côte (départ / arrivée) : la vignette n'en montre que le premier.
  return img.type === 'illustration' ? <span class="lib-thumb lib-thumb-crop">{pic}</span> : pic;
}

export function Library() {
  const [fiches, setFiches] = useState<Fiche[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(memo.query);
  const [group, setGroup] = useState(memo.group);
  const root = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  useEffect(() => {
    // Fiches de machines affichées seulement avec le lieu « salle » ou l'accès à une salle (réglage du profil).
    Promise.all([loadFiches(), list('profile').catch(() => [])]).then(
      ([l, profiles]) => {
        const p = profiles[0];
        const gym = p?.place === 'salle' || !!p?.salleAccess;
        setFiches(sortByName(l.filter((f) => isUsable(f) && (gym || !isMachineFiche(f)))));
      },
      (e: Error) => setError(e.message || FICHES_ERROR),
    );
  }, []);

  useLayoutEffect(() => {
    if (!fiches || restored.current) return;
    restored.current = true;
    const screen = root.current?.closest('.screen');
    if (screen) screen.scrollTop = memo.scroll;
  }, [fiches]);

  const shown = useMemo(() => {
    if (!fiches) return [];
    const schemas = SCHEMA_GROUPS.find((g) => g.id === group)?.schemas;
    const inGroup = schemas ? fiches.filter((f) => schemas.includes(f.schema)) : fiches;
    return searchFiches(inGroup, query);
  }, [fiches, group, query]);

  const remember = () => {
    memo.scroll = root.current?.closest('.screen')?.scrollTop ?? 0;
  };
  const changeQuery = (v: string) => {
    memo.query = v;
    memo.scroll = 0;
    setQuery(v);
  };
  const changeGroup = (g: string) => {
    memo.group = g;
    memo.scroll = 0;
    setGroup(g);
  };

  return (
    <div ref={root}>
      <h1>Bibliothèque</h1>
      {error && <div class="notice" role="alert">{error}</div>}
      {!error && !fiches && <p class="dim" role="status">Chargement…</p>}
      {fiches && (
        <>
          <label class="small dim" for="lib-search">Chercher un exercice</label>
          <input
            id="lib-search"
            class="field"
            type="search"
            enterKeyHint="search"
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
            placeholder="Nom, muscle…"
            value={query}
            onInput={(e) => changeQuery(e.currentTarget.value)}
          />
          <div class="chips" role="group" aria-label="Type d’exercice">
            {[{ id: 'tout', label: 'Tout' }, ...SCHEMA_GROUPS].map((g) => (
              <button
                key={g.id}
                type="button"
                class="chip"
                aria-pressed={group === g.id}
                onClick={() => changeGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <p class="dim small" role="status" aria-live="polite">
            {shown.length === 1 ? '1 exercice' : `${shown.length} exercices`}
          </p>
          {shown.length === 0 ? (
            <div class="empty-state compact">
              <p><strong>Aucun exercice trouvé.</strong></p>
              <p class="dim small">Essaie un autre mot, ou choisis « Tout ».</p>
            </div>
          ) : (
            <ul class="lib-list">
              {shown.map((f) => (
                <li key={f.id}>
                  <a class="lib-row" href={`#/fiche/${f.id}`} onClick={remember}>
                    <Thumb fiche={f} />
                    <span class="lib-text">
                      <span class="lib-name">{f.nom}</span>
                      <span class="lib-muscles dim small">
                        {f.musclesPrincipaux.map((m) => MUSCLE_SHORT[m] ?? 'muscle').join(', ')}
                      </span>
                    </span>
                    <span class="lib-chevron" aria-hidden="true">›</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p class="dim small lib-foot">Les autres exercices (brouillons, non vérifiés) arrivent plus tard.</p>
        </>
      )}
    </div>
  );
}
