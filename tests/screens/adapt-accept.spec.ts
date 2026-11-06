import { tapPrimary } from './helpers-seance';
import { expect, test, type Page } from '@playwright/test';

// Acceptation en un appui (bilan) : propositions « La prochaine fois » avec Accepter / Plus tard. Captures iPhone SE sombre et grand iPhone clair.
// L'historique est préparé dans IndexedDB (3 séances parfaites sur les exercices à charge) pour que le bilan propose un changement.

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

async function seed(page: Page) {
  const info = await page.evaluate(async () => {
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
    const seen = new Set<string>();
    const exs = prog.days.flatMap((d: any) => d.exercises).filter((e: any) => !/bird-dog|montee-sur-chaise|gainage|planche/.test(e.variantId) && e.role !== 'cardio' && e.unit !== 'sec' && !e.supersetGroup && !seen.has(e.variantId) && seen.add(e.variantId));
    exs.forEach((e: any) => { e.sets = 2; }); // 2 séries au programme : la 3e est possible (plafond du rôle 3)
    const base = { ownerId: prog.ownerId, rev: 1, deletedAt: null, syncedAt: null, note: '' };
    const rows: any[] = [];
    const sets: any[] = [];
    [9, 6, 3].forEach((back, k) => {
      const t0 = Date.now() - back * 86_400_000;
      const id = 'ad-' + k;
      const iso = new Date(t0).toISOString();
      rows.push({ ...base, id, createdAt: iso, updatedAt: iso, programId: prog.id, programDayIndex: 0, plannedDate: iso.slice(0, 10), status: 'faite', startedAt: iso, endedAt: new Date(t0 + 2_400_000).toISOString(), endReason: 'terminee', plan: { ...day, exercises: exs } });
      exs.forEach((e: any, i: number) => {
        for (let s = 0; s < e.sets; s++) {
          sets.push({
            ...base, id: `${id}-${i}-${s}`, createdAt: iso, updatedAt: iso, sessionId: id, movementId: e.movementId, variantId: e.variantId,
            exerciseIndex: i, setIndex: s, side: null, targetRepsMin: e.repsMin, targetRepsMax: e.repsMax, targetRir: e.rirTarget, reps: e.repsMax, loadKg: e.startLoadKg ?? 4,
            rir: Math.min(4, e.rirTarget + 1), pain: false, comment: '', isCalibration: false, isWarmup: false, echelon: null,
            completedAt: new Date(t0 + 60_000 * (5 + i * 5 + s)).toISOString(),
          });
        }
      });
    });
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(['sessions', 'sets', 'programs'], 'readwrite');
      rows.forEach((r) => tx.objectStore('sessions').put(r));
      sets.forEach((r) => tx.objectStore('sets').put(r));
      tx.objectStore('programs').put(prog);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
    return { exs: exs.map((e: any) => [e.movementId, e.variantId, e.sets, e.startLoadKg, e.role]), all: day.exercises.map((e: any) => [e.variantId, e.startLoadKg, e.unit, e.supersetGroup, e.sets]) };
  });
  console.log('SEED', JSON.stringify(info));
}

test('Bilan : Accepter / Plus tard sur les propositions', async ({ page }, info) => {
  test.skip(!['se-sombre', 'max-clair'].includes(info.project.name), 'quota : captures iPhone SE sombre et grand iPhone clair seulement');
  test.setTimeout(300_000);
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
  await seed(page);
  await page.getByRole('button', { name: 'Commencer la séance' }).click();
  await page.getByRole('button', { name: 'Échauffement fait' }).click();
  const primary = page.locator('.player-foot .btn-primary');
  for (let i = 0; i < 200; i++) {
    const label = await primary.first().textContent({ timeout: 1500 }).catch(() => null);
    if (label?.includes('Retour')) break;
    const load = page.locator('input[aria-label="Charge en kilos"]');
    if ((await load.count()) > 0 && (await load.first().inputValue()) === '') await load.first().fill('4');
    const rir = page.locator('.rir-row .rir-btn');
    if ((await rir.count()) > 0 && (await page.locator('.rir-row .rir-btn[aria-pressed="true"]').count()) === 0) await rir.last().click();
    if (label) await tapPrimary(page).catch(() => undefined);
    await page.waitForTimeout(150);
  }
  const dump = await page.evaluate(async () => {
    const db: IDBDatabase = await new Promise((res) => { const q = indexedDB.open('muscu-app'); q.onsuccess = () => res(q.result); });
    const all = (s: string): Promise<any[]> => new Promise((res) => { const g = db.transaction(s).objectStore(s).getAll(); g.onsuccess = () => res(g.result); });
    const sets = (await all('sets')).filter((x) => !String(x.sessionId).startsWith('ad-'));
    const sess = await all('sessions');
    return { sets: sets.map((x) => [x.sessionId, x.reps, x.loadKg, x.rir, x.targetRepsMax, x.targetRir, x.isCalibration, x.pain, x.variantId, x.isWarmup]), sess: sess.map((x) => [x.id, x.status, x.endReason]) };
  });
  console.log('DUMP', JSON.stringify(dump));
  const card = page.getByRole('region', { name: 'La prochaine fois' });
  await expect(card).toBeVisible();
  await expect(card.getByRole('button', { name: 'Accepter' }).first()).toBeVisible();
  await expect(card.getByRole('button', { name: 'Plus tard' }).first()).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await checkPhoneRules(page);
  await page.screenshot({ path: `screenshots/${info.project.name}/adapt-accept-bilan.png` });
  await card.getByRole('button', { name: 'Accepter' }).first().click();
  await expect(page.getByText('C’est noté : ce sera dans ta prochaine séance.')).toBeVisible();
  await page.screenshot({ path: `screenshots/${info.project.name}/adapt-accept-bilan-accepte.png` });
  expect(problems).toEqual([]);
});
