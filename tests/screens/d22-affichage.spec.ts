import { expect, test } from '@playwright/test';
// D22 : de bout en bout (WebKit) : importer deux GIF de test, ouvrir la fiche, vérifier qu'un <img> en data: est affiché ET décodé.
const GIF = Buffer.from('47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b', 'hex');
test('D22 : après import, la fiche affiche le GIF importé (variante exacte ou repli signalé)', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.locator('.img-import input[accept="image/gif"]').setInputFiles([
    { name: '0659-LEH9jxP.gif', mimeType: 'image/gif', buffer: GIF }, // pompe contre un mur
    { name: '3211-ZOuKWir.gif', mimeType: 'image/gif', buffer: GIF }, // pompe sur les genoux
  ]);
  await expect(page.getByText(/2 images importées sur/)).toBeVisible();
  await page.getByRole('button', { name: 'Tester l’affichage' }).click();
  await expect(page.getByText(/2 images lues dans la base, 2 affichables/)).toBeVisible();
  await page.evaluate(() => { location.hash = '#/fiche/pompe'; });
  const img = page.locator('img.fiche-img[src^="data:image/gif"]');
  await expect(img).toBeVisible({ timeout: 15_000 });
  expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  await expect(page.locator('figcaption')).toContainText(/Image importée par toi/);
});
