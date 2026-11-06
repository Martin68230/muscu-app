import { expect, test } from '@playwright/test';

// Case « Ancrage de porte » de l'écran Équipement : décochée par défaut, aide visible, conservée après rechargement.
test('profil matériel : ancrage de porte', async ({ page }, info) => {
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();

  const box = page.getByLabel('Ancrage de porte');
  await expect(box).not.toBeChecked();
  await page.getByLabel(/^Élastique \(bande longue/).check();
  await box.check();
  await box.scrollIntoViewIfNeeded();
  await expect(page.getByText('Un ancrage adapté pour poser l’élastique en haut d’une porte fermée.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: `screenshots/${info.project.name}/ancrage-porte.png` });

  await page.reload();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await expect(page.getByLabel('Ancrage de porte')).toBeChecked();
});
