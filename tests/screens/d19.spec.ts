import { expect, test, type Page } from '@playwright/test';

// D19 : « Importer depuis Hevy ou Strong » dans le Profil. Captures WebKit 375x667 et 430x932 (sombre et clair) : choix, aperçu, fin, historique.

async function checkSection(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    const root = document.querySelector('#import-csv-title')?.closest('section');
    if (!root) return ['bloc introuvable'];
    for (const el of root.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim()}`);
    }
    for (const el of root.querySelectorAll<HTMLElement>('.notice, .toast, p')) {
      if (el.getBoundingClientRect().right > window.innerWidth + 1) out.push(`déborde à droite : ${el.className || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}
async function shot(page: Page, name: string, project: string) {
  await checkSection(page);
  await page.screenshot({ path: `screenshots/${project}/d19-${name}.png` });
}

test('D19 : import CSV Hevy / Strong, aperçu, fin, historique, suppression', async ({ page }, info) => {
  test.setTimeout(150_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  await page.clock.setFixedTime(new Date('2026-11-12T10:00:00'));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();

  const title = page.getByRole('heading', { name: 'Importer depuis Hevy ou Strong' });
  await title.scrollIntoViewIfNeeded();
  await shot(page, '1-choix', project);

  // Fichier mal formé : refus clair
  await page.locator('section[aria-labelledby="import-csv-title"] input[type=file]').setInputFiles({ name: 'mauvais.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') });
  await expect(page.getByText(/Import refusé : Fichier non reconnu/)).toBeVisible();
  await shot(page, '2-refus', project);

  // Fichier Strong : aperçu avec choix de l'unité
  await page.locator('section[aria-labelledby="import-csv-title"] input[type=file]').setInputFiles('tests/fixtures/import-strong.csv');
  await expect(page.getByText('Fichier Strong')).toBeVisible();
  await expect(page.getByText(/2 séances/)).toBeVisible();
  await title.scrollIntoViewIfNeeded();
  await shot(page, '3-apercu', project);

  await page.getByRole('button', { name: 'Importer', exact: true }).click();
  await expect(page.getByText(/Import terminé : 2 séances ajoutées/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Supprimer les séances importées' })).toBeVisible();
  await title.scrollIntoViewIfNeeded();
  await shot(page, '4-fin', project);

  // Historique : la séance importée apparaît
  await page.getByRole('button', { name: 'Calendrier', exact: true }).click();
  await expect(page.getByText(/Importé · Jambes/).first()).toBeVisible();
  await page.screenshot({ path: `screenshots/${project}/d19-5-historique.png` });
  await page.locator('.hist-row').filter({ hasText: 'Importé · Jambes' }).click();
  await expect(page.getByRole('heading', { name: 'Séance importée' })).toBeVisible();
  await page.screenshot({ path: `screenshots/${project}/d19-6-detail.png` });

  // Suppression d'un coup
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Supprimer les séances importées' }).click();
  await page.getByRole('button', { name: 'Oui, supprimer' }).click();
  await expect(page.getByText(/2 séances importées supprimées/)).toBeVisible();
});
