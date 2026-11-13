import { expect, test, type Locator, type Page } from '@playwright/test';
import { tapPrimary } from './helpers-seance';

// Niveau 3, étape 2 : la carte des muscles dans l'app (5 vues) : semaine (Accueil), cycle (sous-écran), séance (aperçu), exercice (fiche),
// bilan de séance, date de l'historique. Captures : iPhone SE sombre et grand iPhone clair (screenshots/<projet>/mm-*.png).

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('main button, main a[href], .mm-card summary')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim()}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

/** Appui sur la carte au point (x, y) du repère de la silhouette (face : 0-200, dos : 210-410 ; hauteur 434). */
async function tapMap(card: Locator, x: number, y: number) {
  const hit = card.locator('rect.mm-hit');
  const box = (await hit.boundingBox())!;
  await hit.click({ position: { x: (x / 410) * box.width, y: (y / 434) * box.height } });
}

/** Pixels d'écran par unité de la silhouette (vraie mise à l'échelle de la carte). */
async function hitScalePx(card: Locator): Promise<number> {
  return card.locator('svg.mm').first().evaluate((svg) => (svg as SVGSVGElement).getScreenCTM()!.a);
}

test('Carte des muscles : semaine, cycle, séance, exercice, bilan, historique', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(420_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Créer mon programme' }).click();
  await page.getByRole('button', { name: '4', exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // jours bloqués : aucun
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
  await page.getByRole('button', { name: 'Suivant' }).click(); // blessures : aucune
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });

  // 1. Semaine (Accueil) : appui sur les pectoraux (face), panneau sous la carte.
  const week = page.locator('section.mm-card', { has: page.getByRole('heading', { name: 'Muscles de ton cycle' }) });
  await week.scrollIntoViewIfNeeded();
  expect((await hitScalePx(week)) * 410).toBeGreaterThan(290); // carte presque pleine largeur, même sur iPhone SE
  await tapMap(week, 80, 98);
  await expect(week.locator('.mm-panel')).toContainText(/Pectoraux .* : .* points? sur la semaine\./);
  await expect(week.locator('.mm-z.mm-sel')).toHaveCount(1);
  // Appui À CÔTÉ du dessin (10 unités à gauche de l'avant-bras) : zone sensible agrandie.
  await tapMap(week, 24, 215);
  await expect(week.locator('.mm-panel')).toContainText('Avant-bras');
  await checkPhoneRules(page);
  await week.screenshot({ path: `screenshots/${project}/mm-semaine.png` });

  // 2. Cycle (sous-écran).
  await week.getByRole('button', { name: 'Voir par type de séance' }).click();
  await expect(page.getByRole('heading', { name: 'Muscles par type de séance' })).toBeVisible();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/mm-cycle.png`, fullPage: true });
  await page.getByRole('button', { name: '‹ Retour à l’accueil' }).click();

  // 3. Séance (aperçu).
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  const prev = page.locator('section.mm-card', { has: page.getByRole('heading', { name: 'Muscles de cette séance' }) });
  await prev.scrollIntoViewIfNeeded();
  await tapMap(prev, 300, 230); // dos : fessiers
  await expect(prev.locator('.mm-panel')).toContainText('dans cette séance');
  await checkPhoneRules(page);
  await prev.screenshot({ path: `screenshots/${project}/mm-seance-apercu.png` });

  // 4. Exercice (fiche ouverte depuis l'aperçu), puis retour à l'aperçu.
  await page.locator('a.fiche-link').first().click();
  const ex = page.locator('section.mm-card', { has: page.getByRole('heading', { name: 'Où ça travaille' }) });
  await ex.scrollIntoViewIfNeeded();
  await ex.locator('.mm-z.s-rouge').first().focus();
  await page.keyboard.press('Enter');
  await expect(ex.locator('.mm-panel')).toContainText('muscle principal');
  await checkPhoneRules(page);
  await ex.screenshot({ path: `screenshots/${project}/mm-exercice.png` });
  await page.goBack();

  // 5. Bilan : séance complète.
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  const primary = page.locator('.player-foot .btn-primary');
  for (let i = 0; i < 200; i++) {
    const label = await primary.first().textContent({ timeout: 1500 }).catch(() => null);
    if (label?.includes('Retour')) break;
    if (label) await tapPrimary(page).catch(() => undefined);
    await page.waitForTimeout(150);
  }
  const bilan = page.locator('section.mm-card', { has: page.getByRole('heading', { name: 'Muscles travaillés aujourd’hui' }) });
  await bilan.scrollIntoViewIfNeeded();
  await tapMap(bilan, 100, 140);
  await expect(bilan.locator('.mm-panel')).toContainText('dans cette séance');
  await bilan.screenshot({ path: `screenshots/${project}/mm-bilan.png` });
  await page.getByRole('button', { name: 'Retour à l’accueil' }).click();

  // 6. Date de l'historique.
  await page.getByRole('button', { name: /Calendrier/ }).click();
  await page.getByRole('list', { name: 'Séances passées' }).getByRole('button').first().click();
  const hist = page.locator('section.mm-card', { has: page.getByRole('heading', { name: 'Muscles travaillés ce jour-là' }) });
  await hist.scrollIntoViewIfNeeded();
  await expect(hist).toBeVisible();
  await checkPhoneRules(page);
  await hist.screenshot({ path: `screenshots/${project}/mm-historique.png` });
  expect(errors).toEqual([]);
});
