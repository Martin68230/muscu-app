import { expect, test, type Page } from '@playwright/test';

// F1 : profil en cartes. Captures de chaque carte (375x667 et 430x932, sombre et clair) et contrôles de la
// section D de CLAUDE.md : pas de défilement horizontal, cibles >= 44 px, saisie >= 16 px.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    const interactive = document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file]), label.check');
    for (const el of interactive) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox') continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('input, select, textarea')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`texte de saisie < 16 px : ${el.id || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

async function shot(page: Page, name: string, project: string) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/f1-${name}.png` });
}

test('F1 : parcours du profil, carte par carte', async ({ page }, info) => {
  test.setTimeout(120_000); // WebKit sous Windows est lent : une quinzaine de captures
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
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

  // Accueil : profil incomplet -> « Créer mon programme » à portée du pouce
  await expect(page.getByRole('button', { name: 'Créer mon programme' })).toBeInViewport();
  await shot(page, '00-accueil', project);
  await page.getByRole('button', { name: 'Créer mon programme' }).click();

  // 1. jours par semaine (le bouton Suivant reste désactivé tant qu'on n'a rien choisi)
  await expect(page.getByRole('heading', { name: 'Combien de jours par semaine ?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Suivant' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Suivant' })).toBeInViewport();
  await shot(page, '01-jours', project);
  await page.getByRole('button', { name: '5', exact: true }).click();
  await expect(page.getByText(/prochaine version/)).toBeVisible();
  await shot(page, '01b-jours-hors-v1', project);
  await page.getByRole('button', { name: '3', exact: true }).click();
  await expect(page.getByText(/prochaine version/)).toHaveCount(0);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 2. jours bloqués
  await expect(page.getByRole('heading', { name: 'Des jours impossibles ?' })).toBeVisible();
  await page.getByRole('button', { name: 'dimanche' }).click();
  await shot(page, '02-jours-bloques', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 3. durée
  await expect(page.getByRole('heading', { name: 'Combien de temps par séance ?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Suivant' })).toBeDisabled();
  await page.getByRole('button', { name: '45 min' }).click();
  await shot(page, '03-duree', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 4. lieu
  await page.getByRole('button', { name: /À la maison/ }).click();
  await shot(page, '04-lieu', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 5. matériel (écran existant)
  await expect(page.getByRole('heading', { name: 'Ton matériel' })).toBeVisible();
  await page.getByLabel('Banc plat').check();
  await shot(page, '05-materiel', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 6. niveau
  await page.getByRole('button', { name: /Débutant/ }).click();
  await shot(page, '06-niveau', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 7. objectif
  await page.getByRole('button', { name: /Santé et forme/ }).click();
  await shot(page, '07-objectif', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 8. blessures (écran existant, facultatif)
  await expect(page.getByRole('heading', { name: 'Une gêne ou une blessure ?' })).toBeVisible();
  await page.getByRole('button', { name: 'Aine' }).click();
  await shot(page, '08-blessures', project);
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 9. grossesse (facultatif) ; retour en arrière facile
  await expect(page.getByRole('heading', { name: 'Grossesse ou post-partum ?' })).toBeVisible();
  await shot(page, '09-grossesse', project);
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(page.getByRole('heading', { name: 'Une gêne ou une blessure ?' })).toBeVisible();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();

  // fin
  await expect(page.getByRole('heading', { name: 'Ton profil est prêt' })).toBeVisible();
  await shot(page, '10-fin', project);
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Modifier mon profil' })).toBeVisible();
  await shot(page, '11-accueil-profil-pret', project);

  // Tout est conservé après rechargement et modifiable depuis Profil
  await page.reload();
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await expect(page.getByRole('button', { name: /Jours par semaine\s*3/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Lieu\s*À la maison/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Objectif\s*Santé et forme/ })).toBeVisible();
  await shot(page, '12-profil-resume', project);
  await page.getByRole('button', { name: /Niveau/ }).click();
  await page.getByRole('button', { name: /Avancé/ }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  await expect(page.getByRole('button', { name: /Niveau\s*Avancé/ })).toBeVisible();
});
