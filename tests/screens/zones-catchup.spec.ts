import { expect, test, type Page } from '@playwright/test';

// Niveau 2, étape 3 : rattrapage des zones dans l'aperçu (première séance de la semaine 2, aucune séance faite en semaine 1).
// Préparation dans IndexedDB : programme commencé il y a 8 jours, 2 séries par exercice (la 3e reste possible). Captures SE sombre, grand clair.

async function checkPhoneRules(page: Page) {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('défilement horizontal');
    for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=file])')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) out.push(`zone tactile trop petite (${Math.round(r.width)}x${Math.round(r.height)}) : ${el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
}

test('Aperçu : séries de rattrapage des zones', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(180_000);
  const problems: string[] = [];
  const theme = info.project.name.endsWith('clair') ? 'light' : 'dark';
  page.on('pageerror', (e) => problems.push(`erreur : ${e.message}`));
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
  await page.getByRole('button', { name: 'dimanche' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /À la maison/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByLabel('Banc plat').check();
  await page.getByLabel('Haltères', { exact: true }).check();
  await page.getByLabel(/Poids des haltères/).fill('4; 6; 10; 15; 20');
  await page.getByLabel(/Poids des haltères/).blur();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Avancé/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: /Prise de muscle/ }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  await page.getByRole('button', { name: "Aller à l'accueil" }).click();
  await page.getByRole('button', { name: 'Voir la séance' }).click({ timeout: 20_000 });
  await page.evaluate(async () => {
    const db: IDBDatabase = await new Promise((res, rej) => {
      const q = indexedDB.open('muscu-app');
      q.onsuccess = () => res(q.result);
      q.onerror = () => rej(q.error);
    });
    const prog: any = await new Promise((res) => {
      const g = db.transaction('programs').objectStore('programs').getAll();
      g.onsuccess = () => res(g.result.find((p: any) => p.active));
    });
    const d = new Date(Date.now() - 8 * 86_400_000);
    prog.startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    prog.days.forEach((day: any) => day.exercises.forEach((e: any) => { if (e.role !== 'cardio' && !e.supersetGroup && e.sets > 2) e.sets = 2; }));
    await new Promise<void>((res, rej) => {
      const tx = db.transaction('programs', 'readwrite');
      tx.objectStore('programs').put(prog);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  });
  await page.reload();
  const notice = page.getByRole('status', { name: 'Rattrapage des zones' });
  await expect(notice).toBeVisible({ timeout: 20_000 });
  await expect(notice).toContainText('Cette semaine : une série en plus');
  await notice.scrollIntoViewIfNeeded();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/zones-rattrapage-apercu.png` });
  expect(problems).toEqual([]);
});
