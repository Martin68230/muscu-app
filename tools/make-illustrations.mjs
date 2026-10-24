// Illustrations originales de l'app : node tools/make-illustrations.mjs [id-fiche ...]
// Sans argument : génère public/illustrations/<id>.svg pour toutes les entrées de tools/illustrations-poses.mjs.
// Silhouette articulée dessinée par nous (aucune image d'une autre app). Voir tools/photos.md, section « illustrations originales ».
//
// Repère de dessin : x vers la droite, y VERS LE HAUT, sol à y = 0 ; en vue de profil le personnage regarde vers +x.
// Angles en degrés, convention mathématique : 0 = vers la droite, 90 = vers le haut, 180 = vers la gauche, -90 = vers le bas.
//
// Un exercice = { id, titre, a: pose de départ, b: pose d'arrivée, c?: troisième pose, view?, flip?, labels? }.
// view : 'side' (profil, défaut), 'front' (de face), 'top' (vu de dessus, même moteur que 'front', sans sol).
// Une pose décrit une image :
//   p      : [x, y] bassin
//   t      : angle du tronc (bassin -> cou), 90 = debout, 0 = vers l'avant à l'horizontale
//   h      : angle de la tête (défaut : t)
//   armN / armF : bras proche (ou droit) / lointain (ou gauche) ; le bras lointain est dessiné plus clair en vue de profil
//   legN / legF : jambes, mêmes noms
//   un membre : { a: [angle1, angle2] }  (angles absolus de chaque segment)
//            ou { to: [x, y], bend: 'f'|'b'|'u'|'d' }  (cinématique inverse : le point visé est la main ou la cheville ;
//               bend = côté vers lequel plie le coude ou le genou : f avant, b arrière, u haut, d bas)
//   jambes : foot = angle du pied (0 = à plat vers l'avant, -60 = sur la pointe, 180 = dessus du pied au sol vers l'arrière)
//   vues 'front'/'top' seulement : tl longueur du tronc (défaut 68), hl décalage de la tête, sw demi-largeur des épaules,
//            hw demi-largeur des hanches, sa angle de la ligne des épaules, face angle du nez, hide liste de parties cachées
//            ('torso', 'head', 'armN', 'armF', 'legN', 'legF')
//   back / props : accessoires derrière / devant le personnage : [type, ...] ou fonction (J) => [[type, ...], ...] pour
//            s'attacher aux articulations J (hip, neck, sh, head, elN, haN, elF, haF, knN, anN, toN, knF, anF, toF).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const LEN = { torso: 68, shoulder: 62, head: 20, ua: 36, fa: 33, th: 55, sk: 52, ft: 22 };
export const ANK = 8; // hauteur de la cheville quand le pied est à plat au sol
const rad = (a) => (a * Math.PI) / 180;
const dir = (a) => [Math.cos(rad(a)), Math.sin(rad(a))];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const mul = (v, k) => [v[0] * k, v[1] * k];
const BEND = { f: [1, 0], b: [-1, 0], u: [0, 1], d: [0, -1] };

/** Cinématique inverse à deux segments : renvoie { mid, end }. */
export function ik(root, target, l1, l2, bend = 'f') {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const d = Math.hypot(dx, dy) || 0.001;
  const max = l1 + l2 - 0.05;
  const min = Math.abs(l1 - l2) + 0.05;
  const dd = Math.min(Math.max(d, min), max);
  const ux = dx / d, uy = dy / d;
  const a = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const base = [root[0] + ux * a, root[1] + uy * a];
  const c1 = [base[0] - uy * h, base[1] + ux * h];
  const c2 = [base[0] + uy * h, base[1] - ux * h];
  const bv = BEND[bend] ?? BEND.f;
  const score = (c) => (c[0] - base[0]) * bv[0] + (c[1] - base[1]) * bv[1];
  const mid = score(c1) >= score(c2) ? c1 : c2;
  return { mid, end: [root[0] + ux * dd, root[1] + uy * dd] };
}

function limb(root, spec, l1, l2) {
  if (spec.a) {
    const mid = add(root, mul(dir(spec.a[0]), l1));
    return { mid, end: add(mid, mul(dir(spec.a[1]), l2)) };
  }
  return ik(root, spec.to, l1, l2, spec.bend ?? 'f');
}

const DEF = {
  p: [0, 112], t: 90,
  armN: { a: [-92, -84] }, armF: { a: [-88, -80] },
  legN: { to: [8, ANK], bend: 'f' }, legF: { to: [-6, ANK], bend: 'f' },
};

/** Calcule toutes les articulations d'une pose. view = 'side' | 'front' | 'top'. */
export function solve(pose, view = 'side') {
  const q = { ...DEF, ...pose };
  const front = view !== 'side';
  const hip = q.p;
  const tv = dir(q.t);
  const tl = q.tl ?? LEN.torso;
  const neck = add(hip, mul(tv, tl));
  const shC = add(hip, mul(tv, tl * (LEN.shoulder / LEN.torso)));
  const head = add(neck, mul(dir(q.h ?? q.t), q.hl ?? LEN.head));
  const sw = front ? (q.sw ?? 22) : 0;
  const hw = front ? (q.hw ?? 13) : 0;
  const shDir = dir(q.sa ?? q.t - 90);
  const hipDir = dir(q.t - 90);
  const shN = add(shC, mul(shDir, sw)), shF = sub(shC, mul(shDir, sw));
  const hpN = add(hip, mul(hipDir, hw)), hpF = sub(hip, mul(hipDir, hw));
  const aN = limb(front ? shN : shC, q.armN, LEN.ua, LEN.fa);
  const aF = limb(front ? shF : shC, q.armF, LEN.ua, LEN.fa);
  const lN = limb(front ? hpN : hip, q.legN, LEN.th, LEN.sk);
  const lF = limb(front ? hpF : hip, q.legF, LEN.th, LEN.sk);
  const ft = front ? (q.ft ?? 12) : LEN.ft;
  const fN = q.legN.foot ?? (front ? 0 : 0);
  const fF = q.legF.foot ?? (front ? 180 : 0);
  return {
    hip, neck, sh: shC, head, shN, shF, hpN, hpF,
    elN: aN.mid, haN: aN.end, elF: aF.mid, haF: aF.end,
    knN: lN.mid, anN: lN.end, toN: add(lN.end, mul(dir(fN), ft)),
    knF: lF.mid, anF: lF.end, toF: add(lF.end, mul(dir(fF), ft)),
  };
}

// ---------- Rendu ----------
const W = 295, H = 330, GROUND = 292, CX = 148; // carte de 295 x 330 ; sol à 292 px du haut ; centre à 148
const num = (n) => Math.round(n * 10) / 10;
const px = (pt, c) => [num(c.ox + CX + (c.flip ? -pt[0] : pt[0])), num(GROUND - pt[1])];
const P = (pt, c) => px(pt, c).join(',');

function line(pts, cls, w, c, extra = '') {
  return `<polyline class="${cls}" stroke-width="${w}" points="${pts.map((p) => P(p, c)).join(' ')}"${extra}/>`;
}

function rect(c, x, y, w, h, cls, r = 0) {
  const x1 = c.flip ? -(x + w) : x;
  return `<rect class="${cls}" x="${num(c.ox + CX + x1)}" y="${num(GROUND - y - h)}" width="${num(w)}" height="${num(h)}" rx="${r}"/>`;
}
function dumbbell(c, at, ang) {
  const v = dir(ang + 90);
  const a = add(at, mul(v, 13)), b = add(at, mul(v, -13));
  return line([a, b], 'db', 9, c, ' stroke-linecap="butt"') + line([add(at, mul(v, 6)), add(at, mul(v, -6))], 'dbi', 5, c, ' stroke-linecap="butt"');
}
function bag(c, at, w, h, ang) {
  const [x, y] = px(at, c);
  const rot = c.flip ? ang : -ang;
  return `<g transform="rotate(${rot} ${x} ${y})"><rect class="bag" x="${num(x - w / 2)}" y="${num(y - h / 2)}" width="${w}" height="${h}" rx="9"/><rect class="bagp" x="${num(x - w / 2 + 5)}" y="${num(y - h / 2 + h * 0.55)}" width="${w - 10}" height="${num(h * 0.3)}" rx="4"/></g>`;
}
function arrow(c, a, b) {
  const [ax, ay] = px(a, c);
  const [bx, by] = px(b, c);
  const ang = Math.atan2(by - ay, bx - ax);
  const hl = 10;
  const h1 = [bx - hl * Math.cos(ang - 0.45), by - hl * Math.sin(ang - 0.45)];
  const h2 = [bx - hl * Math.cos(ang + 0.45), by - hl * Math.sin(ang + 0.45)];
  return `<path class="arw" d="M${ax},${ay} L${bx},${by} M${num(h1[0])},${num(h1[1])} L${bx},${by} L${num(h2[0])},${num(h2[1])}"/>`;
}

/** Accessoires : chaque fonction renvoie du SVG. c = contexte { ox, flip }. */
const PROPS = {
  mat: (c, x1, x2) => rect(c, x1, 0, x2 - x1, 5, 'pr', 2),
  rect: (c, x, y, w, h, r = 6) => rect(c, x, y, w, h, 'pr', r),
  bgwall: (c) => rect(c, -140, 0, 280, 262, 'wb', 0),
  wall: (c, x, w = 14) => rect(c, w >= 0 ? x : x + w, 0, Math.abs(w), 250, 'pr', 0),
  anchor: (c, x, y) => { const [a, b] = px([x, y], c); return `<circle class="ac" cx="${a}" cy="${b}" r="6"/>`; },
  step: (c, x1, x2, h) => rect(c, x1, 0, x2 - x1, h, 'pr', 2),
  chair: (c, xBack, h = 46, face = 1) => [
    line([[xBack, 0], [xBack, h + 48]], 'prl', 5, c),
    line([[xBack + face * 44, 0], [xBack + face * 44, h]], 'prl', 5, c),
    line([[xBack, h], [xBack + face * 44, h]], 'prl', 8, c),
  ].join(''),
  db: (c, at, ang = 0) => dumbbell(c, at, ang),
  bag: (c, at, w = 34, h = 44, ang = 0) => bag(c, at, w, h, ang),
  jug: (c, at) => rect(c, at[0] - 9, at[1] - 22, 18, 34, 'pr', 5),
  band: (c, pts) => line(pts, 'ac', 3, c),
  towel: (c, pts) => line(pts, 'tw', 7, c),
  arrow: (c, a, b) => arrow(c, a, b),
  dot: (c, at, r = 4) => { const [a, b] = px(at, c); return `<circle class="ac" cx="${a}" cy="${b}" r="${r}"/>`; },
  // Barre (lot D) : disque vu de profil = bague autour de la barre vue par le bout ; poteau de rack avec crochet gris et barre de sécurité jaune
  plate: (c, at, r = 22) => { const [a, b] = px(at, c); return `<circle class="pl" cx="${a}" cy="${b}" r="${r}"/><circle class="plh" cx="${a}" cy="${b}" r="4"/>`; },
  lin: (c, pts, w = 8) => line(pts, 'prl', w, c),
  rack: (c, x, side, hookY, safeY, len = 38) => [
    rect(c, x - 5, 0, 10, 236, 'pr', 2),
    line([[x, hookY], [x + side * 16, hookY]], 'prl', 6, c),
    line([[x, safeY], [x + side * len, safeY]], 'sf', 7, c),
  ].join(''),
  // Poteau de rack seul (crochet gris) et barre de sécurité jaune qui va jusque sous la barre (x1 -> x2 à la hauteur y)
  post: (c, x, hookY) => rect(c, x - 5, 0, 10, 236, 'pr', 2) + line([[x, hookY], [x + 16, hookY]], 'prl', 6, c),
  safe: (c, x1, x2, y) => line([[x1, y], [x2, y]], 'sf', 7, c),
  barfront: (c, y, half = 84) => line([[-half, y], [half, y]], 'db', 5, c, ' stroke-linecap="butt"') + rect(c, -half - 4, y - 22, 9, 44, 'pl2', 2) + rect(c, half - 5, y - 22, 9, 44, 'pl2', 2),
  // Lot 08 : ballon de gym (grand cercle bleu), ballon lesté (petit cercle brun avec couture), roue abdominale (disque sombre et moyeu)
  ball: (c, at, r = 34) => { const [a, b] = px(at, c); return `<circle class="sb" cx="${a}" cy="${b}" r="${r}"/>`; },
  mball: (c, at, r = 13) => { const [a, b] = px(at, c); return `<circle class="mb" cx="${a}" cy="${b}" r="${r}"/><path class="mbs" d="M${num(a - r)},${b} Q${a},${num(b - r * 0.6)} ${num(a + r)},${b}"/>`; },
  wheel: (c, at, r = 9) => { const [a, b] = px(at, c); return `<circle class="wh" cx="${a}" cy="${b}" r="${r}"/><circle class="whh" cx="${a}" cy="${b}" r="2.5"/>`; },
  ring: (c, at, r = 18) => { const [a, b] = px(at, c); return `<circle class="arc" cx="${a}" cy="${b}" r="${r}"/>`; },
};

function drawProps(list, J, c) {
  const out = [];
  for (const it of typeof list === 'function' ? [list] : list ?? []) {
    const arr = typeof it === 'function' ? it(J) : [it];
    for (const e of arr) {
      if (!e) continue;
      const [type, ...args] = e;
      if (!PROPS[type]) throw new Error(`accessoire inconnu : ${type}`);
      out.push(PROPS[type](c, ...args));
    }
  }
  return out.join('');
}

function figure(pose, view, c) {
  const J = solve(pose, view);
  const hide = new Set(pose.hide ?? []);
  const front = view !== 'side';
  const [hx, hy] = px(J.head, c);
  const out = [drawProps(pose.back, J, c)];
  const far = front ? 'bn' : 'bf';
  const wN = front ? 11 : 11;
  const showArm = (n) => !hide.has(n);
  if (front && !hide.has('torso')) {
    out.push(line([J.hpF, J.hpN], 'bn', 12, c));
    out.push(line([J.shF, J.shN], 'bn', 13, c));
  }
  if (showArm('armF')) out.push(line(front ? [J.shF, J.elF, J.haF] : [J.sh, J.elF, J.haF], far, 10, c));
  if (!hide.has('legF')) out.push(line(front ? [J.hpF, J.knF, J.anF, J.toF] : [J.hip, J.knF, J.anF, J.toF], far, 11, c));
  if (!hide.has('torso')) out.push(line([J.hip, J.neck], 'bn', front ? 24 : 22, c));
  if (!hide.has('legN')) out.push(line(front ? [J.hpN, J.knN, J.anN, J.toN] : [J.hip, J.knN, J.anN, J.toN], 'bn', 12, c));
  if (showArm('armN')) out.push(line(front ? [J.shN, J.elN, J.haN] : [J.sh, J.elN, J.haN], 'bn', wN, c));
  if (!hide.has('head')) {
    out.push(`<circle class="bn bh" cx="${hx}" cy="${hy}" r="15"/>`);
    if (pose.face != null) {
      const a = px(J.head, c), b = px(add(J.head, mul(dir(pose.face), 21)), c);
      out.push(`<line class="bn" stroke-width="7" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
    }
  }
  out.push(drawProps(pose.props, J, c));
  return out.join('');
}

const STYLE = `.bg{fill:#eef1f6}.gr{stroke:#a9b3c4;stroke-width:3;stroke-linecap:round}.bn{stroke:#1f2d4d;fill:none;stroke-linecap:round;stroke-linejoin:round}.bf{stroke:#7f8cab;fill:none;stroke-linecap:round;stroke-linejoin:round}.bh{fill:#1f2d4d}.pr{fill:#c9d1de;stroke:#9aa5b8;stroke-width:1.5}.wb{fill:#dbe1ec}.prl{stroke:#9aa5b8;fill:none;stroke-linecap:round}.ac{stroke:#e8590c;fill:#e8590c;stroke-linecap:round}polyline.ac{fill:none}.arw{stroke:#e8590c;stroke-width:3.5;fill:none;stroke-linecap:round;stroke-linejoin:round}.arc{stroke:#e8590c;stroke-width:3;fill:none;stroke-dasharray:6 5}.tw{stroke:#e0a93c;fill:none;stroke-linecap:round;stroke-linejoin:round}.db{stroke:#4a5568}.dbi{stroke:#8793a8}.bag{fill:#3b7a57;stroke:#285a3f;stroke-width:1.5}.bagp{fill:#2f6849}.pl{fill:#4a5568;fill-opacity:.3;stroke:#4a5568;stroke-width:5}.plh{fill:#4a5568}.pl2{fill:#4a5568;stroke:#2d3748;stroke-width:1}.sf{stroke:#e0a93c;fill:none;stroke-linecap:round}.sb{fill:#8fb8de;fill-opacity:.6;stroke:#4f83b3;stroke-width:3}.mb{fill:#c9884a;stroke:#8a5a2b;stroke-width:2}.mbs{stroke:#8a5a2b;stroke-width:2;fill:none}.wh{fill:#4a5568;stroke:#2d3748;stroke-width:2}.whh{fill:#c9d1de}.lbl{font:600 13px system-ui,sans-serif;fill:#5b6780}@media (prefers-color-scheme:dark){.sb{fill:#5d8fc0;fill-opacity:.55;stroke:#8fb8de}.mb{fill:#c9884a;stroke:#e8b07a}.mbs{stroke:#e8b07a}.wh{fill:#b5bfd3;stroke:#e8edf7}.whh{fill:#2d3750}.pl{fill:#b5bfd3;stroke:#b5bfd3}.plh{fill:#b5bfd3}.pl2{fill:#b5bfd3;stroke:#e8edf7}.sf{stroke:#d9b56a}.bg{fill:#1b2233}.gr{stroke:#4a5670}.bn{stroke:#e8edf7}.bf{stroke:#8a97b5}.bh{fill:#e8edf7}.pr{fill:#2d3750;stroke:#4a5670}.wb{fill:#252e44}.prl{stroke:#56637f}.ac{stroke:#ff8a3d;fill:#ff8a3d}.arw,.arc{stroke:#ff8a3d}.tw{stroke:#d9b56a}.db{stroke:#b5bfd3}.dbi{stroke:#7b87a0}.lbl{fill:#9fb0cf}}`;

/** Construit le SVG complet : départ à gauche, arrivée à droite (et une troisième image si ex.c existe). */
export function buildSvg(ex) {
  const view = ex.view ?? 'side';
  const poses = [ex.a, ex.b, ex.c].filter(Boolean);
  const labels = ex.labels ?? ['Départ', 'Arrivée'];
  const card = (i) => {
    const ox = i * (W + 10);
    const c = { ox, flip: !!ex.flip };
    const pose = poses[i];
    return `<rect class="bg" x="${ox}" y="0" width="${W}" height="${H}" rx="16"/>` +
      (view === 'top' || pose.noGround ? '' : `<line class="gr" x1="${ox + 16}" y1="${GROUND}" x2="${ox + W - 16}" y2="${GROUND}"/>`) +
      figure(pose, view, c) +
      `<text class="lbl" x="${ox + 16}" y="${H - 12}">${labels[i] ?? ''}</text>`;
  };
  const total = poses.length * W + (poses.length - 1) * 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${H}" role="img" aria-labelledby="t"><title id="t">${ex.titre}</title><style>${STYLE}</style>` +
    poses.map((_, i) => card(i)).join('') + `</svg>\n`;
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const { EXERCICES } = await import('./illustrations-poses.mjs');
  const only = process.argv.slice(2);
  const out = join(root, 'public', 'illustrations');
  mkdirSync(out, { recursive: true });
  let n = 0;
  for (const ex of EXERCICES) {
    if (only.length && !only.includes(ex.id)) continue;
    writeFileSync(join(out, `${ex.id}.svg`), buildSvg(ex));
    n++;
  }
  console.log(`${n} illustration(s) écrite(s) dans public/illustrations/`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
