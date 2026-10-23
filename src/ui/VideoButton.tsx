import { useEffect, useRef, useState } from 'preact/hooks';

/**
 * Bouton « Voir une vidéo » (D12) à poser sur la fiche d'un exercice :
 *   <VideoButton video={{ kind: 'youtube', id: 'dQw4w9WgXcQ' }} title="Pompe inclinée" />
 * - Rien n'est chargé tant que la personne n'a pas appuyé (règle 7 : aucun traceur, rien chez Google avant).
 * - Affiché seulement en ligne et si un identifiant valide existe ; masqué dès que le téléphone passe hors ligne.
 * - Lecteur officiel youtube-nocookie.com ; si le lecteur échoue ou ne répond pas, le bouton disparaît.
 * - Vidéo de l'utilisateur (MP4 court dans public/videos/) : lue par la balise <video>, sans tiers.
 */
export type VideoRef = { kind: 'youtube'; id: string } | { kind: 'fichier'; file: string };

export const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const FILE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.mp4$/;
/** Délai après lequel un lecteur qui n'a rien affiché est abandonné. */
export const PLAYER_TIMEOUT_MS = 12_000;

export function isValidVideo(v: VideoRef | null | undefined): v is VideoRef {
  if (!v) return false;
  return v.kind === 'youtube' ? YOUTUBE_ID_RE.test(v.id) : v.kind === 'fichier' && FILE_RE.test(v.file);
}

export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`;
}

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    addEventListener('online', on);
    addEventListener('offline', off);
    return () => {
      removeEventListener('online', on);
      removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function VideoButton({ video, title }: { video: VideoRef | null | undefined; title: string }) {
  const online = useOnline();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open || ready || failed) return;
    timer.current = setTimeout(() => setFailed(true), PLAYER_TIMEOUT_MS);
    return () => clearTimeout(timer.current);
  }, [open, ready, failed]);

  if (!isValidVideo(video) || !online || failed) return null;

  if (!open) {
    return (
      <button type="button" class="btn video-btn" onClick={() => setOpen(true)}>
        <span aria-hidden="true">▶</span> Voir une vidéo
      </button>
    );
  }

  return (
    <div class="video-box">
      {video.kind === 'youtube' ? (
        <iframe
          class="video-frame"
          title={`Vidéo : ${title}`}
          src={embedUrl(video.id)}
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <video
          class="video-frame"
          src={`videos/${video.file}`}
          controls
          playsInline
          muted
          loop
          autoPlay
          preload="none"
          aria-label={`Vidéo : ${title}`}
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
      {video.kind === 'youtube' && (
        <p class="dim small">Lecteur YouTube (mode sans cookies), vidéo de son auteur. Elle ne remplace pas la consigne écrite.</p>
      )}
    </div>
  );
}
