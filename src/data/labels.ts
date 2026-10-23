// Libellés français simples pour tout ce qui vient des fiches (identifiants de knowledge/format-fiches.md).
// Règle : aucun identifiant brut (snake_case, kebab-case) n'est jamais affiché.

import type { InjuryZone } from './model';

export const MUSCLE_LABEL: Record<string, string> = {
  pectoraux: 'pectoraux',
  grand_dorsal: 'grand dorsal (le large muscle du dos)',
  trapezes: 'trapèzes (haut du dos et nuque)',
  rhomboides: 'muscles entre les omoplates',
  dentele_anterieur: 'dentelé (sous l’aisselle, stabilise l’omoplate)',
  deltoides_anterieurs: 'avant des épaules',
  deltoides_lateraux: 'côté des épaules',
  deltoides_posterieurs: 'arrière des épaules',
  biceps: 'biceps',
  triceps: 'triceps',
  avant_bras: 'avant-bras',
  abdominaux: 'abdominaux',
  obliques: 'obliques (côtés du ventre)',
  transverse: 'transverse (ceinture profonde du ventre)',
  erecteurs_rachis: 'muscles du bas du dos',
  carre_des_lombes: 'carré des lombes (côté du bas du dos)',
  fessiers: 'fessiers',
  moyen_fessier: 'moyen fessier (côté de la hanche)',
  quadriceps: 'cuisses (devant)',
  ischios: 'cuisses (derrière)',
  adducteurs: 'intérieur des cuisses',
  mollets: 'mollets',
  flechisseurs_hanche: 'muscles qui lèvent la cuisse',
  coiffe_des_rotateurs: 'petits muscles stabilisateurs de l’épaule',
  peroniers: 'côté de la jambe et de la cheville',
  tibial_anterieur: 'devant du tibia',
};

/** Version courte, pour la liste de la bibliothèque. */
export const MUSCLE_SHORT: Record<string, string> = {
  ...MUSCLE_LABEL,
  grand_dorsal: 'grand dorsal',
  trapezes: 'trapèzes',
  dentele_anterieur: 'dentelé',
  obliques: 'obliques',
  transverse: 'transverse',
  carre_des_lombes: 'carré des lombes',
  moyen_fessier: 'moyen fessier',
  coiffe_des_rotateurs: 'stabilisateurs d’épaule',
  peroniers: 'chevilles',
  tibial_anterieur: 'tibia',
};

export const SCHEMA_LABEL: Record<string, string> = {
  squat: 'Flexion de jambes',
  charniere: 'Pencher le buste, dos droit',
  fente: 'Fente',
  poussee_h: 'Pousser devant soi',
  poussee_v: 'Pousser au-dessus de la tête',
  tirage_h: 'Tirer vers soi',
  tirage_v: 'Tirer vers le bas ou se hisser',
  gainage: 'Gainage',
  anti_rotation: 'Résister à la rotation',
  rotation: 'Rotation du buste',
  porte: 'Porter une charge',
  saut: 'Sauts',
  mobilite: 'Souplesse et mobilité',
  cardio: 'Cardio',
  cheville_mollet: 'Chevilles et mollets',
  hanche_laterale: 'Côté de la hanche',
};

/** Grands groupes pour les filtres rapides de la bibliothèque. */
export const SCHEMA_GROUPS: { id: string; label: string; schemas: string[] }[] = [
  { id: 'pousser', label: 'Pousser', schemas: ['poussee_h', 'poussee_v'] },
  { id: 'tirer', label: 'Tirer', schemas: ['tirage_h', 'tirage_v'] },
  { id: 'jambes', label: 'Jambes', schemas: ['squat', 'fente', 'charniere', 'hanche_laterale', 'cheville_mollet'] },
  { id: 'tronc', label: 'Ventre et dos', schemas: ['gainage', 'anti_rotation', 'rotation'] },
  { id: 'souplesse', label: 'Souplesse', schemas: ['mobilite'] },
  { id: 'cardio', label: 'Cardio', schemas: ['cardio', 'saut'] },
  { id: 'porter', label: 'Porter', schemas: ['porte'] },
];

export const LEVEL_LABEL: Record<string, string> = {
  debutant: 'débutant',
  intermediaire: 'intermédiaire',
  avance: 'avancé',
};

/** Matériel, avec article : « il te manque : des haltères ». */
export const TAG_LABEL: Record<string, string> = {
  poids_du_corps: 'ton poids du corps',
  tapis: 'un tapis ou le sol',
  chaise: 'une chaise stable',
  mur: 'un mur dégagé',
  marche_escalier: 'une marche d’escalier',
  serviette: 'une serviette',
  porte: 'une porte avec un ancrage adapté',
  halteres: 'des haltères',
  kettlebell: 'un kettlebell',
  elastique: 'un élastique',
  mini_bande: 'un élastique en boucle',
  barre_traction: 'une barre de traction',
  banc: 'un banc plat',
  banc_inclinable: 'un banc inclinable',
  roue_abdos: 'une roue abdos',
  swiss_ball: 'un swiss ball',
  medecine_ball: 'un médecine ball',
  rouleau_massage: 'un rouleau de massage',
  corde_a_sauter: 'une corde à sauter',
  sangles_suspension: 'des sangles de suspension',
  lest: 'un gilet lesté',
  sac_de_sable: 'un sac de sable',
  bosu: 'un bosu',
  barre: 'une barre droite',
  barre_ez: 'une barre EZ',
  rack: 'un rack',
  disques: 'des disques',
  sac_a_dos: 'un sac à dos chargé',
  bidons_ou_sacs: 'des bidons ou des sacs de courses',
  partenaire_ou_ancrage: 'un partenaire ou un point d’ancrage sûr',
  box_ou_step: 'un step ou une box',
  poulie: 'une poulie',
  machine: 'une machine guidée',
  machine_cardio: 'un vélo ou un rameur',
  materiel_specialise: 'du matériel spécialisé',
};

export const ZONE_LABEL: Record<InjuryZone, string> = {
  cou: 'cou',
  epaule: 'épaule',
  coude: 'coude',
  poignet: 'poignet',
  dos: 'dos',
  hanche: 'hanche',
  genou: 'genou',
  cheville: 'cheville',
  cuisse: 'cuisse (derrière)',
  aine: 'aine',
};

/** « ta gêne au genou ». */
export const ZONE_GENE: Record<InjuryZone, string> = {
  cou: 'au cou',
  epaule: 'à l’épaule',
  coude: 'au coude',
  poignet: 'au poignet',
  dos: 'au dos',
  hanche: 'à la hanche',
  genou: 'au genou',
  cheville: 'à la cheville',
  cuisse: 'à l’arrière de la cuisse',
  aine: 'à l’aine',
};

export const AMPLITUDE_LABEL: Record<string, string> = {
  reduite: 'mouvement moins ample',
  'mi-course': 'mouvement à moitié seulement',
  'sans-gene': 'seulement dans la zone sans gêne',
  'maintien-court': 'maintiens courts, sans aller jusqu’à l’épuisement',
  'sans-rotation': 'sans tourner le buste',
  'bras-bas': 'bras moins hauts',
  'bras-au-sol': 'bras posés au sol',
  'jambes-seules': 'jambes seulement',
  'tete-alignee': 'tête dans le prolongement du dos',
  lente: 'mouvement lent et contrôlé',
};

export const APPUI_LABEL: Record<string, string> = {
  coussin: 'avec un coussin',
  serviette: 'avec une serviette',
  'poings-fermes': 'poings fermés',
  'avant-bras': 'sur les avant-bras',
  'paumes-face-a-face': 'paumes face à face',
  'mains-vers-exterieur': 'mains tournées vers l’extérieur',
  'main-sur-rampe': 'une main sur la rampe',
  'main-sur-support': 'une main sur un support stable',
  mur: 'appuyé au mur',
  'assise-rehaussee': 'assise rehaussée',
  'pieds-ecartes': 'pieds écartés',
  'buste-redresse': 'buste redressé',
  'charges-surelevees': 'charges posées sur un support plutôt qu’au sol',
  'premiere-marche': 'première marche seulement',
  'coudes-pres-du-corps': 'coudes près du corps',
  'front-pose': 'front posé',
};

export const PREGNANCY_LABEL = 'Pendant la grossesse';
