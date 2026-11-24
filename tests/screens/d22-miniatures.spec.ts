import { expect, test } from '@playwright/test';
// D22 : miniatures des listes (WebKit). Import de 2 GIF de test, bibliothèque : la vignette de « Pompe » est un JPEG statique en data:, décodé ;
// une fiche sans image garde un pictogramme (jamais un carré vide) ; régénération, compteur, suppression ; 400 vignettes simulées légères.
const GIF = Buffer.from('47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b', 'hex');
test('D22 : la bibliothèque affiche la miniature importée, un pictogramme sinon', async ({ page }, info) => {
  test.setTimeout(150_000);
  const project = info.project.name;
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, project.endsWith('clair') ? 'light' : 'dark');
  const external: string[] = [];
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('http://localhost:4173') && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u); });
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.locator('.img-import input[accept="image/gif"]').setInputFiles([
    { name: '0659-LEH9jxP.gif', mimeType: 'image/gif', buffer: GIF },
    { name: '3211-ZOuKWir.gif', mimeType: 'image/gif', buffer: GIF },
  ]);
  await expect(page.getByText(/2 images importées sur/)).toBeVisible();
  await expect(page.getByTestId('thumb-count')).toContainText('2 miniatures');
  // Régénérer
  await page.getByRole('button', { name: 'Régénérer les miniatures' }).click();
  await expect(page.getByText(/2 miniatures refaites/)).toBeVisible();
  await expect(page.getByTestId('thumb-count')).toContainText('2 miniatures');

  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  const row = page.locator('a.lib-row[href="#/fiche/pompe"]');
  await row.scrollIntoViewIfNeeded();
  const img = row.locator('img.exo-thumb-img');
  await expect(img).toBeVisible({ timeout: 15_000 });
  expect(await img.getAttribute('src')).toMatch(/^data:image\/jpeg/);
  expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  // Aucun GIF animé dans la liste
  expect(await page.locator('.lib-list img[src^="data:image/gif"]').count()).toBe(0);
  // Fiche sans image : pictogramme visible, jamais un carré vide
  const ph = page.locator('.lib-list .exo-ph').first();
  await expect(ph).toBeVisible();
  expect(await ph.locator('svg').count()).toBe(1);
  // Zones tactiles : une ligne de la liste fait au moins 44 px, pas de défilement horizontal
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect(await row.evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: `screenshots/${project}/d22-miniatures-biblio.png` });

  // 400 vignettes simulées : poids total et durée de décodage raisonnables
  const sim = await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 160; c.height = 160;
    const g = c.getContext('2d')!;
    const urls: string[] = [];
    for (let i = 0; i < 400; i++) { g.fillStyle = `hsl(${i % 360} 60% 50%)`; g.fillRect(0, 0, 160, 160); g.fillStyle = '#fff'; g.fillRect(20, 20, 60, 60); urls.push(c.toDataURL('image/jpeg', 0.72)); }
    const t0 = performance.now();
    const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(box);
    await Promise.all(urls.map((u) => new Promise<void>((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(); im.onerror = () => res(); im.src = u; box.appendChild(im); })));
    const ms = performance.now() - t0;
    box.remove();
    return { bytes: urls.reduce((a, u) => a + u.length, 0), ms };
  });
  expect(sim.bytes).toBeLessThan(400 * 12_000); // moins de ~12 Ko par vignette
  expect(sim.ms).toBeLessThan(15_000);
  expect(external).toEqual([]);

  // Suppression : images ET miniatures
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Supprimer les images importées' }).click();
  await page.getByRole('button', { name: 'Oui, supprimer' }).click();
  await expect(page.getByText(/0 image importée sur/)).toBeVisible();
  await expect(page.getByTestId('thumb-count')).toContainText('0 miniature');
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  await page.locator('a.lib-row[href="#/fiche/pompe"]').scrollIntoViewIfNeeded();
  await expect(page.locator('a.lib-row[href="#/fiche/pompe"] .exo-ph')).toBeVisible();
  await page.screenshot({ path: `screenshots/${project}/d22-miniatures-apres-suppression.png` });
});
