// Interrupteur générique (mêmes styles que « Gagner du temps ») : option de cardio (D31), accès à une salle et extérieur (D30).
// Zone tactile pleine largeur (>= 44 px), aide sous le libellé ; grisé avec une phrase qui dit pourquoi.
export interface SwitchRowProps {
  id: string;
  label: string;
  on: boolean;
  help?: string | null;
  disabledReason?: string | null;
  busy?: boolean;
  onToggle: (on: boolean) => void;
}

export function SwitchRow({ id, label, on, help, disabledReason, busy, onToggle }: SwitchRowProps) {
  const disabled = !!disabledReason || !!busy;
  const checked = on && !disabledReason;
  return (
    <div class="gain">
      <button type="button" role="switch" aria-checked={checked} aria-describedby={`${id}-help`} class="switch-row" disabled={disabled} onClick={() => onToggle(!checked)}>
        <span class="switch-label">{label}</span>
        <span class="switch" aria-hidden="true"><span class="switch-knob" /></span>
      </button>
      <div id={`${id}-help`} class="small dim">
        <p>{disabledReason ?? help}</p>
      </div>
    </div>
  );
}
