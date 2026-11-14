import { expect, test } from '@playwright/test';
// D22 : section « Images de mes exercices » du Profil. Captures WebKit 375x667 et 430x932 ; zones tactiles >= 44 px, pas de défilement horizontal.
test('D22 : import local des images, écran avant / après import d\'un faux GIF', async ({ page }, info) => {
  test.setTimeout(120_000);
  const project = info.project.name;
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, project.endsWith('clair') ? 'light' : 'dark');
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  const h = page.getByRole('heading', { name: 'Images de mes exercices' });
  await h.scrollIntoViewIfNeeded();
  await expect(page.getByText(/jamais envoyées nulle part/)).toBeVisible();
  const check = async () => {
    const problems = await page.evaluate(() => {
      const out: string[] = [];
      if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
      for (const el of document.querySelectorAll<HTMLElement>('.img-import button')) { const r = el.getBoundingClientRect(); if (r.height < 44) out.push(`zone tactile ${Math.round(r.height)} : ${el.textContent}`); }
      return out;
    });
    expect(problems).toEqual([]);
  };
  await check();
  await page.screenshot({ path: `screenshots/${project}/d22-1-avant.png` });
  // Un GIF minimal au nom de la table : importé, le compteur passe à 1.
  await page.locator('.img-import input[accept="image/gif"]').setInputFiles({ name: '0659-LEH9jxP.gif', mimeType: 'image/gif', buffer: Buffer.from('474946383961010001000000003b', 'hex') });
  await expect(page.getByText(/1 image importée sur/)).toBeVisible();
  await h.scrollIntoViewIfNeeded();
  await check();
  await page.screenshot({ path: `screenshots/${project}/d22-2-apres.png` });
  await page.getByRole('button', { name: 'Supprimer les images importées' }).click();
  await page.getByRole('button', { name: 'Oui, supprimer' }).click();
  await expect(page.getByText(/0 image importée sur/)).toBeVisible();
});
