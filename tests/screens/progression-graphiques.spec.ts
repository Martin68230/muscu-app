// Captures de « Ma progression » avec des données semées : volume par muscle, records, valeur au toucher (WebKit 375 / 430, clair / sombre).
import { test, expect, type Page } from '@playwright/test';

async function onboard(page: Page, theme: string) {
  await page.addInitScript((t) => { try { localStorage.setItem('muscu.theme', t); } catch { /* ignoré */ } }, theme);
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
  await page.getByRole('button', { name: /Avancé/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Prise de muscle/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await page.waitForTimeout(800);
}

async function seed(page: Page) {
  await page.evaluate(async () => {
    const db: IDBDatabase = await new Promise((res, rej) => { const r = indexedDB.open('muscu-app'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    const now = new Date();
    const base = { ownerId: 'u', rev: 1, deletedAt: null, syncedAt: null };
    const sessions: unknown[] = [];
    const sets: unknown[] = [];
    const moves = [['pompe-genoux', 10, 8], ['fente-arriere', 12, 10], ['tirage-sous-table', 0, 10]] as const;
    for (let i = 0; i < 6; i++) {
      const d = new Date(now); d.setDate(d.getDate() - (5 - i) * 6); d.setHours(10, 0, 0, 0);
      const iso = d.toISOString();
      const id = `seed-${i}`;
      sessions.push({ ...base, id, createdAt: iso, updatedAt: iso, programId: 'p', programDayIndex: 0, plannedDate: iso.slice(0, 10), status: 'faite', startedAt: iso, endedAt: iso, note: '', endReason: 'terminee', plan: { dayIndex: 0, label: 'A', exercises: [] } });
      moves.forEach(([mv, kg, reps], k) => {
        for (let j = 0; j < 3; j++) sets.push({ ...base, id: `${id}-${mv}-${j}`, createdAt: iso, updatedAt: iso, sessionId: id, movementId: mv, variantId: `${mv}-v`, exerciseIndex: k, setIndex: j, targetRepsMin: 8, targetRepsMax: 12, reps, loadKg: kg ? kg + Math.floor(i / 2) * 2.5 : null, rir: 2, pain: false, comment: '', completedAt: iso });
      });
    }
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['sessions', 'sets'], 'readwrite');
      sessions.forEach((s) => tx.objectStore('sessions').put(s));
      sets.forEach((s) => tx.objectStore('sets').put(s));
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
}

test('progression : volume par muscle, records, valeur au toucher', async ({ page }, info) => {
  test.setTimeout(240_000);
  await onboard(page, info.project.name.endsWith('clair') ? 'light' : 'dark');
  await seed(page);
  await page.goto('./#/progression');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Ma progression' })).toBeVisible();
  await page.getByRole('button', { name: 'Charge soulevée' }).click();
  await page.getByRole('button', { name: /Semaine du .*kg/ }).last().click();
  await expect(page.locator('.curve-readout').first()).toContainText('kg');
  await page.getByRole('button', { name: 'Cuisses' }).click();
  await page.locator('.rec-row').first().click();
  await page.getByRole('button', { name: 'Voir la courbe' }).first().click();
  await page.waitForTimeout(300);
  await page.locator('.hit').last().click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
  await page.screenshot({ path: `screenshots/${info.project.name}/lot1-progression.png`, fullPage: true });
});
