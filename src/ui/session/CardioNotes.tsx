// D30 : textes des séances de cardio dédiées. Sauts (cardio-regles.md §5.2 T8, §5.2bis condition 7) : avertissement avant les sauts,
// version sans saut d'abord pour le débutant, arrêt au premier signe ; extérieur (§5.4 T9) : rappels avant la sortie et alternative
// intérieure toujours affichée. Aucune localisation.
import { useState } from 'preact/hooks';
import type { PlannedExercise, ProgramDay } from '../../data/model';
import { D30_TEXT } from '../../session/messages';

const hasJump = (d: Pick<ProgramDay, 'exercises'>) => d.exercises.some((e) => !!e.jump);
const isOutdoor = (d: Pick<ProgramDay, 'exercises'>) => d.exercises.some((e) => !!e.outdoor);

/** Aperçu d'une séance de cardio : T8 (sauts) et T9 + alternative intérieure (dehors). Rien pour une séance sans saut ni extérieur. */
export function CardioDayNotes({ day }: { day: Pick<ProgramDay, 'exercises'>; fiches?: unknown }) {
  const jump = hasJump(day);
  const out = isOutdoor(day);
  if (!jump && !out) return null;
  const allSoft = day.exercises.filter((e) => e.jump).every((e) => e.jump!.soft);
  return (
    <>
      {jump && (
        <section class="notice" aria-label="Avant les sauts">
          <p><strong>Avant les sauts</strong></p>
          <p>{D30_TEXT.T8}</p>
          {allSoft && <p>{D30_TEXT.softFirst}</p>}
          <p>{D30_TEXT.jumpStop}</p>
          <p class="small">{D30_TEXT.courbatures}</p>
        </section>
      )}
      {out && (
        <section class="notice" aria-label="Dehors">
          <p><strong>Dehors</strong></p>
          <p>{D30_TEXT.T9}</p>
          <p><strong>{D30_TEXT.indoorTitle}</strong> {D30_TEXT.indoorWalk}</p>
        </section>
      )}
    </>
  );
}

/**
 * Lecteur, exercice de sauts : question « jambes lourdes ou courbaturées ? » (5.1 (5) : oui = version sans saut, imposée dans un
 * programme généré), version sans saut nommée, arrêt au premier signe. Version douce prévue (débutant) : pas de question.
 */
export function JumpPlayNotes({ ex }: { ex: PlannedExercise }) {
  const [heavy, setHeavy] = useState<boolean | null>(null);
  if (!ex.jump) return null;
  return (
    <div class="jump-notes small">
      {ex.jump.soft ? <p>{D30_TEXT.softFirst}</p> : (
        <>
          <p><strong>{D30_TEXT.heavyQuestion}</strong></p>
          <div class="foot-row">
            <button type="button" class="btn btn-sec" aria-pressed={heavy === true} onClick={() => setHeavy(true)}>Oui</button>
            <button type="button" class="btn btn-sec" aria-pressed={heavy === false} onClick={() => setHeavy(false)}>Non</button>
          </div>
          {heavy === true && ex.jump.softNom && <p role="status"><strong>{D30_TEXT.heavyYes}</strong> {D30_TEXT.softLine(ex.jump.softNom)}</p>}
          {heavy !== true && ex.jump.softNom && <p class="dim">{D30_TEXT.softLine(ex.jump.softNom)}</p>}
        </>
      )}
      <p>{D30_TEXT.jumpStop}</p>
    </div>
  );
}

/** Lecteur, marche dehors : rappel T9 en une ligne et alternative intérieure. */
export function OutdoorPlayNotes({ ex }: { ex: PlannedExercise }) {
  if (!ex.outdoor) return null;
  return (
    <div class="small">
      <p>{D30_TEXT.T9short}</p>
      <p class="dim"><strong>{D30_TEXT.indoorTitle}</strong> {D30_TEXT.indoorWalk}</p>
    </div>
  );
}
