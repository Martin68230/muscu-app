import type { Page } from '@playwright/test';

/**
 * Appui sur le bouton principal du lecteur, comme une personne le ferait : la réserve (RIR) est obligatoire à chaque série, donc on en
 * choisit une avant « Série faite » ; un exercice en durée demande de lancer puis d'arrêter le chronomètre avant la série.
 */
export async function tapPrimary(page: Page): Promise<void> {
  const rir = page.locator('.rir-row .rir-btn');
  if ((await rir.count()) > 0 && (await page.locator('.rir-row .rir-btn[aria-pressed="true"]').count()) === 0) await rir.nth(2).click();
  const primary = page.locator('.player-foot .btn-primary').first();
  const label = (await primary.textContent({ timeout: 1500 }).catch(() => null)) ?? '';
  await primary.click({ timeout: 3000 }).catch(() => undefined);
  if (label.startsWith('Démarrer le chronomètre')) {
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Arrêter le chronomètre' }).click({ timeout: 3000 }).catch(() => undefined);
  }
}
