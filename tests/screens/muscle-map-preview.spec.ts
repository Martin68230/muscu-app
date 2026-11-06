import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from '@playwright/test';

// Niveau 3, étape 1 : captures de l'aperçu STATIQUE de la carte des muscles (hors parcours de l'app, rien dans le bundle de production).
// Le HTML est produit par tests/unit/muscle-map-preview.test.ts (npx vitest run tests/unit/muscle-map-preview.test.ts) ; ici : captures seulement.
test('Aperçu : carte des muscles', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  const file = resolve('screenshots/muscle-map', `apercu-${theme}.html`);
  if (!existsSync(file)) throw new Error("lancer d'abord : npx vitest run tests/unit/muscle-map-preview.test.ts");
  await page.goto('file:///' + file.replace(/\\/g, '/'));
  await page.screenshot({ path: `screenshots/muscle-map/${info.project.name}.png`, fullPage: true });
});
