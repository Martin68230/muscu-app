import { defineConfig, devices } from '@playwright/test';

// Captures d'écran en format iPhone avec WebKit (moteur de Safari) : CLAUDE.md règle 31.
const iphoneSE = { ...devices['iPhone SE'], viewport: { width: 375, height: 667 } };
const iphoneMax = { ...devices['iPhone 15 Pro Max'], viewport: { width: 430, height: 932 } };

export default defineConfig({
  testDir: 'tests/screens',
  outputDir: 'test-results',
  reporter: [['list']],
  // Un seul navigateur à la fois : WebKit sous Windows rate des rendus quand plusieurs tournent en parallèle.
  workers: 1,
  use: { baseURL: 'http://localhost:4173/', browserName: 'webkit' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'se-sombre', use: { ...iphoneSE, colorScheme: 'dark' } },
    { name: 'se-clair', use: { ...iphoneSE, colorScheme: 'light' } },
    { name: 'max-sombre', use: { ...iphoneMax, colorScheme: 'dark' } },
    { name: 'max-clair', use: { ...iphoneMax, colorScheme: 'light' } },
  ],
});
