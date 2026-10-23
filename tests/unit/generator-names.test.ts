// Cohérence nom / variante / matériel (format-fiches.md §1), V-MSG-EPAULES (T48) et V-MSG-GROS-AVIS.
import { describe, expect, it } from 'vitest';
import { buildCtx } from '../../src/generator/context';
import { msg } from '../../src/generator/messages';
import { generateProgram } from '../../src/generator/index';
import type { GenerateResult } from '../../src/generator/types';
import { allEx, FICHES, LEVELS, mk, msgIds, PROFILE_KEYS } from './generator-helpers';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
/** Mot cité dans un nom -> tags de matériel qui le justifient. */
const WORDS: [string, RegExp, string[]][] = [
  ['élastique', /\belastiques?\b/, ['elastique', 'mini_bande']],
  ['haltère', /\bhalteres?\b/, ['halteres']],
  ['barre', /\bbarres?\b/, ['barre', 'barre_ez', 'barre_traction', 'rack', 'disques']],
  ['poulie', /\bpoulies?\b/, ['poulie']],
  ['kettlebell', /\bkettlebells?\b/, ['kettlebell']],
  ['banc', /\bbancs?\b/, ['banc', 'banc_inclinable']],
  ['serviette', /\bserviettes?\b/, ['serviette']],
  ['sac à dos', /\bsacs? a dos\b/, ['sac_a_dos']],
  ['chaise', /\bchaises?\b/, ['chaise']],
  ['machine', /\bmachines?\b/, ['machine', 'machine_cardio']],
];
/** « sans élastique » ne cite pas un matériel nécessaire. */
const cited = (nom: string) => {
  const n = norm(nom).replace(/\bsans (sacs? a dos|\w+)/g, '');
  return WORDS.filter(([, re]) => re.test(n));
};

describe('Nom et variante cohérents avec le matériel', () => {
  it('programmes générés : le nom ne cite aucun matériel absent de la variante, tags dans le profil', () => {
    const bad: string[] = [];
    let n = 0;
    for (const profile of PROFILE_KEYS) for (const place of ['maison', 'salle'] as const) for (const days of [2, 3]) for (const level of LEVELS) {
      const input = mk({ profile, place, days, level });
      const r = generateProgram(input);
      if (!r.ok) continue;
      const avail = buildCtx(input).available;
      for (const e of allEx(r.program)) {
        const f = FICHES.find((x) => x.id === e.ficheId)!;
        const v = f.variantes.find((x) => x.id === e.variantId);
        const where = `${profile}/${place}/${days}j/${level} ${e.nom} [${e.variantNom}]`;
        n++;
        if (!v) { bad.push(`${where} : variante introuvable`); continue; }
        for (const t of v.tags) if (!avail.has(t)) bad.push(`${where} : tag ${t} hors profil`);
        for (const [mot, , tags] of cited(e.nom)) if (!v.tags.some((t) => tags.includes(t))) bad.push(`${where} : cite « ${mot} » sans le matériel`);
      }
    }
    expect(n).toBeGreaterThan(500);
    expect(bad.slice(0, 20)).toEqual([]);
  });

  it('fiches : un nom qui cite un matériel -> toutes les variantes l\'utilisent', () => {
    const bad: string[] = [];
    for (const f of FICHES) for (const [mot, , tags] of cited(f.nom)) {
      const sans = f.variantes.filter((v) => !v.tags.some((t) => tags.includes(t))).map((v) => v.id);
      if (sans.length) bad.push(`${f.id} (« ${f.nom} » cite ${mot}) : ${sans.join(', ')}`);
    }
    expect(bad).toEqual([]);
  });

  it('le champ alias est copié dans fiches.json (tableau de textes)', () => {
    for (const f of FICHES as unknown as { id: string; alias: unknown }[]) {
      expect(Array.isArray(f.alias), f.id).toBe(true);
      for (const a of f.alias as unknown[]) expect(typeof a).toBe('string');
    }
    expect((FICHES as unknown as { alias: string[] }[]).some((f) => f.alias.length > 0)).toBe(true);
  });
});

const prog = (r: GenerateResult) => {
  if (!r.ok) throw new Error(r.code);
  return r.program;
};

describe('V-MSG-EPAULES (T48)', () => {
  const base = { profile: 'A0', level: 'debutant' as const, days: 3, goal: 'sante' };
  const count = (o: Parameters<typeof mk>[0]) => msgIds(prog(generateProgram(mk(o)))).filter((i) => i === 'V-MSG-EPAULES').length;
  it('débutant, maison sans matériel : une seule fois, message de fusion ou suggestion', () => {
    const p = prog(generateProgram(mk(base)));
    expect(msgIds(p).filter((i) => i === 'V-MSG-EPAULES')).toHaveLength(1);
    const m = p.messages.find((x) => x.id === 'V-MSG-EPAULES')!;
    expect(m.text).toContain('peu travaillées');
    // Un message d'achat est déjà affiché : fusion, sans la dernière phrase (§8.2).
    const hasAchat = msgIds(p).some((i) => i === 'V-MSG-ACHAT' || i === 'V-MSG-OBJET');
    expect(m.text.includes('ajouteraient')).toBe(!hasAchat);
    expect(msgIds(p)).not.toContain('V-MSG-VOL');
  });
  it("texte seul (sans message d'achat) : cite élastique et haltères", () => {
    const t = msg.epaules(['elastique', 'halteres'], false).text;
    expect(t).toBe('Avec ton matériel, pas de poussée vers le haut : tes épaules sont peu travaillées. Un élastique avec un ancrage de porte ou des haltères en ajouteraient.');
    expect(msg.epaules([], false).text.endsWith('peu travaillées.')).toBe(true);
  });
  it('avec un élastique ou des haltères : absent', () => {
    expect(count({ ...base, profile: 'B' })).toBe(0);
    expect(count({ ...base, profile: 'C' })).toBe(0);
  });
  it('un sac à dos seul ne le supprime pas pour un débutant (et ne figure pas dans la suggestion)', () => {
    const p = prog(generateProgram(mk({ ...base, profile: 'A' })));
    const m = p.messages.filter((x) => x.id === 'V-MSG-EPAULES');
    expect(m).toHaveLength(1);
    expect(m[0].text).not.toContain('sac à dos');
  });
  it('intermédiaire sans matériel : absent (pompe piquée)', () => {
    expect(count({ ...base, level: 'intermediaire' })).toBe(0);
  });
  it('salle : absent', () => {
    expect(count({ ...base, profile: 'F', place: 'salle' })).toBe(0);
  });
});

describe('V-MSG-GROS-AVIS', () => {
  it('présent si grossesse ou post-partum, absent sinon', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) {
      const p = prog(generateProgram(mk({ preg })));
      const m = p.messages.find((x) => x.id === 'V-MSG-GROS-AVIS')!;
      expect(m.text).toBe(
        "Demande l'avis de ton médecin ou de ta sage-femme avant de t'entraîner. Cette appli n'est pas un avis médical : si l'un d'eux t'a déconseillé le sport, ne suis pas ces exercices.",
      );
    }
    expect(msgIds(prog(generateProgram(mk({}))))).not.toContain('V-MSG-GROS-AVIS');
  });
});
