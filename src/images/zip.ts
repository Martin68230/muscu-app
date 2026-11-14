// Lecteur ZIP minimal, local : lit seulement l'index (fin du fichier) puis les entrées demandées, par morceaux (File.slice).
// Un ZIP de 295 Mo n'est jamais chargé en entier. Méthodes 0 (stocké) et 8 (deflate, via DecompressionStream natif). Pas de ZIP64.
export interface ZipEntry { name: string; method: number; compressedSize: number; size: number; offset: number }

const u16 = (v: DataView, o: number) => v.getUint16(o, true);
const u32 = (v: DataView, o: number) => v.getUint32(o, true);

export async function listZip(file: Blob): Promise<ZipEntry[]> {
  const tailLen = Math.min(file.size, 65557);
  const tail = new DataView(await file.slice(file.size - tailLen).arrayBuffer());
  let e = -1;
  for (let i = tailLen - 22; i >= 0; i--) if (u32(tail, i) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('Ce fichier n’est pas un ZIP lisible.');
  const count = u16(tail, e + 10), cdSize = u32(tail, e + 12), cdOff = u32(tail, e + 16);
  if (count === 0xffff || cdSize === 0xffffffff || cdOff === 0xffffffff) throw new Error('ZIP trop gros (ZIP64) : importe plutôt le dossier d’images.');
  if (cdOff + cdSize > file.size) throw new Error('ZIP abîmé (index hors du fichier).');
  const cd = new DataView(await file.slice(cdOff, cdOff + cdSize).arrayBuffer());
  const dec = new TextDecoder();
  const out: ZipEntry[] = [];
  let p = 0;
  for (let n = 0; n < count && p + 46 <= cd.byteLength; n++) {
    if (u32(cd, p) !== 0x02014b50) throw new Error('ZIP abîmé (index illisible).');
    const nameLen = u16(cd, p + 28), extraLen = u16(cd, p + 30), comLen = u16(cd, p + 32);
    const name = dec.decode(new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nameLen));
    out.push({ name, method: u16(cd, p + 10), compressedSize: u32(cd, p + 20), size: u32(cd, p + 24), offset: u32(cd, p + 42) });
    p += 46 + nameLen + extraLen + comLen;
  }
  return out;
}

export async function readZipEntry(file: Blob, entry: ZipEntry, maxBytes: number): Promise<Uint8Array> {
  if (entry.size > maxBytes) throw new Error('image trop grosse');
  const head = new DataView(await file.slice(entry.offset, entry.offset + 30).arrayBuffer());
  if (head.byteLength < 30 || u32(head, 0) !== 0x04034b50) throw new Error('entrée abîmée');
  const start = entry.offset + 30 + u16(head, 26) + u16(head, 28);
  const raw = file.slice(start, start + entry.compressedSize);
  if (entry.method === 0) return new Uint8Array(await raw.arrayBuffer());
  if (entry.method !== 8) throw new Error('compression non gérée');
  if (typeof DecompressionStream === 'undefined') throw new Error('Ce navigateur ne sait pas décompresser un ZIP : importe le dossier d’images.');
  const stream = raw.stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buf = new Uint8Array(await new Response(stream).arrayBuffer());
  if (buf.byteLength > maxBytes) throw new Error('image trop grosse');
  return buf;
}
