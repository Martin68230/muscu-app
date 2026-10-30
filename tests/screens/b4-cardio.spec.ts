import { expect, test } from '@playwright/test';

// B4 : cardio principal (2 jours) -> chaque séance finit par un bloc de cardio ; textes de sécurité T0 / T1 dans l'aperçu.
// Captures iPhone SE sombre et grand iPhone clair seulement (quota) ; contrôles de la section D de CLAUDE.md.
test('B4 : aperçu d\'une séance avec bloc de cardio', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(120_000);
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
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // jours bloqués : aucun
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /À la maison/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // matériel : rien de plus
  await page.getByRole('button', { name: /Débutant/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /^Cardio/ }).first().click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // blessures : aucune
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Les exercices' })).toBeVisible();
  await expect(page.getByText(/chacune suivie de 10 min de cardio/)).toBeVisible();
  await expect(page.getByText(/Le cardio fait travailler ton cœur/)).toBeVisible();
  await expect(page.getByText(/Arrête la séance si tu ressens/)).toBeVisible();
  // D25 (cardio-regles.md §3.4 g-k) : séance corps entier = jambes lourdes -> bloc « facile » ; STR-SEA-4 : 2 dernières minutes lentes.
  await expect(page.getByText('10 min · effort facile, 2 dernières min lentes').first()).toBeVisible();
  const problems = await page.evaluate(() => (document.documentElement.scrollWidth > window.innerWidth + 1 ? ['défilement horizontal'] : []));
  expect(problems).toEqual([]);
  await page.screenshot({ path: `screenshots/${project}/b4-apercu-cardio.png`, fullPage: true });
  await page.getByText('10 min · effort facile, 2 dernières min lentes').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `screenshots/${project}/b4-apercu-cardio-bloc.png` });
  expect(errors).toEqual([]);
});
