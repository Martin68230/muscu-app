// Poses des illustrations originales : une entrée par fiche (voir tools/make-illustrations.mjs pour le format).
// Repère : x à droite, y vers le haut, sol à y = 0, personnage de profil tourné vers +x (sauf view 'front' / 'top').
const A = 8; // cheville à plat
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
    id: 'squat-barre-repere-banc', titre: 'Squat avec repère : on descend jusqu\'à effleurer un banc placé derrière soi, barres de sécurité (jaune) sous le banc',
    labels: ['Barre sur le dos, banc derrière', 'Effleure le banc, sans te relâcher'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: [['rect', -112, 36, 80, 10, 3], ['rect', -106, 0, 8, 36, 2], ['rect', -50, 0, 8, 36, 2], ...rackBack(-132, 168, 30, 36)], props: (J) => barPlate(J) },
    b: { p: [-42, 62], t: 66, h: 72, armN: { to: [-15, 121], bend: 'b' }, armF: { to: [-17, 120], bend: 'b' }, legN: { to: [6, A], bend: 'f' }, legF: { to: [0, A], bend: 'f' }, back: [['rect', -112, 36, 80, 10, 3], ['rect', -106, 0, 8, 36, 2], ['rect', -50, 0, 8, 36, 2], ...rackBack(-132, 168, 30, 36)], props: (J) => [...barPlate(J), ['arrow', [78, 90], [78, 150]]] },
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
    id: 'fente-barre', titre: 'Squat fendu à la barre : un pied devant, un pied derrière, les pieds ne bougent pas ; rack à barres de sécurité (jaune)',
    labels: ['Un pied devant, un derrière', 'Descente droite, genou arrière bas'],
    a: { p: [0, 104], t: 90, armN: { to: [-3, 171], bend: 'b' }, armF: { to: [-5, 170], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'f', foot: -40 }, back: rackBack(-110, 160, 92), props: (J) => barPlate(J) },
    b: { p: [0, 64], t: 90, armN: { to: [-3, 131], bend: 'b' }, armF: { to: [-5, 130], bend: 'b' }, legN: { to: [45, A], bend: 'f' }, legF: { to: [-45, 19], bend: 'd', foot: -40 }, back: rackBack(-110, 160, 92), props: (J) => [...barPlate(J), ['arrow', [86, 150], [86, 100]]] },
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
    id: 'rowing-barre-ez', titre: 'Rowing à la barre EZ, poitrine appuyée sur un banc incliné : la barre part du sol, les coudes reculent',
    labels: ['Bras tendus, barre au sol', 'Barre tirée vers la poitrine'],
    a: { p: [-14, 42], t: 55, h: 40, legN: { to: [-66, A], bend: 'f', foot: -40 }, legF: { to: [-72, A], bend: 'f', foot: -40 }, armN: { a: [-90, -88] }, armF: { a: [-88, -86] }, back: (J) => benchAlong(J), props: (J) => barPlate(J) },
    b: { p: [-14, 42], t: 55, h: 40, legN: { to: [-66, A], bend: 'f', foot: -40 }, legF: { to: [-72, A], bend: 'f', foot: -40 }, armN: { to: [22, 68], bend: 'b' }, armF: { to: [20, 66], bend: 'b' }, back: (J) => benchAlong(J), props: (J) => [...barPlate(J), ['arrow', [72, 40], [72, 80]]] },
  },
  {
    id: 'extension-triceps-barre-ez-allonge', titre: 'Extension des triceps à la barre EZ, allongé au sol : les coudes restent fixes, la barre descend vers le front',
    labels: ['Bras tendus au-dessus de la poitrine', 'Coudes fixes, barre vers le front'],
    a: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 90] }, armF: { a: [88, 88] }, props: (J) => barPlate(J) }),
    b: supine({ p: [-5, 11], legN: { to: [58, A], bend: 'u' }, legF: { to: [52, A], bend: 'u' }, armN: { a: [90, 200] }, armF: { a: [88, 198] }, props: (J) => [...barPlate(J), ['arrow', [-40, 100], [-86, 70]]] }),
  },
  {
    id: 'releve-mollets-debout-barre', titre: 'Relevé de mollets debout avec une barre sur le haut du dos : pieds à plat au sol, on monte sur la pointe des pieds ; rack à barres de sécurité (jaune)',
    labels: ['Pieds à plat, barre sur le dos', 'Monte sur la pointe des pieds'],
    a: { p: [0, 112], t: 90, armN: { to: [-3, 179], bend: 'b' }, armF: { to: [-5, 178], bend: 'b' }, back: rackBack(-100, 168, 106), props: (J) => barPlate(J) },
    b: { p: [0, 126], t: 90, armN: { to: [-3, 193], bend: 'b' }, armF: { to: [-5, 192], bend: 'b' }, legN: { to: [8, 22], bend: 'f', foot: -60 }, legF: { to: [2, 22], bend: 'f', foot: -60 }, back: rackBack(-100, 168, 106), props: (J) => [...barPlate(J), ['arrow', [78, 40], [78, 80]]] },
  },
];
