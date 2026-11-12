import hevyCsv from '../fixtures/import-hevy.csv?raw';
import strongCsv from '../fixtures/import-strong.csv?raw';
import { describe, expect, it } from 'vitest';
import { exerciseKey, parseCsv, parseDateTime, parseDuration, parseWorkoutCsv, CSV_MAX_ROWS, type FicheRef } from '../../src/data/import-csv';
import { writeImported, deleteImported, countImported } from '../../src/data/import-csv-store';
import { importData, exportData } from '../../src/data/backup';
import { create, list, listTrusted } from '../../src/data/repo';
import { validateRow } from '../../src/data/validate';
import { buildEntries } from '../../src/session/calendar';
import { lastTime, withoutCreatedSets } from '../../src/session/history';

const FICHES: FicheRef[] = [
  { id: 'developpe-couche', nom: 'Développé couché', alias: ['bench press', 'développé couché à la barre'] },
  { id: 'squat', nom: 'Squat', alias: [] },
  { id: 'tractions', nom: 'Tractions', alias: ['pull-up'] },
  { id: 'rowing-a', nom: 'Rowing haltère', alias: ['row'] },
  { id: 'rowing-b', nom: 'Rowing barre', alias: ['row'] },
  { id: 'gainage', nom: 'Gainage', alias: ['plank'] },
];
const NOW = new Date('2026-11-12T10:00:00');
const fixture = (n: string) => (n === 'import-hevy.csv' ? hevyCsv : strongCsv);
type Opts = Partial<Parameters<typeof parseWorkoutCsv>[1]>;
const parse = (t: string, o: Opts = {}) => parseWorkoutCsv(t, { fiches: FICHES, now: NOW, ...o });
const ok = (t: string, o: Opts = {}) => {
  const r = parse(t, o);
  if (!r.ok) throw new Error(r.error);
  return r.preview;
};
const err = (t: string, o: Opts = {}) => {
  const r = parse(t, o);
  if (r.ok) throw new Error('attendu un refus');
  return r.error;
};
const cells = (t: string) => parseCsv(t).map((r) => r.map((c) => c.v));

describe('analyse CSV', () => {
  it('guillemets, guillemets doublés, retour à la ligne dans un champ, séparateurs', () => {
    expect(cells('a,"b,c","d\n""e"""\r\nx,y,z\n')).toEqual([['a', 'b,c', 'd\n"e"'], ['x', 'y', 'z']]);
    expect(cells('a;b;c\n1;2;3')[1]).toEqual(['1', '2', '3']);
    expect(cells('a\tb\n1\t2')[1]).toEqual(['1', '2']);
    expect(cells('a,,c,\n')).toEqual([['a', '', 'c', '']]);
  });
  it('guillemet non refermé : refus', () => {
    expect(err('title,start_time,exercise_title\n"x,2024-01-01,Squat')).toMatch(/guillemet/);
  });
  it('dates et durées', () => {
    expect(parseDateTime('26 Mar 2024, 18:30')?.getHours()).toBe(18);
    expect(parseDateTime('2024-03-27 07:15:00')?.getMinutes()).toBe(15);
    expect(parseDateTime('2024-03-27T07:15:00Z')?.toISOString()).toBe('2024-03-27T07:15:00.000Z');
    expect(parseDateTime('31/02/2024')).toBeNull();
    expect(parseDateTime('n’importe quoi')).toBeNull();
    expect(parseDuration('1h 5m')).toBe(3900);
    expect(parseDuration('45m')).toBe(2700);
    expect(parseDuration('1:05:00')).toBe(3900);
    expect(parseDuration('abc')).toBeNull();
  });
  it('noms : accents, casse, pluriels, équipement entre parenthèses', () => {
    expect(exerciseKey('Squat (Barbell)')).toBe('squat');
    expect(exerciseKey('Développé couché')).toBe(exerciseKey('DEVELOPPE COUCHE'));
    expect(exerciseKey('Tractions')).toBe(exerciseKey('Traction'));
  });
});

describe('format Hevy', () => {
  const p = ok(fixture('import-hevy.csv'));
  it('séances, séries, exercices, non reconnus', () => {
    expect(p.format).toBe('hevy');
    expect(p.sessionCount).toBe(2);
    expect(p.setCount).toBe(5);
    expect(p.exerciseCount).toBe(3);
    expect(p.unrecognized).toEqual(['Zottman Curl (Dumbbell)']);
    const push = p.workouts.find((w) => w.title === 'Push Day')!;
    expect(push.exercises[0]).toMatchObject({ movementId: 'developpe-couche', recognized: true });
    expect(push.exercises[0].sets.map((s) => s.isWarmup)).toEqual([true, false, false]);
    expect(push.exercises[0].sets[1]).toMatchObject({ reps: 8, loadKg: 60, rir: 2 });
    expect(push.exercises[1].movementId).toBe('import:Zottman Curl (Dumbbell)');
    expect(new Date(push.endedAt!).getTime() - new Date(push.startedAt).getTime()).toBe(50 * 60000);
  });
  it('exercice à durée', () => {
    const plank = p.workouts.find((w) => w.title === 'Planche')!.exercises[0];
    expect(plank).toMatchObject({ movementId: 'gainage' });
    expect(plank.sets[0]).toMatchObject({ reps: null, holdSec: 60, loadKg: null });
  });
});

describe('format Strong', () => {
  it('point-virgule, durée, échauffement, minuteur ignoré, RPE à virgule', () => {
    const p = ok(fixture('import-strong.csv'));
    expect(p.format).toBe('strong');
    expect(p.sessionCount).toBe(2);
    expect(p.unitAmbiguous).toBe(true);
    const legs = p.workouts.find((w) => w.title === 'Jambes')!;
    expect(legs.exercises[0].sets).toHaveLength(3);
    expect(legs.exercises[0].sets[0].isWarmup).toBe(true);
    expect(legs.exercises[0].sets[2].rir).toBe(2);
    expect(legs.exercises[0].movementId).toBe('squat');
    expect(new Date(legs.endedAt!).getTime() - new Date(legs.startedAt).getTime()).toBe(65 * 60000);
    expect(p.unrecognized).toEqual(['Fentes Bulgares']);
    expect(legs.exercises[0].sets[1].loadKg).toBe(100);
  });
  it('livres : convertis en kg si l’en-tête ou le choix le dit, sinon kg', () => {
    const csv = (head: string) => `Date,Workout Name,Duration,Exercise Name,Set Order,${head},Reps\n2024-03-27 07:15:00,A,30m,Squat,1,225,5\n`;
    const kg = (t: string, o: Opts = {}) => ok(t, o).workouts[0].exercises[0].sets[0].loadKg;
    expect(kg(csv('Weight (lbs)'))).toBe(102.06);
    expect(kg(csv('Weight (kg)'))).toBe(225);
    expect(kg(csv('Weight'))).toBe(225);
    expect(kg(csv('Weight'), { unit: 'lb' })).toBe(102.06);
    expect(ok(csv('Weight')).unitAmbiguous).toBe(true);
  });
  it('Hevy en livres', () => {
    const t = 'title,start_time,end_time,exercise_title,set_index,weight_lbs,reps\nA,2024-03-27 07:15:00,2024-03-27 08:00:00,Squat,0,100,5\n';
    expect(ok(t).workouts[0].exercises[0].sets[0].loadKg).toBe(45.36);
  });
});

describe('noms d’exercices', () => {
  const one = (name: string) => ok(`title,start_time,exercise_title,set_index,weight_kg,reps\nA,2024-03-27 07:15:00,"${name}",0,10,5\n`).workouts[0].exercises[0];
  it('reconnaît nom, alias, pluriel, accents, équipement', () => {
    expect(one('TRACTION (assistée)').movementId).toBe('tractions');
    expect(one('Pull-Up').movementId).toBe('tractions');
    expect(one('développé  couche').movementId).toBe('developpe-couche');
  });
  it('ambigu ou inconnu : jamais relié au hasard, nom nettoyé', () => {
    expect(one('Row')).toMatchObject({ recognized: false, movementId: 'import:Row' });
    expect(one('Machine inconnue <b>x</b>')).toMatchObject({ recognized: false, name: 'Machine inconnue b x /b' });
  });
});

describe('limites et refus', () => {
  const head = 'title,start_time,end_time,exercise_title,set_index,weight_kg,reps\n';
  const line = (o: { date?: string; w?: string; r?: string; name?: string } = {}) => `A,${o.date ?? '2024-03-27 07:15:00'},,${o.name ?? 'Squat'},0,${o.w ?? '50'},${o.r ?? '5'}\n`;
  it('format non reconnu, fichier vide', () => {
    expect(err('a,b,c\n1,2,3\n')).toMatch(/pas un export Hevy ni Strong/);
    expect(err('')).toMatch(/vide/);
    expect(err(head)).toMatch(/vide/);
  });
  it('fichier trop gros', () => {
    expect(err(head + line(), { byteLength: 21 * 1024 * 1024 })).toMatch(/20 Mo/);
  });
  it('trop de lignes', () => {
    expect(err(head + line().repeat(CSV_MAX_ROWS + 5))).toMatch(/lignes/);
  });
  it('poids, répétitions, dates hors limites ou illisibles', () => {
    expect(err(head + line({ w: '1001' }))).toMatch(/Ligne 2 : le poids/);
    expect(err(head + line({ w: '-5' }))).toMatch(/poids/);
    expect(err(head + line({ r: '1001' }))).toMatch(/répétitions/);
    expect(err(head + line({ r: '2.5' }))).toMatch(/répétitions/);
    expect(err(head + line({ w: 'abc' }))).toMatch(/poids/);
    expect(err(head + line({ date: 'hier' }))).toMatch(/date illisible/);
    expect(err(head + line({ date: '2027-01-01 10:00:00' }))).toMatch(/futur/);
    expect(ok(head + line({ date: '2026-11-12 20:00:00' })).sessionCount).toBe(1); // moins de 24 h : accepté
  });
  it('texte trop long dans une colonne utilisée ; une colonne non utilisée peut être longue', () => {
    expect(err(head + line({ name: 'x'.repeat(201) }))).toMatch(/trop long/);
    const t = 'title,start_time,description,exercise_title,set_index,weight_kg,reps\nA,2024-03-27 07:15:00,' + 'y'.repeat(5000) + ',Squat,0,50,5\n';
    expect(ok(t).setCount).toBe(1);
  });
  it('rien d’exploitable : refus', () => {
    expect(err(head + line({ w: '', r: '' }))).toMatch(/exploitable/);
  });
});

describe('séances importées : affichage seulement', () => {
  const importIt = async () => writeImported(ok(fixture('import-hevy.csv')));
  const own = () => create('sessions', { programId: null, programDayIndex: null, plannedDate: '2026-11-01', status: 'faite', startedAt: '2026-11-01T10:00:00.000Z', endedAt: null, note: '' });

  it('écriture : marquées imported, valides, sans doublon au second import, visibles dans l’historique', async () => {
    expect(await importIt()).toMatchObject({ sessionsAdded: 2, sessionsKnown: 0, sets: 5 });
    expect(await importIt()).toMatchObject({ sessionsAdded: 0, sessionsKnown: 2 });
    const sessions = await list('sessions');
    const sets = await list('sets');
    expect(sessions).toHaveLength(2);
    expect(sessions.every((s) => s.imported === true && s.status === 'faite' && s.programId === null)).toBe(true);
    for (const s of sessions) expect(validateRow('sessions', s)).toEqual([]);
    for (const s of sets) expect(validateRow('sets', s)).toEqual([]);
    const entries = buildEntries(sessions, sets);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => e.imported && e.mark === 'faite')).toBe(true);
    expect(entries.find((e) => e.label === 'Importé · Push Day')?.setsDone).toBe(3); // l'échauffement ne compte pas
  });

  it('absentes de « la dernière fois » et de tous les calculs (listTrusted, withoutCreatedSets)', async () => {
    await importIt();
    expect(await listTrusted('sessions')).toEqual([]);
    expect(await listTrusted('sets')).toEqual([]);
    const sessions = await list('sessions');
    const sets = await list('sets');
    // Garde-fou en profondeur : même si un appelant passe tout, les séries importées sont écartées.
    const kept = withoutCreatedSets({ sets, sessions }).sets;
    expect(kept).toEqual([]);
    const variantId = sets.find((s) => s.movementId === 'developpe-couche')!.variantId;
    expect(lastTime(sets, variantId)).not.toBeNull(); // sans le garde-fou, la charge importée serait lue
    expect(lastTime(kept, variantId)).toBeNull();
  });

  it('une vraie séance reste dans les listes de confiance', async () => {
    await importIt();
    const mine = await own();
    expect((await listTrusted('sessions')).map((s) => s.id)).toEqual([mine.id]);
  });

  it('suppression d’un coup des séances importées et de leurs séries, sans toucher aux autres', async () => {
    await importIt();
    const mine = await own();
    expect(await countImported()).toBe(2);
    expect(await deleteImported()).toBe(2);
    expect(await countImported()).toBe(0);
    expect((await list('sessions')).map((s) => s.id)).toEqual([mine.id]);
    expect(await list('sets')).toEqual([]);
  });

  it('export / import JSON : le marquage est conservé, une valeur invalide est refusée', async () => {
    await importIt();
    const file = await exportData();
    expect((await importData(JSON.parse(JSON.stringify(file)))).ok).toBe(true);
    expect(await listTrusted('sessions')).toEqual([]);
    const bad = JSON.parse(JSON.stringify(file));
    bad.data.sessions[0].imported = 'oui';
    expect((await importData(bad)).ok).toBe(false);
  });
});

describe('corrections de relecture', () => {
  it('réimport après suppression : les séances reviennent', async () => {
    const p = ok(fixture('import-hevy.csv'));
    await writeImported(p);
    await deleteImported();
    expect(await countImported()).toBe(0);
    expect(await writeImported(p)).toMatchObject({ sessionsAdded: 2 });
    expect(await countImported()).toBe(2);
    expect((await list('sets')).length).toBe(5);
  });
  it('séries importées orphelines écartées de listTrusted', async () => {
    await writeImported(ok(fixture('import-hevy.csv')));
    const file = await exportData();
    file.data.sessions = [];
    await importData(JSON.parse(JSON.stringify(file)));
    expect((await list('sets')).length).toBe(5);
    expect(await listTrusted('sets')).toEqual([]);
  });
  it('trop de colonnes : refus', () => {
    expect(err(','.repeat(60) + '\n' + ','.repeat(60) + '\n')).toMatch(/colonnes/);
  });
});
