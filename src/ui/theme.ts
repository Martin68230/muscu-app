export type ThemePref = 'dark' | 'light' | 'system';

// Réglage de confort propre à l'appareil : localStorage (lu avant le premier affichage dans index.html).
export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem('muscu.theme');
    if (v === 'light' || v === 'system') return v;
  } catch {
    /* stockage indisponible : thème sombre */
  }
  return 'dark';
}

export function applyTheme(pref: ThemePref): void {
  try {
    localStorage.setItem('muscu.theme', pref);
  } catch {
    /* ignoré */
  }
  const resolved =
    pref === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : pref;
  document.documentElement.dataset.theme = resolved;
  const meta = document.querySelector<HTMLMetaElement>('meta[name=theme-color]');
  if (meta) meta.content = resolved === 'light' ? '#f6f7f9' : '#0f1115';
}
