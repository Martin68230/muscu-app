import { describe, expect, it } from 'vitest';
import { addReport, clearReports, listReports, reportsToJson, reportsToText } from '../../src/data/reports';
import { exportData, importData, wipeAllData } from '../../src/data/backup';
import { listAll } from '../../src/data/repo';
import { validateRow } from '../../src/data/validate';

describe('signalements (D9)', () => {
  it("s'enregistrent localement avec fiche, variante, date, choix et texte", async () => {
    const r = await addReport({ ficheId: 'squat', variantId: 'squat-goblet', choice: 'image', text: '  image fausse ' });
    expect(r).toMatchObject({ ficheId: 'squat', variantId: 'squat-goblet', choice: 'image', text: 'image fausse' });
    expect(Date.parse(r.createdAt)).not.toBeNaN();
    expect(await listReports()).toHaveLength(1);
    expect(validateRow('signalements', r)).toEqual([]);
  });

  it('texte facultatif et tronqué à 1000 caractères', async () => {
    const a = await addReport({ ficheId: 'x', choice: 'autre' });
    expect(a.text).toBe('');
    expect(a.variantId).toBeNull();
    const b = await addReport({ ficheId: 'x', choice: 'autre', text: 'a'.repeat(5000) });
    expect(b.text).toHaveLength(1000);
  });

  it("sont dans l'export, réimportés, et supprimés avec les données", async () => {
    await addReport({ ficheId: 'pompe', choice: 'consigne', text: 'pas clair' });
    const file = await exportData();
    expect(file.data.signalements).toHaveLength(1);
    await wipeAllData();
    expect(await listAll('signalements')).toHaveLength(0);
    const res = await importData(JSON.parse(JSON.stringify(file)));
    expect(res.ok).toBe(true);
    expect(await listReports()).toHaveLength(1);
    await wipeAllData();
    expect(await listAll('signalements')).toHaveLength(0);
  });

  it('une sauvegarde v1 (sans signalements) reste importable ; un signalement invalide est refusé', async () => {
    const file = await exportData();
    const old = JSON.parse(JSON.stringify(file));
    delete old.data.signalements;
    old.schemaVersion = 1;
    expect((await importData(old)).ok).toBe(true);
    const bad = JSON.parse(JSON.stringify(file));
    bad.data.signalements = [{ id: 'z' }];
    expect((await importData(bad)).ok).toBe(false);
  });

  it('export texte et JSON, effacement', async () => {
    await addReport({ ficheId: 'rowing', variantId: 'rowing-haltere', choice: 'douleur', text: 'dos\ngêné' });
    const list = await listReports();
    expect(reportsToText(list)).toContain('rowing / rowing-haltere | Exercice gênant ou douloureux | dos gêné');
    expect(JSON.parse(reportsToJson(list))[0]).toMatchObject({ ficheId: 'rowing', choice: 'douleur' });
    expect(reportsToText([])).toBe('Aucun signalement.');
    await clearReports();
    expect(await listReports()).toHaveLength(0);
  });
});
