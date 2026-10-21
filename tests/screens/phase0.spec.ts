import { expect, test, type Page } from '@playwright/test';

// Pour chaque format (SE / Pro Max) et thème (sombre / clair) : capture de chaque écran
// et contrôle des règles d'affichage (section D de CLAUDE.md).

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    const interactive = document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file]), label.check');
    for (const el of interactive) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // masqué
      if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox') continue; // la zone tactile est le label
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.tagName}`);
    }
    // La barre d'onglets doit rester entièrement visible, même sur une page longue.
    const nav = document.querySelector('.tabbar');
    if (nav && nav.getBoundingClientRect().bottom > window.innerHeight + 1) out.push("barre d'onglets hors de l'écran");
    for (const el of document.querySelectorAll<HTMLElement>('input, select, textarea')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`texte de saisie < 16 px : ${el.id || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

async function shot(page: Page, name: string, project: string) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/${name}.png` });
}

test('parcours phase 0', async ({ page }, info) => {
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('muscu.theme', t);
    } catch {
      /* ignoré */
    }
  }, theme);

  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Avant de commencer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Commencer' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Commencer' })).toBeInViewport(); // à portée du pouce sans défiler
  await shot(page, '01-avertissement', info.project.name);

  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();

  await expect(page.getByRole('heading', { name: 'Salut' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Amis' })).toHaveCount(0); // masqué jusqu'à la phase 6
  await shot(page, '02-accueil', info.project.name);

  await page.getByRole('button', { name: 'Calendrier' }).click();
  await shot(page, '03-calendrier', info.project.name);

  await page.getByRole('button', { name: 'Bibliothèque' }).click();
  await shot(page, '04-bibliotheque', info.project.name);

  await page.getByRole('button', { name: 'Profil' }).click();
  await page.getByLabel('Prénom ou surnom').fill('Martin');
  await page.getByLabel('Prénom ou surnom').blur();
  await shot(page, '05-profil', info.project.name);

  await page.getByRole('button', { name: 'Supprimer toutes mes données' }).click();
  await expect(page.getByRole('heading', { name: 'Tout supprimer ?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Annuler' })).toBeFocused();
  await page.screenshot({ path: `screenshots/${info.project.name}/06-confirmation-suppression.png` });
  await page.getByRole('button', { name: 'Annuler' }).click();

  // Le profil est conservé après rechargement (IndexedDB).
  await page.reload();
  await page.getByRole('button', { name: 'Accueil' }).click();
  await expect(page.getByRole('heading', { name: 'Salut Martin' })).toBeVisible();
});

// Playwright ne sait pas simuler le hors-ligne avec un service worker sous WebKit : on vérifie
// que le service worker s'active et que tout ce qu'il faut pour rouvrir l'app est en cache.
// Le vrai test hors-ligne se fait sur l'iPhone (mode avion).
test('hors-ligne : tout le nécessaire est mis en cache', async ({ page }) => {
  await page.goto('./');
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return reg?.active?.state === 'activated';
  }, null, { timeout: 20_000 });

  const readCache = () =>
    page.evaluate(async () => {
      const urls: string[] = [];
      for (const name of await caches.keys()) {
        for (const req of await (await caches.open(name)).keys()) urls.push(new URL(req.url).pathname);
      }
      return urls;
    });
  await expect.poll(async () => (await readCache()).length, { timeout: 15_000 }).toBeGreaterThanOrEqual(8);
  const cached = await readCache();
  const has = (re: RegExp) => cached.some((u) => re.test(u));
  expect(has(/\/index\.html$/)).toBe(true);
  expect(has(/\/assets\/index-.*\.js$/)).toBe(true);
  expect(has(/\/assets\/index-.*\.css$/)).toBe(true);
  expect(has(/manifest\.webmanifest$/)).toBe(true);
  expect(has(/apple-touch-icon\.png$/)).toBe(true);

  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);

  const manifest = await (await page.request.get('./manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.lang).toBe('fr');
});
