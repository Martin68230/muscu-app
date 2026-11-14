// D22 : table d'images validée, import local (ZIP / fichiers), aucune fuite réseau, aucune image dans le dépôt.
// @ts-ignore -- types Node absents du tsconfig de l'app
import { readFileSync, readdirSync, statSync } from 'node:fs';
// @ts-ignore
import { deflateRawSync } from 'node:zlib';
import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { getDB } from '../../src/data/db';
import { wipeAllData } from '../../src/data/backup';
import { MAX_ENTRIES } from '../../src/images/zip';
import { GV_TABLE } from '../../src/images/gv-table';
import { candidates, entryForFileName } from '../../src/images/match';
import { importFiles } from '../../src/images/importer';
import { countImages, deleteAllImages, getImage } from '../../src/images/store';
// @ts-ignore
import { build } from '../../tools/gen-gv-table.mjs';

const DIR = 'knowledge/exercices';
const schemaDe = new Map<string, string>();
const idsFiches = new Set<string>(); const idsVar = new Set<string>();
const walk = (d: string): void => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) { if (!/ecartees/.test(p)) walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = readFileSync(p, 'utf8'); const m = /^id:\s*(\S+)/m.exec(t); if (m) { idsFiches.add(m[1]); schemaDe.set(m[1], /^schema:s*(S+)/m.exec(t)?.[1] ?? ''); }
    for (const l of t.split('\n')) { const c = l.split('|').map((x: string) => x.trim()); if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && /^[0-9]+$/.test(c[3])) idsVar.add(`${m?.[1]}/${c[1]}`); }
  }
};
walk(DIR);

describe('table D22', () => {
  it('à jour par rapport au TSV validé', () => { expect(readFileSync('src/images/gv-table.ts', 'utf8').split(String.fromCharCode(13)).join('')).toBe(build()); });
  it('fiches et variantes visées existent ; un GIF ne sert que des fiches de même schéma', () => {
    expect(GV_TABLE.length).toBeGreaterThan(20);
    expect(new Set(GV_TABLE.map((e) => `${e.fiche}|${e.variante}|${e.id}`)).size).toBe(GV_TABLE.length);
    const parGif = new Map<string, Set<string>>(); const parId = new Map<string, string>();
    for (const e of GV_TABLE) { (parGif.get(e.gif) ?? parGif.set(e.gif, new Set()).get(e.gif)!).add(e.id); expect(parId.get(e.id) ?? e.gif).toBe(e.gif); parId.set(e.id, e.gif); expect(['sûr', 'proche']).toContain(e.niveau); }
    for (const s of parGif.values()) expect(s.size).toBe(1);
    const fichesParGif = new Map<string, Set<string>>();
    for (const e of GV_TABLE) (fichesParGif.get(e.id) ?? fichesParGif.set(e.id, new Set()).get(e.id)!).add(e.fiche);
    // un GIF peut servir plusieurs fiches (même geste, matériel ou charge différents) seulement dans une même famille de schéma
    for (const [, f] of fichesParGif) expect(new Set([...f].map((x) => schemaDe.get(x))).size).toBe(1);
    for (const e of GV_TABLE) { expect(idsFiches.has(e.fiche)).toBe(true); expect(e.variante).not.toBe(''); expect(idsVar.has(`${e.fiche}/${e.variante}`)).toBe(true); }
  });
  it('une variante classée « sans image » par le coach n’a aucune image', () => {
    const lignes = readFileSync('knowledge/exercices/SANS-IMAGE-coach.tsv', 'utf8').replace(/\r/g, '').split('\n').filter(Boolean).slice(1).map((l: string) => l.split('\t'));
    expect(lignes.length).toBeGreaterThan(100);
    for (const [f, v, raison] of lignes) { expect(['pas_dans_le_jeu', 'ambigu']).toContain(raison); expect(GV_TABLE.some((e) => e.fiche === f && e.variante === v)).toBe(false); }
  });
  it('variante exacte seulement', () => {
    expect(candidates('pompe', 'pompe-mur').map((e) => e.id)).toContain('0659');
    expect(candidates('pompe', 'pompe-standard')).toEqual([]);
    expect(candidates('pompe', null)).toEqual([]);
    expect(entryForFileName('Dossier/GIFs/0659-LEH9jxP.gif')?.id).toBe('0659');
    expect(entryForFileName('0659-autre.gif')).toBeUndefined();
  });
});

const GIF = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 1, 0, 1, 0, 0, 0, 0, 0x3b]);
function crc(b: Uint8Array) { let c, r = 0xffffffff; for (let i = 0; i < b.length; i++) { c = (r ^ b[i]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; r = (r >>> 8) ^ c; } return (r ^ 0xffffffff) >>> 0; }
function makeZip(files: { name: string; data: Uint8Array; deflate?: boolean }[]): Uint8Array {
  const parts: Uint8Array[] = []; const cd: Uint8Array[] = []; let off = 0;
  for (const f of files) {
    const n = new TextEncoder().encode(f.name); const comp = f.deflate ? new Uint8Array(deflateRawSync(f.data)) : f.data;
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(8, f.deflate ? 8 : 0, true); h.setUint32(14, crc(f.data), true); h.setUint32(18, comp.length, true); h.setUint32(22, f.data.length, true); h.setUint16(26, n.length, true);
    const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(10, f.deflate ? 8 : 0, true); c.setUint32(16, crc(f.data), true); c.setUint32(20, comp.length, true); c.setUint32(24, f.data.length, true); c.setUint16(28, n.length, true); c.setUint32(42, off, true);
    parts.push(new Uint8Array(h.buffer), n, comp); cd.push(new Uint8Array(c.buffer), n); off += 30 + n.length + comp.length;
  }
  const cdLen = cd.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cdLen, true); e.setUint32(16, off, true);
  const all = [...parts, ...cd, new Uint8Array(e.buffer)]; const out = new Uint8Array(all.reduce((a, b) => a + b.length, 0)); let p = 0; for (const x of all) { out.set(x, p); p += x.length; } return out;
}
const file = (data: Uint8Array, name: string) => new File([data as BlobPart], name);

const D = GV_TABLE.filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i); // un exemple par GIF
describe('import local', () => {
  it('ZIP (deflate + stocké) : ne garde que les noms de la table, rejette un faux GIF, reprise, suppression', async () => {
    const [a, b, c] = D;
    const zip = makeZip([
      { name: `images/${a.gif}`, data: GIF, deflate: true },
      { name: b.gif, data: GIF },
      { name: c.gif, data: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]) },
      { name: 'inconnu.gif', data: GIF },
    ]);
    const prog: number[] = [];
    const r1 = await importFiles([file(zip, 'x.zip')], (d) => prog.push(d));
    expect(r1.stored.sort()).toEqual([a.id, b.id].sort());
    expect(r1.errors.map((e) => e.name)).toEqual([c.gif]);
    expect(prog.length).toBeGreaterThan(1);
    expect((await getImage(a.id))?.type).toBe('image/gif');
    const r2 = await importFiles([file(zip, 'x.zip')]);
    expect(r2.stored).toEqual([]); expect(r2.already.length).toBe(2);
    expect(await countImages()).toBe(2);
    await deleteAllImages();
    expect(await countImages()).toBe(0);
  });
  it('ZIP piégé : taille déclarée fausse, flux de 10 Mo refusé sans tout charger', async () => {
    const big = new Uint8Array(10 * 1024 * 1024); big.set(GIF);
    const zip = makeZip([{ name: D[5].gif, data: big, deflate: true }]);
    // falsifie la taille déclarée (entête local + index) à 100 octets
    const dv = new DataView(zip.buffer); const n = D[5].gif.length; dv.setUint32(22, 100, true);
    const cdStart = zip.length - 22 - (46 + n); dv.setUint32(cdStart + 24, 100, true);
    const r = await importFiles([file(zip, 'bomb.zip')]);
    expect(r.stored).toEqual([]); expect(r.errors[0].why).toMatch(/trop grosse/);
  });
  it('fichiers isolés et ZIP invalide', async () => {
    const r = await importFiles([file(GIF, D[3].gif), file(new Uint8Array(100), 'faux.zip')]);
    expect(r.stored).toEqual([D[3].id]); expect(r.errors.length).toBe(1);
    await deleteAllImages();
  });
});

describe('entrée du convertisseur (fiches créées depuis le jeu)', () => {
  const auto = JSON.parse(readFileSync('knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json', 'utf8')) as { hasan_id: string; fiche: string; variante: string; niveau?: string }[];
  const gifs = new Set(readFileSync('knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv', 'utf8').split(String.fromCharCode(10)).slice(1).map((l: string) => l.split(String.fromCharCode(9))[0]));
  it('format : hasan_id du jeu, fiche et variante existantes, niveau sûr ou proche, présent dans la table générée', () => {
    expect(Array.isArray(auto)).toBe(true);
    for (const x of auto) {
      expect(gifs.has(String(x.hasan_id))).toBe(true);
      expect(idsFiches.has(x.fiche)).toBe(true);
      expect(idsVar.has(`${x.fiche}/${x.variante}`)).toBe(true);
      expect(['sûr', 'proche', undefined]).toContain(x.niveau);
      expect(GV_TABLE.some((e) => e.id === String(x.hasan_id) && e.fiche === x.fiche && e.variante === x.variante)).toBe(true);
    }
  });
});

describe('durcissement (relecture)', () => {
  it('zip slip : le chemin de l’entrée ne sert jamais, seul le nom de base compte', async () => {
    const a = D[0], b = D[1];
    const zip = makeZip([{ name: '../../' + a.gif, data: GIF }, { name: '/etc/' + b.gif, data: GIF }, { name: '..\evil.gif', data: GIF }]);
    const r = await importFiles([file(zip, 'slip.zip')]);
    expect(r.stored.sort()).toEqual([a.id, b.id].sort());
    expect(r.errors).toEqual([]);
    await deleteAllImages();
  });
  it('nombre d’entrées excessif : refus clair', async () => {
    const zip = makeZip([{ name: D[0].gif, data: GIF }]);
    new DataView(zip.buffer).setUint16(zip.length - 22 + 10, MAX_ENTRIES + 1, true);
    const r = await importFiles([file(zip, 'trop.zip')]);
    expect(r.stored).toEqual([]); expect(r.errors[0].why).toMatch(/plus de 20000/);
  });
  it('quota : écriture refusée en cours d’import, message de reprise, base muscu-app intacte', async () => {
    const db = await getDB();
    await (db as unknown as { put: (s: string, v: unknown) => Promise<unknown> }).put('device', { key: 'sonde-d22' });
    const zip = makeZip([{ name: D[0].gif, data: GIF }, { name: D[1].gif, data: GIF }, { name: D[2].gif, data: GIF }]);
    const proto = (globalThis as unknown as { IDBObjectStore: { prototype: { put: (...a: unknown[]) => unknown } } }).IDBObjectStore.prototype;
    const orig = proto.put; let n = 0;
    const spy = vi.spyOn(proto, 'put').mockImplementation(function (this: unknown, ...a: unknown[]) { if (++n === 2) throw new DOMException('quota', 'QuotaExceededError'); return orig.apply(this, a); });
    const r = await importFiles([file(zip, 'q.zip')]);
    spy.mockRestore();
    expect(r.stored.length).toBe(1);
    expect(r.errors.some((e) => /Import interrompu : 1 image enregistrée sur 3/.test(e.why))).toBe(true);
    expect(await (db as unknown as { get: (s: string, k: string) => Promise<unknown> }).get('device', 'sonde-d22')).toBeTruthy();
    await deleteAllImages();
  });
  it('wipeAllData supprime aussi la base des images', async () => {
    await importFiles([file(GIF, D[0].gif)]);
    expect(await countImages()).toBe(1);
    await wipeAllData();
    expect(await countImages()).toBe(0);
  });
});

describe('confidentialité', () => {
  const src = (d: string): string[] => readdirSync(d).flatMap((n: string) => { const p = `${d}/${n}`; return statSync(p).isDirectory() ? src(p) : [p]; });
  it('aucune requête réseau dans src/images', () => {
    for (const f of src('src/images')) expect(readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '')).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|https?:\/\//);
  });
  it('aucun GIF dans le dépôt versionné (sources, public, knowledge)', () => {
    for (const d of ['src', 'public', 'knowledge', 'tests']) for (const f of src(d)) expect(f).not.toMatch(/\.gif$/i);
  });
  it('l’export de sauvegarde ne lit pas la base des images', () => {
    const t = readFileSync('src/data/backup.ts', 'utf8'); expect(t.replace(/import .*images\/store.*\n/, '')).not.toMatch(/getImage|listImageIds|imageUrl/);
  });
});
