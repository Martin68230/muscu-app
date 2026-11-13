import { expect, test, type Page } from '@playwright/test';

// « Mon sport » : déclaration (Profil) et « Noter une séance de sport ». Captures réelles WebKit : iPhone SE sombre (375x667) et grand iPhone clair (430x932).
// Contrôles des règles 25 à 31 : pas de défilement horizontal, zones tactiles >= 44 px, saisie >= 16 px.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file]):not([type=checkbox]), label.check-row')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('input:not([type=checkbox]), select, textarea')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`texte de saisie < 16 px : ${el.id || el.tagName}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('.card, .notice')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 1) out.push(`déborde à droite : ${el.className}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}
async function shot(page: Page, name: string, project: string, fullPage = true) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/mon-sport-${name}.png`, fullPage });
}

const projects = ['se-sombre', 'max-clair'];

test('Mon sport : déclarer ses sports, noter une séance, messages', async ({ page }, info) => {
  test.skip(!projects.includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(200_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const requests: string[] = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost:4173') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) requests.push(r.url()); });
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  await page.clock.setFixedTime(new Date('2026-11-12T12:00:00'));
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();

  // Accueil : le bouton existe
  await expect(page.getByRole('button', { name: 'Noter une séance de sport' })).toBeVisible();

  // Profil > Mon sport
  await page.getByRole('link', { name: /Profil/ }).or(page.getByRole('button', { name: /Profil/ })).first().click();
  await page.getByRole('button', { name: 'Déclarer mon sport' }).click();
  await page.getByRole('button', { name: 'Volley', exact: true }).click();
  await page.getByRole('button', { name: 'Autre sport' }).click();
  await page.getByRole('button', { name: '2', exact: true }).first().click();
  await page.getByRole('button', { name: 'mardi' }).first().click();
  await page.getByRole('button', { name: 'jeudi' }).first().click();
  await page.getByLabel(/Nom de ton sport/).fill('Escalade');
  await shot(page, 'declarer', project);
  await page.getByRole('button', { name: 'Terminé' }).click();
  await expect(page.getByText(/Volley · 2 par semaine · mardi, jeudi/)).toBeVisible();
  await shot(page, 'profil', project, false);

  // Noter une séance
  await page.getByRole('button', { name: 'Noter une séance de sport' }).click();
  await expect(page.getByRole('heading', { name: 'Noter une séance de sport' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enregistrer cette séance' })).toBeDisabled();
  await shot(page, 'noter', project);
  await page.getByRole('button', { name: 'Soutenue', exact: true }).click();
  await page.getByRole('button', { name: 'Jambes lourdes' }).click();
  await page.getByRole('button', { name: 'Une gêne ou une douleur' }).click();
  await page.getByRole('button', { name: 'Genou' }).click();
  await shot(page, 'noter-gene', project);
  await page.getByRole('button', { name: 'Enregistrer cette séance' }).click();
  await expect(page.getByText('Séance de sport enregistrée.')).toBeVisible();
  await shot(page, 'enregistree', project, false);
  await page.getByRole('button', { name: 'Retour' }).click();

  // Calendrier : section « Sport »
  await page.getByRole('link', { name: /Calendrier/ }).or(page.getByRole('button', { name: /Calendrier/ })).first().click();
  await expect(page.getByRole('region', { name: 'Sport' })).toBeVisible();
  await shot(page, 'calendrier', project);

  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
});
