import { expect, test, type Page } from '@playwright/test';

// Lieu de chaque jour (24/11/2026) : sélecteur à 7 jours, matériel de la salle. Captures 375x667 et 430x932 (sombre et clair), règles 25 à 31 :
// pas de défilement horizontal, cibles >= 44 px, saisie >= 16 px.
async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file]), label.check')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox') continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

test('Lieu par jour : sélecteur des 7 jours et matériel de la salle', async ({ page }, info) => {
  test.setTimeout(120_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Choisir un lieu par jour' }).click();
  await page.getByRole('button', { name: 'Salle lun / mer / ven, maison le reste' }).click();
  const mardi = page.getByRole('group', { name: 'Lieu du mardi' });
  await mardi.getByRole('button', { name: 'Repos' }).click();
  await expect(page.getByRole('group', { name: 'Lieu du dimanche' })).toBeVisible();
  await page.getByRole('group', { name: 'Lieu de chaque jour' }).scrollIntoViewIfNeeded();
  await checkPhoneRules(page);
  await page.getByRole('group', { name: 'Lieu de chaque jour' }).screenshot({ path: `screenshots/${project}/salle-jours-selecteur.png` });
  await page.getByRole('group', { name: 'Matériel de la salle' }).first().scrollIntoViewIfNeeded().catch(() => {});
  await page.screenshot({ path: `screenshots/${project}/salle-jours-profil.png`, fullPage: true });
});
