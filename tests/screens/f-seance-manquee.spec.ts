import { expect, test, type Page } from '@playwright/test';

// Séance manquée (knowledge/seance-manquee-v1.md, cas E1) : carte de l'Accueil, choix du jour, calendrier « Reportée » / « Sautée ».
// Captures : iPhone SE sombre (Accueil, choix du jour, calendrier) et grand iPhone clair (Accueil), quota.
test.use({ timezoneId: 'Europe/Paris', locale: 'fr-FR' });

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('main button, main a[href]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.getAttribute('aria-label') || el.textContent?.trim()}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

/** Programme lundi (A) / jeudi (B), séance B faite le jeudi 29/10, une séance sautée le lundi 26/10 ; aujourd'hui mardi 03/11 09:00. */
async function seed(page: Page) {
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
    const programs = await getAll('programs');
    const prog = programs.find((p) => p.active);
    prog.startDate = '2026-10-01';
    prog.days = prog.days.map((d: any, i: number) => ({ ...d, weekday: i === 0 ? 0 : 3 }));
    const base = { ownerId: prog.ownerId, rev: 1, deletedAt: null, syncedAt: null, createdAt: prog.createdAt, updatedAt: prog.createdAt, note: '' };
    const done = {
      ...base, id: 'sm-b', programId: prog.id, programDayIndex: 1, plannedDate: '2026-10-29', status: 'faite',
      startedAt: new Date(2026, 9, 29, 18).toISOString(), endedAt: new Date(2026, 9, 29, 19).toISOString(), endReason: 'terminee', plan: prog.days[1],
    };
    const skipped = {
      ...base, id: 'sm-s', programId: prog.id, programDayIndex: 0, plannedDate: '2026-10-26', status: 'sautee', startedAt: null, endedAt: null,
      endReason: 'renonce', decidedAt: new Date(2026, 9, 27, 9).toISOString(), plan: prog.days[0],
    };
    const set = {
      ...base, id: 'sm-x', sessionId: 'sm-b', movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
      reps: 10, loadKg: 10, rir: 2, pain: false, comment: '', completedAt: new Date(2026, 9, 29, 18, 10).toISOString(),
    };
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['programs', 'sessions', 'sets'], 'readwrite');
      tx.objectStore('programs').put(prog);
      tx.objectStore('sessions').put(done);
      tx.objectStore('sessions').put(skipped);
      tx.objectStore('sets').put(set);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
}

test('Séance manquée : carte, choix du jour, calendrier', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(150_000);
  const project = info.project.name;
  const theme = project.endsWith('clair') ? 'light' : 'dark';
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.setFixedTime(new Date(2026, 10, 3, 9, 0));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('button', { name: 'Créer mon programme' }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // jours bloqués : aucun
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /À la maison/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // matériel
  await page.getByRole('button', { name: /Débutant/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Santé et forme/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click(); // blessures : aucune
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await expect(page.getByRole('button', { name: 'Voir la séance' })).toBeVisible({ timeout: 20_000 });
  await seed(page);
  await page.reload();

  // Accueil : la carte remplace le bandeau.
  await expect(page.getByRole('heading', { name: "Ta séance de lundi n'a pas eu lieu." })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Séance du jour')).toHaveCount(0);
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/sm-accueil-carte.png`, fullPage: true });
  if (project !== 'se-sombre') return expect(errors).toEqual([]);

  // Choix du jour.
  await page.getByRole('button', { name: 'Décaler à un autre jour de cette semaine' }).click();
  await expect(page.getByRole('heading', { name: 'Choisis un jour' })).toBeVisible();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/sm-choix-jour.png`, fullPage: true });
  await page.getByRole('button', { name: 'Mardi' }).click();
  await expect(page.getByText(/C'est noté : « Séance A » est décalée à mardi. Elle est dans ton calendrier./)).toBeVisible();

  // Calendrier : lundi 2 « Reportée », mardi 3 « Prévue », lundi 26/10 « Sautée ».
  await page.getByRole('button', { name: /Calendrier/ }).click();
  await expect(page.getByRole('button', { name: /lundi 2 novembre.*séance reportée/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /mardi 3 novembre.*séance prévue/i })).toBeVisible();
  await page.getByRole('button', { name: 'Mois précédent' }).click();
  await expect(page.getByRole('button', { name: /lundi 26 octobre : séance sautée/i })).toBeVisible();
  await page.getByRole('button', { name: 'Mois suivant' }).click();
  await page.getByRole('button', { name: /lundi 2 novembre.*séance reportée/i }).click();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/sm-calendrier.png`, fullPage: true });
  expect(errors).toEqual([]);
});
