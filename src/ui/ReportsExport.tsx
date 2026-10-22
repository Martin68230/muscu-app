import { useEffect, useRef, useState } from 'preact/hooks';
import type { Report } from '../data/model';
import { clearReports, listReports, reportsToJson, reportsToText } from '../data/reports';

/** Section Profil : liste des signalements, copie en texte ou JSON pour Claude Code. */
export function ReportsExport() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const confirmDialog = useRef<HTMLDialogElement>(null);

  const refresh = async () => setReports(await listReports());
  useEffect(() => {
    refresh();
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Copié. Colle-le dans Claude Code.');
    } catch {
      setMessage('Copie impossible sur ce navigateur.');
    }
  };

  const clear = async () => {
    confirmDialog.current?.close();
    await clearReports();
    setMessage(null);
    refresh();
  };

  return (
    <>
      <h2>Signalements</h2>
      {reports.length === 0 ? (
        <p class="dim small">Aucun signalement. Le bouton « ⋯ » d'une fiche permet d'en faire un.</p>
      ) : (
        <>
          <p class="dim small">{reports.length} signalement(s) enregistré(s) sur ce téléphone.</p>
          {message && <div class="toast" role="status">{message}</div>}
          <button type="button" class="btn" onClick={() => copy(reportsToText(reports))}>Copier en texte</button>
          <button type="button" class="btn" onClick={() => copy(reportsToJson(reports))}>Copier en JSON</button>
          <button type="button" class="btn btn-danger" onClick={() => confirmDialog.current?.showModal()}>
            Effacer les signalements
          </button>
          <dialog ref={confirmDialog} aria-labelledby="clear-reports-title">
            <h2 id="clear-reports-title">Effacer les signalements ?</h2>
            <p class="dim small">Pense à les copier avant : impossible de revenir en arrière.</p>
            <button type="button" class="btn btn-danger" onClick={clear}>Oui, effacer</button>
            <button type="button" class="btn" autofocus onClick={() => confirmDialog.current?.close()}>Annuler</button>
          </dialog>
        </>
      )}
    </>
  );
}
