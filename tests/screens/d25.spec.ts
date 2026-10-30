import { expect, test, type Page } from '@playwright/test';

// D25 : haut / bas à 4 jours, option « Gagner du temps » (core-et-supersets.md §12), SUP-10, profil (choix des jours, réglage conservé).
// Captures réelles WebKit : iPhone SE sombre (375x667) et grand iPhone clair (430x932) ; contrôles de la section D de CLAUDE.md.
// Horloge fixée à un lundi (2 novembre 2026) : la veille (dimanche) n'a pas de séance, SUP-10 ne retire donc pas la paire.

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
    for (const el of document.querySelectorAll<HTMLElement>('.switch-label')) {
      if (parseFloat(getComputedStyle(el).fontSize) < 16) out.push('libellé de l’interrupteur < 16 px');
    }
    return out;
  });
  expect(problems).toEqual([]);
}
async function shot(page: Page, name: string, project: string, fullPage = false) {
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/d25-${name}.png`, fullPage });
}

async function setup(page: Page, project: string) {
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  await page.clock.setFixedTime(new Date('2026-11-02T09:00:00'));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Créer mon programme' }).click();
}

async function wizard(page: Page, o: { days: string; level: RegExp; project: string; shotDays?: boolean }) {
  await page.getByRole('button', { name: o.days, exact: true }).click();
  if (o.shotDays) await shot(page, 'profil-jours', o.project);
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

/** Écrit directement dans la base locale (IndexedDB) : une séance faite (rotation) et, si demandé, des séries faites (fin d'étalonnage). */
async function seed(page: Page, o: { doneDayIndex: number; setsForDay?: number }) {
  await page.evaluate(async ({ doneDayIndex, setsForDay }) => {
    const fiches = (await (await fetch('./data/fiches.json')).json()).fiches as { id: string; variantes: { id: string; echelon: number }[] }[];
    const db: IDBDatabase = await new Promise((res, rej) => {
      const r = indexedDB.open('muscu-app');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const all = <T,>(store: string): Promise<T[]> =>
      new Promise((res) => {
        const r = db.transaction(store).objectStore(store).getAll();
        r.onsuccess = () => res(r.result as T[]);
      });
    const put = (store: string, row: unknown): Promise<void> =>
      new Promise((res) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).put(row);
        tx.oncomplete = () => res();
      });
    const programs = await all<{ id: string; active: boolean; days: { exercises: { movementId: string; variantId: string; role: string }[] }[] }>('programs');
    const p = programs.find((x) => x.active)!;
    const base = { ownerId: 'local', createdAt: '2026-10-29T09:00:00.000Z', updatedAt: '2026-10-29T09:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null };
    await put('sessions', {
      ...base, id: `seed-${doneDayIndex}`, programId: p.id, programDayIndex: doneDayIndex, plannedDate: '2026-10-29', status: 'faite',
      startedAt: '2026-10-29T09:00:00.000Z', endedAt: '2026-10-29T10:00:00.000Z', note: '', decidedAt: null,
    });
    if (setsForDay === undefined) return;
    let i = 0;
    for (const ex of p.days[setsForDay].exercises) {
      if (ex.role === 'cardio') continue;
      const echelon = fiches.find((f) => f.id === ex.movementId)?.variantes.find((v) => v.id === ex.variantId)?.echelon ?? null;
      for (const setIndex of [0, 1]) {
        await put('sets', {
          ...base, id: `seed-set-${i++}`, sessionId: `seed-${doneDayIndex}`, movementId: ex.movementId, variantId: ex.variantId, exerciseIndex: 0, setIndex,
          targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: null, rir: 2, pain: false, comment: '', completedAt: '2026-10-29T09:30:00.000Z',
          targetRir: 2, isCalibration: false, isWarmup: false, echelon, capped: false,
        });
      }
    }
  }, o);
}

test('D25 : haut / bas, option « Gagner du temps », paire au lecteur, douleur dans une paire', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(240_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await setup(page, project);
  await wizard(page, { days: '4', level: /Intermédiaire/, project });

  // ----- Aperçu 4 jours haut / bas, option éteinte -----
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Haut du corps A' })).toBeVisible();
  const sw = page.getByRole('switch', { name: /Gagner du temps/ });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByText('Même volume de travail, séance plus courte, mais plus fatigant.')).toBeVisible();
  await shot(page, 'apercu-haut-bas-option-eteinte', project);

  // ----- Option allumée (réglage du profil, programme régénéré) ; séance HAUT-A : aucune paire possible (poussée verticale) -----
  await sw.click();
  await expect(sw).toHaveAttribute('aria-checked', 'true', { timeout: 20_000 });
  await expect(page.getByText('Dans cette séance, aucun exercice n’est fait par deux : tu les fais un par un.')).toBeVisible();

  // ----- Séance HAUT-B (rotation) : première fois, la paire est faite un par un (texte de la séance 1) -----
  await seed(page, { doneDayIndex: 1 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Haut du corps B' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/Cette première séance peut durer un peu plus longtemps/)).toBeVisible();
  await expect(page.getByText(/Superset avec/).first()).toBeVisible();
  await shot(page, 'apercu-option-allumee-seance1', project);

  // ----- Étalonnage fait : la paire est jouée au lecteur -----
  await seed(page, { doneDayIndex: 1, setsForDay: 2 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Haut du corps B' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/Cette première séance peut durer/)).toHaveCount(0);
  await shot(page, 'apercu-option-allumee-paire', project, true);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Échauffement' })).toBeVisible();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  const primary = page.locator('.player-foot .btn-primary');
  for (let i = 0; i < 60 && !(await page.getByText(/^Superset :/).isVisible()); i++) {
    await primary.click();
    await page.waitForTimeout(350);
  }
  await expect(page.getByText(/^Superset :/)).toBeVisible();
  await shot(page, 'lecteur-paire', project);

  // ----- Douleur sur un exercice de la paire : « Continuer seul » / « Passer au suivant » -----
  await page.getByRole('button', { name: 'Ça fait mal' }).click();
  await page.getByRole('button', { name: 'Genou' }).click();
  await page.getByRole('button', { name: 'J’arrête cet exercice' }).click();
  await expect(page.getByText(/Le superset s’arrête/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Passer au suivant' })).toBeVisible();
  await shot(page, 'douleur-paire', project);
  expect(errors).toEqual([]);
});

test('D25 : débutant (option grisée), profil (jours, réglage conservé)', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(180_000);
  const project = info.project.name;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await setup(page, project);
  // Carte « jours » : 1 jour -> avertissement STR-REP-1 (capture), puis 4 jours.
  await page.getByRole('button', { name: '1', exact: true }).click();
  await expect(page.getByText(/Une séance par semaine, c'est mieux que rien/)).toBeVisible();
  await shot(page, 'profil-jours-1', project);
  await wizard(page, { days: '4', level: /Débutant/, project });
  await page.getByRole('button', { name: 'Voir la séance' }).click();
  await expect(page.getByRole('heading', { name: 'Haut du corps A' })).toBeVisible();
  const sw = page.getByRole('switch', { name: /Gagner du temps/ });
  await expect(sw).toBeDisabled();
  await expect(page.getByText("Cette option n'est pas proposée au début : tu fais les exercices un par un.")).toBeVisible();
  await shot(page, 'apercu-debutant-option-grisee', project);
  // Profil : section « Mes séances » (même réglage).
  await page.getByRole('button', { name: '← Accueil' }).click();
  await page.goto('./#/profil');
  await expect(page.getByRole('heading', { name: 'Mes séances' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Mes séances' }).scrollIntoViewIfNeeded();
  await shot(page, 'profil-mes-seances', project);
  expect(errors).toEqual([]);
});
