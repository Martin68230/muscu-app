import { expect, test, type Page } from '@playwright/test';

// F7 : Accueil (régularité), Calendrier (mois, marques, détail) et Historique (bilan d'une séance passée).
// Captures iPhone SE sombre et grand iPhone clair seulement (quota), avec les contrôles de la section D de CLAUDE.md.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.getAttribute('aria-label') || el.textContent?.trim() || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

/** Écrit directement dans IndexedDB : jours par semaine du profil, séances et séries d'exemple (dates relatives à aujourd'hui). */
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
    const [profile] = await getAll('profile');
    const base = { ownerId: profile.ownerId, rev: 1, deletedAt: null, syncedAt: null };
    const day = (back: number, h = 18) => {
      const d = new Date();
      d.setDate(d.getDate() - back);
      d.setHours(h, 0, 0, 0);
      return d;
    };
    // [jours en arrière, statut, endReason, série douloureuse ?, nom]
    const plan: [number, string, string | null, boolean, string][] = [
      [1, 'faite', 'terminee', false, 'Haut du corps'],
      [3, 'faite', 'terminee', true, 'Bas du corps'],
      [4, 'sautee', 'abandon', false, 'Haut du corps'],
      [8, 'faite', 'terminee', false, 'Haut du corps'],
      [10, 'reportee', null, false, 'Bas du corps'],
      [15, 'faite', 'terminee', false, 'Bas du corps'],
      [22, 'faite', 'terminee', false, 'Haut du corps'],
    ];
    const sessions: any[] = [];
    const sets: any[] = [];
    plan.forEach(([back, status, endReason, pain, label], i) => {
      const start = day(back);
      const iso = start.toISOString();
      const id = `f7-s${i}`;
      sessions.push({
        ...base, id, createdAt: iso, updatedAt: iso, programId: 'f7', programDayIndex: i % 2, plannedDate: iso.slice(0, 10), status, startedAt: iso,
        endedAt: new Date(start.getTime() + 47 * 60000).toISOString(), note: '', endReason, plan: { dayIndex: i % 2, label, exercises: [] },
      });
      if (status === 'faite' || (status === 'sautee' && false)) {
        for (let k = 0; k < 12; k++) {
          sets.push({
            ...base, id: `${id}-${k}`, createdAt: iso, updatedAt: iso, sessionId: id, movementId: 'm1', variantId: 'v1', exerciseIndex: 0, setIndex: k,
            targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: 20, rir: 2, pain: pain && k === 0, comment: '',
            completedAt: new Date(start.getTime() + (k + 1) * 3 * 60000).toISOString(),
          });
        }
      }
    });
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['sessions', 'sets', 'profile'], 'readwrite');
      tx.objectStore('profile').put({ ...profile, daysPerWeek: 3, createdAt: day(24).toISOString() });
      sessions.forEach((s) => tx.objectStore('sessions').put(s));
      sets.forEach((s) => tx.objectStore('sets').put(s));
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
}

const skip = (name: string) => !['se-sombre', 'max-clair'].includes(name);

test('F7 : accueil, calendrier, historique, bilan passé', async ({ page }, info) => {
  test.skip(skip(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(120_000);
  const problems: string[] = [];
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  page.on('console', (m) => {
    if (/content security policy|refused to (load|execute|frame|connect)|^CSP /i.test(m.text())) problems.push(m.text());
  });
  page.on('pageerror', (e) => problems.push(`erreur : ${e.message}`));
  await page.addInitScript((t) => {
    try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ }
  }, theme);
  await page.goto('./');
  await page.getByText("J'ai 18 ans ou plus.").click();
  await page.getByText("J'ai compris que ce n'est pas un avis médical.").click();
  await page.getByRole('button', { name: 'Commencer' }).click();
  await expect(page.getByText('Ta première séance lancera le suivi.')).toBeVisible();
  await page.screenshot({ path: `screenshots/${info.project.name}/f7-accueil-vide.png` });

  await seed(page);
  await page.reload();
  await expect(page.getByText(/Cette semaine :/)).toBeVisible();
  await expect(page.getByText(/Dernière séance : hier/)).toBeVisible();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f7-accueil.png`, fullPage: true });

  await page.getByRole('button', { name: 'Calendrier' }).click();
  await expect(page.getByRole('heading', { name: 'Calendrier' })).toBeVisible();
  await expect(page.getByText(/séances? faites? sur environ \d+ prévues? \(estimation\)/)).toBeVisible();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f7-calendrier.png`, fullPage: true });

  await page.locator('.calendar button.day').first().click();
  await expect(page.getByRole('button', { name: 'Voir le bilan' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Précédent' }).count();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/f7-calendrier-jour.png`, fullPage: true });

  await page.locator('.hist-row').first().click();
  await expect(page.getByRole('button', { name: /Retour à l’historique/ })).toBeVisible();
  await checkPhoneRules(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: `screenshots/${info.project.name}/f7-bilan-passe.png`, fullPage: true });
  await page.getByRole('button', { name: 'Supprimer cette séance' }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await checkPhoneRules(page);
  await page.getByRole('button', { name: 'Annuler' }).click();
  await page.getByRole('button', { name: /Retour à l’historique/ }).click();
  await expect(page.getByRole('heading', { name: 'Historique' })).toBeVisible();
  expect(problems).toEqual([]);
});
