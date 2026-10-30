import type { EquipmentProfile } from './model';

// Options de matériel du profil (décision D7). Vocabulaire : knowledge/materiel-tags.json
// et knowledge/equipment-taxonomy.md §2 (correspondance profil -> tag).

export interface EquipmentOption {
  /** Tag de fiche. */
  tag: string;
  label: string;
  /** Tag implicite : coché par défaut, stocké dans disabledImplicit quand décoché. */
  implicit?: boolean;
  /** Champ de poids associé. */
  weights?: 'dumbbell' | 'kettlebell' | 'plates';
}

export interface EquipmentGroup {
  id: 'implicite' | 'maison' | 'salle' | 'quotidien';
  title: string;
  hint?: string;
  options: EquipmentOption[];
}

export const EQUIPMENT_GROUPS: EquipmentGroup[] = [
  {
    id: 'implicite',
    title: 'Chez toi, par défaut',
    hint: 'Décoche ce que tu n\'as pas.',
    options: [
      { tag: 'tapis', label: 'Tapis ou sol', implicit: true },
      { tag: 'chaise', label: 'Chaise stable', implicit: true },
      { tag: 'marche_escalier', label: 'Marche d\'escalier', implicit: true },
    ],
  },
  {
    id: 'maison',
    title: 'Maison',
    options: [
      { tag: 'halteres', label: 'Haltères', weights: 'dumbbell' },
      { tag: 'kettlebell', label: 'Kettlebells', weights: 'kettlebell' },
      { tag: 'elastique', label: 'Élastique (bande longue ou à poignées)' },
      { tag: 'mini_bande', label: 'Élastique en boucle (mini-bande)' },
      { tag: 'barre_traction', label: 'Barre de traction' },
      { tag: 'banc', label: 'Banc plat' },
      { tag: 'banc_inclinable', label: 'Banc inclinable' },
      { tag: 'barre', label: 'Barre droite' },
      { tag: 'disques', label: 'Disques', weights: 'plates' },
      { tag: 'barre_ez', label: 'Barre EZ' },
      { tag: 'rack', label: 'Rack ou cage à squat' },
      { tag: 'sangles_suspension', label: 'Sangles de suspension (TRX, anneaux)' },
      { tag: 'roue_abdos', label: 'Roue abdos' },
      { tag: 'swiss_ball', label: 'Swiss ball' },
      { tag: 'medecine_ball', label: 'Médecine ball' },
      { tag: 'box_ou_step', label: 'Step ou box' },
      { tag: 'corde_a_sauter', label: 'Corde à sauter' },
      { tag: 'lest', label: 'Gilet lesté' },
      { tag: 'sac_de_sable', label: 'Sac de sable' },
      { tag: 'bosu', label: 'Bosu' },
      { tag: 'rouleau_massage', label: 'Rouleau de massage' },
    ],
  },
  {
    id: 'salle',
    title: 'Salle de sport',
    hint: 'Utilisé seulement si ton lieu est la salle ou si tu as coché « J’ai accès à une salle » (Profil > Mes séances).',
    options: [
      // Étiquettes de machines-etiquettes.md §1 (D30).
      { tag: 'machine', label: 'Machine guidée' },
      { tag: 'poulie', label: 'Poulie' },
      { tag: 'machine_cardio', label: 'Machine de cardio (vélo, rameur, tapis, elliptique)' },
    ],
  },
  {
    id: 'quotidien',
    title: 'Objets du quotidien',
    hint: 'Seulement si tu veux les utiliser comme charge.',
    options: [
      { tag: 'sac_a_dos', label: 'Sac à dos chargé' },
      { tag: 'bidons_ou_sacs', label: 'Bidons ou sacs de courses' },
      { tag: 'partenaire_ou_ancrage', label: 'Partenaire ou point d\'ancrage sûr' },
    ],
  },
];

export const ALL_OPTION_TAGS: string[] = EQUIPMENT_GROUPS.flatMap((g) => g.options.map((o) => o.tag));

/** Remplit les champs absents des anciennes sauvegardes. */
export type NormalizedEquipment = EquipmentProfile & { dumbbellKind: 'fixes' | 'reglables' | null; platesKg: number[]; other: string };

export function normalizeEquipment(e: EquipmentProfile): NormalizedEquipment {
  return { ...e, dumbbellKind: e.dumbbellKind ?? null, platesKg: e.platesKg ?? [], other: e.other ?? '' };
}

/** Matériel réellement possédé (implicites non décochés inclus), pour le moteur de règles. */
export function ownedTags(e: EquipmentProfile): Set<string> {
  const implicit = ['poids_du_corps', 'tapis', 'chaise', 'mur', 'marche_escalier', 'serviette', 'porte']
    .filter((t) => !e.disabledImplicit.includes(t));
  return new Set([...implicit, ...e.tags]);
}

export function toggleTag(e: EquipmentProfile, tag: string, on: boolean): Partial<EquipmentProfile> {
  const opt = EQUIPMENT_GROUPS.flatMap((g) => g.options).find((o) => o.tag === tag);
  const patch: Partial<EquipmentProfile> = { preset: 'perso' };
  if (opt?.implicit) {
    const rest = e.disabledImplicit.filter((t) => t !== tag);
    patch.disabledImplicit = on ? rest : [...rest, tag];
  } else {
    const rest = e.tags.filter((t) => t !== tag);
    patch.tags = on ? [...rest, tag] : rest;
  }
  return patch;
}

/** « 2, 4,5 ; 10 » -> [2, 4.5, 10] (virgule décimale française acceptée). Ignore le non-numérique. */
export function parseWeights(text: string): number[] {
  const out = text
    .split(/[;\s]+/)
    .map((s) => Number(s.trim().replace(',', '.')))
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 500);
  return [...new Set(out)].sort((a, b) => a - b);
}

export function formatWeights(w: number[]): string {
  return w.map((n) => String(n).replace('.', ',')).join('; ');
}

/** Poids rapides proposés en boutons (le clavier de l'iPhone n'a pas de point-virgule). */
export const QUICK_WEIGHTS_KG = [1, 2, 2.5, 4, 5, 6, 8, 10, 12, 15, 20] as const;

export function formatKg(n: number): string {
  return String(n).replace('.', ',');
}

/** Ajoute un poids saisi (virgule ou point acceptés) ; texte invalide : liste inchangée. */
export function addWeight(list: number[], text: string): number[] {
  return parseWeights([...list.map(String), text.trim().replace(/[;\s]+/g, '')].join(' '));
}

export function removeWeight(list: number[], kg: number): number[] {
  return list.filter((n) => n !== kg);
}
