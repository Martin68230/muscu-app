// Silhouette ORIGINALE (dessinée pour l'app, aucune image reprise ailleurs) en deux vues, face et dos : une zone = un chemin SVG.
// Repère : 200 x 420, axe de symétrie x = 100. On écrit seulement le côté gauche (x < 100) ; le côté droit est calculé par miroir.
// Les identifiants de zones sont ceux de knowledge/zones-correspondance.json. Une zone peut avoir un chemin pour la face, pour le dos ou pour les deux.
type Pt = [number, number];
type View = 'face' | 'dos';

const n1 = (n: number) => Math.round(n * 10) / 10;
const mir = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [200 - x, y]);

/** Polygone aux angles arrondis (rayon `r`, borné par la moitié de chaque côté) : formes plus organiques qu'un polygone brut. */
function rounded(raw: Pt[], r = 2.5): string {
  const pts = raw.filter((p, i) => { const q = raw[(i + raw.length - 1) % raw.length]; return p[0] !== q[0] || p[1] !== q[1]; });
  const k = pts.length;
  let d = '';
  for (let i = 0; i < k; i++) {
    const p = pts[i], a = pts[(i + k - 1) % k], b = pts[(i + 1) % k];
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(r, la / 2), rb = Math.min(r, lb / 2);
    const s: Pt = [p[0] + ((a[0] - p[0]) / la) * ra, p[1] + ((a[1] - p[1]) / la) * ra];
    const e: Pt = [p[0] + ((b[0] - p[0]) / lb) * rb, p[1] + ((b[1] - p[1]) / lb) * rb];
    d += `${i === 0 ? 'M' : 'L'}${n1(s[0])} ${n1(s[1])}Q${n1(p[0])} ${n1(p[1])} ${n1(e[0])} ${n1(e[1])}`;
  }
  return d + 'Z';
}
/** Un morceau de chaque côté du corps (gauche + miroir droit), dans un seul chemin. */
const pair = (r: number, ...polys: Pt[][]) => polys.map((p) => rounded(p, r) + rounded(mir(p), r)).join('');
/** Une pièce centrale symétrique : on donne la moitié gauche, du haut vers le bas. */
const sym = (r: number, left: Pt[]) => rounded([...left, ...mir(left).reverse()], r);

// ---- Corps (décor, sans zone) ----
const ARM: Pt[] = [[52, 69], [46, 76], [42, 92], [41, 105], [40, 150], [36, 190], [32, 238], [44, 240], [51, 205], [59, 150], [64, 104], [62, 80]];
const TORSO: Pt[] = [[92, 42], [91, 58], [76, 63], [56, 67], [52, 75], [60, 100], [67, 104], [69, 125], [73, 170], [68, 205], [64, 220], [98, 238]];
const LEG: Pt[] = [[65, 214], [63, 222], [60, 250], [62, 280], [67, 308], [66, 330], [65, 348], [68, 370], [73, 396], [85, 396], [86, 375], [88, 355], [89, 335], [89, 310], [91, 290], [95, 260], [98, 236]];
/** Décor commun aux deux vues : tête, tronc, bras, mains, jambes, pieds. */
export const BODY_PATH: string = [sym(6, TORSO.slice(0, 11).concat([[100, 238]])), pair(5, ARM, LEG)].join('');
/** Tête, mains et pieds : ellipses (centre, rayons), côté gauche ; le droit est le miroir. */
export const BODY_ELLIPSES: { cx: number; cy: number; rx: number; ry: number; both: boolean }[] = [
  { cx: 100, cy: 27, rx: 13.5, ry: 17, both: false },
  { cx: 37, cy: 252, rx: 7, ry: 13, both: true },
  { cx: 78, cy: 405, rx: 11, ry: 7, both: true },
];

// ---- Zones ----
const ARM_FRONT_DELT_INNER: Pt[] = [[56, 68], [50, 72], [53, 76], [51, 90], [50, 108], [54, 110], [64, 102], [62, 86], [60, 74]];
const DELT_OUTER: Pt[] = [[50, 72], [45, 80], [42, 95], [43, 108], [50, 108], [51, 90], [53, 76]];
const FOREARM: Pt[] = [[40, 150], [59, 150], [55, 180], [50, 205], [44, 238], [32, 238], [35, 210], [37, 185]];
const PERONEUS_FACE: Pt[] = [[66, 326], [74, 322], [74, 360], [77, 392], [73, 394], [68, 370], [65, 348]];
const PERONEUS_DOS: Pt[] = [[68, 368], [73, 364], [74, 380], [76, 393], [73, 394], [70, 382]];
const ABDUCTOR_FACE: Pt[] = [[62, 221], [72, 214], [73, 236], [64, 238], [61, 238]];
const ABDUCTOR_DOS: Pt[] = [[61, 254], [69, 254], [70, 282], [62, 282]];

type ZonePaths = Partial<Record<View, string>>;
const R = 2;
export const ZONE_PATHS: Record<string, ZonePaths> = {
  // Haut du corps, face
  cou: { face: sym(R, [[100, 46], [92, 46], [91, 58], [100, 60]]), dos: sym(R, [[100, 46], [92, 46], [91, 59], [100, 59]]) },
  pectoraux_haut: { face: pair(R, [[97, 72], [78, 70], [60, 74], [62, 86], [80, 90], [97, 88]]) },
  pectoraux_milieu_bas: { face: pair(R, [[97, 90], [80, 92], [62, 88], [64, 101], [70, 106], [84, 112], [97, 111]]) },
  epaules_avant: { face: pair(R, ARM_FRONT_DELT_INNER) },
  epaules_cote: { face: pair(R, DELT_OUTER), dos: pair(R, DELT_OUTER) },
  epaules_arriere: { dos: pair(R, ARM_FRONT_DELT_INNER) },
  dentele_anterieur: { face: pair(R, [[66, 106], [71, 109], [83, 115], [83, 121], [69, 121], [67, 113]]) },
  biceps: { face: pair(R, [[43, 109], [54, 111], [64, 104], [63, 126], [60, 148], [40, 148], [41, 128]]) },
  avant_bras: { face: pair(R, FOREARM), dos: pair(R, FOREARM) },
  // Haut du corps, dos
  trapezes_haut: { dos: pair(R, [[91, 60], [76, 64], [56, 68], [60, 78], [80, 82], [97, 79], [97, 62]]) },
  trapezes_moyen: { dos: pair(R, [[97, 83], [82, 86], [84, 100], [97, 104]]) },
  trapezes_bas: { dos: pair(R, [[97, 107], [85, 105], [80, 118], [90, 140], [97, 150]]) },
  coiffe_rotateurs: { dos: pair(R, [[62, 86], [80, 84], [83, 100], [72, 108], [64, 102]]) },
  grand_dorsal: { dos: pair(R, [[66, 106], [72, 109], [80, 119], [89, 141], [91, 150], [86, 170], [76, 172], [72, 150], [68, 122]]) },
  triceps_long_chef: { dos: pair(R, [[54, 111], [64, 104], [63, 126], [60, 148], [52, 148], [54, 128]]) },
  triceps_lateral_medial: { dos: pair(R, [[43, 109], [54, 111], [54, 128], [52, 148], [40, 148], [41, 128]]) },
  // Tronc
  abdominaux_droits: { face: pair(R, [[97, 116], [85, 118], [83, 140], [84, 172], [97, 172]]) },
  transverse: { face: pair(R, [[97, 175], [84, 175], [85, 192], [90, 206], [97, 212]]) },
  obliques: { face: pair(R, [[69, 123], [83, 124], [82, 146], [83, 173], [83, 176], [84, 192], [88, 206], [80, 211], [71, 211], [73, 172], [70, 134]]) },
  lombaires: { dos: pair(R, [[97, 153], [93, 153], [88, 168], [87, 198], [97, 204]]) },
  carre_des_lombes: { dos: pair(R, [[85, 172], [76, 174], [74, 194], [80, 204], [86, 200]]) },
  // Bas du corps
  fessiers_moyen: { dos: pair(R, [[66, 207], [80, 206], [86, 209], [78, 218], [65, 218]]) },
  fessiers_grand: { dos: pair(R, [[97, 210], [87, 211], [79, 220], [66, 220], [64, 232], [66, 246], [80, 252], [96, 250], [98, 238]]) },
  abducteurs: { face: pair(R, ABDUCTOR_FACE), dos: pair(R, ABDUCTOR_DOS) },
  adducteurs: { face: pair(R, [[97, 240], [90, 247], [85, 265], [86, 285], [91, 290], [95, 262]]) },
  flechisseurs_hanche: { face: pair(R, [[74, 214], [80, 213], [90, 208], [97, 214], [97, 240], [90, 246], [78, 246], [72, 236]]) },
  quadriceps_vastes: {
    face:
      rounded([[64, 238], [78, 246], [75, 274], [76, 292], [78, 298], [77, 306], [67, 306], [62, 280], [60, 250]], R) +
      rounded(mir([[64, 238], [78, 246], [75, 274], [76, 292], [78, 298], [77, 306], [67, 306], [62, 280], [60, 250]]), R) +
      rounded([[81, 294], [91, 292], [89, 306], [79, 306], [79, 298]], R) +
      rounded(mir([[81, 294], [91, 292], [89, 306], [79, 306], [79, 298]]), R),
  },
  quadriceps_droit_femoral: { face: pair(R, [[78, 246], [85, 248], [84, 274], [82, 292], [76, 292], [75, 274]]) },
  ischios: { dos: pair(R, [[97, 256], [70, 256], [71, 282], [63, 283], [67, 306], [89, 306], [91, 290], [95, 262]]) },
  mollets_gastrocnemien: { dos: pair(R, [[67, 320], [88, 320], [88, 346], [85, 360], [76, 362], [70, 358], [66, 340]]) },
  mollets_soleaire: { dos: pair(R, [[76, 364], [88, 362], [86, 376], [85, 394], [78, 394], [77, 380]]) },
  tibiaux: { face: pair(R, [[74, 322], [86, 322], [86, 350], [84, 375], [82, 392], [77, 392], [74, 360]]) },
  peroniers: { face: pair(R, PERONEUS_FACE), dos: pair(R, PERONEUS_DOS) },
};

/** Zones dessinées dans une vue. */
export const zonesOfView = (view: View): string[] => Object.keys(ZONE_PATHS).filter((z) => ZONE_PATHS[z][view]);
