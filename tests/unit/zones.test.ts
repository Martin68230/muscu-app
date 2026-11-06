// Niveau 2, étape 2 : calcul des points par zone (src/zones/zones.ts, knowledge/zones-correspondance.json) et statut gris / orange / rouge.
import { describe, expect, it } from 'vitest';
import { capGroupPoints, pointsByZone, thresholdsOf, zoneCoefs, zonesOfInjury, zoneStatus, ZONES, type ZoneFiche } from '../../src/zones/zones';
import { FICHES } from './generator-helpers';

const F = (id: string, schema: string, mp: string[], ms: string[] = [], type = 'force'): ZoneFiche => ({ id, schema, type, musclesPrincipaux: mp, musclesSecondaires: ms });
const byId = (id: string) => FICHES.find((f) => f.id === id)! as unknown as ZoneFiche;

describe('zones : liste et seuils', () => {
  it('33 zones, sous-zones et petites zones du coach', () => {
    expect(ZONES).toHaveLength(33);
    expect(ZONES.filter((z) => z.seuil === 'P').map((z) => z.id)).toContain('avant_bras');
  });
  it('grande zone : gris sous 3 ; rouge à 10 (muscle), 4 (force), 6 (autre objectif)', () => {
    expect(thresholdsOf('biceps', 'muscle')).toEqual({ gris: 3, rouge: 10 });
    expect(thresholdsOf('biceps', 'force')).toEqual({ gris: 3, rouge: 4 });
    expect(thresholdsOf('biceps', 'sante')).toEqual({ gris: 3, rouge: 6 });
    expect(zoneStatus(2.9, 'biceps', 'muscle')).toBe('gris');
    expect(zoneStatus(3, 'biceps', 'muscle')).toBe('orange');
    expect(zoneStatus(9.9, 'biceps', 'muscle')).toBe('orange');
    expect(zoneStatus(10, 'biceps', 'muscle')).toBe('rouge');
    expect(zoneStatus(4, 'biceps', 'force')).toBe('rouge');
    expect(zoneStatus(3.9, 'biceps', 'force')).toBe('orange');
    expect(zoneStatus(6, 'biceps', 'perte_gras')).toBe('rouge');
  });
  it('petites zones (avant-bras, mollets, transverse) : seuils bas', () => {
    expect(thresholdsOf('avant_bras', 'muscle')).toEqual({ gris: 1.5, rouge: 5 });
    expect(zoneStatus(1.4, 'mollets_soleaire', 'muscle')).toBe('gris');
    expect(zoneStatus(2, 'transverse', 'force')).toBe('rouge');
    expect(zoneStatus(2.9, 'transverse', null)).toBe('orange');
  });
  it('les sous-zones gardent les seuils de la zone mère (pas plus exigeants)', () => {
    expect(thresholdsOf('pectoraux_haut', 'muscle')).toEqual(thresholdsOf('pectoraux_milieu_bas', 'muscle'));
    expect(thresholdsOf('triceps_long_chef', 'force')).toEqual(thresholdsOf('biceps', 'force'));
  });
});

describe('zones : points par série de travail', () => {
  it('principal 1, secondaire 0,5, multipliés par les coefficients de la table des muscles', () => {
    const c = zoneCoefs(F('x-generique', 'poussee_h', ['pectoraux'], ['triceps']));
    expect(c.get('pectoraux_milieu_bas')).toBe(1);
    expect(c.get('pectoraux_haut')).toBe(0.5);
    expect(c.get('triceps_lateral_medial')).toBe(0.5);
    expect(c.get('triceps_long_chef')).toBe(0.25);
  });
  it('règles par motif d\'id : développé incliné = pectoraux du haut ; extension au-dessus de la tête = long chef', () => {
    const inc = zoneCoefs(byId('developpe-incline-halteres'));
    expect(inc.get('pectoraux_haut')).toBe(1);
    expect(inc.get('pectoraux_milieu_bas')).toBe(0.5);
    const ext = zoneCoefs(byId('extension-triceps-assis-halteres'));
    expect(ext.get('triceps_long_chef')).toBe(1);
  });
  it('règle par schéma : hanche latérale = abducteurs ET moyen fessier ; relevé assis = soléaire seul', () => {
    const ab = zoneCoefs(byId('abduction-couchee-cote'));
    expect(ab.get('abducteurs')).toBe(1);
    expect(ab.get('fessiers_moyen')).toBe(1);
    const sol = zoneCoefs(byId('releve-mollets-assis'));
    expect(sol.get('mollets_soleaire')).toBe(1);
    expect(sol.has('mollets_gastrocnemien')).toBe(false);
  });
  it('règle sans muscle (cou) et muscle `cou` : jamais compté deux fois', () => {
    expect(zoneCoefs(byId('isometrique-cou')).get('cou')).toBe(1);
    expect(zoneCoefs(F('isometrique-cou', 'mobilite', ['cou'])).get('cou')).toBe(1);
  });
  it('mobilité, récupération et cardio : 0 point', () => {
    expect(zoneCoefs(byId('chat-vache')).size).toBe(0);
    expect(zoneCoefs(F('course', 'cardio', ['quadriceps'], [], 'cardio')).size).toBe(0);
  });
  it('pointsByZone : séries additionnées, échauffement exclu, une ligne d\'un seul côté = une demi-série', () => {
    const f = F('rowing-x', 'tirage_h', ['grand_dorsal'], ['biceps']);
    const p = pointsByZone([{ ficheId: 'rowing-x', sets: 3 }, { ficheId: 'rowing-x', sets: 2, warmup: true }], [f]);
    expect(p.grand_dorsal).toBe(3);
    expect(p.biceps).toBe(1.5);
    expect(p.pectoraux_haut).toBe(0);
    // Exercice par côté : 1 série = gauche + droite (comme plaf.ts) ; l'historique note chaque côté : 2 lignes = 1 série.
    const side = pointsByZone([{ ficheId: 'rowing-x', side: 'gauche' }, { ficheId: 'rowing-x', side: 'droite' }], [f]);
    expect(side.grand_dorsal).toBe(1);
    expect(pointsByZone([{ ficheId: 'inconnue', sets: 4 }], [f]).grand_dorsal).toBe(0);
  });
  it('plafond par muscle mère : maximum des sous-zones, jamais leur somme', () => {
    const g = capGroupPoints({ pectoraux_haut: 4, pectoraux_milieu_bas: 7, biceps: 2 });
    expect(g.get('pectoraux')).toEqual({ points: 7, zone: 'pectoraux_milieu_bas' });
    expect(g.get('biceps')!.points).toBe(2);
  });
  it('liaison blessures -> zones (affichage seulement)', () => {
    expect(zonesOfInjury('poignet')).toEqual(['avant_bras']);
    expect(zonesOfInjury('genou')).toContain('quadriceps_vastes');
    expect(zonesOfInjury('inconnue')).toEqual([]);
  });
});
