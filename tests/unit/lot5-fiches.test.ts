// Lot 5 (13/11/2026) : 7 fiches utilisables (validées par le kiné, contrôle relecteur, dosages NON SOURCÉS), illustrations originales, listes.
// Placement : cou à la main seulement ; tirage de sac à la main seulement ; ours et crabe jamais dans l'emplacement tronc ; saut latéral seulement dans « Créer une séance ».
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { CREER_SEANCE, CORE_NOT_CORE_IDS, MANUAL_ONLY_FICHES } from '../../src/generator/config';
import { NECK_DEDICATED_IDS } from '../../src/data/injury-rules';
import { FICHES, mk } from './generator-helpers';

const LOT5 = ['cou-lateral-arriere-main', 'rotation-isometrique-cou', 'marche-de-l-ours', 'marche-du-crabe', 'releve-bassin-marche', 'tirage-sac-sur-sol', 'saut-lateral-pieds-joints'];

describe('Lot 5 : 7 fiches', () => {
  it('présentes, utilisables, avec une illustration originale', () => {
    for (const id of LOT5) {
      const f = FICHES.find((x) => x.id === id);
      expect(f, id).toBeTruthy();
      expect(f!.statut, id).toBe('utilisable');
      expect(existsSync(`public/illustrations/${id}.svg`), `illustration ${id}`).toBe(true);
    }
  });
  it('cou : fiches dédiées (placement manuel), jamais proposées par le générateur', () => {
    expect(NECK_DEDICATED_IDS).toContain('cou-lateral-arriere-main');
    expect(NECK_DEDICATED_IDS).toContain('rotation-isometrique-cou');
  });
  it('listes : tirage de sac à la main seulement ; ours et crabe hors tronc ; saut latéral dans « Créer une séance »', () => {
    expect(MANUAL_ONLY_FICHES).toContain('tirage-sac-sur-sol');
    expect(CORE_NOT_CORE_IDS).toEqual(expect.arrayContaining(['marche-de-l-ours', 'marche-du-crabe']));
    expect(CREER_SEANCE.plio.some((p) => p.ficheId === 'saut-lateral-pieds-joints')).toBe(true);
  });
  it('balayage : le tirage de sac, le cou manuel, le saut latéral et le crabe ne sont jamais placés automatiquement ; l\'ours jamais en tronc', () => {
    for (const profile of ['B', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) for (const days of [3, 5]) {
      const r = generateProgram(mk({ profile, level, days, goal: 'muscle', dur: 60, place: profile === 'F' ? 'salle' : 'maison' }));
      expect(r.ok, `${profile} ${level} ${days}`).toBe(true);
      if (!r.ok) continue;
      for (const e of r.program.sessions.flatMap((s) => s.exercises)) {
        expect(['tirage-sac-sur-sol', 'cou-lateral-arriere-main', 'rotation-isometrique-cou', 'saut-lateral-pieds-joints', 'marche-du-crabe'], `${profile} ${level} ${days}`).not.toContain(e.ficheId);
        if (e.ficheId === 'marche-de-l-ours') expect(e.slot).not.toBe('tronc');
      }
    }
  }, 280_000);
});
