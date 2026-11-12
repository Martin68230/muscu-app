import { useEffect, useRef, useState } from 'preact/hooks';
import { loadFiches } from '../../data/fiches';
import { CSV_MAX_BYTES, parseWorkoutCsv, type ImportPreview, type WeightUnit } from '../../data/import-csv';
import { countImported, deleteImported, FORMAT_LABEL, writeImported } from '../../data/import-csv-store';

const plural = (n: number, one: string, many: string): string => `${n} ${n > 1 ? many : one}`;

/** D19 : importer l'historique d'un export CSV de Hevy ou de Strong. Tout reste sur le téléphone ; affichage seulement. */
export function ImportCsv({ onDone }: { onDone?: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const text = useRef<{ raw: string; bytes: number } | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [unit, setUnit] = useState<WeightUnit>('auto');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  const [askDelete, setAskDelete] = useState(false);

  const refresh = () => countImported().then(setCount, () => setCount(0));
  useEffect(() => {
    void refresh();
  }, []);

  const analyse = async (u: WeightUnit) => {
    const t = text.current;
    if (!t) return;
    let fiches: { id: string; nom: string; alias: string[] }[] = [];
    try {
      fiches = (await loadFiches()).map((f) => ({ id: f.id, nom: f.nom, alias: f.alias ?? [] }));
    } catch {
      /* hors ligne sans fiches : tous les exercices seront importés sous leur nom */
    }
    const res = parseWorkoutCsv(t.raw, { fiches, byteLength: t.bytes, unit: u });
    if (!res.ok) {
      text.current = null;
      setPreview(null);
      setMessage(`Import refusé : ${res.error}`);
      return;
    }
    setMessage(null);
    setPreview(res.preview);
  };

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setPreview(null);
    setUnit('auto');
    setAskDelete(false);
    if (file.size > CSV_MAX_BYTES) {
      setMessage('Import refusé : ce fichier est trop gros (20 Mo au maximum).');
      return;
    }
    try {
      text.current = { raw: await file.text(), bytes: file.size };
    } catch {
      setMessage("Ce fichier n'est pas lisible.");
      return;
    }
    await analyse('auto');
  };

  const cancel = () => {
    text.current = null;
    setPreview(null);
    setMessage(null);
  };

  const doImport = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const out = await writeImported(preview);
      text.current = null;
      setPreview(null);
      setMessage(
        `Import terminé : ${plural(out.sessionsAdded, 'séance ajoutée', 'séances ajoutées')}` +
          (out.sessionsKnown ? ` (${plural(out.sessionsKnown, 'déjà présente', 'déjà présentes')})` : '') + '. Tu les retrouves dans le calendrier et l’historique.',
      );
      await refresh();
      onDone?.();
    } catch {
      setMessage('Import impossible : rien n’a pu être enregistré sur ce téléphone.');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      const n = await deleteImported();
      setMessage(`${plural(n, 'séance importée supprimée', 'séances importées supprimées')}.`);
      setAskDelete(false);
      await refresh();
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  const setUnitAndAnalyse = (u: WeightUnit) => {
    setUnit(u);
    void analyse(u);
  };

  return (
    <section aria-labelledby="import-csv-title">
      <h2 id="import-csv-title">Importer depuis Hevy ou Strong</h2>
      <p class="dim small">
        Choisis le fichier CSV exporté par Hevy ou Strong. Tes anciennes séances s’ajoutent à l’historique, seulement pour les voir. Leurs charges ne sont pas vérifiées :
        elles ne servent ni à ta progression, ni à tes prochaines charges, ni à ton planning. Rien n’est envoyé en ligne.
      </p>
      {message && <div class="toast" role="status">{message}</div>}
      <button type="button" class="btn" disabled={busy} onClick={() => input.current?.click()}>Choisir un fichier CSV</button>
      <input
        ref={input}
        type="file"
        accept=".csv,text/csv,text/plain"
        hidden
        onChange={(e) => {
          void choose(e.currentTarget.files?.[0]);
          e.currentTarget.value = '';
        }}
      />
      {preview && (
        <div class="notice" role="region" aria-label="Aperçu de l’import">
          <p><strong>Fichier {FORMAT_LABEL[preview.format]}</strong></p>
          <p>
            {plural(preview.sessionCount, 'séance', 'séances')}, {plural(preview.setCount, 'série', 'séries')}, {plural(preview.exerciseCount, 'exercice', 'exercices')}.
          </p>
          {preview.unrecognized.length > 0 ? (
            <p class="dim small">
              {plural(preview.unrecognized.length, 'exercice non reconnu', 'exercices non reconnus')} : ils seront importés sous leur nom, sans lien avec les fiches de l’app
              ({preview.unrecognized.slice(0, 6).join(', ')}{preview.unrecognized.length > 6 ? '…' : ''}).
            </p>
          ) : (
            <p class="dim small">Tous les exercices ont été reconnus.</p>
          )}
          {preview.unitAmbiguous && (
            <>
              <p class="dim small">Ce fichier ne dit pas l’unité du poids. Les poids sont en :</p>
              <button type="button" class="btn" aria-pressed={preview.unit === 'kg' && unit !== 'lb'} onClick={() => setUnitAndAnalyse('kg')}>Kilos</button>
              <button type="button" class="btn" aria-pressed={unit === 'lb'} onClick={() => setUnitAndAnalyse('lb')}>Livres</button>
            </>
          )}
          <button type="button" class="btn btn-primary" disabled={busy} onClick={() => void doImport()}>Importer</button>
          <button type="button" class="btn" disabled={busy} onClick={cancel}>Annuler</button>
        </div>
      )}
      {count > 0 && !preview && (
        <>
          <p class="dim small">{plural(count, 'séance importée est', 'séances importées sont')} dans ton historique.</p>
          {!askDelete && <button type="button" class="btn btn-danger" disabled={busy} onClick={() => setAskDelete(true)}>Supprimer les séances importées</button>}
          {askDelete && (
            <div class="notice" role="alertdialog" aria-label="Confirmer la suppression des séances importées">
              <p>Supprimer les {count} séances importées de ton historique ? Tes propres séances ne sont pas touchées.</p>
              <button type="button" class="btn btn-danger" disabled={busy} onClick={() => void doDelete()}>Oui, supprimer</button>
              <button type="button" class="btn" onClick={() => setAskDelete(false)}>Annuler</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
