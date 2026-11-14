// Poses des illustrations originales : une entrée par fiche (voir tools/make-illustrations.mjs pour le format).
// Repère : x à droite, y vers le haut, sol à y = 0, personnage de profil tourné vers +x (sauf view 'front' / 'top').
const A = 8; // cheville à plat
// Chaise vue de face (assise, élévation latérale) : dossier et assise derrière le tronc, pieds de chaise ; jambes assises raccourcies
const SEATF = [['rect', -30, 44, 60, 6, 2], ['rect', -28, 50, 56, 78, 3], ['lin', [[-27, 0], [-27, 44]], 5], ['lin', [[27, 0], [27, 44]], 5]];
const LEGSF = [['seg', [[13, 56], [17, 46]], 12], ['seg', [[-13, 56], [-17, 46]], 12], ['seg', [[17, 46], [17, 8]], 11], ['seg', [[-17, 46], [-17, 8]], 11], ['seg', [[17, 8], [28, 8]], 11], ['seg', [[-17, 8], [-28, 8]], 11]];
const walkFwd = [['arrow', [62, 205], [112, 205]]];

// À quatre pattes : hanche (-18,58), genoux au sol, mains sous les épaules
const quad = (o = {}) => ({
  p: [-18, 58], t: 11, h: 20,
  armN: { to: [46, 6], bend: 'f' }, armF: { to: [40, 6], bend: 'f' },
  legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 },
  back: [['mat', -130, 130]],
  ...o,
});
// Allongé sur le ventre, tête à droite
const prone = (o = {}) => ({ p: [-12, 11], t: 0, h: 0, legN: { a: [180, 180], foot: 180 }, legF: { a: [180, 180], foot: 180 }, back: [['mat', -140, 130]], ...o });
// Allongé sur le dos, tête à gauche
const supine = (o = {}) => ({ p: [-5, 11], t: 180, h: 180, back: [['mat', -140, 130]], ...o });
// Planche : mains (62,8), chevilles (-100,22)
const plank = (o = {}) => ({
  p: [1.4, 55.9], t: 18.5, h: 10,
  armN: { to: [62, 8], bend: 'f' }, armF: { to: [58, 8], bend: 'f' },
  legN: { to: [-100, 22], bend: 'd', foot: -60 }, legF: { to: [-96, 22], bend: 'd', foot: -60 },
  back: [['mat', -140, 130]],
  ...o,
});
// Pompe en bas
const plankDown = (o = {}) => plank({ p: [6.5, 32], t: 5.4, h: 0, armN: { to: [62, 8], bend: 'b' }, armF: { to: [58, 8], bend: 'b' }, ...o });
// Accroupi pour ramasser une charge posée au sol
const pickup = (o = {}) => ({
  p: [-30, 45], t: 35, h: 20,
  armN: { to: [16, 14], bend: 'f' }, armF: { to: [10, 14], bend: 'f' },
  legN: { to: [6, A], bend: 'f' }, legF: { to: [-6, A], bend: 'f' },
  ...o,
});
const stride = (o = {}) => ({
  p: [0, 110],
  legN: { to: [20, A], bend: 'f' }, legF: { to: [-22, 15], bend: 'f', foot: -35 },
  armN: { a: [-125, -95] }, armF: { a: [-60, -20] },
  ...o,
});


// ---- Lot 07 (barre) : barre vue par le bout (bague), rack de profil avec barre de sécurité jaune ----
const barPlate = (J) => [['plate', J.haN]];
const rackBack = (x, hookY, safeY, len = 38) => [['rack', x, 1, hookY, safeY, len]];
// Banc incliné dessiné le long du tronc (dossier, assise, pieds) : s'adapte à la pose
const benchAlong = (J) => {
  const dx = J.neck[0] - J.hip[0], dy = J.neck[1] - J.hip[1], L = Math.hypot(dx, dy);
  const u = [dx / L, dy / L];
  const n1 = [u[1], -u[0]], n2 = [-u[1], u[0]];
  const n = n1[1] < n2[1] ? n1 : n2;
  const o = (pt, k) => [pt[0] + n[0] * 15 + u[0] * k, pt[1] + n[1] * 15 + u[1] * k];
  const a = o(J.hip, -8), b = o(J.neck, 12);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return [['lin', [a, b], 10], ['lin', [mid, [mid[0] + 8, 0]], 6], ['lin', [[a[0] - 6, 0], [a[0] + 36, 0]], 6], ['lin', [a, [a[0] + 36, a[1]]], 8]];
};

// Barre vue par le bout, petite bague : les barres de sécurité jaunes se dessinent juste dessous (corrections images du lot 07)
const barEnd = (J) => [['plate', J.haN, 9]];
const barEnd7 = (J) => [['plate', J.haN, 7]];
const benchFlat = [['rect', -92, 36, 172, 10, 3], ['rect', -78, 0, 8, 36, 2], ['rect', 56, 0, 8, 36, 2]];
const benchSq = [['rect', -105, 40, 75, 10, 3], ['rect', -98, 0, 8, 40, 2], ['rect', -44, 0, 8, 40, 2]];

// ---- Lot 09 (gilet lesté, sac de sable, bosu) ----
const dirP = (a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
// Sac de sable en berceau : couché devant la poitrine, les mains dessous. p = bassin, t = angle du tronc
const cradle = (p, t) => {
  const u = dirP(t), f = [u[1], -u[0]];
  const c = [p[0] + u[0] * 50 + f[0] * 24, p[1] + u[1] * 50 + f[1] * 24];
  return { c, hn: [c[0] + 6, c[1] - 14], hf: [c[0] + 3, c[1] - 14] };
};
const cradleArms = (p, t) => { const k = cradle(p, t); return { armN: { to: k.hn, bend: 'd' }, armF: { to: k.hf, bend: 'd' }, props: [['bag', k.c, 46, 24, 0]] }; };
// Sac pris sur une chaise (dossier contre un mur, assise à 46) : prise à deux bras, dos plat, genoux fléchis
const chairWall = [['chair', 110, 46, -1], ['wall', 110, 14]];
const chairLift = (o = {}) => ({
  p: [0, 86], t: 48, h: 52,
  armN: { to: [72, 78], bend: 'u' }, armF: { to: [70, 76], bend: 'u' },
  legN: { to: [22, A], bend: 'f' }, legF: { to: [16, A], bend: 'f' },
  back: [...chairWall, ['bag', [90, 59], 40, 26, 0]],
  ...o,
});
// Bosu : dôme vers le haut centré en x, sommet à 28
const dome = (x) => ['bosu', x];

export const EXERCICES = [
  // ================= pilote =================
  {
    id: 'bird-dog', titre: 'Bird dog : à quatre pattes, bras et jambe opposés tendus',
    labels: ['À quatre pattes', 'Bras et jambe tendus'],
    a: quad(),
    b: quad({ armN: { a: [0, 0] }, legF: { a: [180, 180], foot: -90 } }),
  },
  {
    id: 'marche-du-fermier', titre: 'Marche du fermier : deux charges, une à chaque main',
    labels: ['Charges au sol', 'Marche, buste droit'],
    a: pickup({ props: (J) => [['db', J.haN], ['db', J.haF]] }),
    b: stride({ props: [(J) => [['db', J.haN], ['db', J.haF]], ...walkFwd] }),
  },
  {
    id: 'mobilite-cheville-au-mur', titre: 'Mobilité de cheville au mur : genou vers le mur, talon au sol',
    labels: ['Genou loin du mur', 'Genou vers le mur'],
    a: { p: [20, 110], t: 82, armN: { to: [88, 140], bend: 'd' }, armF: { to: [88, 135], bend: 'd' }, legN: { to: [55, A], bend: 'f' }, legF: { to: [-22, 16], bend: 'f', foot: -20 }, back: [['wall', 90, 14]] },
    b: { p: [48, 92], t: 75, armN: { to: [88, 140], bend: 'd' }, armF: { to: [88, 135], bend: 'd' }, legN: { to: [55, A], bend: 'f' }, legF: { to: [-20, 22], bend: 'f', foot: -40 }, back: [['wall', 90, 14]], props: [['arrow', [30, 50], [66, 50]]] },
  },
  {
    id: 'planche-touche-epaule', titre: 'Planche, une main touche l\'épaule opposée',
    labels: ['Planche, bras tendus', 'Une main touche l\'épaule'],
    a: plank(),
    b: plank({ armN: { a: [-40, 150] } }),
  },
  {
    id: 'pompe-archer', titre: 'Pompe en archer, vue de dessus : un bras plie, l\'autre reste tendu',
    view: 'top', labels: ['Vue de dessus : mains très larges', 'Un bras plie, l\'autre reste tendu'],
    a: { p: [0, 130], t: 90, tl: 90, hl: 12, sw: 22, hw: 9, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { a: [0, 0] }, armF: { a: [180, 180] }, back: [['rect', -60, 10, 120, 238, 0]] },
    b: { p: [16, 130], t: 90, tl: 90, hl: 12, sw: 22, hw: 9, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { a: [0, 75] }, armF: { a: [180, 180] }, back: [['rect', -44, 10, 120, 238, 0]], props: [['arrow', [-40, 80], [-10, 80]]] },
  },
  {
    id: 'pompe-piquee-pieds-sureleves', titre: 'Pompe piquée, pieds sur une marche',
    labels: ['Hanches hautes, bras tendus', 'Tête vers le sol'],
    a: { p: [-40, 118], t: -55, h: -70, armN: { to: [28, 6], bend: 'f' }, armF: { to: [22, 6], bend: 'f' }, legN: { to: [-100, 32], bend: 'f' }, legF: { to: [-96, 32], bend: 'f' }, back: [['step', -125, -80, 24]] },
    b: { p: [-20, 105], t: -75, h: -80, armN: { to: [28, 6], bend: 'u' }, armF: { to: [22, 6], bend: 'u' }, legN: { to: [-100, 32], bend: 'f' }, legF: { to: [-96, 32], bend: 'f' }, back: [['step', -125, -80, 24]] },
  },
  {
    id: 'pompe-piquee', titre: 'Pompe piquée : corps en V inversé, tête vers le sol',
    labels: ['Hanches hautes, bras tendus', 'Tête vers le sol'],
    a: { p: [-30, 108], t: -52, h: -70, armN: { to: [40, 6], bend: 'f' }, armF: { to: [34, 6], bend: 'f' }, legN: { to: [-62, A], bend: 'f' }, legF: { to: [-68, A], bend: 'f' } },
    b: { p: [-24, 100], t: -70, h: -80, armN: { to: [40, 6], bend: 'u' }, armF: { to: [34, 6], bend: 'u' }, legN: { to: [-62, A], bend: 'f' }, legF: { to: [-68, A], bend: 'f' } },
  },
  {
    id: 'porte-sac-a-dos-devant', titre: 'Portage d\'un sac à dos serré contre la poitrine',
    labels: ['Ramasser le sac, dos droit', 'Marcher, sac contre la poitrine'],
    a: pickup({ p: [-10, 50], t: 50, armN: { to: [48, 36], bend: 'f' }, armF: { to: [46, 34], bend: 'f' }, back: [['bag', [58, 23], 30, 44]] }),
    b: stride({ armN: { to: [32, 142], bend: 'd' }, armF: { to: [30, 138], bend: 'd' }, props: [['bag', [26, 148], 30, 44], ...walkFwd] }),
  },
  {
    id: 'porte-valise', titre: 'Marche en valise : une charge d\'un seul côté, buste droit',
    labels: ['Ramasser la charge', 'Marcher sans pencher'],
    a: pickup({ props: (J) => [['db', J.haN]] }),
    b: stride({ armN: { a: [-90, -90] }, armF: { a: [-80, -70] }, props: [(J) => [['db', J.haN]], ...walkFwd] }),
  },
  {
    id: 'pullover-haltere-au-sol', titre: 'Pullover avec haltère, allongé au sol',
    labels: ['Haltère au-dessus de la poitrine', 'Haltère derrière la tête'],
    a: supine({ p: [40, 11], legN: { to: [78, A], bend: 'u' }, legF: { to: [74, A], bend: 'u' }, armN: { a: [90, 92] }, armF: { a: [88, 90] }, props: (J) => [['db', J.haN, 90]] }),
    b: supine({ p: [40, 11], legN: { to: [78, A], bend: 'u' }, legF: { to: [74, A], bend: 'u' }, armN: { a: [160, 165] }, armF: { a: [158, 163] }, props: (J) => [['db', J.haN, 90], ['arrow', [-20, 100], [-70, 74]]] }),
  },
  {
    id: 'souleve-de-terre-roumain-unijambiste', titre: 'Soulevé de terre roumain sur une jambe',
    labels: ['Debout sur une jambe', 'Buste et jambe arrière alignés'],
    a: { p: [0, 111], t: 90, legN: { to: [0, A], bend: 'f' }, legF: { to: [-16, 24], bend: 'f', foot: -60 }, armN: { a: [-88, -88] }, armF: { a: [-86, -86] } },
    b: { p: [-18, 104], t: 2, h: -10, legN: { to: [0, A], bend: 'f' }, legF: { a: [182, 182], foot: -90 }, armN: { a: [-90, -90] }, armF: { a: [-90, -90] } },
  },
  {
    id: 'squat-assis-debout', titre: 'Squat assis-debout sur une chaise',
    labels: ['Assis au bord, bras devant', 'Debout, bien droit'],
    a: { p: [-48, 58], t: 80, armN: { a: [5, 0] }, armF: { a: [3, -2] }, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, back: [['chair', -75, 46, 1]] },
    b: { p: [-1, 112], t: 90, armN: { a: [5, 0] }, armF: { a: [3, -2] }, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, back: [['chair', -75, 46, 1]], props: [['arrow', [78, 70], [78, 120]]] },
  },
  {
    id: 'squat-fendu', titre: 'Squat fendu : descente à la verticale, talon arrière décollé',
    labels: ['Grand pas, debout', 'Descente à la verticale'],
    a: { p: [0, 104], t: 90, armN: { to: [10, 112], bend: 'b' }, armF: { to: [4, 110], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'f', foot: -40 } },
    b: { p: [0, 64], t: 90, armN: { to: [10, 74], bend: 'b' }, armF: { to: [4, 72], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'd', foot: -40 }, props: [['arrow', [-78, 150], [-78, 100]]] },
  },
  {
    id: 'squat-poids-du-corps', titre: 'Squat au poids du corps, bras devant',
    labels: ['Debout, bras devant', 'Cuisses à l\'horizontale'],
    a: { p: [0, 112], t: 90, armN: { a: [0, 0] }, armF: { a: [-3, -3] } },
    b: { p: [-32, 60], t: 62, h: 70, armN: { a: [0, 0] }, armF: { a: [-3, -3] }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' } },
  },
  {
    id: 'tirage-w-allonge', titre: 'Tirage en W, allongé sur le ventre',
    labels: ['Bras tendus devant', 'Coudes aux côtes : un W'],
    a: prone({ armN: { a: [8, 6] }, armF: { a: [6, 4] } }),
    b: prone({ armN: { a: [175, 12] }, armF: { a: [173, 10] }, props: [['arrow', [70, 50], [30, 50]]] }),
  },

  // ================= lot 01 =================
  {
    id: 'assis-debout-mains-cuisses', titre: 'Assis-debout avec les mains sur les cuisses',
    labels: ['Buste penché, mains sur les cuisses', 'Debout complètement'],
    a: { p: [-48, 58], t: 55, h: 50, armN: { to: [-5, 74], bend: 'u' }, armF: { to: [-10, 74], bend: 'u' }, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, back: [['chair', -75, 46, 1]] },
    b: { p: [-1, 112], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, back: [['chair', -75, 46, 1]], props: [['arrow', [78, 70], [78, 120]]] },
  },
  {
    id: 'bird-dog-jambe-seule', titre: 'Bird dog, jambe seule : une jambe tendue, mains au sol',
    labels: ['À quatre pattes', 'Une jambe tendue en arrière'],
    a: quad(),
    b: quad({ legF: { a: [180, 180], foot: -90 } }),
  },
  {
    id: 'bird-dog-pause', titre: 'Bird dog avec pause, puis coude et genou sous le ventre',
    labels: ['Pause, bras et jambe tendus', 'Coude et genou se rejoignent'],
    a: quad({ armN: { a: [0, 0] }, legF: { a: [180, 180], foot: -90 } }),
    b: quad({ armN: { a: [-115, 200] }, legF: { a: [-45, 190], foot: 180 } }),
  },
  {
    id: 'developpe-epaules-elastique', titre: 'Développé épaules avec élastique sous les pieds',
    labels: ['Poignées aux épaules', 'Bras tendus au-dessus de la tête'],
    a: { p: [0, 109], armN: { a: [-50, 92] }, armF: { a: [-52, 92] }, props: (J) => [['band', [[8, 6], J.haN]]] },
    b: { p: [0, 109], armN: { a: [78, 84] }, armF: { a: [76, 82] }, props: (J) => [['band', [[8, 6], J.haN]], ['arrow', [66, 150], [66, 215]]] },
  },
  {
    id: 'developpe-epaules-sac-a-dos', titre: 'Développé épaules avec un sac à dos tenu à deux mains',
    labels: ['Sac devant les épaules', 'Sac au-dessus de la tête'],
    a: { p: [0, 109], armN: { a: [-50, 92] }, armF: { a: [-52, 92] }, props: (J) => [['bag', [J.haN[0] + 14, J.haN[1] - 2], 26, 44, 0]] },
    b: { p: [0, 109], armN: { a: [78, 84] }, armF: { a: [76, 82] }, props: (J) => [['bag', [J.haN[0] + 4, J.haN[1] + 22], 26, 44, 0], ['arrow', [66, 150], [66, 215]]] },
  },
  {
    id: 'gainage-creux', titre: 'Gainage en creux : bas du dos plaqué, épaules décollées',
    labels: ['Genoux au-dessus des hanches', 'Jambes tendues, bras derrière la tête'],
    a: supine({ t: 172, h: 168, legN: { a: [90, 5] }, legF: { a: [90, 3] }, armN: { a: [0, 0] }, armF: { a: [-2, -2] } }),
    b: supine({ t: 172, h: 168, legN: { a: [8, 8], foot: 70 }, legF: { a: [7, 7], foot: 70 }, armN: { a: [178, 178] }, armF: { a: [176, 176] } }),
  },
  {
    id: 'marche-sac-a-dos', titre: 'Marche avec un sac à dos chargé, buste droit',
    labels: ['Sac sur les deux épaules', 'Marche à plat'],
    a: { p: [0, 112], props: (J) => [['bag', [J.sh[0] - 24, J.sh[1] - 22], 26, 46, 0]] },
    b: stride({ props: [(J) => [['bag', [J.sh[0] - 24, J.sh[1] - 22], 26, 46, 0]], ...walkFwd] }),
  },
  {
    id: 'pallof-elastique', titre: 'Pallof à l\'élastique, vu de dessus : résister à la rotation',
    view: 'top', labels: ['Vue de dessus : mains à la poitrine', 'Bras tendus, buste immobile'],
    a: { p: [0, 60], t: 90, tl: 40, hl: 0, sw: 22, hw: 10, face: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { to: [6, 124], bend: 'f' }, armF: { to: [-2, 124], bend: 'b' }, hide: ['legN', 'legF'], back: [['wall', 118, 14], ['anchor', 120, 124]], props: [(J) => [['band', [J.haN, [120, 124]]]]] },
    b: { p: [0, 60], t: 90, tl: 40, hl: 0, sw: 22, hw: 10, face: 90, armN: { to: [4, 186], bend: 'f' }, armF: { to: [-2, 186], bend: 'b' }, hide: ['legN', 'legF'], back: [['wall', 118, 14], ['anchor', 120, 124]], props: [(J) => [['band', [J.haN, [120, 124]]]]] },
  },
  {
    id: 'pompe-equilibre-mur', titre: 'Pompe en équilibre, pieds sur le mur (corps en L)',
    labels: ['Corps en L, pieds au mur', 'Coudes pliés, tête sans toucher'],
    a: { p: [-10, 137], t: -90, h: -90, armN: { a: [-90, -90] }, armF: { a: [-90, -90] }, legN: { to: [96, 137], bend: 'u', foot: 90 }, legF: { to: [92, 137], bend: 'u', foot: 90 }, back: [['wall', 100, 14]] },
    b: { p: [-10, 108], t: -90, h: -90, armN: { to: [-10, 6], bend: 'f' }, armF: { to: [-14, 6], bend: 'f' }, legN: { to: [96, 108], bend: 'u', foot: 90 }, legF: { to: [92, 108], bend: 'u', foot: 90 }, back: [['wall', 100, 14]] },
  },
  {
    id: 'porte-serveur', titre: 'Marche du serveur : une charge au-dessus de la tête, bras tendu',
    labels: ['Charge au-dessus de l\'épaule', 'Marche lente, buste droit'],
    a: { p: [0, 110], armN: { a: [89, 91] }, armF: { a: [-85, -80] }, props: (J) => [['db', [J.haN[0], J.haN[1] + 14]]] },
    b: stride({ armN: { a: [89, 91] }, armF: { a: [-70, -40] }, props: [(J) => [['db', [J.haN[0], J.haN[1] + 14]]], ...walkFwd] }),
  },
  {
    id: 'porte-un-haltere-epaule', titre: 'Marche avec un haltère tenu contre l\'épaule',
    labels: ['Haltère contre l\'épaule', 'Marche lente, buste droit'],
    a: { p: [0, 110], armN: { a: [-55, 100] }, armF: { a: [-85, -80] }, props: (J) => [['db', [J.haN[0] + 2, J.haN[1] + 8]]] },
    b: stride({ armN: { a: [-55, 100] }, armF: { a: [-70, -40] }, props: [(J) => [['db', [J.haN[0] + 2, J.haN[1] + 8]]], ...walkFwd] }),
  },
  {
    id: 'rowing-elastique', titre: 'Rowing à l\'élastique, assis, élastique autour des pieds',
    labels: ['Bras tendus, élastique tendu', 'Coudes en arrière, omoplates serrées'],
    a: { p: [-40, 11], t: 75, h: 75, legN: { a: [2, 2], foot: 80 }, legF: { a: [1, 1], foot: 80 }, armN: { to: [40, 40], bend: 'd' }, armF: { to: [36, 38], bend: 'd' }, back: [['mat', -140, 130]], props: (J) => [['band', [J.haN, [J.toN[0] - 10, 26]]]] },
    b: { p: [-40, 11], t: 100, h: 100, legN: { a: [2, 2], foot: 80 }, legF: { a: [1, 1], foot: 80 }, armN: { to: [-26, 50], bend: 'b' }, armF: { to: [-30, 48], bend: 'b' }, back: [['mat', -140, 130]], props: (J) => [['band', [J.haN, [J.toN[0] - 10, 26]]]] },
  },
  {
    id: 'rowing-sac-a-dos', titre: 'Rowing avec un sac à dos, buste penché dos plat',
    labels: ['Sac pendu sous les épaules', 'Sac tiré vers le ventre'],
    a: { p: [-30, 95], t: 20, h: 25, armN: { a: [-90, -90] }, armF: { a: [-92, -92] }, legN: { to: [4, A], bend: 'f' }, legF: { to: [-4, A], bend: 'f' }, props: (J) => [['bag', [J.haN[0], J.haN[1] - 14], 30, 40, 0]] },
    b: { p: [-30, 95], t: 20, h: 25, armN: { to: [-2, 90], bend: 'b' }, armF: { to: [-6, 88], bend: 'b' }, legN: { to: [4, A], bend: 'f' }, legF: { to: [-4, A], bend: 'f' }, props: (J) => [['bag', [J.haN[0], J.haN[1] - 14], 30, 40, 0]] },
  },
  {
    id: 'tirage-bras-tendus-elastique', titre: 'Tirage bras tendus à l\'élastique, ancré en haut',
    labels: ['Mains à hauteur d\'épaules', 'Mains aux cuisses, bras tendus'],
    a: { p: [0, 108], armN: { a: [5, 6] }, armF: { a: [3, 4] }, back: [['wall', 105, 14], ['anchor', 105, 215]], props: (J) => [['band', [J.haN, [105, 215]]]] },
    b: { p: [0, 108], armN: { a: [-70, -62] }, armF: { a: [-72, -64] }, back: [['wall', 105, 14], ['anchor', 105, 215]], props: (J) => [['band', [J.haN, [105, 215]]], ['arrow', [60, 190], [60, 130]]] },
  },
  {
    id: 'tirage-vertical-elastique-haut', titre: 'Tirage vertical à l\'élastique, à genoux face à l\'ancrage',
    labels: ['Bras tendus vers le haut', 'Coudes vers le bas et l\'arrière'],
    a: { p: [-5, 64], t: 90, armN: { a: [60, 62] }, armF: { a: [58, 60] }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130], ['wall', 106, 14], ['anchor', 106, 225]], props: (J) => [['band', [J.haN, [106, 225]]]] },
    b: { p: [-5, 64], t: 90, armN: { to: [24, 122], bend: 'd' }, armF: { to: [20, 120], bend: 'd' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130], ['wall', 106, 14], ['anchor', 106, 225]], props: (J) => [['band', [J.haN, [106, 225]]]] },
  },

  // ================= lot 02 =================
  {
    id: 'cheville-elastique', titre: 'Cheville à l\'élastique, vue de face du pied : le pied bascule sur la cheville',
    view: 'front', labels: ['Vue de face : pied neutre', 'Le pied bascule vers l\'extérieur'],
    a: { p: [0, 157], t: 90, hw: 0, ft: 30, noGround: true, hide: ['torso', 'head', 'armN', 'armF'], legN: { a: [-90, -90], foot: 0 }, legF: { a: [-90, -90], foot: 180 }, props: [['band', [[0, 54], [-105, 70]]], ['anchor', -105, 70], ['rect', -140, 0, 280, 8, 0]] },
    b: { p: [0, 157], t: 90, hw: 0, ft: 30, noGround: true, hide: ['torso', 'head', 'armN', 'armF'], legN: { a: [-90, -90], foot: -28 }, legF: { a: [-90, -90], foot: 152 }, props: [['band', [[0, 54], [-105, 70]]], ['anchor', -105, 70], ['rect', -140, 0, 280, 8, 0], ['arrow', [60, 100], [60, 70]]] },
  },
  {
    id: 'copenhague-court', titre: 'Copenhague court : gainage latéral, genou du dessus sur la chaise',
    labels: ['Sur le côté, genou sur la chaise', 'Bassin levé, corps aligné'],
    a: { p: [-20, 12], t: 180, h: 180, armN: { a: [-20, 180] }, armF: { a: [-22, 180] }, legN: { a: [38, 0] }, legF: { a: [3, 3] }, back: [['mat', -140, 40], ['chair', 62, 40, -1]] },
    b: { p: [-20, 40], t: 178, h: 178, armN: { a: [-90, 180] }, armF: { a: [-90, 180] }, legN: { a: [10, 0] }, legF: { a: [-12, -12] }, back: [['mat', -140, 40], ['chair', 62, 40, -1]], props: [['arrow', [-20, 100], [-20, 70]]] },
  },
  {
    id: 'curl-ischios-serviette', titre: 'Curl des ischios avec une serviette sous les talons',
    labels: ['Bassin haut, talons près des fesses', 'Talons glissés, bassin haut'],
    a: supine({ p: [5, 36], t: 200, h: 180, legN: { to: [62, 10], bend: 'u', foot: 70 }, legF: { to: [58, 10], bend: 'u', foot: 70 }, armN: { a: [-8, -2] }, armF: { a: [-6, 0] }, props: [['towel', [[45, 5], [82, 5]]]] }),
    b: supine({ p: [5, 36], t: 200, h: 180, legN: { to: [105, 10], bend: 'u', foot: 70 }, legF: { to: [101, 10], bend: 'u', foot: 70 }, armN: { a: [-8, -2] }, armF: { a: [-6, 0] }, props: [['towel', [[88, 5], [125, 5]]], ['arrow', [62, 28], [100, 28]]] }),
  },
  {
    id: 'equilibre-unipodal', titre: 'Équilibre sur une jambe, doigts au mur puis sans appui',
    labels: ['Doigts au mur', 'Sans appui'],
    a: { p: [0, 110], legN: { to: [0, A], bend: 'f' }, legF: { a: [-50, -100] }, armN: { to: [62, 150], bend: 'd' }, armF: { a: [-85, -80] }, back: [['wall', 62, 14]] },
    b: { p: [0, 110], legN: { to: [0, A], bend: 'f' }, legF: { a: [-50, -100] }, armN: { to: [10, 118], bend: 'b' }, armF: { to: [4, 116], bend: 'b' } },
  },
  {
    id: 'fente-laterale', titre: 'Fente latérale, vue de face : grand pas sur le côté',
    view: 'front', labels: ['Debout, pieds largeur de hanches', 'Pas large, une jambe fléchie'],
    a: { p: [0, 110], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armN: { to: [14, 150], bend: 'd' }, armF: { to: [-14, 150], bend: 'd' } },
    b: { p: [30, 88], legN: { to: [70, A], bend: 'f' }, legF: { to: [-50, A], bend: 'b' }, armN: { to: [14, 150], bend: 'd' }, armF: { to: [-14, 150], bend: 'd' }, props: [['arrow', [-40, 200], [10, 200]]] },
  },
  {
    id: 'glissement-mur-epaules', titre: 'Glissement des bras contre le mur, vu de face',
    view: 'front', labels: ['Bras à 90 degrés contre le mur', 'Bras glissés vers le haut'],
    a: { p: [0, 114], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [0, 90] }, armF: { a: [180, 90] }, back: [['bgwall']] },
    b: { p: [0, 114], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [60, 75] }, armF: { a: [120, 105] }, back: [['bgwall']], props: [['arrow', [100, 185], [100, 225]]] },
  },
  {
    id: 'marche-laterale-elastique', titre: 'Marche latérale avec une mini-bande autour des cuisses, vue de face',
    view: 'front', labels: ['Mini-bande tendue, genoux souples', 'Pas sur le côté, bande toujours tendue'],
    a: { p: [0, 104], legN: { to: [18, A], bend: 'f' }, legF: { to: [-18, A], bend: 'b' }, armN: { to: [14, 150], bend: 'd' }, armF: { to: [-14, 150], bend: 'd' }, props: (J) => [['band', [[J.knF[0], J.knF[1] + 14], [J.knN[0], J.knN[1] + 14]]]] },
    b: { p: [10, 104], legN: { to: [52, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armN: { to: [24, 150], bend: 'd' }, armF: { to: [-4, 150], bend: 'd' }, props: (J) => [['band', [[J.knF[0], J.knF[1] + 14], [J.knN[0], J.knN[1] + 14]]], ['arrow', [-40, 240], [10, 240]]] },
  },
  {
    id: 'mobilite-hanches-90-90', titre: 'Mobilité des hanches 90/90, vue de dessus',
    view: 'top', labels: ['Jambe avant et jambe arrière à 90°', 'Genoux basculés de l\'autre côté'],
    a: { p: [0, 70], t: 90, tl: 16, hl: -34, sw: 22, hw: 14, hide: ['torso'], legN: { a: [0, -90] }, legF: { a: [90, 180] }, armN: { to: [44, 90], bend: 'b' }, armF: { to: [-34, 108], bend: 'f' }, back: [['rect', -140, 20, 280, 220, 0], ['rect', -20, 56, 40, 40, 14]] },
    b: { p: [0, 70], t: 90, tl: 16, hl: -34, sw: 22, hw: 14, hide: ['torso'], legN: { a: [90, 0] }, legF: { a: [180, -90] }, armN: { to: [34, 108], bend: 'b' }, armF: { to: [-44, 90], bend: 'f' }, back: [['rect', -140, 20, 280, 220, 0], ['rect', -20, 56, 40, 40, 14]], props: [['arrow', [-30, 200], [30, 200]]] },
  },
  {
    id: 'ouverture-livre-thoracique', titre: 'Ouverture en livre, vue de dessus : couché sur le côté',
    view: 'top', labels: ['Bras tendus devant, paumes jointes', 'Le bras du dessus s\'ouvre en arc'],
    a: { p: [60, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { a: [90, 0] }, legF: { a: [88, 0] }, armN: { a: [90, 90] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 280, 190, 0]] },
    b: { p: [60, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { a: [90, 0] }, legF: { a: [88, 0] }, armN: { a: [-80, -80] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 280, 190, 0]], props: [['ring', [-20, 120], 40]] },
  },
  {
    id: 'pompe-plus', titre: 'Pompe plus : les omoplates bougent, les coudes restent tendus',
    labels: ['Poitrine entre les épaules', 'Dos arrondi, omoplates écartées'],
    a: plank({ t: 14, h: -5 }),
    b: plank({ t: 22, h: 15, props: [['arrow', [30, 90], [30, 112]]] }),
  },
  {
    id: 'rebonds-chevilles', titre: 'Rebonds sur les chevilles, genoux presque tendus',
    labels: ['Talons au sol', 'Sur l\'avant des pieds'],
    a: { p: [0, 112], legN: { to: [8, A], bend: 'f' }, legF: { to: [-6, A], bend: 'f' } },
    b: { p: [0, 128], legN: { to: [8, 24], bend: 'f', foot: -55 }, legF: { to: [-6, 24], bend: 'f', foot: -55 }, props: [['arrow', [70, 120], [70, 170]]] },
  },
  {
    id: 'reception-saut-stabilisee', titre: 'Réception de saut stabilisée : genoux au-dessus des pieds',
    labels: ['Petit saut', 'Réception amortie, stable'],
    a: { p: [0, 146], legN: { to: [6, 38], bend: 'f', foot: -50 }, legF: { to: [-6, 36], bend: 'f', foot: -50 }, armN: { a: [-30, 10] }, armF: { a: [-32, 8] }, props: [['arrow', [96, 200], [96, 140]]] },
    b: { p: [-22, 82], t: 72, h: 80, legN: { to: [8, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' }, armN: { a: [10, 5] }, armF: { a: [8, 3] } },
  },
  {
    id: 'releve-mollets', titre: 'Relevé de mollets, une main au mur',
    labels: ['Talons au sol', 'Sur la pointe des pieds'],
    a: { p: [0, 112], legN: { to: [8, A], bend: 'f' }, legF: { to: [-6, A], bend: 'f' }, armN: { to: [62, 158], bend: 'd' }, armF: { to: [-8, 112], bend: 'b' }, back: [['wall', 64, 14]] },
    b: { p: [0, 128], legN: { to: [8, 24], bend: 'f', foot: -55 }, legF: { to: [-6, 24], bend: 'f', foot: -55 }, armN: { to: [62, 158], bend: 'd' }, armF: { to: [-8, 128], bend: 'b' }, back: [['wall', 64, 14]], props: [['arrow', [-60, 80], [-60, 130]]] },
  },
  {
    id: 'ytw-sol', titre: 'Y, T, W allongé sur le ventre, vu de dessus',
    view: 'top', labels: ['Y : bras en V', 'T : bras en croix', 'W : coudes aux hanches'],
    a: { p: [0, 110], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { a: [58, 58] }, armF: { a: [122, 122] }, hide: [], back: [['rect', -60, 0, 120, 250, 0]] },
    b: { p: [0, 110], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { a: [0, 0] }, armF: { a: [180, 180] }, back: [['rect', -60, 0, 120, 250, 0]] },
    c: { p: [0, 110], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, armN: { a: [-55, 55] }, armF: { a: [235, 125] }, back: [['rect', -60, 0, 120, 250, 0]] },
  },

  // ================= lot 03 =================
  {
    id: 'accroupi-profond-tenu', titre: 'Accroupi profond tenu, mains jointes devant la poitrine',
    labels: ['Debout, pieds un peu écartés', 'Accroupi profond, poitrine ouverte'],
    a: { p: [0, 112], armN: { to: [18, 146], bend: 'd' }, armF: { to: [14, 146], bend: 'd' } },
    b: { p: [-26, 40], t: 75, h: 80, legN: { to: [8, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' }, armN: { to: [16, 100], bend: 'd' }, armF: { to: [12, 100], bend: 'd' } },
  },
  {
    id: 'boxe-dans-le-vide', titre: 'Boxe dans le vide : garde haute puis coup droit',
    labels: ['Garde, poings près du menton', 'Coup droit, coude non verrouillé'],
    a: { p: [-2, 106], t: 88, legN: { to: [24, A], bend: 'f' }, legF: { to: [-26, A], bend: 'f' }, armN: { to: [30, 166], bend: 'd' }, armF: { to: [22, 168], bend: 'd' } },
    b: { p: [-2, 106], t: 84, legN: { to: [24, A], bend: 'f' }, legF: { to: [-26, A], bend: 'f' }, armN: { a: [2, 0] }, armF: { to: [22, 168], bend: 'd' }, props: [['arrow', [100, 200], [130, 200]]] },
  },
  {
    id: 'cercles-de-cheville', titre: 'Cercles de cheville, allongé jambe levée',
    labels: ['Pied vers soi', 'Pied pointé : cercle lent'],
    a: supine({ p: [-10, 11], legN: { a: [90, 88], foot: 160 }, legF: { a: [0, 0], foot: 80 }, armN: { to: [-12, 60], bend: 'u' }, armF: { to: [-14, 62], bend: 'u' } }),
    b: supine({ p: [-10, 11], legN: { a: [90, 88], foot: 40 }, legF: { a: [0, 0], foot: 80 }, armN: { to: [-12, 60], bend: 'u' }, armF: { to: [-14, 62], bend: 'u' }, props: (J) => [['ring', [J.anN[0] + 5, J.anN[1] + 8], 24]] }),
  },
  {
    id: 'etirement-pectoraux-mur', titre: 'Étirement des pectoraux contre un mur, vue de face',
    view: 'front', labels: ['Avant-bras contre le mur', 'Buste tourné à l\'opposé du bras'],
    a: { p: [0, 114], t: 90, sw: 22, legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [0, 90] }, armF: { a: [-95, -95] }, back: [['wall', 58, 16]] },
    b: { p: [0, 114], t: 90, sw: 9, legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [0, 90] }, armF: { a: [-100, -90] }, back: [['wall', 58, 16]], props: [['arrow', [-70, 200], [-70, 235]]] },
  },
  {
    id: 'extension-thoracique', titre: 'Extension du haut du dos sur le dossier d\'une chaise',
    labels: ['Assis droit, mains derrière la tête', 'Haut du dos qui s\'ouvre sur le dossier'],
    a: { p: [-22, 58], t: 90, h: 90, armN: { a: [35, 172] }, armF: { a: [37, 172] }, legN: { to: [30, A], bend: 'f' }, legF: { to: [24, A], bend: 'f' }, back: [['chair', -36, 46, 1]] },
    b: { p: [-22, 58], t: 108, h: 120, armN: { a: [53, 190] }, armF: { a: [55, 190] }, legN: { to: [30, A], bend: 'f' }, legF: { to: [24, A], bend: 'f' }, back: [['chair', -36, 46, 1]] },
  },
  {
    id: 'grenouille-hanches', titre: 'Grenouille : à quatre pattes, bassin vers les talons',
    labels: ['À quatre pattes', 'Bassin reculé vers les talons'],
    a: { p: [-14, 60], t: 0, h: 10, armN: { to: [50, 6], bend: 'f' }, armF: { to: [44, 6], bend: 'f' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130]] },
    b: { p: [-62, 32], t: 15, h: 10, armN: { to: [50, 6], bend: 'f' }, armF: { to: [44, 6], bend: 'f' }, legN: { a: [-30, 180], foot: 180 }, legF: { a: [-30, 180], foot: 180 }, back: [['mat', -140, 130]], props: [['arrow', [-30, 90], [-80, 90]]] },
  },
  {
    id: 'jumping-jacks', titre: 'Jumping jacks, vue de face',
    view: 'front', labels: ['Pieds joints, bras le long du corps', 'Pieds écartés, bras en l\'air'],
    a: { p: [0, 114], legN: { to: [8, A], bend: 'f' }, legF: { to: [-8, A], bend: 'b' }, armN: { a: [-85, -85] }, armF: { a: [-95, -95] } },
    b: { p: [0, 112], legN: { to: [38, 12], bend: 'f' }, legF: { to: [-38, 12], bend: 'b' }, armN: { a: [60, 76] }, armF: { a: [120, 104] } },
  },
  {
    id: 'marche-rapide-intervalles', titre: 'Marche rapide en alternance avec des passages tranquilles',
    labels: ['Allure rapide', 'Allure tranquille'],
    a: stride({ t: 86, legN: { to: [30, A], bend: 'f' }, legF: { to: [-30, 16], bend: 'f', foot: -40 }, armN: { to: [30, 140], bend: 'd' }, armF: { to: [-30, 128], bend: 'd' }, props: [['arrow', [62, 205], [122, 205]]] }),
    b: stride({ legN: { to: [12, A], bend: 'f' }, legF: { to: [-14, 12], bend: 'f', foot: -20 }, armN: { a: [-100, -90] }, armF: { a: [-80, -70] }, props: [['arrow', [62, 205], [90, 205]]] }),
  },
  {
    id: 'montees-genoux-sur-place', titre: 'Montées de genoux sur place, mains devant à hauteur de la taille',
    labels: ['Un genou vers la main', 'L\'autre genou'],
    a: { p: [0, 114], legN: { a: [4, -85], foot: -20 }, legF: { to: [-4, A], bend: 'f' }, armN: { to: [42, 120], bend: 'd' }, armF: { to: [40, 116], bend: 'd' } },
    b: { p: [0, 114], legF: { a: [4, -85], foot: -20 }, legN: { to: [4, A], bend: 'f' }, armN: { to: [42, 120], bend: 'd' }, armF: { to: [40, 116], bend: 'd' } },
  },
  {
    id: 'pas-chasses-lateraux', titre: 'Pas chassés latéraux, vue de face',
    view: 'front', labels: ['Posture prête, genoux souples', 'Pas de côté, l\'autre pied rejoint'],
    a: { p: [0, 100], legN: { to: [20, A], bend: 'f' }, legF: { to: [-20, A], bend: 'b' }, armN: { to: [36, 130], bend: 'd' }, armF: { to: [-36, 130], bend: 'd' } },
    b: { p: [20, 100], legN: { to: [56, A], bend: 'f' }, legF: { to: [-4, A], bend: 'b' }, armN: { to: [56, 130], bend: 'd' }, armF: { to: [-16, 130], bend: 'd' }, props: [['arrow', [-50, 200], [0, 200]]] },
  },
  {
    id: 'passage-de-bras-serviette', titre: 'Passage de bras avec une serviette tendue, vue de face',
    view: 'front', labels: ['Serviette tendue devant les cuisses', 'Bras tendus au-dessus de la tête'],
    a: { p: [0, 114], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [-62, -62] }, armF: { a: [-118, -118] }, props: (J) => [['towel', [J.haF, J.haN]]] },
    b: { p: [0, 114], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [70, 72] }, armF: { a: [110, 108] }, props: (J) => [['towel', [J.haF, J.haN]]] },
  },
  {
    id: 'rotation-bucheron', titre: 'Rotation en bûcheron, vue de face : de haut en diagonale vers le bas',
    view: 'front', labels: ['Mains en haut, d\'un côté', 'Diagonale vers la hanche opposée'],
    a: { p: [0, 108], t: 84, legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { to: [64, 218], bend: 'f' }, armF: { to: [62, 216], bend: 'f' } },
    b: { p: [-8, 92], t: 102, legN: { to: [20, A], bend: 'f' }, legF: { to: [-24, A], bend: 'b' }, armN: { to: [-44, 96], bend: 'f' }, armF: { to: [-46, 98], bend: 'f' }, props: [['arrow', [70, 190], [20, 120]]] },
  },
  {
    id: 'rotation-thoracique-assise', titre: 'Rotation thoracique assise, vue de face, bras croisés',
    view: 'front', labels: ['Assis grand, bras croisés', 'Seul le haut du dos tourne'],
    a: { p: [0, 58], t: 90, sw: 22, hide: ['legN', 'legF'], armN: { to: [-18, 124], bend: 'u' }, armF: { to: [18, 124], bend: 'u' }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]] },
    b: { p: [0, 58], t: 90, sw: 9, hide: ['legN', 'legF'], armN: { to: [-12, 124], bend: 'u' }, armF: { to: [14, 124], bend: 'u' }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]], props: [['arrow', [-70, 200], [-30, 215]]] },
  },
  // ================= lot 04 (cou et arrière d'épaule) =================
  {
    id: 'rotation-douce-cou', titre: 'Rotation douce du cou, vue de face, assis',
    view: 'front', labels: ['Assis grand, regard devant', 'Tête tournée, épaules relâchées'],
    a: { p: [0, 58], t: 90, sw: 22, hide: ['legN', 'legF'], armN: { a: [-92, -92] }, armF: { a: [-88, -88] }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]] },
    b: { p: [0, 58], t: 90, sw: 22, face: 0, hide: ['legN', 'legF'], armN: { a: [-92, -92] }, armF: { a: [-88, -88] }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]], props: [['arrow', [-30, 215], [30, 215]]] },
  },
  {
    id: 'inclinaison-douce-cou', titre: 'Inclinaison douce du cou, vue de face, assis',
    view: 'front', labels: ['Assis grand, regard devant', 'Oreille vers l\'épaule, épaule basse'],
    a: { p: [0, 58], t: 90, sw: 22, hide: ['legN', 'legF'], armN: { a: [-92, -92] }, armF: { a: [-88, -88] }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]] },
    b: { p: [0, 58], t: 90, sw: 22, h: 62, hl: 22, hide: ['legN', 'legF'], armN: { a: [-92, -92] }, armF: { a: [-88, -88] }, back: [['rect', -46, 40, 92, 10, 3], ['rect', -44, 0, 8, 40, 0], ['rect', 36, 0, 8, 40, 0]], props: [['arrow', [-10, 232], [40, 222]]] },
  },
  {
    id: 'retraction-cervicale', titre: 'Rentrer le menton, vue de profil, debout',
    labels: ['Tête avancée, regard devant', 'Menton rentré, tête reculée'],
    a: { p: [0, 112], t: 90, h: 28, hl: 26, armN: { a: [-92, -90] }, armF: { a: [-88, -86] } },
    b: { p: [0, 112], t: 90, h: 90, hl: 20, armN: { a: [-92, -90] }, armF: { a: [-88, -86] }, props: [['arrow', [70, 208], [20, 208]]] },
  },
  {
    id: 'retraction-omoplates', titre: 'Serrer les omoplates, vue de profil, debout',
    labels: ['Épaules relâchées', 'Omoplates rapprochées'],
    a: { p: [0, 112], t: 84, h: 75, armN: { a: [-78, -76] }, armF: { a: [-76, -74] } },
    b: { p: [0, 112], t: 92, h: 90, armN: { a: [-104, -102] }, armF: { a: [-102, -100] }, props: [['arrow', [40, 150], [-10, 150]]] },
  },
  {
    id: 'face-pull-elastique', titre: 'Tirage au visage à l\'élastique, ancré en haut',
    labels: ['Bras tendus vers l\'ancrage', 'Mains au visage, coudes écartés'],
    a: { p: [-20, 110], t: 94, h: 90, legN: { to: [0, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, armN: { to: [50, 170], bend: 'd' }, armF: { to: [46, 168], bend: 'd' }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]]] },
    b: { p: [-20, 110], t: 94, h: 90, legN: { to: [0, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, armN: { to: [14, 190], bend: 'b' }, armF: { to: [10, 186], bend: 'b' }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]], ['arrow', [60, 150], [20, 150]]] },
  },
  {
    id: 'oiseau-un-bras-appuye', titre: 'Oiseau un bras, vue de dessus, une main appuyée sur une chaise',
    view: 'top', labels: ['Buste penché, bras pendant', 'Bras levé sur le côté'],
    a: { p: [0, 60], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, hide: ['legN', 'legF'], armN: { a: [-35, -35] }, armF: { a: [120, 120] }, back: [['rect', -80, 150, 60, 14, 3]] },
    b: { p: [0, 60], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, hide: ['legN', 'legF'], armN: { a: [0, 0] }, armF: { a: [120, 120] }, back: [['rect', -80, 150, 60, 14, 3]], props: [['arrow', [70, 100], [100, 130]]] },
  },
  {
    id: 'ecartement-serviette', titre: 'Écartement d\'une serviette bras tendus, vue de dessus',
    view: 'top', labels: ['Serviette tendue', "Mains vers l'extérieur"],
    a: { p: [0, 40], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { to: [24, 172], bend: 'f' }, armF: { to: [-24, 172], bend: 'f' }, props: (J) => [['towel', [J.haF, J.haN]]] },
    b: { p: [0, 40], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { to: [56, 160], bend: 'f' }, armF: { to: [-56, 160], bend: 'f' }, props: (J) => [['towel', [J.haF, J.haN]], ['arrow', [62, 190], [92, 190]], ['arrow', [-62, 190], [-92, 190]]] },
  },
  {
    id: 'tirage-visage-sangles', titre: 'Tirage au visage aux sangles de suspension, corps incliné',
    labels: ['Bras tendus, corps incliné en arrière', 'Mains au visage, coudes écartés'],
    a: { p: [-22, 108], t: 100, h: 100, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [52, 150], bend: 'd' }, armF: { to: [48, 148], bend: 'd' }, back: [['wall', 150, 14], ['anchor', 150, 230]], props: (J) => [['band', [J.haN, [150, 230]]]] },
    b: { p: [-12, 110], t: 94, h: 92, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [16, 186], bend: 'b' }, armF: { to: [12, 182], bend: 'b' }, back: [['wall', 150, 14], ['anchor', 150, 230]], props: (J) => [['band', [J.haN, [150, 230]]], ['arrow', [70, 150], [30, 150]]] },
  },
  {
    id: 'hip-thrust-banc', titre: 'Hip thrust, poids du corps : haut du dos sur un banc, hanches qui montent',
    labels: ['Bassin bas, haut du dos sur le banc', 'Buste et cuisses alignés'],
    a: { p: [-5, 22], t: 155, h: 165, armN: { to: [10, 28], bend: 'd' }, armF: { to: [6, 28], bend: 'd' }, legN: { to: [40, A], bend: 'f' }, legF: { to: [34, A], bend: 'f' }, back: [['step', -135, -58, 40]] },
    b: { p: [-5, 54], t: 180, h: 175, armN: { to: [10, 56], bend: 'd' }, armF: { to: [6, 56], bend: 'd' }, legN: { to: [40, A], bend: 'f' }, legF: { to: [34, A], bend: 'f' }, back: [['step', -135, -58, 40]], props: [['arrow', [-5, 82], [-5, 110]]] },
  },
  {
    id: 'montee-sur-banc', titre: 'Montée sur banc, sans charge : un pied sur le banc, on se redresse dessus',
    labels: ['Un pied posé sur le banc', 'Debout sur le banc, genou levé'],
    a: { p: [-20, 100], t: 90, h: 90, armN: { a: [-90, -90] }, armF: { a: [-90, -90] }, legN: { to: [30, 48], bend: 'f' }, legF: { to: [-22, A], bend: 'f' }, back: [['step', 12, 92, 40]] },
    b: { p: [40, 150], t: 90, h: 90, armN: { a: [-90, -90] }, armF: { a: [-90, -90] }, legN: { to: [40, 48], bend: 'f' }, legF: { to: [56, 98], bend: 'f' }, back: [['step', 12, 92, 40]], props: [['arrow', [-30, 60], [-30, 110]]] },
  },
  // ================= lot 06 =================
  {
    id: 'tirage-vertical-allonge-ventre', titre: 'Tirage vertical allongé sur le ventre : bras tendus devant, puis coudes vers les côtes, poitrine au sol',
    labels: ['Bras tendus devant', 'Coudes aux côtes, poitrine au sol'],
    a: prone({ armN: { a: [4, 4] }, armF: { a: [2, 2] } }),
    b: prone({ armN: { a: [172, 8] }, armF: { a: [174, 6] }, props: [['arrow', [110, 50], [70, 50]]] }),
  },
  {
    id: 'tirage-vertical-serviette', titre: 'Tirage vertical à la serviette, vue de face : serviette tendue bras levés, puis mains devant la poitrine',
    view: 'front', labels: ['Bras levés, serviette tendue', 'Mains devant la poitrine, coudes bas'],
    a: { p: [0, 112], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { a: [72, 76] }, armF: { a: [108, 104] }, props: (J) => [['towel', [J.haF, J.haN]]] },
    b: { p: [0, 112], legN: { to: [12, A], bend: 'f' }, legF: { to: [-12, A], bend: 'b' }, armN: { to: [42, 168], bend: 'd' }, armF: { to: [-42, 168], bend: 'd' }, props: (J) => [['towel', [J.haF, J.haN]], ['arrow', [96, 230], [96, 180]]] },
  },
  {
    id: 'releve-mollets-assis', titre: 'Relevé de mollets assis sur une chaise : talons au sol, puis talons levés',
    labels: ['Assis, talons au sol', 'Talons levés'],
    a: { p: [-48, 58], t: 88, armN: { to: [4, 66], bend: 'd' }, armF: { to: [0, 66], bend: 'd' }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, back: [['chair', -75, 46, 1]] },
    b: { p: [-48, 58], t: 88, armN: { to: [4, 66], bend: 'd' }, armF: { to: [0, 66], bend: 'd' }, legN: { to: [8, 26], bend: 'f', foot: -55 }, legF: { to: [2, 26], bend: 'f', foot: -55 }, back: [['chair', -75, 46, 1]], props: [['arrow', [60, 20], [60, 55]]] },
  },
  {
    id: 'releve-tibial-mur', titre: 'Relevé du tibial contre un mur : dos au mur, pieds avancés, pointes de pieds levées',
    labels: ['Dos au mur, pieds à plat', 'Pointes de pieds levées, talons au sol'],
    a: { p: [-14, 108], t: 97, h: 90, armN: { a: [-90, -88] }, armF: { a: [-88, -86] }, legN: { to: [36, A], bend: 'f' }, legF: { to: [28, A], bend: 'f' }, back: [['wall', -26, -14]] },
    b: { p: [-14, 108], t: 97, h: 90, armN: { a: [-90, -88] }, armF: { a: [-88, -86] }, legN: { to: [36, A], bend: 'f', foot: 28 }, legF: { to: [28, A], bend: 'f', foot: 28 }, back: [['wall', -26, -14]], props: [['arrow', [78, 14], [78, 44]]] },
  },
  {
    id: 'marche-pointes-talons', titre: 'Marche sur les pointes, puis sur les talons : vue de profil',
    labels: ['Marche sur les pointes', 'Marche sur les talons, pointes levées'],
    a: stride({ p: [0, 119], legN: { to: [20, 24], bend: 'f', foot: -55 }, legF: { to: [-22, 24], bend: 'f', foot: -55 }, props: walkFwd }),
    b: stride({ p: [0, 112], legN: { to: [24, A], bend: 'f', foot: 30 }, legF: { to: [-22, A], bend: 'f', foot: 30 }, props: walkFwd }),
  },
  {
    id: 'releve-mollets-halteres', titre: 'Relevé de mollets debout avec deux haltères le long du corps',
    labels: ['Debout, talons au sol', 'Talons levés, sur la pointe des pieds'],
    a: { p: [0, 112], armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, props: (J) => [['db', J.haN], ['db', J.haF]] },
    b: { p: [0, 128], armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, legN: { to: [8, 24], bend: 'f', foot: -55 }, legF: { to: [-6, 24], bend: 'f', foot: -55 }, props: (J) => [['db', J.haN], ['db', J.haF], ['arrow', [70, 120], [70, 160]]] },
  },
  {
    id: 'abduction-couchee-cote', titre: 'Abduction couchée sur le côté, vue de face : jambe du dessous pliée, jambe du dessus levée peu haut',
    view: 'front', labels: ['Sur le côté, jambe du dessous pliée', 'Jambe du dessus levée, peu haut'],
    a: { p: [-40, 20], t: 180, h: 180, tl: 68, sw: 12, hw: 8, hide: ['armF'], armN: { to: [-96, 38], bend: 'u' }, legN: { a: [3, 3] }, legF: { a: [18, -35] }, back: [['mat', -170, 130]] },
    b: { p: [-40, 20], t: 180, h: 180, tl: 68, sw: 12, hw: 8, hide: ['armF'], armN: { to: [-96, 38], bend: 'u' }, legN: { a: [20, 20] }, legF: { a: [18, -35] }, back: [['mat', -170, 130]], props: [['arrow', [70, 70], [70, 100]]] },
  },
  {
    id: 'abduction-quatre-pattes', titre: 'Abduction à quatre pattes, vue de dessus : genou plié levé de côté',
    view: 'top', labels: ['À quatre pattes, genoux sous les hanches', 'Genou levé de côté, jambe pliée'],
    a: { p: [0, 110], t: 90, tl: 70, hl: 18, sw: 22, hw: 14, h: 90, armN: { a: [90, 90] }, armF: { a: [90, 90] }, legN: { a: [-90, -90] }, legF: { a: [-90, -90] }, back: [['rect', -60, 0, 120, 230, 6]] },
    b: { p: [0, 110], t: 90, tl: 70, hl: 18, sw: 22, hw: 14, h: 90, armN: { a: [90, 90] }, armF: { a: [90, 90] }, legN: { a: [-5, -85] }, legF: { a: [-90, -90] }, back: [['rect', -60, 0, 120, 230, 6]], props: [['arrow', [78, 60], [108, 60]]] },
  },
  {
    id: 'marche-laterale-poids-du-corps', titre: 'Marche latérale sans élastique, vue de face : pas sur le côté, genoux souples',
    view: 'front', labels: ['Debout, genoux légèrement fléchis', 'Pas sur le côté, bassin bas'],
    a: { p: [0, 106], legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { to: [14, 130], bend: 'd' }, armF: { to: [-14, 130], bend: 'd' } },
    b: { p: [20, 100], legN: { to: [48, A], bend: 'f' }, legF: { to: [-8, A], bend: 'b' }, armN: { to: [34, 130], bend: 'd' }, armF: { to: [6, 130], bend: 'd' }, props: [['arrow', [-30, 200], [20, 200]]] },
  },
  {
    id: 'abduction-hanche-poulie', titre: 'Abduction de hanche à la poulie basse, vue de face : sangle à la cheville, une main sur le montant, jambe levée de côté',
    view: 'front', labels: ['Une main sur le montant, sangle', 'Jambe levée de côté, tendue'],
    a: { p: [0, 112], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-62, 138], bend: 'b' }, armN: { to: [26, 122], bend: 'f' }, back: [['wall', -124, -14], ['anchor', -124, 24], ['rect', -72, 0, 14, 144, 3]], props: (J) => [['band', [J.anN, [-124, 24]]]] },
    b: { p: [0, 112], legN: { to: [84, 38], bend: 'u' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-62, 138], bend: 'b' }, armN: { to: [26, 122], bend: 'f' }, back: [['wall', -124, -14], ['anchor', -124, 24], ['rect', -72, 0, 14, 144, 3]], props: (J) => [['band', [J.anN, [-124, 24]]], ['arrow', [60, 110], [96, 90]]] },
  },
  {
    id: 'abduction-hanche-machine', titre: 'Abduction de hanche à la machine, vue de face : assis, genoux qui s\'écartent contre les coussins',
    view: 'front', labels: ['Assis, genoux contre les coussins', 'Genoux écartés'],
    a: { p: [0, 58], armN: { to: [26, 80], bend: 'd' }, armF: { to: [-26, 80], bend: 'd' }, legN: { to: [26, A], bend: 'f' }, legF: { to: [-26, A], bend: 'b' }, back: [['rect', -26, 38, 52, 12, 3], ['rect', -12, 50, 24, 100, 6]], props: (J) => [['rect', J.knN[0] + 2, J.knN[1] - 16, 11, 32, 4], ['rect', J.knF[0] - 13, J.knF[1] - 16, 11, 32, 4]] },
    b: { p: [0, 58], armN: { to: [26, 80], bend: 'd' }, armF: { to: [-26, 80], bend: 'd' }, legN: { to: [62, A], bend: 'f' }, legF: { to: [-62, A], bend: 'b' }, back: [['rect', -26, 38, 52, 12, 3], ['rect', -12, 50, 24, 100, 6]], props: (J) => [['rect', J.knN[0] + 2, J.knN[1] - 16, 11, 32, 4], ['rect', J.knF[0] - 13, J.knF[1] - 16, 11, 32, 4], ['arrow', [50, 110], [92, 110]], ['arrow', [-50, 110], [-92, 110]]] },
  },
  {
    id: 'releve-mollets-machine', titre: 'Relevé de mollets à la machine : debout épaules sous les coussins',
    labels: ['Debout, talons dans le vide', 'Debout, sur la pointe des pieds'],
    a: { p: [0, 128], armN: { to: [14, 196], bend: 'd' }, armF: { to: [-8, 196], bend: 'd' }, legN: { to: [8, 22], bend: 'f', foot: -15 }, legF: { to: [2, 22], bend: 'f', foot: -15 }, back: [['rect', -50, 0, 12, 250, 2], ['step', -6, 40, 16]], props: (J) => [['rect', J.sh[0] - 16, J.sh[1] - 2, 32, 14, 5], ['rect', -44, J.sh[1] - 2, 36, 10, 2]] },
    b: { p: [0, 144], armN: { to: [14, 212], bend: 'd' }, armF: { to: [-8, 212], bend: 'd' }, legN: { to: [14, 38], bend: 'f', foot: -60 }, legF: { to: [8, 38], bend: 'f', foot: -60 }, back: [['rect', -50, 0, 12, 250, 2], ['step', -6, 40, 16]], props: (J) => [['rect', J.sh[0] - 16, J.sh[1] - 2, 32, 14, 5], ['rect', -44, J.sh[1] - 2, 36, 10, 2], ['arrow', [78, 60], [78, 100]]] },
  },
  {
    id: 'abduction-hanche-debout', titre: 'Abduction de hanche debout, vue de face : une main sur le dossier de la chaise, buste droit, jambe levée peu haut',
    view: 'front', labels: ['Une main sur le dossier, buste droit', 'Jambe levée de côté, peu haut'],
    a: { p: [0, 112], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-52, 124], bend: 'b' }, armN: { to: [20, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3]] },
    b: { p: [0, 112], legN: { to: [55, 22], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-52, 124], bend: 'b' }, armN: { to: [20, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3]], props: [['arrow', [66, 90], [96, 80]]] },
  },
  {
    id: 'dips-banc-triceps', titre: 'Dips sur banc : genoux pliés puis jambes tendues, mains sur le banc derrière soi',
    labels: ['Départ : bras tendus, genoux pliés', 'Bas : coudes à 90°, pas plus', 'Échelon 2 : jambes tendues'],
    a: { p: [18, 53], t: 90, h: 90, armN: { to: [-4, 46], bend: 'b' }, armF: { to: [-6, 46], bend: 'b' }, legN: { to: [72, A], bend: 'f' }, legF: { to: [66, A], bend: 'f' }, back: [['step', -90, 4, 46]] },
    b: { p: [18, 30], t: 90, h: 90, armN: { to: [-4, 46], bend: 'b' }, armF: { to: [-6, 46], bend: 'b' }, legN: { to: [72, A], bend: 'f' }, legF: { to: [66, A], bend: 'f' }, back: [['step', -90, 4, 46]], props: [['arrow', [-40, 70], [-40, 100]]] },
    c: { p: [0, 30], t: 90, h: 90, armN: { to: [-22, 46], bend: 'b' }, armF: { to: [-24, 46], bend: 'b' }, legN: { to: [112, A], bend: 'f' }, legF: { to: [107, A], bend: 'f' }, back: [['step', -108, -14, 46]], props: [['arrow', [-58, 70], [-58, 100]]] },
  },
  {
    id: 'clam-coquille', titre: 'Coquille (clam), vue de dessus : couché sur le côté, hanches et genoux pliés, pieds joints, le genou du dessus qui s ouvre',
    view: 'top', labels: ['Hanches et genoux pliés, pieds joints', 'Genou du dessus ouvert, pieds joints'],
    a: { p: [-40, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { to: [36, 122], bend: 'f' }, legF: { to: [36, 122], bend: 'b' }, armN: { a: [90, 90] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 300, 190, 0]] },
    b: { p: [-40, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { to: [36, 122], bend: 'f' }, legF: { to: [28, 124], bend: 'b' }, armN: { a: [90, 90] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 300, 190, 0]], props: [['arrow', [20, 185], [20, 210]]] },
  },
  // ================= lot 07 (barre) : illustrations des fiches sans photo adaptée =================
  {
    id: 'squat-arriere-barre', titre: 'Squat arrière à la barre : barre sur le haut du dos dans un rack à barres de sécurité (jaune), descente jusqu\'aux cuisses parallèles',
    labels: ['Barre sur le haut du dos', 'Cuisses parallèles au sol'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: rackBack(-100, 168, 106), props: (J) => [...barPlate(J), ['arrow', [78, 190], [78, 130]]] },
    b: { p: [-32, 60], t: 62, h: 70, armN: { to: [-5, 120], bend: 'b' }, armF: { to: [-7, 119], bend: 'b' }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, back: rackBack(-100, 168, 106), props: (J) => [...barPlate(J), ['arrow', [78, 90], [78, 150]]] },
  },
  {
    id: 'squat-avant-barre', titre: 'Squat avant à la barre : barre sur l\'avant des épaules, coudes hauts, rack à barres de sécurité (jaune)',
    labels: ['Barre sur l\'avant des épaules', 'Buste droit, coudes hauts'],
    a: { p: [0, 112], t: 90, armN: { to: [8, 184], bend: 'f' }, armF: { to: [5, 183], bend: 'f' }, back: rackBack(-100, 168, 106), props: (J) => [...barPlate(J), ['arrow', [78, 190], [78, 130]]] },
    b: { p: [-28, 62], t: 76, h: 80, armN: { to: [-3, 140], bend: 'f' }, armF: { to: [-5, 139], bend: 'f' }, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, back: rackBack(-100, 168, 108), props: (J) => [...barPlate(J), ['arrow', [78, 90], [78, 150]]] },
  },
  {
    id: 'squat-barre-repere-banc', titre: 'Squat avec repère : on touche le banc derrière soi sans s\'asseoir ; barres de sécurité (jaune) 3 à 5 cm sous la barre quand on touche le banc',
    labels: ['Debout, barre sur le dos', 'Touche le banc, sans t\'asseoir'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: [...benchSq, ['post', -132, 172], ['safe', -132, 22, 108]], props: barEnd },
    b: { p: [-40, 57], t: 66, h: 72, armN: { to: [-17, 119], bend: 'b' }, armF: { to: [-19, 118], bend: 'b' }, legN: { to: [6, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' }, back: [...benchSq, ['post', -132, 172], ['safe', -132, 22, 108]], props: (J) => [...barEnd(J), ['arrow', [78, 90], [78, 150]]] },
  },
  {
    id: 'souleve-de-terre-sumo-barre', titre: 'Soulevé de terre sumo, vue de face : pieds très écartés, mains étroites à l\'intérieur des genoux',
    view: 'front', labels: ['Pieds très écartés, mains étroites', 'Debout, barre contre les jambes'],
    a: { p: [0, 52], tl: 56, legN: { to: [56, A], bend: 'f' }, legF: { to: [-56, A], bend: 'b' }, armN: { to: [14, 24], bend: 'd' }, armF: { to: [-14, 24], bend: 'd' }, props: [['barfront', 22]] },
    b: { p: [0, 108], legN: { to: [48, A], bend: 'f' }, legF: { to: [-48, A], bend: 'b' }, armN: { to: [15, 102], bend: 'd' }, armF: { to: [-15, 102], bend: 'd' }, props: [['barfront', 102], ['arrow', [112, 60], [112, 140]]] },
  },
  {
    id: 'good-morning-barre', titre: 'Good morning : barre sur le haut du dos dans un rack à barres de sécurité (jaune), les hanches reculent, le dos reste plat',
    labels: ['Debout, barre sur le haut du dos', 'Hanches en arrière, dos plat'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: rackBack(-100, 168, 108), props: (J) => barPlate(J) },
    b: { p: [-45, 99], t: 20, h: 24, armN: { to: [11, 125], bend: 'b' }, armF: { to: [9, 124], bend: 'b' }, legN: { to: [6, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' }, back: rackBack(-100, 168, 108), props: (J) => [...barPlate(J), ['arrow', [-30, 160], [-82, 160]]] },
  },
  {
    id: 'developpe-couche-prise-serree-barre', titre: 'Développé couché prise serrée : banc dans le rack, barres de sécurité (jaune) juste au-dessus de la poitrine, coudes près du buste',
    labels: ['Barre au-dessus de la poitrine', 'Descente lente, coudes près du buste'],
    a: { p: [0, 57], t: 180, h: 180, legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, back: [['rect', -92, 36, 172, 10, 3], ['rect', -78, 0, 8, 36, 2], ['rect', 56, 0, 8, 36, 2], ...rackBack(-110, 140, 74, 76)], props: (J) => barPlate(J) },
    b: { p: [0, 57], t: 180, h: 180, legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { to: [-58, 80], bend: 'f' }, armF: { to: [-60, 80], bend: 'f' }, back: [['rect', -92, 36, 172, 10, 3], ['rect', -78, 0, 8, 36, 2], ['rect', 56, 0, 8, 36, 2], ...rackBack(-110, 140, 74, 76)], props: (J) => [...barPlate(J), ['arrow', [-62, 150], [-62, 112]]] },
  },
  {
    id: 'developpe-incline-barre', titre: 'Développé incliné à la barre : pente douce (environ 30 degrés), barres de sécurité (jaune) juste au-dessus de la poitrine',
    labels: ['Barre bras tendus, pente douce', 'Descente lente vers le haut du torse'],
    a: { p: [0, 52], t: 150, h: 150, legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, back: (J) => [...benchAlong(J), ...rackBack(-124, 150, 97, 78)], props: (J) => barPlate(J) },
    b: { p: [0, 52], t: 150, h: 150, legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { to: [-50, 103], bend: 'f' }, armF: { to: [-52, 103], bend: 'f' }, back: (J) => [...benchAlong(J), ...rackBack(-124, 150, 97, 78)], props: (J) => [...barPlate(J), ['arrow', [-50, 170], [-50, 135]]] },
  },
  {
    id: 'rowing-pendlay-barre', titre: 'Rowing Pendlay : buste parallèle au sol, la barre repart du sol à chaque répétition et monte vers le bas de la poitrine',
    labels: ['Barre au sol, buste parallèle', 'Barre tirée vers la poitrine'],
    a: { p: [-70, 86], t: 8, h: 0, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-14, A], bend: 'f' }, armN: { a: [-92, -88] }, armF: { a: [-90, -86] }, props: (J) => barPlate(J) },
    b: { p: [-70, 86], t: 8, h: 0, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-14, A], bend: 'f' }, armN: { a: [150, -75] }, armF: { a: [152, -77] }, props: (J) => [...barPlate(J), ['arrow', [60, 30], [60, 80]]] },
  },
  {
    id: 'rowing-barre-ez', titre: 'Rowing à la barre EZ, buste penché debout : la barre pend bras tendus, puis les coudes reculent et la barre monte vers le bas de la poitrine',
    labels: ['Buste penché, barre qui pend', 'Barre tirée vers le ventre'],
    a: { p: [-28, 104], t: 45, h: 52, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-12, A], bend: 'f' }, armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, props: (J) => [['plate', J.haN, 14]] },
    b: { p: [-28, 104], t: 45, h: 52, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-12, A], bend: 'f' }, armN: { to: [8, 112], bend: 'b' }, armF: { to: [6, 111], bend: 'b' }, props: (J) => [['plate', J.haN, 14], ['arrow', [62, 80], [62, 118]]] },
  },
  {
    id: 'extension-triceps-barre-ez-allonge', titre: 'Extension des triceps à la barre EZ, allongé au sol : les coudes restent fixes, la barre descend vers le front',
    labels: ['Bras tendus au-dessus de la poitrine', 'Coudes fixes, barre vers le front'],
    a: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, props: (J) => barPlate(J) }),
    b: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 200] }, armF: { a: [88, 198] }, props: (J) => [...barPlate(J), ['arrow', [-40, 100], [-86, 70]]] }),
  },
  {
    id: 'releve-mollets-debout-barre', titre: 'Relevé de mollets debout avec une barre sur le haut du dos : pieds à plat au sol, on monte sur la pointe des pieds ; barres de sécurité (jaune) juste sous la barre en quart de squat',
    labels: ['Pieds à plat, barre sur le dos', 'Monte sur la pointe des pieds'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: [['post', -110, 172], ['safe', -110, 22, 149]], props: barEnd },
    b: { p: [0, 126], t: 90, armN: { to: [-3, 193], bend: 'b' }, armF: { to: [-5, 192], bend: 'b' }, legN: { to: [8, 22], bend: 'f', foot: -60 }, legF: { to: [2, 22], bend: 'f', foot: -60 }, back: [['post', -110, 172], ['safe', -110, 22, 149]], props: (J) => [...barEnd(J), ['arrow', [78, 40], [78, 80]]] },
  },
  {
    id: 'developpe-couche-barre', titre: 'Développé couché à la barre : sur banc puis au sol, dans le rack ; barres de sécurité (jaune) juste au-dessus de la poitrine, la barre s\'arrête sans la toucher (au sol : arrêt quand les coudes touchent le sol)',
    labels: ['Banc : bras tendus', 'Banc : arrêt sans toucher', 'Sol : arrêt aux coudes'],
    a: { p: [0, 57], t: 180, h: 180, legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, back: [...benchFlat, ['post', -110, 135], ['safe', -110, -30, 69.5]], props: (J) => [...barEnd7(J), ['arrow', [-62, 175], [-62, 150]]] },
    b: { p: [0, 57], t: 180, h: 180, legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { to: [-58, 80], bend: 'f' }, armF: { to: [-60, 80], bend: 'f' }, back: [...benchFlat, ['post', -110, 135], ['safe', -110, -30, 69.5]], props: (J) => [...barEnd7(J), ['arrow', [-62, 150], [-62, 115]]] },
    c: { p: [-5, 11], t: 180, h: 180, legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { to: [-34, 42], bend: 'd' }, armF: { to: [-36, 42], bend: 'd' }, back: [['post', -110, 125], ['safe', -110, -20, 31.5]], props: (J) => [...barEnd7(J), ['arrow', [-34, 100], [-34, 62]]] },
  },
  {
    id: 'hip-thrust-barre', titre: 'Poussée de hanches à la barre : haut du dos contre un banc calé contre un mur, barre sur les hanches avec une serviette dessous, deux mains sur la barre',
    labels: ['Hanches presque au sol', 'Buste et cuisses alignés'],
    a: { p: [-2, 24], t: 163, h: 170, legN: { to: [52, A], bend: 'u' }, legF: { to: [46, A], bend: 'u' }, armN: { to: [-2, 42], bend: 'd' }, armF: { to: [-4, 42], bend: 'd' }, back: [['wall', -125, 14], ['rect', -111, 26, 62, 10, 3], ['rect', -104, 0, 8, 26, 2], ['rect', -64, 0, 8, 26, 2]], props: (J) => [['towel', [[-9, 36], [5, 36]]], ...barEnd7(J)] },
    b: { p: [0, 58], t: 193, h: 200, legN: { to: [55, A], bend: 'u' }, legF: { to: [49, A], bend: 'u' }, armN: { to: [0, 76], bend: 'd' }, armF: { to: [-2, 76], bend: 'd' }, back: [['wall', -125, 14], ['rect', -111, 26, 62, 10, 3], ['rect', -104, 0, 8, 26, 2], ['rect', -64, 0, 8, 26, 2]], props: (J) => [['towel', [[-7, 70], [7, 70]]], ...barEnd7(J), ['arrow', [40, 100], [40, 130]]] },
  },
  {
    id: 'souleve-de-terre-barre', titre: 'Soulevé de terre à la barre : départ du sol, dos plat, barre contre les jambes ; on monte en poussant le sol, jusqu\'à debout',
    labels: ['Départ du sol, dos plat', 'Debout, barre contre les cuisses'],
    a: { p: [-52, 52], t: 40, h: 48, legN: { to: [-10, A], bend: 'f' }, legF: { to: [-16, A], bend: 'f' }, armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, props: (J) => barPlate(J) },
    b: { p: [0, 112], t: 90, armN: { a: [-92, -90] }, armF: { a: [-90, -88] }, props: (J) => [...barPlate(J), ['arrow', [78, 70], [78, 130]]] },
  },
  {
    id: 'shrug-barre', titre: 'Shrug à la barre : debout, barre tenue bras tendus devant les cuisses, les épaules montent vers les oreilles sans plier les coudes ; barre prise au rack',
    labels: ['Debout, bras tendus', 'Épaules vers les oreilles'],
    a: { p: [0, 112], t: 90, armN: { to: [4, 105], bend: 'd' }, armF: { to: [2, 105], bend: 'd' }, back: [['post', -110, 100]], props: (J) => barPlate(J) },
    b: { p: [0, 112], t: 90, armN: { to: [4, 113], bend: 'd' }, armF: { to: [2, 113], bend: 'd' }, back: [['post', -110, 100]], props: (J) => [...barPlate(J), ['arrow', [78, 90], [78, 125]]] },
  },
  {
    id: 'rowing-barre-penche', titre: 'Rowing à la barre, buste penché sans appui : dos plat, la barre pend devant les genoux puis monte vers le bas de la poitrine, coudes vers l\'arrière',
    labels: ['Buste penché, barre qui pend', 'Barre tirée vers le ventre'],
    a: { p: [-45, 98], t: 35, h: 42, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-14, A], bend: 'f' }, armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, props: (J) => barPlate(J) },
    b: { p: [-45, 98], t: 35, h: 42, legN: { to: [-8, A], bend: 'f' }, legF: { to: [-14, A], bend: 'f' }, armN: { to: [4, 108], bend: 'b' }, armF: { to: [2, 107], bend: 'b' }, props: (J) => [...barPlate(J), ['arrow', [72, 70], [72, 110]]] },
  },
  // ================= Lot 08 (ballons de gym, ballons lestés, roue) =================
  {
    id: 'roue-abdos', titre: 'Roue abdominale, à genoux face à un mur : roulé court jusqu\'à ce que la roue touche le mur',
    labels: ['Roue sous les épaules', 'Roulé court : roue au mur'],
    a: { p: [-18, 58], t: 22, h: 10, armN: { to: [44, 9], bend: 'b' }, armF: { to: [42, 9], bend: 'b' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -110, 40], ['wall', 106, 14]], props: [['wheel', [44, 9]]] },
    b: { p: [-2, 57], t: 12, h: 2, armN: { to: [96, 9], bend: 'b' }, armF: { to: [94, 9], bend: 'b' }, legN: { a: [-100, 180], foot: 180 }, legF: { a: [-100, 180], foot: 180 }, back: [['mat', -110, 40], ['wall', 106, 14]], props: [['wheel', [96, 9]], ['arrow', [52, 40], [84, 40]]] },
  },
  {
    id: 'planche-ballon', titre: 'Planche sur un ballon de gym : avant-bras sur le ballon, pieds au sol ; puis avant-bras au sol et tibias sur le ballon',
    labels: ['Avant-bras sur le ballon', 'Avant-bras au sol, tibias sur le ballon'],
    a: { p: [-30.5, 79], t: 32, h: 22, armN: { to: [54, 76], bend: 'd' }, armF: { to: [50, 76], bend: 'd' }, legN: { to: [-121, 22], bend: 'd', foot: -60 }, legF: { to: [-121, 22], bend: 'd', foot: -60 }, back: [['ball', [45, 36], 36]] },
    b: { p: [-4.6, 56.9], t: -12, h: -20, armN: { to: [88, 9], bend: 'd' }, armF: { to: [84, 9], bend: 'd' }, legN: { to: [-110, 74], bend: 'd', foot: 180 }, legF: { to: [-110, 74], bend: 'd', foot: 180 }, back: [['ball', [-84, 36], 36]] },
  },
  {
    id: 'planche-cercles-ballon', titre: 'Planche, avant-bras sur un ballon de gym : de petits cercles avec les avant-bras, le corps reste en ligne',
    labels: ['Ballon à l\'avant', 'Ballon vers l\'arrière : cercle'],
    a: { p: [-30.5, 79], t: 32, h: 22, armN: { to: [54, 76], bend: 'd' }, armF: { to: [50, 76], bend: 'd' }, legN: { to: [-121, 22], bend: 'd', foot: -60 }, legF: { to: [-121, 22], bend: 'd', foot: -60 }, back: [['ball', [45, 36], 36]], props: [['ring', [48, 76], 16]] },
    b: { p: [-30.5, 79], t: 32, h: 22, armN: { to: [42, 76], bend: 'd' }, armF: { to: [38, 76], bend: 'd' }, legN: { to: [-121, 22], bend: 'd', foot: -60 }, legF: { to: [-121, 22], bend: 'd', foot: -60 }, back: [['ball', [33, 36], 36]], props: [['ring', [38, 76], 16]] },
  },
  {
    id: 'rollout-ballon', titre: 'Roulé du ballon à genoux : avant-bras sur le ballon, il roule vers l\'avant tant que le dos reste plat',
    labels: ['Avant-bras sur le ballon', 'Le ballon roule vers l\'avant'],
    a: { p: [-45, 58], t: 35, h: 25, armN: { to: [70, 75], bend: 'd' }, armF: { to: [66, 75], bend: 'd' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -130, 40], ['ball', [55, 36], 36]] },
    b: { p: [-30, 56], t: 12, h: 5, armN: { to: [95, 75], bend: 'd' }, armF: { to: [91, 75], bend: 'd' }, legN: { a: [-105, 180], foot: 180 }, legF: { a: [-105, 180], foot: 180 }, back: [['mat', -130, 40], ['ball', [88, 36], 36]], props: [['arrow', [70, 118], [106, 118]]] },
  },
  {
    id: 'curl-ischios-ballon', titre: 'Curl des ischios sur ballon de gym : couché sur le dos, hanches hautes, talons sur le ballon que l\'on tire vers les fessiers',
    labels: ['Hanches hautes, jambes tendues', 'Le ballon roule vers les fesses'],
    a: { p: [9, 33], t: 198, h: 165, armN: { to: [15, 8], bend: 'u' }, armF: { to: [11, 8], bend: 'u' }, legN: { a: [18, 18], foot: 80 }, legF: { a: [18, 18], foot: 80 }, back: [['mat', -120, 40], ['ball', [112, 34], 34]] },
    b: { p: [9, 33], t: 198, h: 165, armN: { to: [15, 8], bend: 'u' }, armF: { to: [11, 8], bend: 'u' }, legN: { to: [92, 64], bend: 'u', foot: 80 }, legF: { to: [88, 64], bend: 'u', foot: 80 }, back: [['mat', -120, 40], ['ball', [92, 34], 34]], props: [['arrow', [130, 100], [90, 100]]] },
  },
  {
    id: 'pont-fessier-ballon', titre: 'Pont fessier, haut du dos sur un ballon de gym : le bassin descend sous les épaules, puis monte jusqu\'à l\'alignement',
    labels: ['Bassin bas', 'Buste et cuisses alignés'],
    a: { p: [4, 34], t: 145, h: 150, armN: { to: [24, 40], bend: 'd' }, armF: { to: [20, 40], bend: 'd' }, legN: { to: [48, A], bend: 'u' }, legF: { to: [42, A], bend: 'u' }, back: [['ball', [-50, 34], 34]] },
    b: { p: [10, 60], t: 165, h: 160, armN: { to: [30, 62], bend: 'd' }, armF: { to: [26, 62], bend: 'd' }, legN: { to: [65, A], bend: 'u' }, legF: { to: [59, A], bend: 'u' }, back: [['ball', [-50, 34], 34]], props: [['arrow', [10, 98], [10, 124]]] },
  },
  {
    id: 'extension-dorsale-ballon', titre: 'Extension du dos sur un ballon de gym : à plat ventre, hanches sur le ballon, le buste monte jusqu\'à l\'alignement, bras croisés, pointes de pieds contre un mur plein',
    labels: ['Buste qui pend, bras croisés', 'Buste aligné avec les jambes'],
    a: { p: [-5, 80], t: -30, h: -40, armN: { a: [-125, 55] }, armF: { a: [-120, 50] }, legN: { to: [-92, 20], bend: 'u', foot: -120 }, legF: { to: [-92, 20], bend: 'u', foot: -120 }, back: [['wall', -104, -14], ['mat', -110, 90], ['ball', [-5, 34], 34]] },
    b: { p: [-5, 80], t: 36, h: 30, armN: { a: [-100, 70] }, armF: { a: [-95, 65] }, legN: { to: [-92, 20], bend: 'u', foot: -120 }, legF: { to: [-92, 20], bend: 'u', foot: -120 }, back: [['wall', -104, -14], ['mat', -110, 90], ['ball', [-5, 34], 34]], props: [['arrow', [70, 70], [84, 100]]] },
  },
  {
    id: 'pompe-mains-ballon', titre: 'Pompe mains sur un ballon de gym calé contre un mur : poitrine vers le ballon, le ballon ne bouge pas',
    labels: ['Bras tendus, ballon contre le mur', 'Poitrine vers le ballon'],
    a: { p: [10, 94.5], t: 42, h: 36, armN: { to: [66, 70], bend: 'b' }, armF: { to: [62, 70], bend: 'b' }, legN: { to: [-70, 22], bend: 'd', foot: -60 }, legF: { to: [-66, 22], bend: 'd', foot: -60 }, back: [['wall', 100, 14], ['ball', [66, 34], 34]] },
    b: { p: [18.6, 81.8], t: 34, h: 28, armN: { to: [66, 70], bend: 'b' }, armF: { to: [62, 70], bend: 'b' }, legN: { to: [-70, 22], bend: 'd', foot: -60 }, legF: { to: [-66, 22], bend: 'd', foot: -60 }, back: [['wall', 100, 14], ['ball', [66, 34], 34]] },
  },
  {
    id: 'squat-mur-ballon', titre: 'Squat avec un ballon de gym entre le bas du dos et un mur : le ballon roule, les genoux ne dépassent pas 90 degrés',
    labels: ['Debout, dos sur le ballon', 'Genoux à 90 degrés au plus'],
    a: { p: [0, 98], t: 90, h: 90, legN: { to: [45, A], bend: 'f' }, legF: { to: [39, A], bend: 'f' }, back: [['wall', -91, 14], ['ball', [-43, 116], 34]] },
    b: { p: [0, 66], t: 90, h: 90, armN: { a: [-80, -70] }, armF: { a: [-76, -66] }, legN: { to: [45, A], bend: 'f' }, legF: { to: [39, A], bend: 'f' }, back: [['wall', -91, 14], ['ball', [-43, 84], 34]], props: [['arrow', [-100, 120], [-100, 80]]] },
  },
  {
    id: 'lancer-poitrine-mur', titre: 'Lancer de poitrine contre un mur avec un ballon lesté : pousser droit devant, pieds à plat',
    labels: ['Ballon contre la poitrine', 'Bras tendus : le ballon part'],
    a: { p: [0, 108], t: 90, h: 90, armN: { to: [22, 150], bend: 'd' }, armF: { to: [18, 150], bend: 'd' }, legN: { to: [12, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, back: [['wall', 128, 14]], props: [['mball', [30, 156]]] },
    b: { p: [0, 108], t: 90, h: 90, armN: { to: [68, 172], bend: 'd' }, armF: { to: [64, 172], bend: 'd' }, legN: { to: [12, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, back: [['wall', 128, 14]], props: [['mball', [84, 174]], ['arrow', [102, 174], [122, 174]]] },
  },
  {
    id: 'lancer-rotation-mur', titre: 'Lancer en rotation contre un mur, vue de face : ballon lesté près de la hanche, puis lancer à hauteur de poitrine ; pieds fixes à peu près à la largeur des épaules, rotation courte, genoux dans l’axe des orteils',
    view: 'front', labels: ['Ballon près de la hanche', 'Rotation puis lancer'],
    a: { p: [-4, 112], t: 90, legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, sa: -10, armN: { to: [-50, 106], bend: 'f' }, armF: { to: [-46, 104], bend: 'f' }, back: [['wall', 126, 14]], props: [['mball', [-52, 100]]] },
    b: { p: [0, 112], t: 90, legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, sa: 10, armN: { to: [70, 166], bend: 'f' }, armF: { to: [66, 164], bend: 'f' }, back: [['wall', 126, 14]], props: [['mball', [84, 168]], ['arrow', [98, 168], [120, 168]]] },
  },
  {
    id: 'lancer-bas-haut-mur', titre: 'Lancer de bas en haut contre un mur : hanches en arrière, ballon entre les jambes, puis hanches en avant et lancer à hauteur de poitrine, jamais au-dessus de la tête, mur à 2 m au moins, pieds au sol',
    labels: ['Hanches en arrière, ballon bas', 'Poitrine au plus, mur à 2 m'],
    a: { p: [-115, 98], t: 38, h: 40, armN: { to: [-56, 68], bend: 'f' }, armF: { to: [-60, 68], bend: 'f' }, legN: { to: [-66, A], bend: 'f' }, legF: { to: [-74, A], bend: 'f' }, back: [['wall', 140, 14]], props: [['mball', [-44, 64]]] },
    b: { p: [-70, 112], t: 90, h: 90, armN: { to: [-6, 158], bend: 'd' }, armF: { to: [-10, 158], bend: 'd' }, legN: { to: [-66, A], bend: 'f' }, legF: { to: [-74, A], bend: 'f' }, back: [['wall', 140, 14]], props: [['mball', [10, 162]], ['arrow', [30, 162], [64, 166]]] },
  },
  {
    id: 'rotation-assise-ballon-lest', titre: 'Rotation assise avec un ballon lesté, vue de face : buste légèrement en arrière, le ballon passe d\'un côté à l\'autre',
    view: 'front', labels: ['Ballon devant la poitrine', 'Rotation du buste'],
    a: { p: [0, 14], t: 90, tl: 54, h: 90, legN: { to: [26, 10], bend: 'u' }, legF: { to: [-26, 10], bend: 'u' }, armN: { to: [14, 58], bend: 'd' }, armF: { to: [-14, 58], bend: 'd' }, back: [['mat', -110, 110]], props: [['mball', [0, 56]]] },
    b: { p: [0, 14], t: 90, tl: 54, h: 90, sa: -15, legN: { to: [26, 10], bend: 'u' }, legF: { to: [-26, 10], bend: 'u' }, armN: { to: [52, 46], bend: 'd' }, armF: { to: [30, 52], bend: 'd' }, back: [['mat', -110, 110]], props: [['mball', [44, 46]], ['arrow', [16, 100], [64, 80]]] },
  },
  {
    id: 'bucheron-ballon-lest', titre: 'Bûcheron avec un ballon lesté, vue de face : du haut d\'une épaule vers la hanche opposée',
    view: 'front', labels: ['Ballon près de l\'épaule', 'Diagonale vers la hanche'],
    a: { p: [0, 108], t: 88, legN: { to: [18, A], bend: 'f' }, legF: { to: [-18, A], bend: 'b' }, armN: { to: [50, 172], bend: 'f' }, armF: { to: [46, 170], bend: 'f' }, props: [['mball', [52, 178]]] },
    b: { p: [-6, 96], t: 98, legN: { to: [20, A], bend: 'f' }, legF: { to: [-22, A], bend: 'b' }, armN: { to: [-44, 100], bend: 'f' }, armF: { to: [-46, 102], bend: 'f' }, props: [['mball', [-50, 98]], ['arrow', [62, 168], [14, 120]]] },
  },
  {
    id: 'squat-ballon-lest', titre: 'Squat avec un ballon lesté contre la poitrine : hanches en arrière, dos droit',
    labels: ['Debout, ballon à la poitrine', 'Squat, ballon contre la poitrine'],
    a: { p: [0, 112], t: 90, armN: { to: [22, 156], bend: 'd' }, armF: { to: [18, 156], bend: 'd' }, props: [['mball', [30, 162]]] },
    b: { p: [-32, 60], t: 62, h: 70, armN: { to: [22, 108], bend: 'd' }, armF: { to: [18, 108], bend: 'd' }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, props: [['mball', [30, 114]]] },
  },
  {
    id: 'squat-lancer-mur', titre: 'Squat puis lancer de poitrine contre un mur avec un ballon lesté, pieds à plat',
    labels: ['Squat, ballon à la poitrine', 'Debout : le ballon part'],
    a: { p: [-32, 60], t: 62, h: 70, armN: { to: [22, 108], bend: 'd' }, armF: { to: [18, 108], bend: 'd' }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, back: [['wall', 128, 14]], props: [['mball', [30, 114]]] },
    b: { p: [0, 112], t: 90, armN: { to: [68, 172], bend: 'd' }, armF: { to: [64, 172], bend: 'd' }, back: [['wall', 128, 14]], props: [['mball', [84, 174]], ['arrow', [102, 174], [122, 174]]] },
  },
  {
    id: 'porte-ballon-lest', titre: 'Marche avec un ballon lesté contre la poitrine, buste droit',
    labels: ['Ballon contre la poitrine', 'Pas courts, buste droit'],
    a: stride({ armN: { to: [22, 156], bend: 'd' }, armF: { to: [18, 156], bend: 'd' }, props: [['mball', [30, 162]], ...walkFwd] }),
    b: stride({ legN: { to: [-22, 15], bend: 'f', foot: -35 }, legF: { to: [20, A], bend: 'f' }, armN: { to: [22, 156], bend: 'd' }, armF: { to: [18, 156], bend: 'd' }, props: [['mball', [30, 162]], ...walkFwd] }),
  },
  // ================= Lot 09 (gilet lesté, sac de sable, bosu) =================
  {
    id: 'squat-gilet-lest', titre: 'Squat avec un gilet lesté, variante libre, vue de profil : gilet serré sur le tronc, descente dos droit, cuisses au plus à l\'horizontale',
    labels: ['Debout, gilet serré', 'Descente, dos droit'],
    a: { vest: true, p: [0, 112], t: 90, armN: { a: [0, 0] }, armF: { a: [-3, -3] } },
    b: { vest: true, p: [-32, 60], t: 62, h: 70, armN: { a: [0, 0] }, armF: { a: [-3, -3] }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' } },
  },
  {
    id: 'fente-gilet-lest', titre: 'Fente avec un gilet lesté, une main au mur, vue de profil : pieds qui ne bougent pas, on descend à la verticale',
    labels: ['Un pied devant, main au mur', 'Descente à la verticale'],
    a: { vest: true, p: [0, 104], t: 90, armN: { to: [66, 151], bend: 'd' }, armF: { to: [12, 108], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'f', foot: -40 }, back: [['wall', 68, 14]] },
    b: { vest: true, p: [0, 64], t: 90, armN: { to: [66, 111], bend: 'd' }, armF: { to: [12, 68], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'd', foot: -40 }, back: [['wall', 68, 14]], props: [['arrow', [-78, 150], [-78, 100]]] },
  },
  {
    id: 'pompe-gilet-lest', titre: 'Pompe avec un gilet lesté, mains au sol, vue de profil : gilet à plat sur la poitrine, corps en ligne',
    labels: ['Corps en ligne, gilet serré', 'Coudes pliés, poitrine près du sol'],
    a: plank({ vest: true }),
    b: plankDown({ vest: true, props: [['arrow', [-30, 100], [-30, 70]]] }),
  },
  {
    id: 'traction-gilet-lest', titre: 'Traction avec un gilet lesté, vue de face, mains vers soi : suspendu bras tendus, puis menton au-dessus de la barre ; barre basse, pieds à moins de 30 cm du sol',
    view: 'front',
    labels: ['Suspendu, bras tendus', 'Menton au-dessus de la barre'],
    a: { vest: true, p: [0, 122], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [7, 16], bend: 'f' }, legF: { to: [-7, 16], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7]] },
    b: { vest: true, p: [0, 180], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [7, 74], bend: 'f' }, legF: { to: [-7, 74], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7]], props: [['arrow', [112, 130], [112, 190]]] },
  },
  {
    id: 'traction-un-bras', titre: 'Traction à un bras assistée, échelon 1, vue de face : élastique épais noué à la barre et passé sous le pied, une main tire, l’autre main reste posée sur la barre sans tirer',
    view: 'front',
    labels: ['Un bras tire, l’autre main soutient', 'Menton à la barre, sans balancer'],
    a: { p: [0, 122], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [7, 30], bend: 'f' }, legF: { to: [-7, 16], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7]], props: (J) => [['band', [[-62, 254], J.anN]]] },
    b: { p: [0, 180], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [7, 88], bend: 'f' }, legF: { to: [-7, 74], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7]], props: (J) => [['band', [[-62, 254], J.anN]], ['arrow', [112, 130], [112, 190]]] },
  },
  {
    id: 'marche-gilet-lest', titre: 'Marche avec un gilet lesté, vue de profil : pas courts, buste droit, épaules loin des oreilles',
    labels: ['Gilet serré, buste droit', 'Pas courts, à vitesse tranquille'],
    a: stride({ vest: true, props: walkFwd }),
    b: stride({ vest: true, legN: { to: [-22, 15], bend: 'f', foot: -35 }, legF: { to: [20, A], bend: 'f' }, props: walkFwd }),
  },
  {
    id: 'montee-gilet-lest', titre: 'Montée sur la première marche avec un gilet lesté, vue de profil : un pied entièrement posé, on se redresse sans élan',
    labels: ['Un pied entier sur la marche', 'Debout sur la marche, sans élan'],
    a: { vest: true, p: [-20, 108], t: 90, h: 90, armN: { a: [-90, -90] }, armF: { a: [-90, -90] }, legN: { to: [30, 26], bend: 'f' }, legF: { to: [-22, A], bend: 'f' }, back: [['step', 10, 130, 18]] },
    b: { vest: true, p: [30, 130], t: 90, h: 90, armN: { a: [-90, -90] }, armF: { a: [-90, -90] }, legN: { to: [30, 26], bend: 'f' }, legF: { to: [12, 46], bend: 'f' }, back: [['step', 10, 130, 18]], props: [['arrow', [-40, 80], [-40, 130]]] },
  },
  {
    id: 'pont-fessier-gilet-lest', titre: 'Pont fessier avec un gilet lesté, vue de profil : couché sur le dos, gilet à plat, le bassin monte jusqu\'à l\'alignement épaules, hanches, genoux',
    labels: ['Bassin bas, gilet à plat', 'Épaules, hanches, genoux alignés'],
    a: { vest: true, p: [5, 12], t: 180, h: 175, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, back: [['mat', -140, 130]] },
    b: { vest: true, p: [8, 38], t: 203, h: 170, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, back: [['mat', -140, 130]], props: [['arrow', [4, 90], [4, 120]]] },
  },
  {
    id: 'porte-sac-berceau', titre: 'Portage d\'un sac de sable en berceau, sac pris sur une chaise : serré dans les deux bras contre la poitrine, marche buste droit',
    labels: ['Sac pris sur la chaise, dos plat', 'Marche, sac contre la poitrine'],
    a: chairLift(),
    b: stride({ ...cradleArms([0, 110], 90), props: [...cradleArms([0, 110], 90).props, ...walkFwd] }),
  },
  {
    id: 'squat-sac-berceau', titre: 'Squat avec un sac de sable en berceau (sac pris sur une chaise) : sac collé à la poitrine, hanches en arrière, dos droit',
    labels: ['Debout, sac contre la poitrine', 'Descente, dos droit'],
    a: { p: [0, 112], t: 90, ...cradleArms([0, 112], 90) },
    b: { p: [-32, 60], t: 62, h: 70, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, ...cradleArms([-32, 60], 62) },
  },
  {
    id: 'souleve-de-terre-sac', titre: 'Soulevé de terre avec un sac de sable pris sur une chaise : dos plat, sac serré contre les jambes, on se redresse jusqu\'à debout',
    labels: ['Départ : sac sur la chaise, dos plat', 'Debout, sac contre les cuisses'],
    a: chairLift(),
    b: { p: [0, 112], t: 90, armN: { to: [14, 106], bend: 'f' }, armF: { to: [12, 106], bend: 'f' }, props: [['bag', [22, 100], 28, 34, 0], ['arrow', [70, 70], [70, 130]]] },
  },
  {
    id: 'rowing-sac-de-sable', titre: 'Rowing avec un sac de sable, un bras, main libre sur une chaise : buste penché dos plat, le sac pend puis monte vers la poitrine',
    labels: ['Sac pendu, main sur la chaise', 'Sac tiré vers la poitrine'],
    a: { p: [-45, 84], t: 15, h: 20, armN: { a: [-90, -90] }, armF: { to: [54, 52], bend: 'u' }, legN: { to: [-6, A], bend: 'f' }, legF: { to: [-12, A], bend: 'f' }, back: [['chair', 92, 46, -1], ['wall', 92, 14]], props: (J) => [['bag', [J.haN[0], J.haN[1] - 14], 30, 30, 0]] },
    b: { p: [-45, 84], t: 15, h: 20, armN: { to: [-8, 84], bend: 'b' }, armF: { to: [54, 52], bend: 'u' }, legN: { to: [-6, A], bend: 'f' }, legF: { to: [-12, A], bend: 'f' }, back: [['chair', 92, 46, -1], ['wall', 92, 14]], props: [['bag', [-8, 70], 30, 30, 0], ['arrow', [-8, 20], [-8, 50]]] },
  },
  {
    id: 'squat-bosu', titre: 'Squat sur un bosu, dôme vers le haut, une main au mur, vue de profil : pieds au centre du dôme, quart de squat seulement',
    labels: ['Pieds sur le dôme, main au mur', 'Quart de squat, dos droit'],
    a: { p: [0, 139], t: 90, armN: { to: [60, 190], bend: 'd' }, armF: { a: [-60, -30] }, legN: { to: [8, 34], bend: 'f' }, legF: { to: [2, 34], bend: 'f' }, back: [dome(0), ['wall', 62, 14]] },
    b: { p: [-14, 112], t: 80, h: 80, armN: { to: [60, 160], bend: 'd' }, armF: { a: [-60, -30] }, legN: { to: [8, 34], bend: 'f' }, legF: { to: [2, 34], bend: 'f' }, back: [dome(0), ['wall', 62, 14]] },
  },
  {
    id: 'planche-bosu', titre: 'Planche, avant-bras sur le dôme d\'un bosu calé contre un mur, vue de profil : sur les genoux, puis sur les pointes de pieds, corps en ligne',
    labels: ['Genoux au tapis, corps en ligne', 'Pointes de pieds, corps en ligne'],
    // S2 (contrôle lot 09) : coude posé sur le dôme sous l'épaule, avant-bras à plat sur la moitié du dôme côté soi (jamais bras tendu)
    // N2 : coudes près du bord du dôme (24 unités du centre), tête à environ 42 unités du mur (au moins 30 cm : le bosu mesure 84 unités pour 60 cm)
    a: { p: [-12.4, 31.9], t: 21.2, h: 13, armN: { a: [-90, 15] }, armF: { a: [-90, 14] }, legN: { a: [201.2, 180], foot: 180 }, legF: { a: [200.3, 180], foot: 180 }, back: [['mat', -140, 62], dome(87), ['wall', 129, 14]] },
    b: { p: [-15.7, 43.1], t: 11.4, h: 8, armN: { a: [-90, 15] }, armF: { a: [-90, 14] }, legN: { to: [-120.5, 22], bend: 'd', foot: -60 }, legF: { to: [-121, 22], bend: 'd', foot: -60 }, back: [['mat', -140, 62], dome(87), ['wall', 129, 14]] },
  },
  {
    id: 'pompe-bosu', titre: 'Pompe, mains sur le dôme d\'un bosu calé contre un mur, genoux au tapis, vue de profil : on descend peu, la poitrine reste au-dessus du dôme',
    labels: ['Bras presque tendus, corps en ligne', 'Descente courte, coudes à 45°'],
    // C12 + N2 : mains sous les épaules sur la moitié proche du dôme (x = 29 à 32), tête à environ 50 unités du mur dans les deux poses
    a: { p: [-30, 47.4], t: 40, h: 32, armN: { to: [32, 22], bend: 'b' }, armF: { to: [29, 21], bend: 'b' }, legN: { a: [220, 180], foot: 180 }, legF: { a: [219, 180], foot: 180 }, back: [['mat', -150, 40], dome(60), ['wall', 102, 14]] },
    b: { p: [-37.1, 39.2], t: 29.7, h: 22, armN: { to: [32, 22], bend: 'b' }, armF: { to: [29, 21], bend: 'b' }, legN: { a: [209.7, 180], foot: 180 }, legF: { a: [208.7, 180], foot: 180 }, back: [['mat', -150, 40], dome(60), ['wall', 102, 14]], props: [['arrow', [-40, 110], [-40, 80]]] },
  },
  {
    id: 'equilibre-unipodal-bosu', titre: 'Équilibre sur une jambe sur un bosu, dôme vers le haut, vue de face : un pied au centre du dôme, doigts au mur, puis sans appui',
    view: 'front',
    labels: ['Doigts au mur', 'Sans appui, doigts près du mur'],
    a: { p: [0, 138], t: 90, h: 90, armN: { to: [57, 154], bend: 'd' }, armF: { a: [-100, -95] }, legN: { to: [13, 36], bend: 'f' }, legF: { to: [-10, 60], bend: 'b' }, back: [dome(13), ['wall', 57, 14]] },
    b: { p: [0, 138], t: 90, h: 90, armN: { a: [-85, -87] }, armF: { a: [-95, -93] }, legN: { to: [13, 36], bend: 'f' }, legF: { to: [-10, 60], bend: 'b' }, back: [dome(13), ['wall', 57, 14]] },
  },
  // ---- Lot 10 (sauts, hip thrust sur chaise, course) ----
  {
    id: 'squat-petit-saut', titre: 'Squat avec petit saut, vue de profil : petit squat, montée rapide, puis décollage de quelques centimètres seulement (version douce : on ne décolle pas)',
    labels: ['Debout, pieds au sol', 'Petit squat, dos droit', 'Montée rapide, petit décollage'],
    a: { p: [0, 112], t: 90, armN: { a: [-92, -84] }, armF: { a: [-88, -80] } },
    b: { p: [-24, 80], t: 70, h: 78, armN: { a: [-30, 10] }, armF: { a: [-32, 8] }, legN: { to: [8, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' } },
    c: { p: [0, 132], t: 90, armN: { a: [-60, -20] }, armF: { a: [-58, -18] }, legN: { to: [8, 27], bend: 'f', foot: -50 }, legF: { to: [-4, 24], bend: 'f', foot: -50 }, props: [['arrow', [90, 190], [90, 225]]] },
  },
  {
    id: 'hip-thrust-chaise', titre: 'Poussée de hanches, haut du dos sur le bord de la chaise calée contre un mur : deux jambes, puis une jambe avec un élastique tenu à plat sur la hanche (jamais fixé derrière soi)',
    labels: ['Deux jambes, hanches basses', 'Deux jambes, alignées', 'Une jambe, élastique en main'],
    a: { p: [-5, 22], t: 155, h: 165, armN: { to: [10, 28], bend: 'd' }, armF: { to: [6, 28], bend: 'd' }, legN: { to: [40, A], bend: 'f' }, legF: { to: [34, A], bend: 'f' }, back: [['wall', -118, 14], ['chair', -102, 40, 1]] },
    b: { p: [-5, 54], t: 180, h: 175, armN: { to: [10, 56], bend: 'd' }, armF: { to: [6, 56], bend: 'd' }, legN: { to: [40, A], bend: 'f' }, legF: { to: [34, A], bend: 'f' }, back: [['wall', -118, 14], ['chair', -102, 40, 1]], props: [['arrow', [-5, 82], [-5, 110]]] },
    c: { p: [-5, 54], t: 180, h: 175, armN: { to: [-24, 4], bend: 'd' }, armF: { to: [-3, 60], bend: 'u' }, legN: { to: [40, A], bend: 'f' }, legF: { a: [58, -25] }, back: [['wall', -118, 14], ['chair', -102, 40, 1]], props: [['band', [[-14, 63], [10, 63]]], ['arrow', [-5, 120], [-5, 140]]] },
  },
  {
    id: 'alternance-marche-course', titre: 'Alternance marche rapide et course lente, vue de profil : marche à grands pas, puis foulée de course courte, tronc droit',
    labels: ['Marche rapide', 'Course lente, foulée courte'],
    a: { p: [0, 112], t: 90, legN: { to: [28, A], bend: 'f' }, legF: { to: [-26, 12], bend: 'f', foot: -30 }, armN: { a: [-125, -95] }, armF: { a: [-60, -20] }, props: [['arrow', [70, 205], [120, 205]]] },
    b: { p: [0, 122], t: 84, h: 86, legN: { to: [32, 46], bend: 'f', foot: -20 }, legF: { to: [-40, 34], bend: 'f', foot: -60 }, armN: { a: [-125, -50] }, armF: { a: [-55, 35] }, props: [['arrow', [70, 205], [120, 205]]] },
  },
  {
    id: 'course-continue-lente', titre: 'Course continue lente, vue de profil : le pied se pose sous le corps, tronc droit, foulée courte, bras fléchis qui balancent',
    labels: ['Appui, pied sous le corps', 'Foulée courte, pas de grand bond'],
    a: { p: [4, 106], t: 86, h: 88, legN: { to: [8, A], bend: 'f' }, legF: { to: [-34, 40], bend: 'f', foot: -60 }, armN: { a: [-125, -45] }, armF: { a: [-55, 30] } },
    b: { p: [0, 120], t: 84, h: 86, legN: { to: [26, 46], bend: 'f', foot: -20 }, legF: { to: [-36, 36], bend: 'f', foot: -60 }, armN: { a: [-55, 35] }, armF: { a: [-125, -50] }, props: [['arrow', [70, 205], [120, 205]]] },
  },
  {
    id: 'course-sur-place', titre: 'Course sur place, vue de profil : on reste au même endroit, genoux qui montent peu, pieds qui se posent doucement, bras fléchis',
    labels: ['Genou droit levé', 'Genou gauche levé'],
    a: { p: [0, 114], t: 88, h: 88, legN: { to: [14, 44], bend: 'f', foot: -20 }, legF: { to: [-4, A], bend: 'f' }, armN: { a: [-125, -50] }, armF: { a: [-55, 35] } },
    b: { p: [0, 114], t: 88, h: 88, legN: { to: [-4, A], bend: 'f' }, legF: { to: [12, 46], bend: 'f', foot: -20 }, armN: { a: [-55, 35] }, armF: { a: [-125, -50] } },
  },
  {
    id: 'corde-a-sauter', titre: 'Corde à sauter, vue de profil : petits sauts bas, pieds joints, coudes près du corps, les poignets font tourner la corde',
    labels: ['Pieds au sol, genoux souples', 'Petit saut, quelques centimètres'],
    a: { p: [0, 112], t: 90, legN: { to: [4, A], bend: 'f' }, legF: { to: [-2, A], bend: 'f' }, armN: { a: [-80, 10] }, armF: { a: [-82, 8] } },
    b: { p: [0, 122], t: 90, legN: { to: [4, 12], bend: 'f', foot: -40 }, legF: { to: [-2, 10], bend: 'f', foot: -40 }, armN: { a: [-80, 10] }, armF: { a: [-82, 8] }, props: [['arrow', [70, 150], [70, 190]]] },
  },
  // ---- Lot 11 (variété : curl, développés et tirage à l'élastique) ----
  {
    id: 'curl-halteres', titre: 'Curl aux haltères, debout, vue de profil : bras le long du corps, puis haltères montés vers les épaules, coudes contre les côtes (prise marteau : même geste, paumes face aux cuisses)',
    labels: ['Bras le long du corps', 'Haltères aux épaules, coudes fixes'],
    a: { p: [0, 112], armN: { a: [-90, -90] }, armF: { a: [-92, -92] }, props: (J) => [['plate', J.haN, 10], ['plate', J.haF, 10]] },
    b: { p: [0, 112], armN: { a: [-88, 68] }, armF: { a: [-90, 64] }, props: (J) => [['plate', J.haN, 10], ['plate', J.haF, 10], ['arrow', [62, 120], [62, 165]]] },
  },
  {
    id: 'curl-elastique', titre: 'Curl à l’élastique, debout sur le milieu de l’élastique, vue de profil : élastique déjà un peu tendu, mains le long du corps, puis mains aux épaules, coudes contre les côtes',
    labels: ['Bras le long du corps', 'Mains aux épaules, coudes fixes'],
    a: { p: [0, 112], armN: { a: [-90, -90] }, armF: { a: [-92, -92] }, props: (J) => [['band', [[19, 5], J.haN]], ['band', [[19, 5], J.haF]]] },
    b: { p: [0, 112], armN: { a: [-88, 68] }, armF: { a: [-90, 64] }, props: (J) => [['band', [[19, 5], J.haN]], ['band', [[19, 5], J.haF]], ['arrow', [62, 120], [62, 165]]] },
  },
  {
    id: 'essorage-serviette', titre: 'Essorage de serviette : serviette roulée tenue à deux mains devant la poitrine, les mains tournent en sens inverses',
    labels: ['Serviette tenue à deux mains', 'Les mains tournent en sens inverses'],
    a: { p: [0, 112], armN: { to: [30, 100], bend: 'd' }, armF: { to: [30, 100], bend: 'd' }, props: (J) => [['band', [J.haN, J.haF]]] },
    b: { p: [0, 112], armN: { to: [30, 100], bend: 'd' }, armF: { to: [30, 100], bend: 'd' }, props: (J) => [['band', [J.haN, J.haF]], ['arrow', [52, 118], [52, 90]]] },
  },
  {
    id: 'flexion-poignet-avant-bras', titre: 'Curl de poignet à l’élastique, assis, avant-bras posé sur la cuisse, paume vers le haut, élastique sous le pied',
    labels: ['Main dans le vide, paume en haut', 'Le poignet plie, la paume monte'],
    a: { p: [-48, 58], t: 80, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 66], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [[10, 5], J.haN]]] },
    b: { p: [-48, 58], t: 80, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 66], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [[10, 5], J.haN]], ['arrow', [30, 62], [30, 90]]] },
  },
  {
    id: 'extension-poignet-avant-bras', titre: 'Extension de poignet à l’élastique, assis, avant-bras posé sur la cuisse, paume vers le bas, élastique sous le pied',
    labels: ['Main dans le vide, paume en bas', 'Le dos de la main monte'],
    a: { p: [-48, 58], t: 80, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 66], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [[10, 5], J.haN]]] },
    b: { p: [-48, 58], t: 80, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 66], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [[10, 5], J.haN]], ['arrow', [30, 62], [30, 90]]] },
  },
  {
    id: 'renfo-cou-isometrique', titre: 'Renfo du cou en isométrie, assis, une main contre le front : la main pousse la tête, la tête ne bouge pas',
    labels: ['Main sur le front, tête neutre', 'On pousse sans bouger la tête'],
    a: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [22, 128], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]] },
    b: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [22, 128], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: [['arrow', [70, 135], [40, 135]]] },
  },
  {
    id: 'developpe-epaules-elastique-alterne', titre: 'Développé épaules alterné à l’élastique, assis sur une chaise calée contre un mur, élastique sous les pieds : une main pousse, l’autre reste à hauteur d’épaule',
    labels: ['Mains aux épaules', 'Un bras pousse, l’autre attend', 'L’autre bras pousse'],
    a: { p: [-21, 58], t: 90, legN: { to: [36, A], bend: 'f' }, legF: { to: [30, A], bend: 'f' }, armN: { a: [-50, 92] }, armF: { a: [-52, 92] }, back: [['wall', -50, 14], ['chair', -34, 46, 1]], props: (J) => [['band', [[47, 5], J.haN]], ['band', [[47, 5], J.haF]]] },
    b: { p: [-21, 58], t: 90, legN: { to: [36, A], bend: 'f' }, legF: { to: [30, A], bend: 'f' }, armN: { a: [72, 78] }, armF: { a: [-52, 92] }, back: [['wall', -50, 14], ['chair', -34, 46, 1]], props: (J) => [['band', [[47, 5], J.haN]], ['band', [[47, 5], J.haF]], ['arrow', [40, 150], [40, 215]]] },
    c: { p: [-21, 58], t: 90, legN: { to: [36, A], bend: 'f' }, legF: { to: [30, A], bend: 'f' }, armN: { a: [-50, 92] }, armF: { a: [70, 76] }, back: [['wall', -50, 14], ['chair', -34, 46, 1]], props: (J) => [['band', [[47, 5], J.haN]], ['band', [[47, 5], J.haF]], ['arrow', [40, 150], [40, 215]]] },
  },
  {
    id: 'developpe-sol-elastique', titre: 'Développé au sol à l’élastique, vue de profil : allongé sur le dos, genoux pliés, élastique à plat sous le haut des omoplates ; coudes au sol, puis bras presque tendus vers le plafond',
    labels: ['Coudes au sol', 'Bras presque tendus'],
    a: supine({ legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { a: [-5, 90] }, armF: { a: [-8, 90] }, back: (J) => [['band', [[-52, 9], J.haN]], ['band', [[-52, 9], J.haF]]] }),
    b: supine({ legN: { to: [60, A], bend: 'u' }, legF: { to: [54, A], bend: 'u' }, armN: { a: [86, 88] }, armF: { a: [84, 86] }, back: (J) => [['band', [[-52, 9], J.haN]], ['band', [[-52, 9], J.haF]]], props: [['arrow', [-100, 40], [-100, 85]]] }),
  },
  {
    id: 'tirage-vertical-un-bras-elastique', titre: 'Tirage vertical à un bras à l’élastique, debout, vue de profil : une main tient l’élastique à hauteur du front sans le monter, l’autre main tire le coude vers le bas, le long du corps, jusqu’à hauteur de l’épaule',
    labels: ['Main du haut fixe, bras qui tire levé', 'Coude le long du corps, main à l’épaule'],
    a: { p: [0, 112], armF: { to: [60, 200], bend: 'd' }, armN: { to: [56, 176], bend: 'd' }, props: (J) => [['band', [J.haF, J.haN]]] },
    b: { p: [0, 112], armF: { to: [60, 200], bend: 'd' }, armN: { a: [-65, 80] }, props: (J) => [['band', [J.haF, J.haN]], ['arrow', [80, 180], [80, 140]]] },
  },
  {
    id: 'elevation-laterale', titre: 'Élévation latérale aux haltères, assis sur une chaise calée contre un mur, vue de face : bras le long du corps, puis bras levés sur les côtés jusqu’à l’horizontale, mains jamais au-dessus des coudes',
    view: 'front', labels: ['Bras le long du corps', 'Bras à l’horizontale, pas plus haut'],
    a: { p: [0, 58], t: 90, hide: ['legN', 'legF'], armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, back: SEATF, props: (J) => [...LEGSF, ['plate', J.haN, 9], ['plate', J.haF, 9]] },
    b: { p: [0, 58], t: 90, hide: ['legN', 'legF'], armN: { a: [8, -4] }, armF: { a: [172, -176] }, back: SEATF, props: (J) => [...LEGSF, ['plate', J.haN, 9], ['plate', J.haF, 9], ['arrow', [120, 100], [120, 128]], ['arrow', [-120, 100], [-120, 128]]] },
  },
  {
    id: 'bonjour-poids-du-corps', titre: 'Bonjour au poids du corps, vue de profil : bras croisés sur la poitrine, les hanches reculent et le buste, dos plat, s’incline de moitié au plus (environ 45 degrés), genoux souples',
    labels: ['Debout, bras croisés', 'Buste incliné de moitié, dos plat'],
    a: { p: [0, 112], armN: { to: [12, 158], bend: 'd' }, armF: { to: [8, 162], bend: 'd' } },
    b: { p: [-30, 106], t: 45, h: 45, armN: { to: [22, 136], bend: 'd' }, armF: { to: [18, 140], bend: 'd' }, props: [['arrow', [-24, 60], [-76, 60]]] },
  },
  {
    id: 'charniere-dos-au-mur', titre: 'Charnière de hanche dos au mur, vue de profil : pieds à une longueur de pied du mur, les fesses reculent jusqu’au mur, le buste s’incline dos plat, les mains glissent sur les cuisses sans atteindre les genoux',
    labels: ['Debout, mains sur le haut des cuisses', 'Fesses au mur, dos plat'],
    a: { p: [0, 112], armN: { to: [10, 104], bend: 'd' }, armF: { to: [6, 104], bend: 'd' }, back: [['wall', -39, 14]] },
    b: { p: [-14, 108], t: 60, h: 60, armN: { to: [1, 94], bend: 'd' }, armF: { to: [-3, 96], bend: 'd' }, back: [['wall', -39, 14]], props: [['arrow', [44, 130], [44, 100]]] },
  },
  // ---- Lot 13 (fiches manquantes) ----
  {
    id: 'poussee-verticale-mur', titre: 'Poussée verticale au mur, vue de profil : debout face au mur, mains à hauteur du front, la tête passe entre les bras et s’arrête à une main du mur, rien sur la tête',
    labels: ['Mains à hauteur du front, bras tendus', 'Tête entre les bras, à une main du mur'],
    a: { p: [-12.6, 109.3], t: 77, h: 77, armN: { to: [66, 190], bend: 'd' }, armF: { to: [64, 188], bend: 'd' }, legN: { to: [-36, A], bend: 'f' }, legF: { to: [-40, A], bend: 'f' }, back: [['wall', 68, 14]], props: [['arrow', [12, 232], [48, 232]]] },
    b: { p: [3, 104.4], t: 68, h: 68, armN: { to: [66, 190], bend: 'd' }, armF: { to: [64, 188], bend: 'd' }, legN: { to: [-36, A], bend: 'f' }, legF: { to: [-40, A], bend: 'f' }, back: [['wall', 68, 14]], props: [['arrow', [52, 232], [16, 232]]] },
  },
  {
    id: 'rowing-serviette-resistee', titre: 'Rowing à la serviette, vue de dessus : serviette tendue entre les mains, une main résiste bras presque tendu, l’autre ramène la serviette vers le côté de la poitrine, coude près du corps',
    view: 'top', labels: ['Serviette tendue devant la poitrine', 'Une main tire, l’autre résiste'],
    a: { p: [0, 40], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { to: [24, 172], bend: 'f' }, armF: { to: [-24, 172], bend: 'f' }, props: (J) => [['towel', [J.haF, J.haN]]] },
    b: { p: [0, 40], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { to: [36, 116], bend: 'd' }, armF: { to: [-24, 172], bend: 'f' }, props: (J) => [['towel', [J.haF, J.haN]], ['arrow', [66, 170], [66, 128]]] },
  },
  {
    id: 'descente-une-jambe-chaise', titre: 'Descente sur une jambe vers une chaise, vue de profil : chaise calée contre un mur, l’autre pied frôle le sol, descente lente jusqu’à l’assise, remontée à deux jambes',
    labels: ['Sur une jambe, chaise derrière', 'Descente lente jusqu’à l’assise'],
    a: { p: [-1, 112], t: 90, armN: { a: [5, 0] }, armF: { a: [3, -2] }, legN: { to: [8, A], bend: 'f' }, legF: { to: [34, 24], bend: 'u' }, back: [['wall', -79, -14], ['chair', -75, 46, 1]], props: [['arrow', [88, 120], [88, 70]]] },
    b: { p: [-48, 58], t: 72, h: 72, armN: { a: [5, 0] }, armF: { a: [3, -2] }, legN: { to: [10, A], bend: 'f' }, legF: { to: [46, 22], bend: 'u' }, back: [['wall', -79, -14], ['chair', -75, 46, 1]] },
  },
  {
    id: 'equilibre-sur-une-jambe-en-mouvement', titre: 'Équilibre sur une jambe avec mouvement des bras, vue de profil : yeux ouverts, bras montent devant jusqu’à l’horizontale au plus, mur à portée',
    labels: ['Sur une jambe, bras le long du corps', 'Bras devant, à l’horizontale au plus'],
    a: { p: [0, 110], legN: { to: [0, A], bend: 'f' }, legF: { to: [-4, 24], bend: 'b' }, armN: { a: [-90, -88] }, armF: { a: [-88, -86] }, back: [['wall', 112, 14]] },
    b: { p: [0, 110], legN: { to: [0, A], bend: 'f' }, legF: { to: [-4, 24], bend: 'b' }, armN: { a: [2, 0] }, armF: { a: [0, -2] }, back: [['wall', 112, 14]], props: [['arrow', [70, 130], [70, 175]]] },
  },
  {
    id: 'adduction-couchee-cote', titre: 'Adduction couchée sur le côté, vue de face : jambe du dessus fléchie, pied au sol devant le genou, jambe du dessous tendue levée de quelques centimètres',
    view: 'front', labels: ['Sur le côté, jambe du dessus fléchie', 'Jambe du dessous levée de quelques cm'],
    a: { p: [-40, 20], t: 180, h: 180, tl: 68, sw: 12, hw: 8, hide: ['armF'], armN: { to: [-96, 38], bend: 'u' }, legN: { to: [20, 8], bend: 'u' }, legF: { a: [1, 1] }, back: [['mat', -170, 130]] },
    b: { p: [-40, 20], t: 180, h: 180, tl: 68, sw: 12, hw: 8, hide: ['armF'], armN: { to: [-96, 38], bend: 'u' }, legN: { to: [20, 8], bend: 'u' }, legF: { a: [9, 9] }, back: [['mat', -170, 130]], props: [['arrow', [76, 40], [76, 80]]] },
  },
  // ================= D23 vague 2 lot 1 =================
  {
    id: 'adduction-serrage-genoux', titre: 'Serrage des genoux sur un objet souple, couché sur le dos, vue de profil : bassin au sol, puis bassin soulevé en pont',
    labels: ['Serrer, bassin au sol', 'Serrer, en pont'],
    a: supine({ p: [5, 12], t: 180, h: 175, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, props: (J) => [['bag', [J.knN[0] + 2, J.knN[1]], 18, 16, 0]] }),
    b: supine({ p: [8, 38], t: 203, h: 170, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, props: (J) => [['bag', [J.knN[0] + 2, J.knN[1]], 18, 16, 0], ['arrow', [4, 90], [4, 120]]] }),
  },
  {
    id: 'chaise-murale', titre: 'Chaise murale, vue de profil : dos contre le mur, genoux peu fléchis à gauche, puis cuisses presque à l’horizontale à droite',
    labels: ['Genoux peu fléchis', 'Cuisses à l’horizontale'],
    a: { p: [-14, 100], t: 94, h: 90, armN: { to: [12, 98], bend: 'd' }, armF: { to: [8, 98], bend: 'd' }, legN: { to: [32, A], bend: 'f' }, legF: { to: [26, A], bend: 'f' }, back: [['wall', -26, -14]] },
    b: { p: [-14, 62], t: 94, h: 90, armN: { to: [12, 66], bend: 'd' }, armF: { to: [8, 66], bend: 'd' }, legN: { to: [42, A], bend: 'f' }, legF: { to: [36, A], bend: 'f' }, back: [['wall', -26, -14]], props: [['arrow', [96, 108], [96, 66]]] },
  },
  {
    id: 'curl-ischios-elastique', titre: 'Curl des ischio-jambiers debout à l’élastique, une main sur une chaise, vue de profil : jambe tendue, puis talon ramené vers les fesses',
    labels: ['Jambe tendue', 'Talon vers les fesses'],
    a: { p: [0, 112], t: 90, armN: { to: [70, 100], bend: 'd' }, armF: { to: [66, 100], bend: 'd' }, legN: { a: [-92, -92], foot: -30 }, legF: { to: [0, A], bend: 'f' }, back: [['chair', 110, 46, -1]], props: (J) => [['band', [J.anN, [-70, 6]]]] },
    b: { p: [0, 112], t: 90, armN: { to: [70, 100], bend: 'd' }, armF: { to: [66, 100], bend: 'd' }, legN: { a: [-92, 165], foot: -40 }, legF: { to: [0, A], bend: 'f' }, back: [['chair', 110, 46, -1]], props: (J) => [['band', [J.anN, [-70, 6]]], ['arrow', [-70, 40], [-70, 90]]] },
  },
  {
    id: 'ecarte-sol-elastique', titre: 'Écarté à l’élastique passé derrière le dos, vue de face : mains devant la poitrine, puis bras ouverts sur les côtés',
    view: 'front', labels: ['Mains devant la poitrine', 'Bras ouverts, coudes souples'],
    a: { p: [0, 104], legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { to: [12, 152], bend: 'd' }, armF: { to: [-12, 152], bend: 'd' }, back: (J) => [['band', [J.haF, [-48, J.haF[1]], [48, J.haN[1]], J.haN]]] },
    b: { p: [0, 104], legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { a: [10, 2] }, armF: { a: [170, 178] }, back: (J) => [['band', [J.haF, [-44, J.haF[1] - 18], [44, J.haN[1] - 18], J.haN]]], props: (J) => [['arrow', [100, 190], [130, 190]], ['arrow', [-100, 190], [-130, 190]]] },
  },
  {
    id: 'extension-genou-elastique', titre: 'Extension du genou assis sur une chaise avec un élastique à la cheville, vue de profil : genou fléchi, puis jambe tendue',
    labels: ['Genou fléchi', 'Jambe tendue'],
    a: { p: [-48, 58], t: 88, armN: { to: [4, 66], bend: 'd' }, armF: { to: [0, 66], bend: 'd' }, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [J.anN, [-100, 20]]]] },
    b: { p: [-48, 58], t: 88, armN: { to: [4, 66], bend: 'd' }, armF: { to: [0, 66], bend: 'd' }, legN: { a: [-2, 4], foot: 60 }, legF: { to: [2, A], bend: 'f' }, back: [['chair', -75, 46, 1]], props: (J) => [['band', [J.anN, [-100, 20]]], ['arrow', [70, 40], [70, 60]]] },
  },
  {
    id: 'extension-hanche-quatre-pattes', titre: 'Extension de la hanche à quatre pattes, vue de profil : genou sous la hanche, puis cuisse levée vers l’arrière, genou fléchi',
    labels: ['Genou sous la hanche', 'Cuisse levée, genou fléchi'],
    a: quad(),
    b: quad({ legN: { a: [188, 90], foot: 60 }, props: [['arrow', [-120, 40], [-120, 80]]] }),
  },
  {
    id: 'haussement-epaules-halteres', titre: 'Haussement d’épaules avec un haltère dans chaque main, vue de face : épaules basses, puis épaules montées vers les oreilles',
    view: 'front', labels: ['Épaules basses', 'Épaules montées, bras tendus'],
    a: { p: [0, 104], legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, props: (J) => [['plate', J.haN, 9], ['plate', J.haF, 9]] },
    b: { p: [0, 104], tl: 74, hl: -4, legN: { to: [16, A], bend: 'f' }, legF: { to: [-16, A], bend: 'b' }, armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, props: (J) => [['plate', J.haN, 9], ['plate', J.haF, 9], ['arrow', [64, 150], [64, 176]], ['arrow', [-64, 150], [-64, 176]]] },
  },
  // ================= D23 vague 2 lot 2 =================
  {
    id: 'montee-rapide-chaise', titre: 'Montée rapide sur chaise calée contre un mur, vue de profil : un pied posé au milieu de l’assise, puis debout sur la chaise, les deux pieds posés',
    labels: ['Un pied entier sur l’assise', 'Debout sur la chaise, stable'],
    a: { p: [38, 102], t: 90, h: 90, armN: { to: [48, 96], bend: 'b' }, armF: { to: [44, 96], bend: 'b' }, legN: { to: [88, 54], bend: 'f' }, legF: { to: [32, A], bend: 'f' }, back: [['chair', 112, 46, -1], ['wall', 112, 14]] },
    b: { p: [84, 158], t: 90, h: 90, armN: { to: [94, 152], bend: 'b' }, armF: { to: [90, 152], bend: 'b' }, legN: { to: [94, 54], bend: 'f' }, legF: { to: [78, 54], bend: 'f' }, back: [['chair', 112, 46, -1], ['wall', 112, 14]], props: [['arrow', [20, 70], [20, 120]]] },
  },
  {
    id: 'good-morning-elastique', titre: 'Good morning à l’élastique, vue de profil : élastique sous les pieds, mains près des épaules, les hanches reculent et le buste, dos plat, s’incline de moitié au plus, genoux souples',
    labels: ['Debout sur l’élastique, mains aux épaules', 'Hanches en arrière, dos plat'],
    a: { p: [0, 112], armN: { to: [14, 168], bend: 'd' }, armF: { to: [10, 170], bend: 'd' }, props: (J) => [['band', [[6, 4], J.haN]], ['band', [[-6, 4], J.haF]]] },
    b: { p: [-34, 104], t: 45, h: 45, armN: { to: [14, 150], bend: 'd' }, armF: { to: [10, 152], bend: 'd' }, props: (J) => [['band', [[6, 4], J.haN]], ['band', [[-6, 4], J.haF]], ['arrow', [-30, 60], [-82, 60]]] },
  },
  {
    id: 'balances-de-jambe', titre: 'Balances de jambe debout, une main sur un mur, vue de profil : jambe tendue qui se balance doucement vers l’avant, puis vers l’arrière, buste droit',
    labels: ['Jambe balancée vers l’avant', 'Jambe balancée vers l’arrière'],
    a: { p: [30, 112], t: 90, armN: { to: [82, 142], bend: 'd' }, armF: { to: [78, 142], bend: 'd' }, legN: { a: [-68, -68], foot: 0 }, legF: { to: [30, A], bend: 'f' }, back: [['wall', 88, 14]], props: [['arrow', [60, 40], [80, 52]]] },
    b: { p: [30, 112], t: 90, armN: { to: [82, 142], bend: 'd' }, armF: { to: [78, 142], bend: 'd' }, legN: { a: [-112, -112], foot: -30 }, legF: { to: [30, A], bend: 'f' }, back: [['wall', 88, 14]], props: [['arrow', [0, 52], [-20, 40]]] },
  },
  {
    id: 'extension-triceps-sol-leger', titre: 'Extension des triceps allongé au sol avec un haltère léger dans chaque main : les coudes restent fixes, les haltères descendent vers les côtés de la tête, jamais au-dessus du visage',
    labels: ['Bras tendus au-dessus de la poitrine', 'Coudes fixes, haltères près de la tête'],
    a: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, props: (J) => [['db', J.haN, 0], ['db', J.haF, 0]] }),
    b: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 200] }, armF: { a: [88, 198] }, props: (J) => [['db', J.haN, 0], ['db', J.haF, 0], ['arrow', [-40, 100], [-86, 70]]] }),
  },
  // ================= D23 vague 2 lot 3 =================
  {
    id: 'crunch-au-sol', titre: 'Crunch au sol, vue de profil : couché sur le dos, genoux pliés, pieds à plat, bras croisés sur la poitrine ; seules les épaules se soulèvent, le bas du dos reste au sol',
    labels: ['Couché, bras croisés sur la poitrine', 'Épaules soulevées, bas du dos au sol'],
    a: supine({ p: [-5, 11], t: 180, h: 180, armN: { to: [-48, 24], bend: 'u' }, armF: { to: [-52, 24], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' } }),
    b: supine({ p: [-5, 11], t: 158, h: 150, armN: { to: [-44, 40], bend: 'u' }, armF: { to: [-48, 40], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, props: [['arrow', [-70, 70], [-52, 100]]] }),
  },
  {
    id: 'releve-bassin-jambes-pliees', titre: 'Relevé de bassin, jambes pliées en l’air, vue de profil : cuisses à la verticale, genoux à angle droit, mains à plat au sol ; le bassin décolle de quelques centimètres',
    labels: ['Cuisses à la verticale, mains au sol', 'Bassin soulevé de quelques cm'],
    a: supine({ p: [-5, 11], t: 180, h: 180, armN: { to: [-30, 8], bend: 'u' }, armF: { to: [-34, 8], bend: 'u' }, legN: { a: [90, 0] }, legF: { a: [90, 0] } }),
    b: supine({ p: [-8, 26], t: 190, h: 180, armN: { to: [-30, 8], bend: 'u' }, armF: { to: [-34, 8], bend: 'u' }, legN: { a: [96, 6] }, legF: { a: [96, 6] }, props: [['arrow', [34, 50], [34, 84]]] }),
  },
  {
    id: 'superman-alterne', titre: 'Superman alterné, vue de profil : couché sur le ventre, un bras tendu devant et la jambe opposée tendue se lèvent de quelques centimètres, regard vers le sol',
    labels: ['Sur le ventre, bras tendus devant', 'Bras et jambe opposés levés'],
    a: prone({ p: [-12, 11], armN: { a: [0, 0] }, armF: { a: [0, 0] } }),
    b: prone({ p: [-12, 11], armN: { a: [14, 14] }, armF: { a: [0, 0] }, legF: { a: [172, 172], foot: 180 }, props: [['arrow', [70, 40], [70, 66]], ['arrow', [-110, 40], [-110, 66]]] }),
  },
  {
    id: 'nage-au-sol', titre: 'Nage au sol, vue de profil : couché sur le ventre, battements lents de bras et jambes opposés qui se lèvent de quelques centimètres, regard vers le sol',
    labels: ['Sur le ventre, bras devant', 'Bras et jambe opposés levés', 'On alterne doucement'],
    a: prone({ p: [-12, 11], armN: { a: [0, 0] }, armF: { a: [0, 0] } }),
    b: prone({ p: [-12, 11], armN: { a: [14, 14] }, armF: { a: [0, 0] }, legF: { a: [172, 172], foot: 180 }, props: [['arrow', [70, 40], [70, 66]]] }),
    c: prone({ p: [-12, 11], armN: { a: [0, 0] }, armF: { a: [14, 14] }, legN: { a: [172, 172], foot: 180 }, props: [['arrow', [-110, 40], [-110, 66]]] }),
  },
  {
    id: 'gainage-lateral-dynamique', titre: 'Gainage latéral dynamique, vue de face : appui sur l’avant-bras, corps aligné, puis le bassin descend vers le sol et remonte sans à-coup',
    view: 'front', labels: ['Corps aligné, appui sur l’avant-bras', 'Le bassin descend, puis remonte'],
    a: { p: [1, 30], t: 168, h: 165, tl: 68, sw: 12, hw: 8, armN: { a: [-90, 0] }, armF: { to: [-2, 44], bend: 'u' }, legN: { to: [106, 9], bend: 'u' }, legF: { to: [102, 9], bend: 'u' }, back: [['mat', -170, 170]] },
    b: { p: [1, 16], t: 157, h: 160, tl: 68, sw: 12, hw: 8, armN: { a: [-90, 0] }, armF: { to: [-2, 30], bend: 'u' }, legN: { to: [106, 9], bend: 'u' }, legF: { to: [102, 9], bend: 'u' }, back: [['mat', -170, 170]], props: [['arrow', [4, 110], [4, 70]]] },
  },
  {
    id: 'presse-des-mains', titre: 'Presse des mains, vue de face : debout, paumes jointes devant la poitrine, coudes plus bas que les poignets, les paumes s’appuient l’une contre l’autre sans bouger',
    view: 'front', labels: ['Paumes jointes devant la poitrine', 'Les paumes s’appuient l’une sur l’autre'],
    a: { p: [0, 112], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armN: { to: [3, 150], bend: 'd' }, armF: { to: [-3, 150], bend: 'd' } },
    b: { p: [0, 112], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armN: { to: [3, 150], bend: 'd' }, armF: { to: [-3, 150], bend: 'd' }, props: [['arrow', [-40, 150], [-12, 150]], ['arrow', [40, 150], [12, 150]]] },
  },
  {
    id: 'fente-laterale-glissee-serviette', titre: 'Fente latérale glissée, vue de face : une main sur une chaise, serviette sous le pied qui glisse sur le côté, l’autre jambe se plie, buste droit',
    view: 'front', labels: ['Pieds joints, serviette sous un pied', 'Le pied glisse, l’autre genou plie'],
    a: { p: [0, 112], legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-52, 124], bend: 'b' }, armN: { to: [20, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3]], props: [['towel', [[6, 5], [24, 5]]]] },
    b: { p: [-14, 90], legN: { to: [80, A], bend: 'f' }, legF: { to: [-24, A], bend: 'b' }, armF: { to: [-62, 124], bend: 'b' }, armN: { to: [6, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3]], props: [['towel', [[68, 5], [92, 5]]], ['arrow', [50, 40], [96, 40]]] },
  },
  {
    id: 'adduction-hanche-elastique-debout', titre: 'Adduction de la hanche debout avec un élastique ancré bas à la cheville, vue de face : une main sur la chaise, la jambe part de côté puis revient devant l’autre, sans pencher le buste',
    view: 'front', labels: ['Jambe écartée, élastique tendu', 'La jambe revient devant l’autre'],
    a: { p: [0, 112], legN: { to: [44, 16], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-52, 124], bend: 'b' }, armN: { to: [20, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3], ['wall', 124, 14], ['anchor', 122, 20]], props: (J) => [['band', [J.anN, [122, 20]]]] },
    b: { p: [0, 112], legN: { to: [-4, 22], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-52, 124], bend: 'b' }, armN: { to: [20, 118], bend: 'f' }, back: [['rect', -80, 0, 8, 122, 2], ['rect', -80, 114, 40, 10, 3], ['wall', 124, 14], ['anchor', 122, 20]], props: (J) => [['band', [J.anN, [122, 20]]], ['arrow', [86, 60], [34, 60]]] },
  },
  {
    id: 'extension-hanche-debout-elastique', titre: 'Extension de la hanche debout avec un élastique ancré bas à la cheville, vue de profil : face à la porte, mains sur le dossier d’une chaise, la jambe part un peu en arrière, buste droit',
    labels: ['Face à la porte, mains sur le dossier', 'Jambe poussée un peu en arrière'],
    a: { p: [30, 104], legN: { to: [36, A], bend: 'f' }, legF: { to: [24, A], bend: 'f' }, armN: { to: [62, 108], bend: 'd' }, armF: { to: [60, 106], bend: 'd' }, back: [['rect', 58, 0, 8, 106, 2], ['rect', 58, 98, 34, 10, 3], ['wall', 150, 14], ['anchor', 148, 20]], props: (J) => [['band', [J.anN, [148, 20]]]] },
    b: { p: [30, 104], t: 88, legN: { to: [-10, 22], bend: 'f', foot: -40 }, legF: { to: [24, A], bend: 'f' }, armN: { to: [62, 108], bend: 'd' }, armF: { to: [60, 106], bend: 'd' }, back: [['rect', 58, 0, 8, 106, 2], ['rect', 58, 98, 34, 10, 3], ['wall', 150, 14], ['anchor', 148, 20]], props: (J) => [['band', [J.anN, [148, 20]]], ['arrow', [10, 60], [-26, 60]]] },
  },
  {
    id: 'montee-laterale-marche', titre: 'Montée latérale sur la première marche, vue de face : une main sur la rampe, un pied monte sur la marche, puis les deux pieds sont posés dessus, sans charge dans les mains',
    view: 'front', labels: ['Un pied sur la marche, main sur la rampe', 'Debout sur la marche, stable'],
    a: { p: [8, 108], legN: { to: [44, 26], bend: 'f' }, legF: { to: [-14, A], bend: 'b' }, armF: { to: [-24, 114], bend: 'b' }, armN: { to: [20, 114], bend: 'f' }, back: [['step', 20, 100, 18], ['lin', [[-70, 100], [90, 150]], 5]] },
    b: { p: [44, 130], legN: { to: [58, 26], bend: 'f' }, legF: { to: [30, 26], bend: 'b' }, armF: { to: [20, 128], bend: 'b' }, armN: { to: [64, 134], bend: 'f' }, back: [['step', 20, 100, 18], ['lin', [[-70, 100], [90, 150]], 5]], props: [['arrow', [-20, 60], [10, 60]]] },
  },
  {
    id: 'fente-marchee-halteres', titre: 'Fente marchée avec un haltère léger dans chaque main, vue de profil : un pas en avant, les deux genoux fléchis, buste droit, puis on se redresse',
    labels: ['Debout, haltères légers le long du corps', 'Grand pas, les deux genoux fléchis'],
    a: { p: [0, 112], armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, props: (J) => [['db', J.haN], ['db', J.haF]] },
    b: { p: [24, 80], armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, legN: { to: [58, A], bend: 'f' }, legF: { to: [-50, 22], bend: 'd', foot: -60 }, props: [(J) => [['db', J.haN], ['db', J.haF]], ['arrow', [70, 190], [112, 190]]] },
  },
  // ================= D23 vague 2 lot 4 =================
  {
    id: 'developpe-elastique-dos', titre: 'Développé à l’élastique passé dans le dos, vue de profil : élastique à plat derrière le haut du dos, mains à la poitrine, puis bras tendus devant sans cambrer',
    labels: ['Mains à la poitrine, élastique dans le dos', 'Bras tendus devant, élastique derrière'],
    a: { p: [0, 112], t: 80, h: 80, legN: { to: [34, A], bend: 'f' }, legF: { to: [-30, A], bend: 'b' }, armN: { to: [28, 160], bend: 'd' }, armF: { to: [24, 158], bend: 'd' }, back: (J) => [['band', [J.haN, [J.sh[0] - 34, J.sh[1] - 16], J.haF]]] },
    b: { p: [0, 112], t: 80, h: 80, legN: { to: [34, A], bend: 'f' }, legF: { to: [-30, A], bend: 'b' }, armN: { to: [76, 164], bend: 'd' }, armF: { to: [72, 162], bend: 'd' }, back: (J) => [['band', [J.haN, [J.sh[0] - 34, J.sh[1] - 16], J.haF]]], props: [['arrow', [40, 205], [90, 205]]] },
  },
  {
    id: 'pompe-declinee-banc', titre: 'Pompe pieds surélevés, vue de profil : mains au sol, pieds posés sur un banc, corps aligné ; les coudes plient, la poitrine descend vers le sol',
    labels: ['Corps aligné, pieds sur le banc', 'Coudes pliés, poitrine près du sol'],
    a: { p: [5, 65], t: 11.5, h: 5, armN: { to: [62, 8], bend: 'f' }, armF: { to: [58, 8], bend: 'f' }, legN: { to: [-100, 46], bend: 'd', foot: -60 }, legF: { to: [-96, 46], bend: 'd', foot: -60 }, back: [['mat', -10, 130], ['rect', -140, 0, 70, 40, 3]] },
    b: { p: [6, 44], t: 8, h: 0, armN: { to: [62, 8], bend: 'b' }, armF: { to: [58, 8], bend: 'b' }, legN: { to: [-100, 46], bend: 'd', foot: -60 }, legF: { to: [-96, 46], bend: 'd', foot: -60 }, back: [['mat', -10, 130], ['rect', -140, 0, 70, 40, 3]], props: [['arrow', [-20, 110], [-20, 80]]] },
  },
  {
    id: 'tirage-vertical-elastique-barre-traction', titre: 'Tirage vertical à l’élastique noué à la barre de traction, vue de profil : à genoux sous la barre, bras tendus vers le haut, puis coudes tirés vers le bas, mains aux épaules',
    labels: ['Bras tendus vers la barre', 'Coudes vers le bas, mains aux épaules'],
    a: { p: [-5, 64], t: 90, armN: { a: [80, 82] }, armF: { a: [78, 80] }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130], ['rect', 6, 244, 14, 8, 2], ['anchor', 13, 240]], props: (J) => [['band', [J.haN, [13, 240]]]] },
    b: { p: [-5, 64], t: 90, armN: { to: [24, 122], bend: 'd' }, armF: { to: [20, 120], bend: 'd' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130], ['rect', 6, 244, 14, 8, 2], ['anchor', 13, 240]], props: (J) => [['band', [J.haN, [13, 240]]], ['arrow', [70, 190], [70, 140]]] },
  },
  {
    id: 'traction-negative-barre', titre: 'Traction négative, vue de face : on monte sur une chaise, menton au-dessus de la barre, puis on descend très lentement jusqu’aux bras presque tendus',
    view: 'front', labels: ['Menton au-dessus de la barre, pieds sur la chaise', 'Descente lente, bras presque tendus'],
    a: { p: [0, 180], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [9, 70], bend: 'f' }, legF: { to: [-9, 70], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7], ['rect', -34, 0, 68, 66, 3]], props: [['arrow', [112, 190], [112, 130]]] },
    b: { p: [0, 124], t: 90, h: 90, armN: { to: [31, 252], bend: 'f' }, armF: { to: [-31, 252], bend: 'b' }, legN: { to: [6, 20], bend: 'f' }, legF: { to: [-6, 20], bend: 'b' }, back: [['rect', -86, 0, 8, 258, 2], ['rect', 78, 0, 8, 258, 2], ['lin', [[-82, 254], [82, 254]], 7], ['rect', -34, 0, 68, 66, 3]] },
  },
  {
    id: 'oiseau-elastique', titre: 'Oiseau à l’élastique, vue de dessus : buste penché en avant, élastique sous les pieds, bras pendants, puis bras écartés sur les côtés à hauteur des épaules',
    view: 'top', labels: ['Buste penché, bras pendants', 'Bras écartés sur les côtés'],
    a: { p: [0, 60], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { a: [78, 78] }, armF: { a: [102, 102] }, props: (J) => [['band', [J.haN, [16, 56]]], ['band', [J.haF, [-16, 56]]]] },
    b: { p: [0, 60], t: 90, tl: 70, hl: 18, sw: 22, hw: 8, h: 90, hide: ['legN', 'legF'], armN: { a: [8, 8] }, armF: { a: [172, 172] }, props: (J) => [['band', [J.haN, [16, 56]]], ['band', [J.haF, [-16, 56]]], ['arrow', [90, 130], [112, 130]], ['arrow', [-90, 130], [-112, 130]]] },
  },
  {
    id: 'developpe-arnold-halteres', titre: 'Développé Arnold assis sur une chaise, vue de face : haltères devant les épaules, paumes vers soi, puis les mains tournent vers l’avant en montant jusqu’aux bras tendus',
    view: 'front', labels: ['Haltères devant les épaules, paumes vers soi', 'Bras tendus au-dessus de la tête'],
    a: { p: [0, 58], t: 90, hide: ['legN', 'legF'], armN: { to: [8, 142], bend: 'd' }, armF: { to: [-8, 142], bend: 'd' }, back: SEATF, props: (J) => [...LEGSF, ['plate', J.haN, 9], ['plate', J.haF, 9]] },
    b: { p: [0, 58], t: 90, hide: ['legN', 'legF'], armN: { to: [20, 186], bend: 'd' }, armF: { to: [-20, 186], bend: 'd' }, back: SEATF, props: (J) => [...LEGSF, ['plate', J.haN, 9], ['plate', J.haF, 9], ['arrow', [100, 140], [100, 190]], ['arrow', [-100, 140], [-100, 190]]] },
  },
  {
    id: 'tirage-visage-elastique-barre', titre: 'Tirage au visage à l’élastique noué à la barre de traction, vue de profil : bras tendus vers la barre, puis mains au visage, coudes écartés',
    labels: ['Bras tendus vers la barre', 'Mains au visage, coudes écartés'],
    a: { p: [-20, 110], t: 94, h: 90, legN: { to: [0, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, armN: { to: [50, 170], bend: 'd' }, armF: { to: [46, 168], bend: 'd' }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]]] },
    b: { p: [-20, 110], t: 94, h: 90, legN: { to: [0, A], bend: 'f' }, legF: { to: [-8, A], bend: 'f' }, armN: { to: [14, 190], bend: 'b' }, armF: { to: [10, 186], bend: 'b' }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]], ['arrow', [60, 150], [20, 150]]] },
  },
  {
    id: 'curl-concentration-halteres', titre: 'Curl concentration, vue de profil : assis, buste penché, coude appuyé contre l’intérieur de la cuisse, l’haltère monte vers l’épaule sans que le coude bouge',
    labels: ['Bras tendu vers le sol, coude contre la cuisse', 'Haltère monté vers l’épaule, coude fixe'],
    a: { p: [-30, 58], t: 45, h: 40, legN: { to: [28, A], bend: 'f' }, legF: { to: [24, A], bend: 'f' }, armN: { a: [-98, -90] }, armF: { to: [10, 64], bend: 'u' }, back: [['chair', -52, 46, 1]], props: (J) => [['plate', J.haN, 9]] },
    b: { p: [-30, 58], t: 45, h: 40, legN: { to: [28, A], bend: 'f' }, legF: { to: [24, A], bend: 'f' }, armN: { a: [-98, 50] }, armF: { to: [10, 64], bend: 'u' }, back: [['chair', -52, 46, 1]], props: (J) => [['plate', J.haN, 9], ['arrow', [60, 60], [60, 100]]] },
  },
  {
    id: 'curl-inverse-halteres', titre: 'Curl prise inversée, debout, vue de profil : haltères tenus paumes vers le sol, bras le long du corps, puis haltères montés vers les épaules, coudes contre les côtes',
    labels: ['Paumes vers le sol, bras le long du corps', 'Haltères aux épaules, coudes fixes'],
    a: { p: [0, 112], armN: { a: [-90, -90] }, armF: { a: [-92, -92] }, props: (J) => [['plate', J.haN, 10], ['plate', J.haF, 10]] },
    b: { p: [0, 112], armN: { a: [-88, 68] }, armF: { a: [-90, 64] }, props: (J) => [['plate', J.haN, 10], ['plate', J.haF, 10], ['arrow', [62, 120], [62, 165]]] },
  },
  {
    id: 'curl-poignet-halteres', titre: 'Curl de poignet, vue de profil : assis, avant-bras posé sur la cuisse, poignet dépassant le genou, un haltère très léger ; la main descend, puis remonte, l’avant-bras ne bouge pas',
    labels: ['Poignet détendu, main vers le bas', 'Poignet monté, avant-bras immobile'],
    a: { p: [-48, 58], t: 35, h: 20, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, armN: { a: [-105, -25] }, armF: { a: [-100, -20] }, back: [['chair', -75, 46, 1]], props: (J) => [['plate', J.haN, 7]] },
    b: { p: [-48, 58], t: 35, h: 20, legN: { to: [8, A], bend: 'f' }, legF: { to: [2, A], bend: 'f' }, armN: { a: [-105, 30] }, armF: { a: [-100, -20] }, back: [['chair', -75, 46, 1]], props: (J) => [['plate', J.haN, 7], ['arrow', [52, 56], [52, 86]]] },
  },
  {
    id: 'extension-triceps-elastique', titre: 'Extension des triceps à l’élastique ancré en haut, vue de profil : coudes collés au corps, avant-bras à l’horizontale, puis les mains poussent vers le bas jusqu’aux bras tendus, coudes immobiles',
    labels: ['Coudes collés, mains à hauteur de poitrine', 'Bras tendus vers le bas, coudes fixes'],
    a: { p: [0, 112], armN: { a: [-92, 0] }, armF: { a: [-90, 2] }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]]] },
    b: { p: [0, 112], armN: { a: [-92, -84] }, armF: { a: [-90, -82] }, back: [['wall', 150, 14], ['anchor', 150, 214]], props: (J) => [['band', [J.haN, [150, 214]]], ['arrow', [66, 150], [66, 100]]] },
  },
  {
    id: 'kickback-triceps-halteres', titre: 'Extension triceps buste penché, vue de profil : une main et un genou sur le banc, dos plat, coude plié contre le corps, puis l’avant-bras part vers l’arrière jusqu’au bras tendu, coude immobile',
    labels: ['Coude plié contre le corps', 'Bras tendu vers l’arrière, coude fixe'],
    a: { p: [-18, 104], t: 11, h: 20, armN: { a: [191, -90] }, armF: { to: [46, 50], bend: 'f' }, legN: { a: [-90, 180], foot: 180 }, legF: { to: [-30, A], bend: 'b' }, back: [['rect', -85, 38, 155, 8, 2], ['lin', [[-70, 0], [-70, 38]], 6], ['lin', [[55, 0], [55, 38]], 6]], props: (J) => [['plate', J.haN, 8]] },
    b: { p: [-18, 104], t: 11, h: 20, armN: { a: [191, 191] }, armF: { to: [46, 50], bend: 'f' }, legN: { a: [-90, 180], foot: 180 }, legF: { to: [-30, A], bend: 'b' }, back: [['rect', -85, 38, 155, 8, 2], ['lin', [[-70, 0], [-70, 38]], 6], ['lin', [[55, 0], [55, 38]], 6]], props: (J) => [['plate', J.haN, 8], ['arrow', [-50, 120], [-90, 120]]] },
  },
  {
    id: 'cou-lateral-arriere-main', titre: 'Cou, isométrie avec la main, assis : la main derrière la tête pousse, la tête résiste sans bouger (côté : même geste, main sur le côté de la tête)',
    labels: ['Main contre la tête, tête neutre', 'On résiste sans bouger la tête'],
    a: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [-12, 128], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]] },
    b: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [-12, 128], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: [['arrow', [-70, 138], [-40, 138]]] },
  },
  {
    id: 'rotation-isometrique-cou', titre: 'Cou, résister à la rotation avec la main, assis : la main sur la joue pousse, la tête garde le regard devant',
    labels: ['Main sur la joue, regard devant', 'On résiste sans tourner la tête'],
    a: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 120], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]] },
    b: { p: [-48, 58], t: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [14, 120], bend: 'u' }, armF: { a: [3, -2] }, back: [['chair', -75, 46, 1]], props: [['arrow', [58, 120], [34, 120]]] },
  },
  {
    id: 'marche-de-l-ours', titre: 'Marche de l\'ours, genoux décollés : à quatre pattes sur les mains et la pointe des pieds, genoux à quelques centimètres du sol, dos plat ; puis un pas lent main et pied opposés',
    labels: ['Genoux décollés, dos plat', 'Un pas lent, main et pied opposés'],
    a: quad({ p: [-18, 64], t: 9, h: 18, legN: { to: [-66, 9], bend: 'd', foot: -60 }, legF: { to: [-60, 9], bend: 'd', foot: -60 } }),
    b: quad({ p: [-14, 64], t: 9, h: 18, armN: { to: [64, 6], bend: 'f' }, legF: { to: [-40, 9], bend: 'd', foot: -60 }, legN: { to: [-66, 9], bend: 'd', foot: -60 }, props: [['arrow', [30, 100], [70, 100]]] }),
  },
  {
    id: 'marche-du-crabe', titre: 'Pont du crabe, maintien : assis au sol puis hanches levées, mains derrière sous les épaules, pieds à plat, genoux pliés ; corps en table',
    labels: ['Hanches basses, mains derrière', 'Hanches levées, corps en table'],
    a: { p: [-30, 24], t: 25, h: 30, armN: { to: [32, 7], bend: 'f' }, armF: { to: [26, 7], bend: 'f' }, legN: { to: [-70, A], bend: 'u' }, legF: { to: [-64, A], bend: 'u' }, back: [['mat', -140, 130]] },
    b: { p: [-30, 54], t: 20, h: 28, armN: { to: [34, 7], bend: 'f' }, armF: { to: [28, 7], bend: 'f' }, legN: { to: [-72, A], bend: 'u' }, legF: { to: [-66, A], bend: 'u' }, back: [['mat', -140, 130]], props: [['arrow', [-30, 95], [-30, 125]]] },
  },
  {
    id: 'releve-bassin-marche', titre: 'Relevé de bassin avec pas alternés : couché sur le dos, bassin levé en pont, puis un pied monte sans que le bassin s\'incline',
    labels: ['Pont, bassin levé', 'Un pied monte, bassin stable'],
    a: { p: [8, 38], t: 203, h: 170, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [60, A], bend: 'u' }, back: [['mat', -140, 130]] },
    b: { p: [8, 38], t: 203, h: 170, armN: { to: [15, 9], bend: 'u' }, armF: { to: [10, 9], bend: 'u' }, legN: { to: [66, A], bend: 'u' }, legF: { to: [52, 40], bend: 'u' }, back: [['mat', -140, 130]], props: [['arrow', [100, 40], [100, 70]]] },
  },
  {
    id: 'tirage-sac-sur-sol', titre: 'Tirage d\'un sac sur le sol : buste penché dos plat, mains sur la poignée du sac, le sac glisse vers soi en tirant main sur main',
    labels: ['Bras tendus vers le sac', 'Sac tiré vers les pieds, coudes serrés'],
    a: { p: [-40, 52], t: 30, h: 28, armN: { to: [64, 32], bend: 'd' }, armF: { to: [60, 32], bend: 'd' }, legN: { to: [-5, A], bend: 'f' }, legF: { to: [-15, A], bend: 'f' }, props: [['bag', [76, 24], 40, 26, 0]] },
    b: { p: [-40, 52], t: 30, h: 28, armN: { to: [14, 40], bend: 'b' }, armF: { to: [10, 40], bend: 'b' }, legN: { to: [-5, A], bend: 'f' }, legF: { to: [-15, A], bend: 'f' }, props: [['bag', [26, 24], 40, 26, 0], ['arrow', [100, 70], [60, 70]]] },
  },
  {
    id: 'saut-lateral-pieds-joints', titre: 'Saut latéral pieds joints, vue de face : réception souple pieds joints, puis petit saut de côté par-dessus une ligne, genoux au-dessus des pieds',
    view: 'front', labels: ['Pieds joints, genoux souples', 'Petit saut de côté (quelques centimètres)'],
    a: { p: [0, 106], legN: { to: [8, A], bend: 'f' }, legF: { to: [-8, A], bend: 'b' }, armN: { a: [-70, -50] }, armF: { a: [-110, -130] } },
    b: { p: [0, 124], legN: { to: [8, 26], bend: 'f' }, legF: { to: [-8, 26], bend: 'b' }, armN: { a: [-50, -30] }, armF: { a: [-130, -150] }, props: [['arrow', [-40, 40], [40, 40]]] },
  },
  // ---- Lot 06 (vague 2) ----
  {
    id: 'coquille-hanche', titre: 'Coquille, vue de dessus : couché sur le côté, hanches et genoux pliés, pieds joints, le genou du dessus qui s\'ouvre',
    view: 'top', labels: ['Hanches et genoux pliés, pieds joints', 'Genou du dessus ouvert, pieds joints'],
    a: { p: [-40, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { to: [36, 122], bend: 'f' }, legF: { to: [36, 122], bend: 'b' }, armN: { a: [90, 90] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 300, 190, 0]] },
    b: { p: [-40, 120], t: 180, tl: 68, hl: 20, h: 180, sw: 6, hw: 6, legN: { to: [36, 122], bend: 'f' }, legF: { to: [28, 124], bend: 'b' }, armN: { a: [90, 90] }, armF: { a: [92, 92] }, back: [['rect', -140, 30, 300, 190, 0]], props: [['arrow', [20, 185], [20, 210]]] },
  },
  {
    id: 'elevation-frontale-halteres', titre: 'Élévation frontale avec deux haltères légers, vue de profil : bras le long du corps, puis bras tendus devant jusqu\'à l\'horizontale',
    labels: ['Bras le long du corps', 'Bras tendus devant, à l\'horizontale'],
    a: { p: [0, 112], armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, props: (J) => [['db', J.haN], ['db', J.haF]] },
    b: { p: [0, 112], armN: { a: [3, 3] }, armF: { a: [-3, -3] }, props: (J) => [['db', J.haN, 90], ['db', J.haF, 90], ['arrow', [120, 150], [120, 195]]] },
  },
  {
    id: 'etirement-epaule-bras-croise', titre: 'Étirement de l\'arrière de l\'épaule, vue de face : un bras tendu devant la poitrine, l\'autre main le tire doucement contre soi',
    view: 'front', labels: ['Debout, bras le long du corps', 'Bras tendu en travers, tiré par l\'autre main'],
    a: { p: [0, 112], armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' } },
    b: { p: [0, 112], armF: { a: [0, 0] }, armN: { to: [14, 168], bend: 'd' }, legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' } },
  },
  {
    id: 'fente-croisee', titre: 'Fente croisée en arrière, vue de face : une jambe passe derrière l\'autre, en diagonale, puis on se redresse ; mains aux hanches',
    view: 'front', labels: ['Debout, mains aux hanches', 'Une jambe passe derrière, genoux fléchis'],
    a: { p: [0, 112], armN: { to: [26, 110], bend: 'f' }, armF: { to: [-26, 110], bend: 'b' }, legN: { to: [14, A], bend: 'f' }, legF: { to: [-14, A], bend: 'b' } },
    b: { p: [0, 86], armN: { to: [26, 84], bend: 'f' }, armF: { to: [-26, 84], bend: 'b' }, legN: { to: [14, A], bend: 'f' }, legF: { to: [34, 16], bend: 'd', foot: -30 }, props: [['arrow', [-70, 70], [-70, 40]]] },
  },
  {
    id: 'pallof-pas-lateraux', titre: 'Tenue anti-rotation avec pas de côté, vue de dessus : bras tendus devant la poitrine, élastique tiré de côté, petits pas qui s\'éloignent de l\'ancrage, buste immobile',
    view: 'top', labels: ['Bras tendus, élastique de côté', 'Pas de côté, buste qui ne tourne pas'],
    a: { p: [0, 60], t: 90, tl: 40, hl: 0, sw: 22, hw: 10, face: 90, armN: { to: [4, 186], bend: 'f' }, armF: { to: [-2, 186], bend: 'b' }, hide: ['legN', 'legF'], back: [['wall', 118, 14], ['anchor', 120, 124]], props: [(J) => [['band', [J.haN, [120, 124]]]]] },
    b: { p: [-40, 60], t: 90, tl: 40, hl: 0, sw: 22, hw: 10, face: 90, armN: { to: [-36, 186], bend: 'f' }, armF: { to: [-42, 186], bend: 'b' }, hide: ['legN', 'legF'], back: [['wall', 118, 14], ['anchor', 120, 124]], props: [(J) => [['band', [J.haN, [120, 124]]]], ['arrow', [-10, 20], [-60, 20]]] },
  },
  {
    id: 'planche-glissee-serviette', titre: 'Planche glissée (la scie), vue de profil : avant-bras sur un tapis, pieds sur une serviette, le corps glisse un peu d\'avant en arrière en restant aligné',
    labels: ['Corps aligné, pieds sur la serviette', 'Petit glissement, ventre serré'],
    a: { p: [-6, 34], t: 14, h: 10, armN: { to: [100, 8], bend: 'd' }, armF: { to: [96, 8], bend: 'd' }, legN: { to: [-106, 22], bend: 'd', foot: -60 }, legF: { to: [-102, 22], bend: 'd', foot: -60 }, back: [['mat', -140, 130]], props: [['towel', [[-120, 4], [-88, 4]]]] },
    b: { p: [16, 34], t: 14, h: 10, armN: { to: [100, 8], bend: 'd' }, armF: { to: [96, 8], bend: 'd' }, legN: { to: [-84, 22], bend: 'd', foot: -60 }, legF: { to: [-80, 22], bend: 'd', foot: -60 }, back: [['mat', -140, 130]], props: [['towel', [[-98, 4], [-66, 4]]], ['arrow', [-40, 100], [0, 100]]] },
  },
  {
    id: 'porte-haltere-bras-leve', titre: 'Marche avec un haltère léger bras levé : un haltère tenu au-dessus de la tête, bras tendu, poignet droit, l\'autre bras le long du corps',
    labels: ['Haltère au-dessus de l\'épaule', 'Marche lente, buste droit'],
    a: { p: [0, 110], armN: { a: [89, 91] }, armF: { a: [-85, -80] }, props: (J) => [['db', [J.haN[0], J.haN[1] + 14]]] },
    b: stride({ armN: { a: [89, 91] }, armF: { a: [-70, -40] }, props: [(J) => [['db', [J.haN[0], J.haN[1] + 14]]], ...walkFwd] }),
  },
  {
    id: 'posture-enfant-bras-avances', titre: 'Posture de l\'enfant, bras avancés : à genoux, fesses vers les talons, bras tendus devant sur le sol, front vers le sol',
    labels: ['À genoux, buste droit', 'Fesses sur les talons, bras avancés'],
    a: { p: [-20, 62], t: 90, h: 90, armN: { a: [-95, -93] }, armF: { a: [-85, -87] }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['mat', -140, 130]] },
    b: { p: [-75, 28], t: 10, h: -15, armN: { to: [56, 7], bend: 'u' }, armF: { to: [52, 7], bend: 'u' }, legN: { a: [-20, 180], foot: 180 }, legF: { a: [-20, 180], foot: 180 }, back: [['mat', -140, 130]], props: [['arrow', [-60, 90], [-90, 70]]] },
  },
  {
    id: 'pull-through-elastique', titre: 'Tirage entre les jambes à l\'élastique (charnière de hanche), vue de profil : dos à l\'ancrage, bassin en arrière dos plat, puis on se redresse en poussant le bassin vers l\'avant',
    labels: ['Bassin en arrière, dos plat', 'Debout, bassin poussé vers l\'avant'],
    a: { p: [-30, 94], t: 40, h: 48, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [-6, 78], bend: 'd' }, armF: { to: [-10, 78], bend: 'd' }, back: [['wall', -112, -14], ['anchor', -116, 40]], props: (J) => [['band', [J.haN, [-116, 40]]]] },
    b: { p: [0, 112], t: 90, armN: { to: [22, 100], bend: 'd' }, armF: { to: [18, 100], bend: 'd' }, back: [['wall', -112, -14], ['anchor', -116, 40]], props: (J) => [['band', [J.haN, [-116, 40]]], ['arrow', [60, 90], [90, 90]]] },
  },
  {
    id: 'souleve-de-terre-halteres', titre: 'Soulevé de terre aux haltères : pieds largeur de hanches, bassin en arrière, dos plat, haltères le long des jambes ; on se redresse en poussant le sol',
    labels: ['Bassin en arrière, dos plat, haltères aux tibias', 'Debout, haltères le long des cuisses'],
    a: { p: [-52, 52], t: 40, h: 48, legN: { to: [-10, A], bend: 'f' }, legF: { to: [-16, A], bend: 'f' }, armN: { a: [-90, -90] }, armF: { a: [-88, -88] }, props: (J) => [['db', J.haN], ['db', J.haF]] },
    b: { p: [0, 112], t: 90, armN: { a: [-92, -90] }, armF: { a: [-90, -88] }, props: (J) => [['db', J.haN], ['db', J.haF], ['arrow', [78, 70], [78, 130]]] },
  },
  {
    id: 'tirage-vertical-poulie', titre: 'Tirage vertical à la poulie haute, vue de profil : assis, cuisses calées sous le boudin, bras tendus vers le haut, puis coudes vers le bas, poignée à hauteur de la poitrine',
    labels: ['Cuisses calées, bras tendus en haut', 'Coudes vers le bas, poignée à la poitrine'],
    a: { p: [-48, 58], t: 84, h: 90, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [-2, 238], bend: 'f' }, armF: { to: [-8, 236], bend: 'f' }, back: [['chair', -75, 46, 1], ['rect', 50, 0, 12, 262, 3], ['rect', 26, 246, 42, 10, 3], ['rect', -8, 66, 34, 12, 4]], props: (J) => [['band', [J.haN, [34, 246]]]] },
    b: { p: [-48, 58], t: 76, h: 80, legN: { to: [10, A], bend: 'f' }, legF: { to: [4, A], bend: 'f' }, armN: { to: [8, 132], bend: 'd' }, armF: { to: [4, 130], bend: 'd' }, back: [['chair', -75, 46, 1], ['rect', 50, 0, 12, 262, 3], ['rect', 26, 246, 42, 10, 3], ['rect', -8, 66, 34, 12, 4]], props: (J) => [['band', [J.haN, [34, 246]]], ['arrow', [86, 190], [86, 140]]] },
  },
  {
    id: 'traction-assistee-machine', titre: 'Traction assistée à la machine, vue de profil : genoux sur le support, mains aux poignées en haut, on tire jusqu\'à ce que le menton passe les poignées, le support aide à monter',
    labels: ['Genoux sur le support, bras tendus', 'Menton au niveau des poignées'],
    a: { p: [0, 130], t: 90, h: 90, armN: { to: [22, 256], bend: 'f' }, armF: { to: [18, 256], bend: 'b' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['rect', 36, 0, 10, 262, 2], ['lin', [[16, 258], [40, 258]], 6], ['rect', -64, 66, 80, 8, 3], ['rect', -30, 0, 10, 66, 2]] },
    b: { p: [0, 158], t: 90, h: 90, armN: { to: [22, 256], bend: 'd' }, armF: { to: [18, 256], bend: 'd' }, legN: { a: [-90, 180], foot: 180 }, legF: { a: [-90, 180], foot: 180 }, back: [['rect', 36, 0, 10, 262, 2], ['lin', [[16, 258], [40, 258]], 6], ['rect', -64, 94, 80, 8, 3], ['rect', -30, 0, 10, 94, 2]], props: [['arrow', [80, 120], [80, 170]]] },
  },
];
