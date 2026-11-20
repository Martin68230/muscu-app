import { expect, test } from '@playwright/test';
// D22 : une fiche CONVERTIE depuis le jeu (curl au pupitre, variante poulie, GIF 0195) reçoit son GIF par identifiant, sur la fiche et dans le compteur « Mes images ».
const GIF = Buffer.from('47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b', 'hex');
test('D22 : fiche convertie du jeu : GIF affiché après import, compteurs Mes images', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await expect(page.getByText(/exercices? avec une image importée \(sur \d+\)/)).toBeVisible();
  await page.locator('.img-import input[accept="image/gif"]').setInputFiles({ name: '0195-P2lNrGL.gif', mimeType: 'image/gif', buffer: GIF });
  await expect(page.locator('.img-count')).toContainText('1 image importée');
  await expect(page.getByText(/1 exercice avec une image importée/)).toBeVisible();
  await page.getByRole('button', { name: 'Tester l’affichage' }).click();
  await expect(page.getByText(/1 image lue dans la base, 1 affichable/)).toBeVisible();
  await page.evaluate(() => { location.hash = '#/fiche/curl-au-pupitre'; });
  const img = page.locator('img.fiche-img[src^="data:image/gif"]');
  await expect(img).toBeVisible({ timeout: 15_000 });
  expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
});
