// Volet déroulant « Précautions » (fermé par défaut) : cadre jaune des précautions par exercice, replié pour alléger l'écran.
// Jamais pour une consigne d'arrêt immédiat ni pour un message de sécurité général (grossesse, reprise, symptôme, « pas un avis médical »).
import type { ComponentChildren } from 'preact';

export function Precautions({ title = 'Précautions', label, children }: { title?: string; label?: string; children: ComponentChildren }) {
  return (
    <details class="precautions" aria-label={label ?? title}>
      <summary>{title}</summary>
      <div class="precautions-body">{children}</div>
    </details>
  );
}
