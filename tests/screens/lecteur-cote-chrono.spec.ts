import { expect, test, type Page } from '@playwright/test';

// Lecteur de séance : exercice d'un seul côté (« de chaque côté »), chronomètre d'un exercice en durée, réserve obligatoire à chaque série,
// reprise du chrono après un rechargement. Captures iPhone SE sombre (375x667) et grand iPhone clair (430x932) seulement.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label')}`);
    }
    for (const el of document.querySelectorAll<HTMLElement>('input, select, textarea')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push(`texte de saisie < 16 px : ${el.id || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

/** Tout ce qui sert à valider la série doit se voir sans défiler : de l'en-tête au bouton du bas. */
async function expectFits(page: Page, sels: string[]) {
  const miss = await page.evaluate((list) => {
    const head = document.querySelector('.player-head')!.getBoundingClientRect();
    const foot = document.querySelector('.player-foot')!.getBoundingClientRect();
    const out: string[] = [];
    for (const q of list) {
      const el = document.querySelector(q);
      if (!el) { out.push('absent ' + q); continue; }
      const r = el.getBoundingClientRect();
      const inFoot = q.startsWith('.player-foot');
      if (r.top < head.bottom - 1 || (!inFoot && r.bottom > foot.top + 1) || r.bottom > window.innerHeight) out.push(q + ' hors écran');
    }
    return out;
  }, sels);
  expect(miss).toEqual([]);
}

async function shot(page: Page, name: string, project: string) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/lecteur-${name}.png` });
}

/** Jour de séance fabriqué : pompe à un bras (un côté à la fois) puis planche latérale (durée, un côté à la fois). */
async function seedDay(page: Page) {
  await page.evaluate(async () => {
    const db: IDBDatabase = await new Promise((res, rej) => {
      const q = indexedDB.open('muscu-app');
      q.onsuccess = () => res(q.result);
      q.onerror = () => rej(q.error);
    });
    const getAll = (store: string): Promise<any[]> => new Promise((res) => {
      const g = db.transaction(store).objectStore(store).getAll();
      g.onsuccess = () => res(g.result);
    });
    const prog = (await getAll('programs')).find((p) => p.active);
    const base = { supersetGroup: null, rirTarget: 2, warmupSets: [], capped: false, adaptation: null, substitut: false, startLoadKg: null, holdSec: null };
    const exercises = [
      { ...base, movementId: 'pompe-un-bras', variantId: 'pompe-un-bras-chaise', sets: 2, repsMin: 5, repsMax: 8, restSec: 60, unit: 'reps', role: 'autre', slot: 'poussee_1', perSide: true },
      { ...base, movementId: 'planche-laterale', variantId: 'planche-laterale-genoux', sets: 2, repsMin: 0, repsMax: 0, restSec: 60, unit: 'sec', holdSec: 20, role: 'tronc', slot: 'tronc', perSide: true, rirTarget: 3 },
    ];
    prog.days = prog.days.map((d: any) => ({ ...d, exercises }));
    await new Promise<void>((res, rej) => {
      const tx = db.transaction('programs', 'readwrite');
      tx.objectStore('programs').put(prog);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
}

test('Lecteur : de chaque côté, chronomètre, réserve obligatoire, reprise du chrono', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(`erreur : ${e.message}`));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);

  // ----- Profil créé par l'interface, puis jour de séance fabriqué -----
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
  await page.getByRole('button', { name: /Intermédiaire/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Prise de muscle/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await seedDay(page);
  await page.reload();
  await page.getByRole('button', { name: 'Voir la séance' }).click({ timeout: 20_000 });
  await expect(page.getByText(/de chaque côté/).first()).toBeVisible();
  await shot(page, 'cote-apercu', project);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  const warm = page.getByRole('button', { name: 'Échauffement fait' });
  await warm.waitFor({ timeout: 10_000 });
  await warm.click();

  // ----- Pompe à un bras : côté gauche, consigne claire -----
  await expect(page.locator('.set-line')).toContainText('Série 1 sur 2 · côté gauche');
  await expect(page.locator('.side-rule')).toContainText('Une série = les deux côtés');
  await expect(page.locator('.target-line')).toContainText('5-8 répétitions de chaque côté');
  await expectFits(page, ['.set-line', '.side-rule', '.target-line', '[aria-label="Répétitions"]', '[aria-label="Répétitions en réserve"]', '.player-foot .btn-primary']);
  await shot(page, 'cote-gauche', project);

  // ----- Réserve obligatoire : « Série faite » sans réponse est refusée -----
  await page.getByRole('button', { name: 'Série faite' }).click();
  await expect(page.getByRole('alert')).toContainText('Choisis combien de répétitions te restaient');
  await expect(page.locator('.set-line')).toContainText('côté gauche');
  await shot(page, 'reserve-manquante', project);
  await page.getByRole('group', { name: 'Répétitions en réserve' }).getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Série faite' }).click();

  // ----- Côté droit tout de suite (pas de repos entre les deux côtés) -----
  await expect(page.locator('.set-line')).toContainText('Série 1 sur 2 · côté droit');
  await shot(page, 'cote-droit', project);
  await page.getByRole('group', { name: 'Répétitions en réserve' }).getByRole('button', { name: '1', exact: true }).click();
  await page.getByRole('button', { name: 'Série faite' }).click();
  await expect(page.getByRole('timer')).toBeVisible(); // repos après le 2e côté
  await page.getByRole('button', { name: 'Passer le repos' }).click();

  // ----- Série 2 : deux côtés encore, puis la planche -----
  for (let side = 0; side < 2; side++) {
    await page.getByRole('group', { name: 'Répétitions en réserve' }).getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: 'Série faite' }).click();
  }
  await page.getByRole('button', { name: 'Passer le repos' }).click();

  // ----- Planche latérale : chronomètre -----
  await expect(page.getByRole('heading', { name: /Planche latérale/i })).toBeVisible();
  await expect(page.locator('.target-line')).toContainText('20 s de chaque côté');
  await expect(page.getByRole('button', { name: /Démarrer le chronomètre \(20 s\)/ })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Temps de tenue en plus' })).toHaveCount(0); // la réserve vient après la tenue
  await shot(page, 'chrono-pret', project);
  await page.getByRole('button', { name: /Démarrer le chronomètre/ }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  await page.waitForTimeout(1500);
  await shot(page, 'chrono-en-cours', project);

  // ----- Rechargement en pleine tenue : le chrono continue sur l'heure réelle -----
  await page.reload();
  await expect(page.getByText('Reprendre ta séance')).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Reprendre', exact: true }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(page.locator('.set-line')).toContainText('côté gauche');
  const left = await page.getByRole('timer').textContent();
  expect(left).toMatch(/^0:(0\d|1\d|20)$/);
  await page.getByRole('button', { name: 'Arrêter le chronomètre' }).click();
  await expect(page.getByText(/Tenu : \d+ s/)).toBeVisible();
  await expect(page.getByRole('group', { name: 'Temps de tenue en plus' })).toBeVisible();
  await expectFits(page, ['.hold-card', '[aria-label="Temps de tenue en plus"]', '.player-foot .btn-primary']);
  await shot(page, 'chrono-reserve', project);
  await page.getByRole('button', { name: 'Série faite' }).click();
  await expect(page.getByRole('alert')).toContainText('Choisis combien de temps');
  await page.getByRole('group', { name: 'Temps de tenue en plus' }).getByRole('button', { name: '5 s', exact: true }).click();
  await page.getByRole('button', { name: 'Série faite' }).click();
  await expect(page.locator('.set-line')).toContainText('côté droit');

  expect(problems).toEqual([]);
});
