import { useEffect, useRef, useState } from 'preact/hooks';
import { importFiles, type ImportReport } from './importer';
import { countImages, deleteAllImages, imageUrl, listImageIds, countThumbs } from './store';
import { regenerateThumbs } from './thumbs';
import { UNIQUE_IDS } from './match';
import { GV_TABLE } from './gv-table';

export const IMPORT_WARNING = 'Importe seulement des images dont tu as le droit d’usage. Elles restent sur ce téléphone et ne sont jamais envoyées nulle part.';

/** Section « Images de mes exercices » (D22) : import local, rien n'est envoyé, rien n'est dans l'export de sauvegarde. */
export function ImagesImport() {
  const zipIn = useRef<HTMLInputElement>(null);
  const dirIn = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);
  const [thumbs, setThumbs] = useState(0);
  const [regen, setRegen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState<{ done: number; total: number } | null>(null);
  const [rep, setRep] = useState<ImportReport | null>(null);
  const [ask, setAsk] = useState(false);
  const refresh = () => { void countThumbs().then(setThumbs, () => setThumbs(0)); return countImages().then(setCount, () => setCount(0)); };
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
  const [diag, setDiag] = useState<string | null>(null);
  const runDiag = async () => {
    setDiag('Vérification…');
    try {
      const ids = await listImageIds();
      let ok = 0; let sample = '';
      for (const id of ids) {
        const u = await imageUrl(id);
        const good = !!u && await new Promise<boolean>((res) => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = u!; });
        if (good) { ok++; if (!sample) { const e = GV_TABLE.find((x) => x.id === id); sample = e ? ` Exemple : ${e.fiche} (${e.variante}).` : ''; } }
      }
      setDiag(`${ids.length} image${ids.length > 1 ? 's' : ''} lue${ids.length > 1 ? 's' : ''} dans la base, ${ok} affichable${ok > 1 ? 's' : ''}.${sample}`);
    } catch (e) { setDiag(`Lecture impossible : ${(e as Error).message}`); }
  };
  const pct = prog && prog.total ? Math.round((prog.done / prog.total) * 100) : 0;
  return (
    <section class="card img-import" aria-labelledby="img-import-t">
      <h2 id="img-import-t">Images de mes exercices</h2>
      <p class="img-count" role="status"><strong>{count}</strong> image{count > 1 ? 's' : ''} importée{count > 1 ? 's' : ''} sur {UNIQUE_IDS.length}. <span class="dim small" data-testid="thumb-count">{thumbs} miniature{thumbs > 1 ? 's' : ''} pour les listes.</span></p>
      <p class="small">Tu peux ajouter les GIF de ta propre copie du jeu d’images Gym visual (ZIP ou dossier). Seuls les exercices dont la correspondance est sûre en reçoivent une ({UNIQUE_IDS.length} images possibles) ; les autres gardent l’écran actuel. La consigne écrite prime toujours sur l’image.</p>
      <p class="small"><strong>{IMPORT_WARNING}</strong></p>
      <details class="img-more small"><summary>Place disponible</summary><p class="dim">L’estimation de la place disponible reste indicative : si le téléphone manque de place, l’import s’arrête avec un message et tu peux le reprendre.</p></details>
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
      <button type="button" class="btn" disabled={busy || count === 0} onClick={runDiag}>Tester l’affichage</button>
      {diag && <p class="small" role="status">{diag}</p>}
      <button type="button" class="btn" disabled={busy || count === 0} onClick={async () => { setBusy(true); setRegen('Miniatures…'); try { const r = await regenerateThumbs((d, n) => setRegen(`Miniatures : ${d} / ${n}`)); setRegen(`${r.ok} miniature${r.ok > 1 ? 's' : ''} refaite${r.ok > 1 ? 's' : ''}${r.failed ? `, ${r.failed} impossible${r.failed > 1 ? 's' : ''}` : ''}.`); } catch (e) { setRegen(`Échec : ${(e as Error).message}`); } setBusy(false); void refresh(); }}>Régénérer les miniatures</button>
      {regen && <p class="small" role="status">{regen}</p>}
      <button type="button" class="btn btn-danger" disabled={busy || count === 0} onClick={() => setAsk(true)}>Supprimer les images importées</button>
      {ask && (
        <div role="alertdialog" aria-label="Confirmer la suppression" class="card">
          <p>Supprimer les {count} images importées (et leurs miniatures) de ce téléphone ?</p>
          <button type="button" class="btn btn-danger" onClick={async () => { await deleteAllImages(); setAsk(false); setRep(null); setRegen(null); void refresh(); }}>Oui, supprimer</button>
          <button type="button" class="btn" autofocus onClick={() => setAsk(false)}>Annuler</button>
        </div>
      )}
    </section>
  );
}
