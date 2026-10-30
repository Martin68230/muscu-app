import { expect, test, type Page } from '@playwright/test';

// D30 / D31 : option « Ajouter une séance de cardio ? », profil (« j'ai accès à une salle », « je peux sortir dehors »), aperçu d'une
// séance de cardio dédiée (dehors : T9 + alternative intérieure), sauts (T8, version douce du débutant), lecteur du jour léger.
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
  await page.screenshot({ path: `screenshots/${project}/d30-${name}.png`, fullPage });
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

/** Accès direct à la base locale (IndexedDB) depuis la page (sans évaluation de texte : la CSP de l'app l'interdit). */
type Op = 'seedCardio' | 'sport' | 'soft';
async function db(page: Page, op: Op): Promise<void> {
  await page.evaluate(async (op) => {
    const d: IDBDatabase = await new Promise((res, rej) => {
      const r = indexedDB.open('muscu-app');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const all = (store: string): Promise<any[]> =>
      new Promise((res) => {
        const r = d.transaction(store).objectStore(store).getAll();
        r.onsuccess = () => res(r.result);
      });
    const put = (store: string, row: unknown): Promise<void> =>
      new Promise((res) => {
        const tx = d.transaction(store, 'readwrite');
        tx.objectStore(store).put(row);
        tx.oncomplete = () => res();
      });
    const now = new Date().toISOString();
    if (op === 'sport') {
      // Objectif « sport » (volley) : pas encore dans le parcours ; écrit dans la base comme le ferait un futur écran.
      for (const g of await all('goals')) await put('goals', { ...g, goalKey: g.rank === 1 ? 'sport' : g.goalKey, updatedAt: now });
      const pr = (await all('profile'))[0];
      await put('profile', { ...pr, sports: ['volley'], updatedAt: now });
      return;
    }
    if (op === 'soft') {
      for (const s of await all('sessions')) if (s.status === 'en_cours') await put('sessions', { ...s, deletedAt: now });
      const p = (await all('programs')).find((x) => x.active);
      for (const day of p.days) day.exercises = day.exercises.map((e: any) => (e.jump ? { ...e, variantId: e.jump.softVariantId ?? e.variantId, jump: { ...e.jump, soft: true, contacts: 0 } } : e));
      await put('programs', p);
      return;
    }
    const p = (await all('programs')).find((x) => x.active);
    const k = p.days.findIndex((day: any) => day.exercises.length && day.exercises.every((e: any) => e.role === 'cardio'));
    if (k < 0) throw new Error('aucune séance de cardio');
    const done = (k - 1 + p.days.length) % p.days.length;
    const base = { ownerId: 'local', createdAt: '2026-10-29T09:00:00.000Z', updatedAt: '2026-10-29T09:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null };
    await put('sessions', { ...base, id: `seed-cardio-${Date.now()}`, programId: p.id, programDayIndex: done, plannedDate: '2026-10-29', status: 'faite',
      startedAt: '2026-10-29T09:00:00.000Z', endedAt: '2026-10-29T10:00:00.000Z', note: '', decidedAt: null });
  }, op);
}

/** Séance faite juste avant le jour de cardio : la séance suivante (rotation) est la séance de cardio. */
async function goToCardioDay(page: Page) {
  // L'accueil régénère d'abord le programme si un réglage a changé ; la séance faite est écrite ensuite, sur le programme actif.
  await page.goto('./#/accueil');
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await db(page, 'seedCardio');
  await page.goto('./#/seance');
  await expect(page.getByRole('heading', { name: /^Cardio/ })).toBeVisible({ timeout: 20_000 });
}

const projects = ['se-sombre', 'max-clair'];

test('D30 : option « Ajouter une séance de cardio ? », profil, aperçu de la séance dédiée dehors', async ({ page }, info) => {
  test.skip(!projects.includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await setup(page, project);
  await wizard(page, { days: '3', level: /Intermédiaire/ });
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  const sw = page.getByRole('switch', { name: 'Ajouter une séance de cardio ?' });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await shot(page, 'apercu-option-cardio', project);
  await sw.click();
  await expect(sw).toHaveAttribute('aria-checked', 'true', { timeout: 20_000 });

  await page.goto('./#/profil');
  await expect(page.getByRole('heading', { name: 'Mes séances' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('switch', { name: /Je peux marcher ou courir dehors/ }).click();
  await expect(page.getByRole('switch', { name: /Je peux marcher ou courir dehors/ })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('switch', { name: 'J’ai accès à une salle' })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('switch', { name: /Je peux marcher ou courir dehors/ }).scrollIntoViewIfNeeded();
  await shot(page, 'profil-reglages', project);

  await goToCardioDay(page);
  await expect(page.getByText('Pas envie ou pas possible de sortir ?')).toBeVisible();
  await expect(page.getByText(/Garde le son bas/)).toBeVisible();
  await shot(page, 'apercu-cardio-dehors', project);
  await page.getByText('Pas envie ou pas possible de sortir ?').scrollIntoViewIfNeeded();
  await shot(page, 'apercu-cardio-dehors-alternative', project);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await expect(page.getByText(/arrête-toi pour regarder l’écran/)).toBeVisible({ timeout: 20_000 });
  await shot(page, 'lecteur-cardio-dehors', project);
  expect(errors).toEqual([]);
});

test('D30 : séance de sport avec sauts (T8) et version sans saut du débutant', async ({ page }, info) => {
  test.skip(!projects.includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await setup(page, project);
  await wizard(page, { days: '2', level: /Intermédiaire/ });
  await db(page, 'sport');

  await page.reload();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await goToCardioDay(page);
  await expect(page.getByText(/Les sauts demandent plus aux genoux/)).toBeVisible();
  await shot(page, 'apercu-sauts-t8', project);
  await page.getByRole('heading', { name: 'Les exercices' }).scrollIntoViewIfNeeded();
  await shot(page, 'apercu-sauts-liste', project);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  await expect(page.getByText('Tes jambes sont-elles lourdes ou courbaturées ?')).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Oui', exact: true }).click();
  await expect(page.getByText('Fais la version sans saut aujourd’hui.')).toBeVisible();
  await shot(page, 'lecteur-sauts-jambes-lourdes', project);

  // Débutant : version sans saut prévue (même séance, variantes douces) ; T8 affiché avant.
  await page.goto('./');
  await db(page, 'soft');

  await goToCardioDay(page);
  await expect(page.getByText('Version sans saut d’abord : c’est la version prévue pour toi.').first()).toBeVisible();
  await page.getByText('Version sans saut d’abord : c’est la version prévue pour toi.').first().scrollIntoViewIfNeeded();
  await shot(page, 'apercu-sauts-t8-debutant', project);
  expect(errors).toEqual([]);
});

test('D30 : lecteur du jour léger (aujourd\'hui, facultatif)', async ({ page }, info) => {
  test.skip(!projects.includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(180_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await setup(page, project, '2026-11-04T09:00:00'); // mercredi : jour léger d'un débutant à 6 jours (force lundi, mardi, jeudi, vendredi)
  await wizard(page, { days: '6', level: /Débutant/ });
  await expect(page.getByRole('heading', { name: 'Jour léger (facultatif)' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Jour léger (facultatif)' }).scrollIntoViewIfNeeded();
  await shot(page, 'accueil-jour-leger', project);
  await page.getByRole('button', { name: 'Commencer la marche' }).click();
  await expect(page.getByRole('timer')).toHaveText('10:00');
  await shot(page, 'jour-leger-minuteur', project);
  expect(errors).toEqual([]);
});
