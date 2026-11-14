import { tapPrimary } from './helpers-seance';
import { test, type Page } from '@playwright/test';

async function setup(page: Page, info: { project: { name: string } }, problems: string[]) {
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  page.on('console', (m) => {
    if (/content security policy|refused to (load|execute|frame|connect)|^CSP /i.test(m.text())) problems.push(m.text());
  });
  page.on('pageerror', (e) => problems.push(`erreur : ${e.message}`));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
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
  await page.screenshot({ path: `screenshots/${info.project.name}/${process.env.SHOT ?? 'avant'}-accueil.png`, fullPage: true });
  await page.getByRole('button', { name: 'Voir la séance' }).click({ timeout: 20_000 });
  await page.screenshot({ path: `screenshots/${info.project.name}/${process.env.SHOT ?? 'avant'}-apercu.png`, fullPage: true });
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  await page.getByRole('button', { name: 'Série faite' }).waitFor();
  await page.screenshot({ path: `screenshots/${info.project.name}/${process.env.SHOT ?? 'avant'}-seance.png` });
  await tapPrimary(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${info.project.name}/${process.env.SHOT ?? 'avant'}-seance2.png` });
}


test('audit design', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name));
  test.setTimeout(240_000);
  await setup(page, info, []);
  const tag = process.env.SHOT ?? 'avant';
  const primary = page.locator('.player-foot .btn-primary');
  for (let i = 0; i < 150; i++) {
    const label = await primary.first().textContent({ timeout: 1500 }).catch(() => null);
    if (label?.includes('Retour')) break;
    if (label) await tapPrimary(page).catch(() => undefined);
    await page.waitForTimeout(150);
  }
  await page.screenshot({ path: `screenshots/${info.project.name}/${tag}-bilan.png`, fullPage: true });
  await page.getByRole('button', { name: 'Retour à l’accueil' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${info.project.name}/${tag}-accueil2.png`, fullPage: true });
  if (tag !== 'avant') {
    await page.getByRole('button', { name: 'Ma progression' }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/${info.project.name}/${tag}-progression.png`, fullPage: true });
    await page.getByRole('button', { name: 'Retour à l’accueil' }).first().click();
  }
  for (const t of ['Calendrier', 'Bibliothèque', 'Profil']) {
    await page.locator('.tabbar').getByRole('button', { name: t }).click();
    await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${info.project.name}/${tag}-${t.toLowerCase()}.png`, fullPage: true });
  }
});
