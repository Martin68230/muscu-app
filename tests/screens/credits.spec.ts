import { expect, test } from '@playwright/test';

// Écran « Crédits » (D12) : accessible depuis le Profil, une colonne, sans défilement horizontal,
// zones tactiles >= 44 px. Captures dans screenshots/<projet>/.
test('page Crédits depuis le profil', async ({ page }, info) => {
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('muscu.theme', t);
    } catch {
      /* ignoré */
    }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Crédits et licences' }).click();

  await expect(page.getByRole('heading', { name: 'Crédits', exact: true })).toBeVisible();
  await expect(page.getByText('free-exercise-db (yuhonas)')).toBeVisible();
  await expect(page.getByText('Illustrations de l\'app')).toBeVisible();
  await expect(page.getByText(/lecteur officiel/)).toBeVisible();

  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], summary')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim()}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/07-credits.png`, fullPage: true });

  await page.getByRole('button', { name: /Retour au profil/ }).click();
  await expect(page.getByRole('heading', { name: 'Profil' })).toBeVisible();
});
