// Thème appliqué avant le premier affichage (pas de flash blanc). Sombre par défaut.
// Fichier à part (et non un script dans index.html) pour que la politique de sécurité (CSP) interdise les scripts en ligne.
(function () {
  var t = 'dark';
  try { t = localStorage.getItem('muscu.theme') || 'dark'; } catch (e) {}
  if (t === 'system') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name=theme-color]').content = t === 'light' ? '#f6f7f9' : '#0f1115';
})();
