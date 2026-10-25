import { useEffect, useState } from 'preact/hooks';
import type { PregnancyStatus, WorkoutSession } from '../../data/model';
import { list, softDelete } from '../../data/repo';
import { loadFiches } from '../../data/fiches';
import { dateKey, frDate, sessionDate } from '../../session/calendar';
import { computeSummary } from '../../session/summary';
import { summaryText, type SummaryText } from '../../session/summary-texts';

/**
 * Bilan d'une séance passée, en lecture seule (rien n'est recalculé dans la base). Mêmes règles que le bilan de fin de séance :
 * grossesse et post-partum = durée et séries seulement ; abandon et symptôme = aucun chiffre de performance.
 */
export function PastSummary({ sessionId, pregnancy, onBack, onDeleted }: {
  sessionId: string;
  pregnancy: PregnancyStatus | null | undefined;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const [state, setState] = useState<{ row: WorkoutSession; text: SummaryText } | 'absent' | null>(null);
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [sets, sessions] = await Promise.all([list('sets'), list('sessions')]);
        const row = sessions.find((s) => s.id === sessionId);
        if (!row) return setState('absent');
        let names = { fiche: (_id: string) => 'Exercice', variant: (_id: string) => 'Exercice' };
        try {
          const fiches = await loadFiches();
          names = {
            fiche: (id) => fiches.find((f) => f.id === id)?.nom ?? 'Exercice',
            variant: (id) => fiches.flatMap((f) => f.variantes).find((v) => v.id === id)?.nom ?? 'Exercice',
          };
        } catch {
          /* hors ligne sans fiches : le bilan reste lisible, sans noms d'exercices */
        }
        const summary = computeSummary({ session: row, sets, sessions, pregnancy });
        setState({ row, text: summaryText(summary, { names, pregnancy }) });
      } catch {
        setState('absent');
      }
    })();
  }, [sessionId]);

  const remove = async () => {
    setBusy(true);
    try {
      // La séance et ses séries : sinon ses charges continueraient de guider la progression.
      const sets = await list('sets');
      for (const s of sets.filter((x) => x.sessionId === sessionId)) await softDelete('sets', s.id);
      await softDelete('sessions', sessionId);
    } finally {
      onDeleted();
    }
  };

  const t = state && state !== 'absent' ? state.text : null;
  return (
    <>
      <button type="button" class="btn btn-back" onClick={onBack}>‹ Retour à l’historique</button>
      {state === null && <p class="dim" role="status">Calcul du bilan…</p>}
      {state === 'absent' && <p role="alert">Cette séance est introuvable.</p>}
      {t && state !== 'absent' && state !== null && (
        <>
          <p class="dim small capitalize">{frDate(dateKey(sessionDate(state.row)))} · {state.row.plan?.label ?? 'Séance'}</p>
          <h1>{t.title}</h1>
          {t.paragraphs.map((p, i) => <p key={i} class={i === 0 ? '' : 'dim'}>{p}</p>)}
          {t.stats.length > 0 && (
            <section class="card end-stats" aria-label="Chiffres de la séance">
              {t.stats.map((s) => (
                <p key={s.label}><span class="dim small">{s.label}</span><br /><strong>{s.value}</strong></p>
              ))}
            </section>
          )}
          {t.comparison.length > 0 && (
            <section class="card" aria-label="Par rapport à la séance précédente">
              {t.comparison.map((c, i) => <p key={i}>{c}</p>)}
            </section>
          )}
          {t.records.length > 0 && (
            <section class="card" aria-label="Records">
              {t.records.map((r, i) => <p key={i}><strong>{r}</strong></p>)}
            </section>
          )}
          {t.details.length > 0 && <p class="dim small">{t.details.join(' ')}</p>}
          {!ask && <button type="button" class="btn btn-danger" onClick={() => setAsk(true)}>Supprimer cette séance</button>}
          {ask && (
            <div class="notice" role="alertdialog" aria-label="Confirmer la suppression">
              <p>Supprimer cette séance de ton historique ? Ses séries seront aussi supprimées. Cette action est définitive.</p>
              <button type="button" class="btn btn-danger" disabled={busy} onClick={() => void remove()}>Oui, supprimer</button>
              <button type="button" class="btn" onClick={() => setAsk(false)}>Annuler</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
