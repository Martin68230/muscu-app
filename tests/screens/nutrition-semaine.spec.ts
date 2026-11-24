import { expect, test, type Page } from '@playwright/test';

// Semaine de repas : plan gardé en mémoire, changer un repas / un aliment, verrouiller, annuler, valider, calendrier (fiche de journée), historique.
// Une colonne, pas de défilement horizontal, zones tactiles >= 44 px, saisie 16 px (règles 25 à 31). Captures dans screenshots/<projet>/.
async function problems(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], summary, input[type="radio"], input[type="checkbox"]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const target = el.closest('label') ?? el;
      const t = target.getBoundingClientRect();
      if (t.height < 44 && !el.closest('.calendar')) out.push(`zone tactile trop petite (${Math.round(t.width)}x${Math.round(t.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="date"], input[type="search"]')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`saisie sous 16 px : ${el.name || el.placeholder}`);
    }
    return out;
  });
}

test('Nutrition : générer, changer, verrouiller, annuler, valider, calendrier, historique', async ({ page }, info) => {
  test.setTimeout(180_000);
  const shot = (n: string, full = true) => page.screenshot({ path: `screenshots/${info.project.name}/nutrition-semaine-${n}.png`, fullPage: full });
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  await page.getByRole('link', { name: /Nutrition/ }).first().click();
  await page.getByLabel('Un homme').check();
  await page.getByLabel('Année de naissance').fill('1992');
  await page.getByLabel('Taille (cm)').fill('178');
  await page.getByLabel('Poids actuel (kg)').fill('80');
  for (const q of ['maladie suivie', 'perdre le contrôle', 'traitement médicamenteux']) {
    await page.getByRole('group', { name: new RegExp(q) }).getByLabel('Non', { exact: true }).check();
  }
  await page.getByLabel('Garder mon poids').check();
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await page.getByRole('button', { name: 'Semaine', exact: true }).click();

  // Avant la génération : préférences rapides (état vide utile)
  await expect(page.getByText('Avant de générer : préférences rapides')).toBeVisible();
  await expect(page.getByText(/Imposer un repas/)).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await shot('01-avant-generation');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByRole('heading', { name: 'Mes 7 jours' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Valider la semaine' })).toBeEnabled();

  // Mémoire : on quitte l'écran et on revient, le même plan est là (jamais régénéré sans demande)
  const firstMeal = (await page.locator('.plan-meal strong').first().textContent()) ?? '';
  await page.getByRole('button', { name: 'Poids et courbe' }).click();
  await page.getByRole('button', { name: 'Semaine', exact: true }).click();
  await expect(page.locator('.plan-meal strong').first()).toHaveText(firstMeal);
  await page.reload();
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  await page.getByRole('link', { name: /Nutrition/ }).first().click();
  await page.getByRole('button', { name: 'Semaine', exact: true }).click();
  await expect(page.locator('.plan-meal strong').first()).toHaveText(firstMeal);
  await shot('02-plan');

  // Changer un repas (3 alternatives équivalentes), puis annuler
  await page.getByRole('button', { name: /^Actions pour/ }).first().click();
  await page.getByRole('button', { name: 'Changer ce repas' }).click();
  await expect(page.locator('.alt-card')).toHaveCount(3);
  await expect(await problems(page)).toEqual([]);
  await shot('03-changer-repas');
  await page.locator('.alt-card').first().getByRole('button', { name: 'Choisir ce repas' }).click();
  await expect(page.getByText(/changé :/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Annuler le dernier changement' }).click();
  await expect(page.locator('.plan-meal strong').first()).toHaveText(firstMeal);

  // Verrouiller un repas
  await page.getByRole('button', { name: /^Actions pour/ }).first().click();
  await page.getByRole('button', { name: 'Verrouiller', exact: true }).click();
  await expect(page.getByText(/Repas verrouillé/)).toBeVisible();
  // Régénérer : confirmation, le repas verrouillé reste
  await page.getByRole('button', { name: 'Régénérer ma semaine' }).click();
  await expect(page.getByText('Régénérer cette semaine ?')).toBeVisible();
  await shot('04-confirmer-regeneration');
  await page.getByRole('button', { name: 'Oui, régénérer' }).click();
  await expect(page.locator('.plan-meal strong').first()).toHaveText(firstMeal);

  // Changer un aliment
  await page.getByRole('button', { name: /^Actions pour/ }).nth(2).click();
  await page.getByRole('button', { name: 'Changer un aliment' }).click();
  await expect(page.getByText('Quel aliment changer ?')).toBeVisible();
  await shot('05-changer-aliment');

  // Valider : la semaine passe au calendrier
  await page.getByRole('button', { name: 'Valider la semaine' }).click();
  await expect(page.getByText('✓ Semaine validée.')).toBeVisible();
  await shot('06-validee');
  await expect(await problems(page)).toEqual([]);

  // Courses mémorisées : cocher, ajouter une ligne, fermer / rouvrir l'appli
  await page.getByRole('button', { name: 'Mes courses' }).click();
  const box = page.locator('#courses input[type="checkbox"]').first();
  await box.check();
  await page.getByLabel('Ajouter une ligne').fill('Papier alu');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.getByText('Papier alu')).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await shot('06b-courses');
  await page.reload();
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  await page.getByRole('link', { name: /Nutrition/ }).first().click();
  await page.getByRole('button', { name: 'Semaine', exact: true }).click();
  await expect(page.locator('#courses input[type="checkbox"]').first()).toBeChecked();
  await expect(page.getByText('Papier alu')).toBeVisible();

  // Calendrier : repère de repas, fiche de journée avec séance prévue (ou repos) et repas, jour suivant
  await page.getByRole('link', { name: 'Voir au calendrier' }).click();
  await expect(page.getByRole('heading', { name: 'Calendrier' })).toBeVisible();
  await page.locator('.calendar .day.today').click();
  await expect(page.getByRole('group', { name: 'Changer de jour' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible();
  await expect(page.getByText(/Ta cible/).first()).toBeVisible();
  await shot('07-calendrier-jour');
  await page.getByRole('button', { name: 'Fait', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Fait', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Jour suivant' }).click();
  await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await shot('08-jour-suivant');

  // Accueil : repas du jour ; historique
  await page.getByRole('button', { name: 'Accueil', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mes repas du jour' })).toBeVisible();
  await shot('09-accueil', false);
  await page.goto('./#/nutrition/historique');
  await expect(page.getByRole('heading', { name: 'Mon historique de repas' })).toBeVisible();
  await expect(page.getByText(/repas faits sur/)).toBeVisible();
  await page.locator('.hist-row').first().click();
  await expect(page.getByRole('heading', { name: 'Courses de cette semaine' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refaire cette semaine' })).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await shot('11-historique-semaine');
  await expect(await problems(page)).toEqual([]);
  await shot('10-historique');
});
