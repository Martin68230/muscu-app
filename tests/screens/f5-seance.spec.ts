import { expect, test, type Page } from '@playwright/test';

// F5 partie B : séance de bout en bout (profil créé par l'interface). Captures iPhone SE sombre (375x667) et grand iPhone clair (430x932)
// seulement (quota) + contrôles de la section D de CLAUDE.md : pas de défilement horizontal, cibles >= 44 px, saisie >= 16 px, aucune erreur CSP.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    const interactive = document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])');
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

/** Règle 27 : sans défiler, la saisie complète est visible entre l'en-tête et le bouton du bas (vérifié sur iPhone SE). */
async function expectInputFits(page: Page) {
  const out = await page.evaluate(() => {
    const head = document.querySelector('.player-head')!.getBoundingClientRect();
    const foot = document.querySelector('.player-foot')!.getBoundingClientRect();
    const miss: string[] = [];
    const sels = ['.ex-info h1', '.set-line', '.target-line', '[aria-label="Répétitions"]', '[aria-label="Répétitions en réserve"]', '[aria-label="Charge en kilos"]', '.player-foot .btn-primary'];
    for (const q of sels) {
      const el = document.querySelector(q);
      if (!el) { if (q.includes('Charge')) continue; miss.push('absent ' + q); continue; }
      const r = el.getBoundingClientRect();
      const inFoot = q.includes('player-foot');
      if (r.top < head.bottom - 1 || (!inFoot && r.bottom > foot.top + 1) || r.bottom > window.innerHeight) miss.push(q + ' hors écran');
    }
    for (const el of Array.from(document.querySelectorAll('.player-scroll p'))) {
      if (/^Dernière fois/.test(el.textContent || '')) {
        const r = el.getBoundingClientRect();
        if (r.bottom > foot.top + 1) miss.push('Dernière fois hors écran');
      }
    }
    return miss;
  });
  expect(out).toEqual([]);
}

async function shot(page: Page, name: string, project: string) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/f5-${name}.png` });
}

test('F5 : séance de bout en bout', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  const problems: string[] = [];
  page.on('console', (m) => {
    if (/content security policy|refused to (load|execute|frame|connect)|^CSP /i.test(m.text())) problems.push(m.text());
  });
  page.on('pageerror', (e) => problems.push(`erreur : ${e.message}`));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
    window.addEventListener('securitypolicyviolation', (e) => console.error(`CSP ${e.violatedDirective} ${e.blockedURI}`));
  }, theme);

  // ----- Profil créé par l'interface (avancé, 2 jours, 45 min : la séance contient un superset) -----
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
  await page.getByRole('button', { name: 'Suivant' }).click(); // blessures : aucune
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();

  // ----- Accueil : séance du jour -----
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Séance A')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeInViewport();
  await shot(page, 'accueil-seance', project);

  // ----- Aperçu -----
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('button', { name: 'Commencer la séance' })).toBeVisible();
  await expect(page.getByText('Les exercices')).toBeVisible();
  await shot(page, 'apercu', project);

  // ----- Lecteur : aucune requête réseau de données pendant la séance -----
  const network: string[] = [];
  const onRequest = (r: import('@playwright/test').Request) => {
    const t = r.resourceType();
    if (t === 'fetch' || t === 'xhr' || t === 'websocket' || t === 'eventsource') network.push(`${t} ${r.url()}`);
    if (!r.url().startsWith('http://localhost:4173/') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) network.push(`externe ${r.url()}`);
  };
  page.on('request', onRequest);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Échauffement' })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(0);
  await expect(page.locator('.tabbar')).toHaveCount(0);
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  await expect(page.getByRole('button', { name: 'Série faite' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Série faite' })).toBeInViewport();
  await expect(page.getByRole('button', { name: /signaler un problème/i })).toBeVisible();
  await shot(page, 'lecteur-exercice', project);

  // ----- Repos : grand compte à rebours -----
  await page.getByRole('button', { name: 'Série faite' }).click();
  // une série d'échauffement peut venir avant : on passe les repos jusqu'à voir le grand compte à rebours d'un vrai repos
  await expect(page.getByRole('timer')).toBeVisible();
  const size = await page.locator('.rest-clock').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(72);
  await expect(page.getByText(/ne sonne pas écran verrouillé/)).toBeVisible();
  await shot(page, 'repos', project);
  await page.getByRole('button', { name: '+15 s' }).click();
  await page.getByRole('button', { name: 'Passer le repos' }).click();

  // ----- Saisie complète visible sans défiler (iPhone SE) -----
  const primary = page.locator('.player-foot .btn-primary');
  const reps = page.getByRole('group', { name: 'Répétitions', exact: true });
  for (let i = 0; i < 40 && !(await reps.isVisible()); i++) {
    await primary.click();
    await page.waitForTimeout(350); // pause entre deux observations : la boucle clique à l'aveugle sur le bouton principal ; sur WebKit (Windows) un changement d'écran peut dépasser 150 ms et le clic suivant tombe alors sur l'écran suivant. Aucune lenteur de F6 (série et repos < 1 ms mesurés)
  }
  await expect(reps).toBeVisible();
  if (info.project.name === 'se-sombre') await expectInputFits(page);
  await shot(page, 'lecteur-saisie', project);

  // ----- Superset : on avance (bouton principal du bas) jusqu'à en rencontrer un -----
  let superset = false;
  for (let i = 0; i < 80 && !superset; i++) {
    if ((await page.locator('.superset').isVisible()) && (await reps.isVisible())) superset = true;
    else {
      await primary.click();
      await page.waitForTimeout(350);
    }
  }
  expect(superset).toBe(true);
  await expect(page.getByText(/Superset : .+ puis /)).toBeVisible();
  if (info.project.name === 'se-sombre') await expectInputFits(page);
  await shot(page, 'superset', project);

  // ----- Douleur -----
  await expect(page.getByRole('button', { name: 'Ça fait mal' })).toBeVisible();
  await page.getByRole('button', { name: 'Ça fait mal' }).click();
  await expect(page.getByText(/Arrête, et reviens à la version plus douce/)).toBeVisible();
  await page.getByRole('button', { name: 'Genou' }).click();
  await shot(page, 'douleur', project);
  await page.getByRole('button', { name: 'J’arrête cet exercice' }).click();
  await expect(page.getByText(/Exercice arrêté : pas de progression/)).toBeVisible();
  await page.getByRole('button', { name: 'Continuer la séance' }).click();

  // ----- Symptôme : U1 d'abord, puis reprise avec confirmation -----
  const stepBtn = page.getByRole('button', { name: 'Série faite' });
  await expect(stepBtn).toBeVisible();
  await page.getByRole('button', { name: 'J’ai un symptôme' }).click();
  await expect(page.getByText('Urgence : appelle le 15 (SAMU) ou le 112.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Appeler le 15' })).toHaveAttribute('href', 'tel:15');
  await shot(page, 'symptome', project);
  await page.getByRole('button', { name: 'Revenir à la séance' }).click();
  await page.getByRole('button', { name: 'Oui, je reprends' }).click();
  await expect(stepBtn).toBeVisible();

  // ----- Une série puis rechargement : reprise -----
  await stepBtn.click();
  await page.waitForTimeout(400);
  page.off('request', onRequest); // le rechargement relit les fiches dans le cache de l'appli (démarrage, pas la séance)
  await page.reload();
  await expect(page.getByText('Reprendre ta séance')).toBeVisible({ timeout: 20_000 });
  await shot(page, 'reprise', project);
  await page.getByRole('button', { name: 'Reprendre', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Quitter' })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await primary.click();
    await page.waitForTimeout(350);
  }

  // ----- Fin -----
  await page.getByRole('button', { name: 'Quitter' }).click();
  await page.getByRole('button', { name: 'Terminer la séance' }).click();
  await expect(page.getByRole('heading', { name: /Séance terminée|Première séance faite|Séance écourtée/ })).toBeVisible();
  await shot(page, 'fin', project);
  await page.getByRole('button', { name: 'Retour à l’accueil' }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible();

  expect(network).toEqual([]);
  expect(problems).toEqual([]);
});
