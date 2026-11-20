import credits from '../../data/credits.json';

interface ImageCredit {
  file: string;
  titre: string;
  auteur: string;
  licence: string;
  licenceUrl?: string;
  url?: string;
}
interface Source {
  id: string;
  titre: string;
  detail: string;
  licence: string;
  licenceUrl: string | null;
  url: string | null;
  images: number;
  liste?: ImageCredit[];
}

/** Page « Crédits » (D12, règle 12) : générée par tools/make-credits.mjs à partir des fichiers du dépôt. */
export function Credits({ onBack }: { onBack: () => void }) {
  const sources = credits.sources as Source[];
  return (
    <>
      <button type="button" class="btn back-btn" onClick={onBack}>← Retour au profil</button>
      <h1>Crédits</h1>
      <p class="dim small">Les images de l'app viennent de sources libres ou ont été dessinées pour elle. Merci à leurs auteurs.</p>

      {sources.map((s) => (
        <section class="card credit" key={s.id}>
          <h2>{s.titre}</h2>
          <p>{s.detail}</p>
          <p class="small dim">
            Licence : {s.licenceUrl ? <a href={s.licenceUrl} rel="noopener noreferrer" target="_blank">{s.licence}</a> : s.licence}
            {' · '}{s.images} image{s.images > 1 ? 's' : ''}
          </p>
          {s.url && <p class="small"><a href={s.url} rel="noopener noreferrer" target="_blank">Voir la source</a></p>}
          {s.liste && (
            <details>
              <summary>Auteur de chaque image</summary>
              <ul class="small">
                {s.liste.map((i) => (
                  <li key={i.file}>
                    {i.titre} : {i.auteur}, {i.licence}
                    {i.url && <> (<a href={i.url} rel="noopener noreferrer" target="_blank">page</a>)</>}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      ))}

      <section class="card credit">
        <h2>Liste d’exercices du jeu hasaneyldrm</h2>
        <p>Une partie des exercices de l’app est créée à partir de la liste d’exercices du jeu « exercises-dataset » de Hasan Emir Yıldırım (licence MIT, © 2026 Hasan Emir Yıldırım). Seul le texte de la liste est utilisé ; les consignes sont réécrites pour l’app.</p>
        <p class="small"><a href="https://github.com/hasaneyldrm/exercises-dataset" rel="noopener noreferrer" target="_blank">Voir la source</a></p>
      </section>

      <section class="card credit">
        <h2>Images importées par toi</h2>
        <p>Les GIF du jeu Gym visual (liste d’exercices hasaneyldrm) ne sont pas dans l’app. Si tu importes ta propre copie, elle reste sur ton téléphone, n’est ni envoyée ni redistribuée, et appartient à Gym visual. Ces images ne sont pas fournies par l’app : tu les importes toi-même, sous ta responsabilité.</p>
      </section>

      <section class="card credit">
        <h2>Vidéos</h2>
        <p>{credits.videos}</p>
      </section>
    </>
  );
}
