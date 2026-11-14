import { useEffect, useRef, useState } from 'preact/hooks';
import { importFiles, type ImportReport } from './importer';
import { countImages, deleteAllImages } from './store';
import { UNIQUE_IDS } from './match';

export const IMPORT_WARNING = 'Importe seulement des images dont tu as le droit d’usage. Elles restent sur ce téléphone et ne sont jamais envoyées nulle part.';

/** Section « Images de mes exercices » (D22) : import local, rien n'est envoyé, rien n'est dans l'export de sauvegarde. */
export function ImagesImport() {
  const zipIn = useRef<HTMLInputElement>(null);
  const dirIn = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState<{ done: number; total: number } | null>(null);
  const [rep, setRep] = useState<ImportReport | null>(null);
  const [ask, setAsk] = useState(false);
  const refresh = () => countImages().then(setCount, () => setCount(0));
  useEffect(() => { void refresh(); }, []);

  const go = async (list: FileList | null) => {
    if (!list || !list.length) return;
    setBusy(true); setRep(null); setProg({ done: 0, total: 0 });
    try { setRep(await importFiles(Array.from(list), (done, total) => setProg({ done, total }))); }
    catch (e) { setRep({ stored: [], already: [], missing: [], errors: [{ name: 'import', why: (e as Error).message }], scanned: 0 }); }
    setBusy(false); setProg(null); void refresh();
    if (zipIn.current) zipIn.current.value = '';
    if (dirIn.current) dirIn.current.value = '';
  };
  const pct = prog && prog.total ? Math.round((prog.done / prog.total) * 100) : 0;
  return (
    <section class="card img-import" aria-labelledby="img-import-t">
      <h2 id="img-import-t">Images de mes exercices</h2>
      <p class="small">Tu peux ajouter les GIF de ta propre copie du jeu d’images Gym visual (ZIP ou dossier). Seuls les exercices dont la correspondance est sûre en reçoivent une ({UNIQUE_IDS.length} images possibles) ; les autres gardent l’écran actuel. La consigne écrite prime toujours sur l’image.</p>
      <p class="small"><strong>{IMPORT_WARNING}</strong></p>
      <p class="dim small">{count} image{count > 1 ? 's' : ''} importée{count > 1 ? 's' : ''} sur {UNIQUE_IDS.length}.</p>
      <input ref={zipIn} type="file" accept=".zip,application/zip" hidden onChange={(e) => go((e.currentTarget as HTMLInputElement).files)} />
      <input ref={dirIn} type="file" accept="image/gif" multiple hidden onChange={(e) => go((e.currentTarget as HTMLInputElement).files)} />
      <button type="button" class="btn" disabled={busy} onClick={() => zipIn.current?.click()}>Choisir le ZIP</button>
      <button type="button" class="btn" disabled={busy} onClick={() => dirIn.current?.click()}>Choisir des images (GIF)</button>
      {prog && <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} class="img-bar"><div style={{ width: `${pct}%` }} /><span class="small">{prog.total ? `${prog.done} / ${prog.total}` : 'Lecture du fichier…'}</span></div>}
      {rep && (
        <div class="small" role="status">
          <p>{rep.stored.length} ajoutée{rep.stored.length > 1 ? 's' : ''}{rep.already.length ? `, ${rep.already.length} déjà là` : ''}. {rep.stored.length + rep.already.length === 0 && rep.errors.length === 0 ? 'Aucun fichier reconnu : les noms doivent être ceux du jeu (ex. 0025-EIeI8Vf.gif).' : ''}</p>
          {rep.errors.length > 0 && <ul>{rep.errors.map((e) => <li key={e.name}>{e.name} : {e.why}</li>)}</ul>}
          {rep.errors.length > 0 && <p class="dim">Choisis de nouveau le même fichier : ce qui est déjà importé est sauté.</p>}
        </div>
      )}
      <button type="button" class="btn btn-danger" disabled={busy || count === 0} onClick={() => setAsk(true)}>Supprimer les images importées</button>
      {ask && (
        <div role="alertdialog" aria-label="Confirmer la suppression" class="card">
          <p>Supprimer les {count} images importées de ce téléphone ?</p>
          <button type="button" class="btn btn-danger" onClick={async () => { await deleteAllImages(); setAsk(false); setRep(null); void refresh(); }}>Oui, supprimer</button>
          <button type="button" class="btn" autofocus onClick={() => setAsk(false)}>Annuler</button>
        </div>
      )}
    </section>
  );
}
