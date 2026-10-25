import { describe, expect, it } from 'vitest';
import { splitMessages } from '../../src/ui/screens/Preview';
import type { Program } from '../../src/data/model';

const prog = (ids: string[]): Program => ({ messages: ids.map((id) => ({ id, text: `texte ${id}` })) } as unknown as Program);

describe('aperçu : sécurité visible, le reste derrière « Pourquoi ? »', () => {
  it('sépare la sécurité (douleur, grossesse, blessures, cardio) des informations', () => {
    const r = splitMessages(prog(['V-MSG-FREQ', 'V-MSG-ZONE', 'V-MSG-OBJ', 'T0', 'V-MSG-ACHAT', 'V-MSG-GROS-AVIS', 'V-MSG-CARDIO-OMS']));
    expect(r.safety).toEqual(['texte V-MSG-GROS-AVIS', 'texte V-MSG-ZONE', 'texte T0']);
    expect(r.info).toEqual(['texte V-MSG-FREQ', 'texte V-MSG-OBJ', 'texte V-MSG-ACHAT', 'texte V-MSG-CARDIO-OMS']);
  });
  it('aucun message de sécurité n\'est rangé dans les informations (R3, T1, T1u, T5)', () => {
    const r = splitMessages(prog(['R3', 'T1', 'T1u', 'T5', 'V-MSG-PRO']));
    expect(r.info).toEqual([]);
    expect(r.safety).toHaveLength(5);
  });
});
