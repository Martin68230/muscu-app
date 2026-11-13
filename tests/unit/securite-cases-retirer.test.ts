// Régression sécurité : une case « retirer » d'une fiche ne laisse JAMAIS placer l'exercice (sauf la variante désignée par
// `sans-zone:`), et une case `adapter: variante:` n'est jamais servie par une variante plus dure que la variante désignée.
// Balayage fiches x zones x niveaux 1 à 3 x profils de matériel x lieu x niveau x objectif.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import type { GenProgram } from '../../src/generator/types';
import { FICHES, LEVELS, mk, PROFILE_KEYS, ZONES } from './generator-helpers';

const fiche = (id: string) => FICHES.find((f) => f.id === id);

interface Placed { ficheId: string; variantId: string }
function placed(p: GenProgram): Placed[] {
  const out: Placed[] = [];
  const add = (x: { ficheId: string; variantId: string } | null | undefined) => x && out.push({ ficheId: x.ficheId, variantId: x.variantId });
  for (const s of p.sessions) {
    for (const e of s.exercises) { add(e); add(e.alt); }
    add(s.warmup.general);
    s.warmup.mobility.forEach(add);
    add(s.warmup.cooldown);
  }
  for (const d of p.lightDays) { add(d.general); d.mobility.forEach(add); }
  return out;
}

function violations(p: GenProgram, zone: string, level: 1 | 2 | 3): string[] {
  const bad: string[] = [];
  for (const { ficheId, variantId } of placed(p)) {
    const f = fiche(ficheId);
    const c = f?.securite.zones[zone]?.[level - 1];
    if (!f || !c || c.action === 'garder') continue;
    if (c.action === 'retirer') {
      if (!c.sansZone || c.sansZone !== variantId) bad.push(`${ficheId}/${variantId} ${zone}-n${level} retirer${c.sansZone ? ' sans-zone:' + c.sansZone : ''}`);
    } else if (c.variante) {
      const target = f.variantes.find((v) => v.id === c.variante);
      const got = f.variantes.find((v) => v.id === variantId);
      if (target && got && got.echelon > target.echelon) bad.push(`${ficheId}/${variantId} ${zone}-n${level} adapter variante:${c.variante}`);
    }
  }
  return bad;
}

describe('cases « retirer » respectées sur toutes les zones et niveaux', () => {
  it('aucun placement interdit', () => {
    const all = new Set<string>();
    for (const profile of PROFILE_KEYS.filter((k) => ['A0', 'C', 'E', 'F'].includes(k))) for (const place of ['maison', 'salle'] as const) for (const level of LEVELS) for (const goal of ['muscle']) {
      for (const zone of ZONES) for (const lv of [1, 2, 3] as const) {
        const r = generateProgram(mk({ profile, place, level, goal, days: 4, injuries: [[zone, lv]] }));
        if (!r.ok) continue;
        violations(r.program, zone, lv).forEach((v) => all.add(v));
      }
    }
    expect([...all].sort()).toEqual([]);
  }, 280000);
});
