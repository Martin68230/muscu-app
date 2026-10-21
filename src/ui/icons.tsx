// Icônes dessinées pour l'app (traits simples, aucun visuel d'une autre app).
const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': true,
};

export const IconHome = () => (
  <svg {...common}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
);
export const IconCalendar = () => (
  <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IconLibrary = () => (
  <svg {...common}><path d="M2 12h2M20 12h2M6 8v8M18 8v8M4 10v4M20 10v4M6 12h12" /></svg>
);
export const IconFriends = () => (
  <svg {...common}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14.5c2.3.3 3.9 1.9 4.5 4.5" /></svg>
);
export const IconProfile = () => (
  <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.2-6.5 8-6.5s7 2.5 8 6.5" /></svg>
);
export const IconShield = () => (
  <svg {...common}><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
);
