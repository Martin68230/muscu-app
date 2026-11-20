// Captures de cohérence visuelle (lot 4) : Nutrition, Semaine, Profil, Bibliothèque, états vides.
import { test, expect, type Page } from '@playwright/test';

async function onboard(page: Page, theme: string) {
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Créer mon programme' }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'dimanche' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /À la maison/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByLabel('Banc plat').check();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Avancé/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Prise de muscle/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await page.waitForTimeout(800);
}


test('cohérence : écrans nutrition, profil, bibliothèque', async ({ page }, info) => {
  test.setTimeout(240_000);
  await onboard(page, info.project.name.endsWith('clair') ? 'light' : 'dark');
  const shot = async (name: string) => {
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, name).toBe(false);
    await page.screenshot({ path: `screenshots/${info.project.name}/lot4-${name}.png`, fullPage: true });
  };
  await page.locator('.tabbar').getByRole('button', { name: 'Bibliothèque' }).click();
  await expect(page.getByText(/Filtres/)).toBeVisible({ timeout: 60_000 });
  await shot('bibliotheque');
  await page.getByText(/Filtres/).click();
  await page.getByLabel('Muscle').selectOption('dos');
  await page.getByLabel('Matériel').selectOption('halteres');
  await shot('bibliotheque-filtres');
  await page.getByLabel('Niveau').selectOption('debutant');
  await page.getByLabel('Matériel').selectOption('swiss_ball');
  await shot('bibliotheque-vide-ou-court');
});
