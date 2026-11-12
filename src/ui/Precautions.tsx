// Volet déroulant « Précautions » (fermé par défaut) : cadre jaune des précautions par exercice, replié pour alléger l'écran.
// Jamais pour une consigne d'arrêt immédiat ni pour un message de sécurité général (grossesse, reprise, symptôme, « pas un avis médical »).
import type { ComponentChildren } from 'preact';

export function Precautions({ title = 'Précautions', label, className, children }: { title?: string; label?: string; className?: string; children: ComponentChildren }) {
  return (
    <details class={className ? `precautions ${className}` : 'precautions'} aria-label={label ?? title}>
      <summary>{title}</summary>
      <div class="precautions-body">{children}</div>
    </details>
  );
}
