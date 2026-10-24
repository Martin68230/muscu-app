import { expect, test, type Page } from '@playwright/test';

// F6 : parcours jusqu'au bilan (séance complète, abandonnée, avec douleur). Captures iPhone SE sombre et grand iPhone clair seulement (quota),
// avec les contrôles de la section D de CLAUDE.md (pas de défilement horizontal, cibles >= 44 px, aucune erreur CSP).

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

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
  await page.getByRole('button', { name: 'Voir la séance' }).click({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  await expect(page.getByRole('button', { name: 'Série faite' })).toBeVisible();
}

const skip = (name: string) => !['se-sombre', 'max-clair'].includes(name);

test('F6 : séance complète -> bilan', async ({ page }, info) => {
  test.skip(skip(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const problems: string[] = [];
  await setup(page, info, problems);
  const primary = page.locator('.player-foot .btn-primary');
  for (let i = 0; i < 150; i++) {
    const label = await primary.first().textContent({ timeout: 1500 }).catch(() => null);
    if (label?.includes('Retour')) break; // le bilan est affiché : ne pas le fermer
    if (label) await primary.first().click({ timeout: 3000 }).catch(() => undefined);
    await page.waitForTimeout(150);
  }
  await expect(page.getByRole('heading', { name: 'Première séance faite' })).toBeVisible();
  await expect(page.getByText('La prochaine fois, on pourra comparer.')).toBeVisible();
  await expect(page.getByLabel('Chiffres de la séance')).toBeVisible();
  await expect(page.getByRole('button', { name: /signaler un problème/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retour à l’accueil' })).toBeInViewport();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f6-bilan-complete.png` });
  await page.getByRole('button', { name: 'Retour à l’accueil' }).click();
  expect(problems).toEqual([]);
});

test('F6 : séance abandonnée -> aucun chiffre', async ({ page }, info) => {
  test.skip(skip(info.project.name), 'quota');
  test.setTimeout(240_000);
  const problems: string[] = [];
  await setup(page, info, problems);
  await page.getByRole('button', { name: 'Quitter' }).click();
  await page.getByRole('button', { name: 'Abandonner la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Séance arrêtée' })).toBeVisible();
  await expect(page.getByText('Aucun souci : on reprendra quand tu veux.')).toBeVisible();
  await expect(page.getByLabel('Chiffres de la séance')).toHaveCount(0);
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f6-bilan-abandon.png` });
  expect(problems).toEqual([]);
});

test('F6 : séance avec douleur -> bilan sans reproche', async ({ page }, info) => {
  test.skip(skip(info.project.name), 'quota');
  test.setTimeout(240_000);
  const problems: string[] = [];
  await setup(page, info, problems);
  const reps = page.getByRole('group', { name: 'Répétitions', exact: true });
  for (let i = 0; i < 40 && !(await reps.isVisible()); i++) {
    await page.locator('.player-foot .btn-primary').click();
    await page.waitForTimeout(150);
  }
  await expect(reps).toBeVisible(); // première série de travail (l'échauffement est passé)
  await page.getByRole('button', { name: 'Ça fait mal' }).click();
  await page.getByRole('button', { name: 'Genou' }).click();
  await page.getByRole('button', { name: 'J’arrête cet exercice' }).click();
  await page.getByRole('button', { name: 'Continuer la séance' }).click();
  await page.getByRole('button', { name: 'Quitter' }).click();
  await page.getByRole('button', { name: 'Terminer la séance' }).click();
  await expect(page.getByText(/Tu as signalé une douleur sur/)).toBeVisible();
  await expect(page.getByText(/Tu as bien fait d’arrêter/)).toBeVisible();
  await expect(page.getByText(/parles-en à un professionnel de santé/)).toBeVisible();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f6-bilan-douleur.png` });
  expect(problems).toEqual([]);
});
