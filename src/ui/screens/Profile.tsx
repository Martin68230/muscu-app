import { useRef, useState } from 'preact/hooks';
import type { Profile as ProfileRow } from '../../data/model';
import { update } from '../../data/repo';
import { exportData, importData, wipeAllData } from '../../data/backup';
import { Injuries } from './Injuries';
import { HealthNoticeText } from '../HealthNotice';
import { applyTheme, getThemePref, type ThemePref } from '../theme';

const THEMES: [ThemePref, string][] = [
  ['dark', 'Sombre'],
  ['light', 'Clair'],
  ['system', 'Auto'],
];

async function saveFile(name: string, text: string): Promise<void> {
  const file = new File([text], name, { type: 'application/json' });
  // Sur iPhone, la feuille de partage permet « Enregistrer dans Fichiers ».
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

export function Profile({ profile, onChange, onWiped }: {
  profile: ProfileRow;
  onChange: (p: ProfileRow) => void;
  onWiped: () => void;
}) {
  const [theme, setTheme] = useState<ThemePref>(getThemePref());
  const [name, setName] = useState(profile.displayName);
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const noticeDialog = useRef<HTMLDialogElement>(null);

  const chooseTheme = (t: ThemePref) => {
    setTheme(t);
    applyTheme(t);
  };

  const saveName = async () => {
    const trimmed = name.trim();
    if (trimmed !== profile.displayName) onChange(await update('profile', profile.id, { displayName: trimmed }));
  };

  const doExport = async () => {
    const data = await exportData();
    const day = new Date().toISOString().slice(0, 10);
    await saveFile(`muscu-sauvegarde-${day}.json`, JSON.stringify(data, null, 2));
    setMessage('Sauvegarde créée. Garde ce fichier en lieu sûr : il contient tes données de santé.');
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setMessage("Ce fichier n'est pas lisible.");
      return;
    }
    const result = await importData(parsed);
    if (!result.ok) {
      setMessage(`Import refusé : ${result.errors[0]}`);
      return;
    }
    const total = Object.values(result.applied).reduce((a, b) => a + (b ?? 0), 0);
    setMessage(`Import terminé : ${total} élément(s) mis à jour.`);
    onWiped(); // recharge le profil depuis la base
  };

  const doWipe = async () => {
    confirmDialog.current?.close();
    await wipeAllData();
    onWiped();
  };

  return (
    <>
      <h1>Profil</h1>

      <div class="card">
        <label for="name" class="small dim">Prénom ou surnom</label>
        <input
          id="name"
          class="field"
          type="text"
          autocomplete="nickname"
          enterkeyhint="done"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          onBlur={saveName}
        />
      </div>

      <h2>Affichage</h2>
      <div class="segmented" role="group" aria-label="Thème">
        {THEMES.map(([value, label]) => (
          <button key={value} aria-pressed={theme === value} onClick={() => chooseTheme(value)}>
            {label}
          </button>
        ))}
      </div>

      <h2>Mes données</h2>
      <p class="dim small">Tout reste sur ce téléphone. Fais une sauvegarde de temps en temps.</p>
      {message && <div class="toast" role="status">{message}</div>}
      <button class="btn" onClick={doExport}>Exporter une sauvegarde</button>
      <button class="btn" onClick={() => fileInput.current?.click()}>Importer une sauvegarde</button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          doImport(e.currentTarget.files?.[0]);
          e.currentTarget.value = '';
        }}
      />
      <button class="btn btn-danger" onClick={() => confirmDialog.current?.showModal()}>
        Supprimer toutes mes données
      </button>

      <Injuries key={profile.id} />

      <h2>Santé</h2>
      <button class="btn" onClick={() => noticeDialog.current?.showModal()}>Relire l'avertissement santé</button>

      <p class="dim small version">Version {__APP_VERSION__}</p>

      <dialog ref={confirmDialog} aria-labelledby="wipe-title">
        <h2 id="wipe-title">Tout supprimer ?</h2>
        <p>Profil, séances, poids et réglages seront effacés de ce téléphone. Impossible de revenir en arrière.</p>
        <p class="dim small">Pense à exporter une sauvegarde avant.</p>
        <button class="btn btn-danger" onClick={doWipe}>Oui, tout supprimer</button>
        {/* Le focus va sur « Annuler », jamais sur l'action irréversible. */}
        <button class="btn" autofocus onClick={() => confirmDialog.current?.close()}>Annuler</button>
      </dialog>

      <dialog ref={noticeDialog} aria-label="Avertissement santé">
        <HealthNoticeText />
        <button class="btn btn-primary" onClick={() => noticeDialog.current?.close()}>J'ai compris</button>
      </dialog>
    </>
  );
}
