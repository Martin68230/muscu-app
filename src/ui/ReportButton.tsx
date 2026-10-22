import { useRef, useState } from 'preact/hooks';
import type { ReportChoice } from '../data/model';
import { addReport, REPORT_CHOICES } from '../data/reports';

/**
 * Bouton discret « ⋯ » + menu « Signaler un problème » (D9).
 * À poser dans un coin de la fiche d'exercice et du lecteur de séance :
 *   <ReportButton ficheId={movement.id} variantId={variant?.id} />
 * Enregistre sur l'appareil, sans réseau, sans quitter l'écran.
 */
export function ReportButton({ ficheId, variantId = null }: { ficheId: string; variantId?: string | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<ReportChoice | null>(null);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const open = () => {
    setChoice(null);
    setText('');
    setSent(false);
    setError(false);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const send = async () => {
    if (!choice) return;
    try {
      await addReport({ ficheId, variantId, choice, text });
      setSent(true);
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <button type="button" class="report-btn" aria-label="Plus d'options : signaler un problème" onClick={open}>
        <span aria-hidden="true">⋯</span>
      </button>
      <dialog ref={dialog} aria-labelledby={`report-title-${ficheId}`}>
        {sent ? (
          <>
            <h2 id={`report-title-${ficheId}`}>Merci !</h2>
            <p class="dim small">Signalement enregistré sur ce téléphone. Tu retrouves la liste dans Profil.</p>
            <button type="button" class="btn btn-primary" autofocus onClick={close}>Fermer</button>
          </>
        ) : (
          <>
            <h2 id={`report-title-${ficheId}`}>Signaler un problème</h2>
            <div class="report-choices" role="group" aria-label="Type de problème">
              {REPORT_CHOICES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  class="zone-btn"
                  aria-pressed={choice === c.value}
                  onClick={() => setChoice(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <label for={`report-text-${ficheId}`} class="small dim">Précision (facultatif)</label>
            <textarea
              id={`report-text-${ficheId}`}
              class="field"
              rows={2}
              maxLength={1000}
              value={text}
              onInput={(e) => setText(e.currentTarget.value)}
            />
            {error && <div class="toast" role="alert">Enregistrement impossible. Réessaie.</div>}
            <button type="button" class="btn btn-primary" disabled={!choice} onClick={send}>Envoyer</button>
            <button type="button" class="btn" onClick={close}>Annuler</button>
          </>
        )}
      </dialog>
    </>
  );
}
