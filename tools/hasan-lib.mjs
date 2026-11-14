// Partagé par hasan-candidats.mjs (copie des tables de hasan-rapprochement.mjs).
export const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const STOP = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'a', 'au', 'aux', 'en', 'sur', 'avec', 'the', 'with', 'on', 'of', 'and', 'un', 'une', 'male', 'female', 'version', 'exercice', 'l', 'd', 'sans', 'pour', 'to']);

// expressions anglaises -> mots de nos fiches (ordre : les plus longues d'abord)
export const PHRASES = [
  ['romanian deadlift', 'souleve de terre roumain'], ['stiff leg deadlift', 'souleve de terre jambes tendues'], ['sumo deadlift', 'souleve de terre sumo'], ['deadlift', 'souleve de terre'],
  ['push-up', 'pompe'], ['push up', 'pompe'], ['pushup', 'pompe'], ['sit-up', 'releve de buste'], ['sit up', 'releve de buste'], ['pull-up', 'traction'], ['pull up', 'traction'], ['chin-up', 'traction'], ['chin up', 'traction'],
  ['step-up', 'montee sur'], ['step up', 'montee sur'], ['hip thrust', 'hip thrust'], ['good morning', 'good morning'], ['bench press', 'developpe couche'], ['overhead press', 'developpe epaules'], ['shoulder press', 'developpe epaules'], ['military press', 'developpe epaules'],
  ['lat pulldown', 'tirage vertical'], ['pulldown', 'tirage vertical'], ['bent over row', 'rowing penche'], ['seated row', 'rowing assis'], ['calf raise', 'mollets elevation'], ['russian twist', 'rotation russe'], ['mountain climber', 'grimpeur'],
  ['glute bridge', 'pont fessier'], ['hip bridge', 'pont fessier'], ['bird dog', 'bird dog'], ['dead bug', 'dead bug'], ['wall sit', 'chaise murale'], ['leg raise', 'releve de jambes'], ['side plank', 'planche laterale'], ['plank', 'planche'],
  ['bulgarian split squat', 'squat bulgare'], ['split squat', 'squat fendu'], ['lunge', 'fente'], ['squat', 'squat'], ['lateral raise', 'elevation laterale'], ['front raise', 'elevation frontale'], ['shrug', 'haussement epaules'],
  ['jumping jack', 'jumping jack'], ['pallof press', 'pallof'], ['face pull', 'face pull'], ['kickback', 'kickback'], ['crunch', 'crunch'], ['twist', 'rotation'], ['curl', 'curl'], ['dip', 'dips'], ['fly', 'ecarte'], ['flye', 'ecarte'], ['row', 'rowing'], ['press', 'developpe'],
  ['stability ball', 'swiss ball'], ['medicine ball', 'medecine ball'], ['bosu ball', 'bosu'], ['ez barbell', 'barre ez'], ['ez-bar', 'barre ez'], ['dumbbell', 'halteres'], ['barbell', 'barre'], ['kettlebell', 'kettlebell'], ['cable', 'poulie'], ['resistance band', 'elastique'], ['band', 'elastique'],
  ['one arm', 'un bras unilateral'], ['single arm', 'un bras unilateral'], ['single leg', 'unijambiste'], ['one leg', 'unijambiste'], ['bulgarian', 'bulgare'], ['front', 'avant'], ['incline', 'incline'], ['decline', 'decline'],
  ['close grip', 'prise serree'], ['wide grip', 'prise large'], ['reverse', 'inverse'], ['seated', 'assis'], ['standing', 'debout'], ['lying', 'allonge'], ['kneeling', 'genoux'], ['hanging', 'suspendu'], ['raise', 'elevation'], ['extension', 'extension'],
];
export const stem = (t) => (t.length > 3 ? t.replace(/(s|x)$/, '') : t);
export const tokens = (s) => [...new Set(strip(s).replace(/[^a-z0-9]+/g, ' ').split(' ').filter((t) => t && !STOP.has(t)).map(stem))];
export const translate = (name) => { let s = ` ${strip(name).replace(/[()]/g, ' ')} `; for (const [en, fr] of PHRASES) s = s.split(` ${en} `).join(` ${fr} `).split(` ${en}s `).join(` ${fr} `); return s; };

// muscle ciblé par Hasan -> muscles principaux possibles chez nous
export const MUSCLES = {
  abs: ['abdominaux', 'transverse', 'obliques'], pectorals: ['pectoraux'], biceps: ['biceps'], glutes: ['fessiers', 'moyen_fessier'], delts: ['deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs'],
  triceps: ['triceps'], 'upper back': ['rhomboides', 'trapezes', 'grand_dorsal', 'deltoides_posterieurs'], lats: ['grand_dorsal'], calves: ['mollets', 'tibial_anterieur', 'peroniers'], quads: ['quadriceps'],
  forearms: ['avant_bras'], hamstrings: ['ischios'], spine: ['erecteurs_rachis', 'carre_des_lombes'], traps: ['trapezes'], adductors: ['adducteurs'], 'serratus anterior': ['dentele_anterieur'],
  abductors: ['moyen_fessier', 'fessiers'], 'levator scapulae': ['trapezes'], 'cardiovascular system': [],
};
export const BASE = new Set(['poids_du_corps', 'tapis', 'chaise', 'mur', 'marche_escalier', 'serviette', 'porte', 'box_ou_step', 'banc', 'banc_inclinable']);
export const EQUIP = {
  'body weight': [], dumbbell: ['halteres'], cable: ['poulie', 'machine'], barbell: ['barre', 'disques', 'rack'], 'olympic barbell': ['barre', 'disques', 'rack'], 'ez barbell': ['barre_ez', 'disques'],
  'leverage machine': ['machine'], 'smith machine': ['machine', 'barre', 'disques'], 'sled machine': ['machine'], band: ['elastique', 'mini_bande', 'partenaire_ou_ancrage'], 'resistance band': ['elastique', 'mini_bande', 'partenaire_ou_ancrage'],
  kettlebell: ['kettlebell'], weighted: ['lest', 'sac_a_dos', 'bidons_ou_sacs', 'sac_de_sable', 'halteres'], 'stability ball': ['swiss_ball'], 'medicine ball': ['medecine_ball'], rope: ['corde_a_sauter', 'poulie'], roller: ['rouleau_massage'],
  'wheel roller': ['roue_abdos'], 'bosu ball': ['bosu'], assisted: ['machine', 'elastique'], 'stationary bike': ['machine_cardio'], 'elliptical machine': ['machine_cardio'], 'stepmill machine': ['machine_cardio'],
  'upper body ergometer': ['machine_cardio'], 'skierg machine': ['machine_cardio'], 'trap bar': ['materiel_specialise'], hammer: ['materiel_specialise'], tire: ['materiel_specialise'],
};
// indice de schéma d'après le nom traduit
export const SCHEMA_HINTS = [['souleve de terre', 'charniere'], ['hip thrust', 'charniere'], ['good morning', 'charniere'], ['pont fessier', 'charniere'], ['pompe', 'poussee_h'], ['developpe couche', 'poussee_h'], ['developpe epaules', 'poussee_v'], ['traction', 'tirage_v'], ['tirage vertical', 'tirage_v'],
  ['rowing', 'tirage_h'], ['fente', 'squat'], ['squat', 'squat'], ['montee sur', 'squat'], ['planche', 'gainage'], ['rotation', 'rotation'], ['pallof', 'anti_rotation'], ['mollets', 'cheville_mollet']];

