// Option « Gagner du temps » (core-et-supersets.md §12) : interrupteur commun à l'aperçu de séance et au profil.
// Éteint par défaut ; grisé avec une phrase courte pour un débutant (SUP-4), en grossesse ou en post-partum (SUP-9).
import { GAIN_TEXT } from '../session/messages';

export interface GainToggleProps {
  on: boolean;
  /** Phrase qui dit pourquoi l'option est grisée, ou null si elle est disponible. */
  disabledReason: string | null;
  onToggle: (on: boolean) => void;
  busy?: boolean;
}

/** Raison d'un interrupteur grisé, d'après le profil. */
export function gainDisabledReason(p: { level: string | null; pregnancy?: string | null }): string | null {
  if (p.pregnancy === 'enceinte' || p.pregnancy === 'post_partum') return GAIN_TEXT.offPregnancy;
  if (!p.level || p.level === 'debutant') return GAIN_TEXT.offBeginner;
  return null;
}

export function GainToggle({ on, disabledReason, onToggle, busy }: GainToggleProps) {
  const disabled = !!disabledReason || !!busy;
  const checked = on && !disabledReason;
  return (
    <div class="gain">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby="gain-help"
        class="switch-row"
        disabled={disabled}
        onClick={() => onToggle(!checked)}
      >
        <span class="switch-label">{GAIN_TEXT.label}</span>
        <span class="switch" aria-hidden="true"><span class="switch-knob" /></span>
      </button>
      <div id="gain-help" class="small dim">
        {disabledReason ? <p>{disabledReason}</p> : (
          <>
            <p>{GAIN_TEXT.explain}</p>
            <p>{GAIN_TEXT.honest}</p>
          </>
        )}
      </div>
    </div>
  );
}
