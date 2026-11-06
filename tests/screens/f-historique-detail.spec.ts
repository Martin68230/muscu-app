import { expect, test, type Page } from '@playwright/test';

// Historique (niveau 1) : filtres par mois et type, détail d’une séance, comparaison avec la séance précédente du même type, courbe.
// Captures : iPhone SE sombre (liste, détail) et grand iPhone clair.
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

/** Trois séances du même type (Séance A) les 08, 15 et 29/10, avec séries : un superset, un exercice par côté, un exercice tenu ; aujourd'hui mardi 03/11. */
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
    const prog = (await getAll('programs')).find((p) => p.active);
    const day = prog.days[0];
    const exs = day.exercises.slice(0, 4).map((e: any, i: number) => ({
      ...e, supersetGroup: i < 2 ? 'g1' : null, perSide: i === 2, unit: i === 3 ? 'sec' : e.unit === 'sec' ? 'reps' : e.unit, holdSec: i === 3 ? 30 : null, role: e.role === 'cardio' ? 'pilier' : e.role,
    }));
    const plan = { ...day, label: 'Séance A', exercises: exs };
    const base = { ownerId: prog.ownerId, rev: 1, deletedAt: null, syncedAt: null, createdAt: prog.createdAt, updatedAt: prog.createdAt, note: '' };
    const rows: any[] = [];
    const sets: any[] = [];
    [['2026-10-08', 20, 8, 'Séance A'], ['2026-10-15', 22.5, 10, 'Séance A'], ['2026-10-22', 22.5, 10, 'Séance B'], ['2026-10-29', 25, 10, 'Séance A']].forEach(([d, kg, reps, label], k) => {
      const id = 'hv-' + k;
      const [y, m, dd] = (d as string).split('-').map(Number);
      rows.push({ ...base, id, programId: prog.id, programDayIndex: 0, plannedDate: d, status: 'faite', startedAt: new Date(y, m - 1, dd, 18).toISOString(), endedAt: new Date(y, m - 1, dd, 18, 48).toISOString(), endReason: 'terminee', plan: { ...plan, label } });
      exs.forEach((e: any, i: number) => {
        if (label === 'Séance B' && i > 0) return;
        const nSets = i === 0 ? 2 + (k === 3 ? 1 : 0) : 2;
        for (let s = 0; s < nSets; s++) {
          for (const side of i === 2 ? ['gauche', 'droite'] : [null]) {
            sets.push({
              ...base, id: id + '-' + i + '-' + s + '-' + side, sessionId: id, movementId: e.movementId, variantId: e.variantId, exerciseIndex: i, setIndex: s, side,
              targetRepsMin: 8, targetRepsMax: 12, reps: i === 3 ? null : (reps as number) - s, loadKg: i === 3 ? null : i === 0 ? kg : 10, holdSec: i === 3 ? 30 + k * 5 : null,
              rir: i === 3 ? null : 2, felt: i === 3 ? 2 : null, pain: false, comment: '', completedAt: new Date(y, m - 1, dd, 18, 10 + i * 5 + s).toISOString(),
            });
          }
        }
      });
    });
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['sessions', 'sets'], 'readwrite');
      rows.forEach((r) => tx.objectStore('sessions').put(r));
      sets.forEach((r) => tx.objectStore('sets').put(r));
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
}

test('Historique : filtres, détail, comparaison, courbe', async ({ page }, info) => {
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

  await page.getByRole('button', { name: /Calendrier/ }).click();
  await expect(page.getByRole('heading', { name: 'Historique' })).toBeVisible();
  await expect(page.getByLabel('Mois', { exact: true })).toBeVisible();
  await page.getByLabel('Mois', { exact: true }).selectOption('2026-10');
  await page.getByRole('button', { name: 'Séance A', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Séances passées' }).getByRole('listitem')).toHaveCount(3);
  await page.getByRole('button', { name: 'Tous', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Séances passées' }).getByRole('listitem')).toHaveCount(4);
  await page.getByRole('heading', { name: 'Historique' }).scrollIntoViewIfNeeded();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${project}/hist-liste.png`, fullPage: true });

  await page.getByRole('list', { name: 'Séances passées' }).getByRole('button').first().click();
  await expect(page.getByRole('heading', { name: 'Détail de la séance' })).toBeVisible();
  await expect(page.getByText('Par rapport à la séance précédente').first()).toBeVisible();
  await expect(page.getByText(/Superset avec/).first()).toBeVisible();
  await expect(page.getByText(/gauche .*droite/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Voir la courbe' }).first().click();
  await expect(page.locator('svg.curve-svg')).toBeVisible();
  await checkPhoneRules(page);
  await page.getByRole('heading', { name: 'Détail de la séance' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `screenshots/${project}/hist-detail.png`, fullPage: true });
  expect(errors).toEqual([]);
});
