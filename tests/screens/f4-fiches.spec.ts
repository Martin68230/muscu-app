import { expect, test, type Page } from '@playwright/test';

// F4 : Bibliothèque et fiche d'exercice. Captures 375x667 (sombre) et 430x932 (clair) + contrôles de la section D de CLAUDE.md
// (pas de défilement horizontal, cibles >= 44 px, saisie >= 16 px) + aucune erreur de politique de sécurité (CSP) en console.

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

/** La zone qui défile est .screen (pas la page) : la capture « complète » agrandit donc la fenêtre le temps de la prise. */
const WANTED = new Set(['01-bibliotheque', '07-fiche-cou-urgence', '08-fiche-grossesse']);
async function shot(page: Page, name: string, project: string, full = false) {
  await checkPhoneRules(page);
  if (!WANTED.has(name)) return; // quota : seulement les écrans demandés sont capturés
  const path = `screenshots/${project}/f4-${name}.png`;
  if (!full) {
    await page.screenshot({ path });
    return;
  }
  const size = page.viewportSize()!;
  const h = await page.evaluate(() => {
    const s = document.querySelector('.screen') as HTMLElement;
    return s.scrollHeight + (document.querySelector('.tabbar') as HTMLElement).offsetHeight;
  });
  await page.setViewportSize({ width: size.width, height: Math.min(h + 8, 2600) });
  await page.screenshot({ path });
  await page.setViewportSize(size);
}

/** Écrit directement dans IndexedDB (matériel, blessures) : le profil de test, sans passer par les cartes. */
async function seed(page: Page, o: { tags?: string[]; injuries?: { zone: string; level: number }[]; pregnancy?: string }) {
  await page.evaluate(async ({ tags, injuries, pregnancy }) => {
    const db: IDBDatabase = await new Promise((res, rej) => {
      const q = indexedDB.open('muscu-app');
      q.onsuccess = () => res(q.result);
      q.onerror = () => rej(q.error);
    });
    const eq: any[] = await new Promise((res) => {
      const g = db.transaction('equipment').objectStore('equipment').getAll();
      g.onsuccess = () => res(g.result);
    });
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['equipment', 'injuries', 'profile'], 'readwrite');
      if (pregnancy) {
        const g = tx.objectStore('profile').getAll();
        g.onsuccess = () => g.result[0] && tx.objectStore('profile').put({ ...g.result[0], pregnancy });
      }
      if (tags && eq[0]) tx.objectStore('equipment').put({ ...eq[0], tags, preset: 'perso' });
      const owner = eq[0]?.ownerId ?? 'local';
      (injuries ?? []).forEach((inj, i) => {
        tx.objectStore('injuries').put({
          id: `test-inj-${i}`, ownerId: owner, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), rev: 1,
          deletedAt: null, syncedAt: null, zone: inj.zone, side: null, level: inj.level, note: '', active: true,
        });
      });
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  }, o);
}

test('F4 : bibliothèque et fiches', async ({ page }, info) => {
  test.setTimeout(180_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  const csp: string[] = [];
  page.on('console', (m) => {
    if (/content security policy|refused to (load|execute|frame|connect)|^CSP /i.test(m.text())) csp.push(m.text());
  });
  page.on('pageerror', (e) => csp.push(`erreur : ${e.message}`));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
    window.addEventListener('securitypolicyviolation', (e) => console.error(`CSP ${e.violatedDirective} ${e.blockedURI}`));
  }, theme);

  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await expect(page.getByRole('button', { name: 'Créer mon programme' })).toBeVisible();

  // Politique de sécurité : présente dans la page de production
  const meta = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(meta).toContain("script-src 'self'");
  expect(meta).toContain('frame-src https://www.youtube-nocookie.com');

  // Bibliothèque
  await page.getByRole('button', { name: 'Bibliothèque' }).click();
  await expect(page.locator('.lib-row').first()).toBeVisible();
  await expect(page.getByText(/\d+ exercices/)).toBeVisible();
  await shot(page, '01-bibliotheque', project);

  // Recherche sans accent, ouverture d'une fiche, retour avec la recherche conservée
  await page.getByLabel('Chercher un exercice').fill('pallof');
  await expect(page.locator('.lib-row')).toHaveCount(1);
  await page.locator('.lib-row').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Retour à la bibliothèque' }).click();
  await expect(page.getByLabel('Chercher un exercice')).toHaveValue('pallof');
  await page.getByLabel('Chercher un exercice').fill('');

  // Sans élastique : aucune variante compatible
  await page.goto('./#/fiche/pallof-elastique');
  await expect(page.getByText('Il te manque du matériel pour cet exercice.')).toBeVisible();
  await shot(page, '02-fiche-sans-variante', project, true);

  // Avec un élastique, une gêne au genou (niveau 2) et à l'épaule (niveau 1) : photos, légende, vidéo, lignes blessure
  await seed(page, { tags: ['elastique'], injuries: [{ zone: 'genou', level: 2 }, { zone: 'epaule', level: 1 }] });
  await page.reload();
  await expect(page.getByText('Il te manque du matériel pour cet exercice.')).toHaveCount(0);
  await expect(page.getByText(/À genoux — Élastique ancré/)).toBeVisible();
  await expect(page.getByText(/À cause de ta gêne au genou \(niveau 2\)/)).toBeVisible();
  await expect(page.locator('.fiche-img')).toHaveCount(2);
  await expect(page.getByText("À la poulie ou à l'élastique : même placement.")).toBeVisible();
  await shot(page, '03-fiche-photos-legende-blessure', project);
  await shot(page, '04-fiche-complete', project, true);
  await page.getByRole('button', { name: /Voir une vidéo/ }).click();
  await expect(page.locator('iframe.video-frame')).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
  expect(await page.locator('iframe.video-frame').getAttribute('src')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);

  // Illustration seule
  await page.goto('./#/fiche/abduction-couchee-cote');
  await expect(page.locator('.fiche-img')).toHaveCount(1);
  await shot(page, '05-fiche-illustration', project);

  // Variante non compatible (haltères) marquée « Il te manque »
  await page.goto('./#/fiche/fente-avant');
  await expect(page.getByText(/Il te manque : des haltères/).first()).toBeVisible();
  await shot(page, '06-fiche-variante-manque', project, true);

  // Fiche du cou : signes d'urgence (15 / 112) visibles
  await page.goto('./#/fiche/isometrique-cou');
  await expect(page.getByText(/Urgence, appelle le 15 ou le 112/)).toBeVisible();
  await page.getByText(/Urgence, appelle le 15 ou le 112/).scrollIntoViewIfNeeded();
  await shot(page, '07-fiche-cou-urgence', project);

  // Grossesse cochée
  await seed(page, { pregnancy: 'enceinte' });
  await page.reload();
  await page.goto('./#/fiche/pallof-elastique');
  await expect(page.getByText(/Pendant ta grossesse/)).toBeVisible();
  await page.getByText(/Pendant ta grossesse/).scrollIntoViewIfNeeded();
  await shot(page, '08-fiche-grossesse', project);

  // Fiche inconnue
  await page.goto('./#/fiche/nexiste-pas');
  await expect(page.getByText('Cette fiche n’existe pas.')).toBeVisible();

  expect(csp).toEqual([]);
});
