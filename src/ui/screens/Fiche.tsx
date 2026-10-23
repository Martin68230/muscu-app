import { useEffect, useState } from 'preact/hooks';
import type { EquipmentProfile, Injury, PregnancyStatus } from '../../data/model';
import { list as listRows } from '../../data/repo';
import { availableTags } from '../../generator/context';
import {
  FICHES_ERROR,
  chooseVariant,
  cleanText,
  ficheOfId,
  findFiche,
  injuryLines,
  isUsable,
  levelText,
  listText,
  loadFiches,
  nameOfId,
  pregnancyLine,
  tagText,
  type Fiche as FicheData,
  type Variante,
} from '../../data/fiches';
import { MUSCLE_LABEL, SCHEMA_LABEL } from '../../data/labels';
import { ReportButton } from '../ReportButton';
import { VideoButton, type VideoRef } from '../VideoButton';

export const MEDICAL_REMINDER = 'Cette appli n’est pas un avis médical. Arrête-toi en cas de douleur.';

export function backToLibrary(): void {
  location.hash = '#/bibliotheque';
}

export function videoOf(f: FicheData): VideoRef | null {
  if (!f.video) return null;
  if (f.video.kind === 'youtube') return { kind: 'youtube', id: f.video.ref };
  if (f.video.kind === 'fichier') return { kind: 'fichier', file: f.video.ref };
  return null;
}

/** Images à montrer : jusqu'à deux photos (départ / arrivée), sinon la première illustration. */
export function displayImages(f: FicheData) {
  const photos = f.images.filter((i) => i.type === 'photo').slice(0, 2);
  if (photos.length) return photos;
  return f.images.filter((i) => i.type === 'illustration').slice(0, 1);
}

export function FicheImages({ fiche, compact = false }: { fiche: FicheData; compact?: boolean }) {
  const imgs = displayImages(fiche);
  const [broken, setBroken] = useState<string[]>([]);
  const shown = imgs.filter((i) => !broken.includes(i.src)).slice(0, compact ? 1 : 2);
  if (shown.length === 0) return null;
  const legende = shown.find((i) => i.legende)?.legende;
  return (
    <figure class={`fiche-figure${compact ? ' compact' : ''}`}>
      <div class={`fiche-imgs${shown.length > 1 ? ' fiche-imgs-2' : ''}`}>
        {shown.map((img, k) => (
          <img
            key={img.src}
            class="fiche-img"
            src={img.src}
            loading="lazy"
            decoding="async"
            alt={
              img.type === 'illustration'
                ? `Dessin de l’exercice : ${fiche.nom}`
                : shown.length > 1
                  ? `${fiche.nom} : ${k === 0 ? 'position de départ' : 'position d’arrivée'}`
                  : `Photo de l’exercice : ${fiche.nom}`
            }
            onError={() => setBroken((b) => [...b, img.src])}
          />
        ))}
      </div>
      {legende && <figcaption class="dim small">{legende}</figcaption>}
    </figure>
  );
}

function materialText(v: Variante): string {
  const tags = v.tags.filter((t) => t !== 'poids_du_corps');
  return tags.length ? listText(tags.map(tagText)) : 'aucun matériel';
}

function FicheLink({ id, list, label }: { id: string; list: FicheData[]; label?: string }) {
  const target = ficheOfId(list, id);
  const name = label ?? nameOfId(list, id);
  if (!name) return null;
  if (!target) return <>{name}</>;
  return (
    <a class="fiche-link" href={`#/fiche/${target.id}`}>
      {name}
    </a>
  );
}

export interface FicheViewProps {
  fiche: FicheData;
  all: FicheData[];
  equipment: EquipmentProfile | null;
  injuries: Injury[];
  pregnancy: PregnancyStatus | null | undefined;
}

/** Contenu de la fiche (sans accès à la base : testable). */
export function FicheView({ fiche, all, equipment, injuries, pregnancy }: FicheViewProps) {
  const owned = availableTags(equipment ?? { preset: 'A', tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] });
  const choice = chooseVariant(fiche, owned);
  const lines = injuryLines(fiche, injuries, all);
  const c = (s: string) => cleanText(s, all);
  const cl = (arr: string[]) => arr.map(c).filter(Boolean);
  const consignes = cl(fiche.consignes);
  const attention = cl(fiche.pointsAttention);
  const erreurs = cl(fiche.erreursFrequentes ?? []);
  const arret = cl(fiche.securite.signesArret);
  const s = fiche.securite;
  const soft = s.versionPlusDouce;
  const softIsOwnVariant = !!soft && fiche.variantes.some((v) => v.id === soft);
  const prog = fiche.progression;

  return (
    <>
      <div class="fiche-head">
        <h1>{fiche.nom}</h1>
        <ReportButton ficheId={fiche.id} variantId={choice.best?.id ?? null} />
      </div>
      <p class="dim small">
        {SCHEMA_LABEL[fiche.schema] ?? 'Exercice'} · à partir du niveau {levelText(fiche.niveauMin)}
      </p>

      <FicheImages fiche={fiche} />

      <section class="card" aria-labelledby="f-muscles">
        <h2 id="f-muscles">Muscles travaillés</h2>
        <p>
          <strong>{fiche.musclesPrincipaux.map((m) => MUSCLE_LABEL[m] ?? 'muscle').join(', ')}</strong>
        </p>
        {fiche.musclesSecondaires.length > 0 && (
          <p class="dim small">
            Aussi sollicités : {fiche.musclesSecondaires.map((m) => MUSCLE_LABEL[m] ?? 'muscle').join(', ')}
          </p>
        )}
      </section>

      <section class="card fiche-pour-toi" aria-labelledby="f-variante">
        <h2 id="f-variante">Pour toi</h2>
        {choice.best ? (
          <p>
            <strong>{choice.best.nom}</strong> — {c(choice.best.installation)}
          </p>
        ) : (
          <p>
            <strong>Il te manque du matériel pour cet exercice.</strong>
            {choice.closest && (
              <>
                {' '}
                La version la plus proche est « {choice.closest.variante.nom} » : il te manque{' '}
                {listText(choice.closest.missing.map(tagText))}.
              </>
            )}
          </p>
        )}
        {fiche.variantes.length > 1 && (
          <>
            <h3 class="fiche-h3">Toutes les variantes</h3>
            <ul class="fiche-variantes">
              {choice.rows.map(({ variante, missing }) => (
                <li key={variante.id} class={missing.length ? 'fiche-var-off' : undefined}>
                  <strong>{variante.nom}</strong> <span class="dim small">({levelText(variante.niveau)})</span>
                  <div class="dim small">Matériel : {materialText(variante)}</div>
                  {missing.length > 0 && (
                    <div class="fiche-manque small">Il te manque : {listText(missing.map(tagText))}</div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {(lines.length > 0 || pregnancy === 'enceinte' || pregnancy === 'post_partum') && (
        <section class="notice fiche-securite" aria-label="Adaptations pour toi">
          {lines.map((l) => (
            <p key={l.zone}>{c(l.text)}</p>
          ))}
          {(pregnancy === 'enceinte' || pregnancy === 'post_partum') && <p>{c(pregnancyLine(fiche, all, pregnancy))}</p>}
        </section>
      )}

      <section class="card" aria-labelledby="f-consignes">
        <h2 id="f-consignes">Comment faire</h2>
        <ol class="fiche-liste">
          {consignes.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </section>

      {attention.length > 0 && (
        <section class="card" aria-labelledby="f-attention">
          <h2 id="f-attention">Points d’attention</h2>
          <ul class="fiche-liste">
            {attention.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {erreurs.length > 0 && (
        <section class="card" aria-labelledby="f-erreurs">
          <h2 id="f-erreurs">Erreurs fréquentes</h2>
          <ul class="fiche-liste">
            {erreurs.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {arret.length > 0 && (
        <section class="card" aria-labelledby="f-arret">
          <h2 id="f-arret">Arrête-toi si…</h2>
          <ul class="fiche-liste">
            {arret.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {(soft || (prog && (prog.plusFacile.length > 0 || prog.plusDur.length > 0))) && (
        <section class="card" aria-labelledby="f-prog">
          <h2 id="f-prog">Plus doux, plus dur</h2>
          {soft && nameOfId(all, soft) && (
            <p>
              Version plus douce :{' '}
              {softIsOwnVariant ? <strong>{nameOfId(all, soft)}</strong> : <FicheLink id={soft} list={all} />}
            </p>
          )}
          {prog && prog.plusFacile.length > 0 && (
            <p>
              Plus facile :{' '}
              {prog.plusFacile.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <FicheLink id={id} list={all} />
                </span>
              ))}
            </p>
          )}
          {prog && prog.plusDur.length > 0 && (
            <p>
              Plus dur :{' '}
              {prog.plusDur.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <FicheLink id={id} list={all} />
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      <VideoButton video={videoOf(fiche)} title={fiche.nom} />

      <p class="dim small fiche-rappel">{MEDICAL_REMINDER}</p>
    </>
  );
}

export function Fiche({ id, pregnancy }: { id: string; pregnancy: PregnancyStatus | null | undefined }) {
  const [all, setAll] = useState<FicheData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<EquipmentProfile | null>(null);
  const [injuries, setInjuries] = useState<Injury[]>([]);

  useEffect(() => {
    loadFiches().then(setAll, (e: Error) => setError(e.message || FICHES_ERROR));
    listRows('equipment').then((r) => setEquipment(r[0] ?? null));
    listRows('injuries').then(setInjuries);
  }, []);

  const fiche = all ? findFiche(all, id) : undefined;
  return (
    <>
      <button type="button" class="btn back-btn" onClick={backToLibrary}>← Bibliothèque</button>
      {error && <div class="notice" role="alert">{error}</div>}
      {!error && !all && <p class="dim" role="status">Chargement…</p>}
      {all && (!fiche || !isUsable(fiche)) && (
        <div class="empty-state compact">
          <p><strong>Cette fiche n’existe pas.</strong></p>
        </div>
      )}
      {all && fiche && isUsable(fiche) && (
        <FicheView fiche={fiche} all={all} equipment={equipment} injuries={injuries} pregnancy={pregnancy} />
      )}
      <div class="thumb-zone thumb-zone-alone">
        <button type="button" class="btn btn-primary" onClick={backToLibrary}>Retour à la bibliothèque</button>
      </div>
    </>
  );
}
