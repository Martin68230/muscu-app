import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/** Bulle « ? » : un appui ouvre une explication courte juste en dessous, un second appui la ferme. */
export function Help({ term, children }: { term: string; children: ComponentChildren }) {
  const [open, setOpen] = useState(false);
  return (
    <span class="ux-help">
      <button type="button" class="ux-help-btn" aria-expanded={open} aria-label={`Que veut dire « ${term} » ?`} onClick={() => setOpen(!open)}>?</button>
      {open && <span class="ux-help-text" role="note">{children}</span>}
    </span>
  );
}
