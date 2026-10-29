import { execSync } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

/** Politique de sécurité du contenu : ajoutée au build seulement (le serveur de développement a besoin de scripts en ligne). */
export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
].join('; ');

const cspPlugin: Plugin = {
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => html.replace('<meta charset="UTF-8" />', (m) => `${m}
    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
  },
};

/** Identifiant de la version affichée dans Profil : numéro, commit court et date du build (sans git : numéro seul). */
function buildLabel(): string {
  const v = process.env.npm_package_version ?? '0.0.0';
  let sha = (process.env.GITHUB_SHA ?? '').slice(0, 7);
  if (!sha) {
    try {
      sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      sha = '';
    }
  }
  const day = new Date().toISOString().slice(0, 10).split('-').reverse().join('/');
  return `${v}${sha ? ` · ${sha}` : ''} · ${day}`;
}

// base './' : le site fonctionne quel que soit le nom du dépôt GitHub Pages.
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(buildLabel()),
  },
  plugins: [
    preact(),
    cspPlugin,
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon.svg'],
      manifest: {
        name: 'Muscu entre amis',
        short_name: 'Muscu',
        description: 'Programmes de musculation simples, privés et hors-ligne.',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0f1115',
        theme_color: '#0f1115',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    maxWorkers: 6, // trop de fichiers en parallèle affamaient les tests à horloge réelle sur une machine chargée
    testTimeout: 40000, // machines chargées : les tests du générateur dépassaient 5 s sans être faux
  },
});
