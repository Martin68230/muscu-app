import { expect, test, type Page } from '@playwright/test';

// D28 « Créer une séance » : choix, résultat, ajout au calendrier, préparation depuis le calendrier, lancement dans le lecteur.
// Captures réelles WebKit : iPhone SE sombre (375x667) et grand iPhone clair (430x932) ; contrôles des règles 25 à 31.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox') continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('input, select, textarea')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`texte de saisie < 16 px : ${el.id || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('.switch-label, .notice p, .light-day p, .jump-notes p')) {
      if (el.offsetParent && parseFloat(getComputedStyle(el).fontSize) < 14) out.push(`texte trop petit : ${el.textContent?.slice(0, 30)}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('.notice, .card, .gain')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 1) out.push(`déborde à droite : ${el.className}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}
async function shot(page: Page, name: string, project: string, fullPage = false) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/d28-${name}.png`, fullPage });
}

async function setup(page: Page, project: string, date = '2026-11-02T09:00:00') {
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  await page.clock.setFixedTime(new Date(date));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Créer mon programme' }).click();
}

async function wizard(page: Page, o: { days: string; level: RegExp }) {
  await page.getByRole('button', { name: o.days, exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // jours impossibles : aucun
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /À la maison/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByLabel('Élastique (bande longue ou à poignées)').check();
  await page.getByLabel('Banc plat').check();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: o.level }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Prise de muscle/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // blessures : aucune
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
}

const projects = ['se-sombre', 'max-clair'];

test('D28 : Créer une séance (choix, résultat, calendrier, lecteur)', async ({ page }, info) => {
  test.skip(!projects.includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(270_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const requests: string[] = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost:4173') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) requests.push(r.url()); });
  await setup(page, project);
  await wizard(page, { days: '3', level: /Intermédiaire/ });

  // Choix
  await page.getByRole('button', { name: 'Créer une séance' }).click();
  await expect(page.getByRole('heading', { name: 'Créer une séance' })).toBeVisible();
  await expect(page.getByText('Ta chaise est-elle stable et calée contre un mur ?')).toBeVisible();
  await shot(page, 'choix', project);
  await page.getByRole('button', { name: 'Tronc', exact: true }).click();
  await page.getByRole('button', { name: '20 min' }).click();
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Ta séance' })).toBeVisible();
  await shot(page, 'resultat-tronc', project, true);

  // Ajouter au calendrier : un jour à venir
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await page.locator('#create-day').selectOption({ index: 3 });
  await shot(page, 'choix-jour', project);
  await page.getByRole('button', { name: 'Ajouter ce jour' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'séance ajoutée au calendrier' })).toBeVisible();
  await shot(page, 'ajoutee', project);

  await page.goto('./#/calendrier');
  await page.getByRole('button', { name: /^jeudi 5 novembre/ }).click();
  await expect(page.getByRole('button', { name: 'Préparer cette séance' })).toBeVisible();
  await shot(page, 'calendrier-jour', project);
  await page.getByRole('button', { name: 'Préparer cette séance' }).click();
  await expect(page.getByRole('heading', { name: 'Créer une séance' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tronc', exact: true })).toHaveAttribute('aria-pressed', 'true');

  // Corps entier + volley : sauts, puis lecteur
  await page.getByRole('button', { name: 'Corps entier' }).click();
  await page.getByRole('button', { name: 'Volley' }).click();
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Oui', exact: true }).click();
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Ta séance' })).toBeVisible();
  await page.getByText(/^Précautions \(/).first().click().catch(() => undefined);
  await shot(page, 'resultat-sauts', project, true);
  await page.getByRole('button', { name: 'Faire maintenant' }).click();
  await expect(page.getByRole('button', { name: 'Échauffement fait' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  await expect(page.getByRole('button', { name: 'Série faite' }).or(page.getByText('Tes jambes sont-elles lourdes ou courbaturées ?')).first()).toBeVisible({ timeout: 20_000 });
  await shot(page, 'lecteur', project);
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
});
