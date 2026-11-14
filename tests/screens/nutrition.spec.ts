import { expect, test, type Page } from '@playwright/test';

// Écran « Nutrition » (phase 7) : entrée en tête de la Bibliothèque, questionnaire de sécurité, besoins, pesée et courbe.
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
      if (t.height < 44) out.push(`zone tactile trop petite (${Math.round(t.width)}x${Math.round(t.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="date"], input[type="search"]')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`saisie sous 16 px : ${el.name || el.placeholder}`);
    }
    return out;
  });
}

test('Nutrition : questionnaire, besoins, pesée et courbe', async ({ page }, info) => {
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
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();

  // Entrée Nutrition en tête de la Bibliothèque
  const entry = page.getByRole('link', { name: /Nutrition/ }).first();
  await expect(entry).toBeVisible();
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-01-bibliotheque.png`, fullPage: false });
  await entry.click();
  await expect(page.getByRole('heading', { name: 'Nutrition' })).toBeVisible();
  await expect(page.getByText(/n’est pas un avis médical/).first()).toBeVisible();

  // Questionnaire : homme, 1992, 178 cm, 80 kg, tout « Non », objectif perte
  await page.getByLabel('Un homme').check();
  await page.getByLabel('Année de naissance').fill('1992');
  await page.getByLabel('Taille (cm)').fill('178');
  await page.getByLabel('Poids actuel (kg)').fill('80');
  for (const q of ['maladie suivie', 'perdre le contrôle', 'traitement médicamenteux']) {
    await page.getByRole('group', { name: new RegExp(q) }).getByLabel('Non', { exact: true }).check();
  }
  await page.getByLabel('Perdre du gras').check();
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-02-questionnaire.png`, fullPage: true });
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

  // Besoins
  await expect(page.getByRole('heading', { name: 'Ma journée moyenne' })).toBeVisible();
  await expect(page.getByText(/kcal/).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ma semaine' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Aujourd’hui/ })).toBeVisible();
  await expect(page.getByText(/Eau : repère général/)).toBeVisible();
  await expect(page.getByText(/Rythme de poids visé/)).toBeVisible();
  await page.getByText('Comment c’est calculé').click();
  await expect(page.getByText(/Cible finale après plancher et plafonds/)).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-03-besoins.png`, fullPage: true });

  // Pesée : 4 semaines de pesées, courbe
  await page.getByRole('button', { name: 'Poids et courbe' }).click();
  const weights: [string, string][] = [['2026-10-12', '81,2'], ['2026-10-19', '80,6'], ['2026-10-26', '80,3'], ['2026-11-02', '79,9']];
  for (const [d, kg] of weights) {
    await page.getByLabel('Date').fill(d);
    await page.getByLabel('Poids (kg)').fill(kg);
    await page.getByRole('group', { name: /j’ai suivi le plan/ }).getByLabel('Oui').check();
    await page.getByRole('button', { name: 'Enregistrer la pesée' }).click();
    await expect(page.getByRole('status').first()).toBeVisible();
  }
  await expect(page.getByRole('img', { name: /Courbe du poids/ })).toBeVisible();
  await expect(page.getByText(/Poids lissé :/)).toBeVisible();
  await page.getByRole('img', { name: /Courbe du poids/ }).screenshot({ path: `screenshots/${info.project.name}/nutrition-04b-courbe.png` });
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-04-poids-courbe.png`, fullPage: true });
});

test('Nutrition : une réponse « oui » donne des repères seulement, sans chiffre', async ({ page }, info) => {
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
  await page.getByRole('group', { name: /maladie suivie/ }).getByLabel('Oui', { exact: true }).check();
  await page.getByRole('group', { name: /perdre le contrôle/ }).getByLabel('Non', { exact: true }).check();
  await page.getByRole('group', { name: /traitement médicamenteux/ }).getByLabel('Non', { exact: true }).check();
  await page.getByLabel('Perdre du gras').check();
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pourquoi je n’affiche pas de chiffres' })).toBeVisible();
  await expect(page.getByText(/Tu as répondu « oui » pour une maladie suivie/)).toBeVisible();
  await expect(page.getByText(/À voir avec un professionnel/)).toBeVisible();
  await expect(page.getByText(/kcal/)).toHaveCount(0);
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-05-reperes.png`, fullPage: true });
});

test('Nutrition : une donnée manquante est nommée, on la complète et les chiffres apparaissent', async ({ page }, info) => {
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Bibliothèque', exact: true }).click();
  await page.getByRole('link', { name: /Nutrition/ }).first().click();
  // Sexe « ne pas préciser » : l'app ne peut pas calculer et le dit.
  await page.getByLabel('Je préfère ne pas préciser').check();
  await page.getByLabel('Année de naissance').fill('1992');
  await page.getByLabel('Taille (cm)').fill('178');
  await page.getByLabel('Poids actuel (kg)').fill('80');
  for (const q of ['maladie suivie', 'perdre le contrôle', 'traitement médicamenteux']) {
    await page.getByRole('group', { name: new RegExp(q) }).getByLabel('Non', { exact: true }).check();
  }
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pourquoi je n’affiche pas de chiffres' })).toBeVisible();
  await expect(page.getByText(/Le sexe n’est pas indiqué/)).toBeVisible();
  await expect(page.getByText(/À compléter/).first()).toBeVisible();
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-06-raisons.png`, fullPage: true });
  // On complète : les chiffres apparaissent.
  await page.getByRole('button', { name: 'Compléter mes informations' }).click();
  await page.getByLabel('Un homme').check();
  for (const q of ['maladie suivie', 'perdre le contrôle', 'traitement médicamenteux']) {
    await page.getByRole('group', { name: new RegExp(q) }).getByLabel('Non', { exact: true }).check();
  }
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ma journée moyenne' })).toBeVisible();
  await expect(page.getByText(/kcal/).first()).toBeVisible();
});

test('Nutrition : semaine de repas, repas optionnels, lot, courses cochables et allergie', async ({ page }, info) => {
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
  await expect(page.getByRole('heading', { name: 'Ma journée moyenne' })).toBeVisible();

  await page.getByRole('button', { name: 'Semaine', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ma semaine de repas' })).toBeVisible();
  // Réglages : goûter et un en-cas par jour
  await page.getByText('Repas, allergies et préférences').click();
  for (const d of ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']) {
    await page.getByRole('group', { name: 'Jours du goûter' }).getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('group', { name: 'En-cas par jour' }).getByRole('button', { name: new RegExp(`^${d} : 0 en-cas`) }).click();
  }
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-07-reglages-repas.png`, fullPage: true });
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByRole('heading', { name: 'Mes 7 jours' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mes courses de la semaine' })).toBeVisible();
  await expect(page.getByText(/Vérifie toujours les étiquettes/).first()).toBeVisible();
  // Courses cochables
  const first = page.locator('.nut-shop input[type="checkbox"]').first();
  await first.check();
  await expect(first).toBeChecked();
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-08-semaine.png`, fullPage: true });

  // Allergie au lait : plus aucune recette avec du lait dans la semaine
  await page.getByRole('group', { name: 'Allergènes à exclure' }).getByRole('button', { name: 'Lait', exact: true }).click();
  await page.getByRole('button', { name: 'Régénérer ma semaine' }).click();
  await expect(page.getByRole('heading', { name: 'Mes 7 jours' })).toBeVisible();
  const allergenLines = await page.locator('.nut-meals p').allInnerTexts();
  for (const l of allergenLines) if (l.startsWith('Allergènes')) expect(l).not.toMatch(/Lait/);
  await expect(await problems(page)).toEqual([]);
  await page.screenshot({ path: `screenshots/${info.project.name}/nutrition-09-semaine-sans-lait.png`, fullPage: true });
});
