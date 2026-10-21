import { IconLibrary } from '../icons';

export function Library() {
  return (
    <>
      <h1>Bibliothèque</h1>
      <div class="empty-state">
        <IconLibrary />
        <p><strong>Les fiches d'exercices arrivent.</strong></p>
        <p class="dim small">
          Chaque fiche est rédigée, complétée par un volet prévention des blessures, puis contrôlée avant d'apparaître ici.
        </p>
      </div>
    </>
  );
}
