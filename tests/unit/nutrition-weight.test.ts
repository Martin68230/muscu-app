import { describe, expect, it } from 'vitest';
import { weighReminder } from '../../src/nutrition/weight-trend';

// 2026-11-16 = lundi ; jour de pesée 5 = samedi (2026-11-21).
describe('rappel de pesée hebdomadaire', () => {
  it('rien avant le jour de pesée', () => {
    expect(weighReminder([], 5, '2026-11-18')).toBeNull();
  });
  it('« due » le jour de pesée, « late » après, sans pesée cette semaine', () => {
    expect(weighReminder(['2026-11-10'], 5, '2026-11-21')).toBe('due');
    expect(weighReminder(['2026-11-10'], 5, '2026-11-22')).toBe('late');
  });
  it('plus de rappel dès qu’une pesée existe cette semaine', () => {
    expect(weighReminder(['2026-11-17'], 5, '2026-11-22')).toBeNull();
  });
  it('jour de pesée invalide : samedi par défaut', () => {
    expect(weighReminder([], 99, '2026-11-21')).toBe('due');
  });
});
