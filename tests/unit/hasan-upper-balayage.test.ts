// Balayage de profils pour l'activation des fiches du haut du corps du jeu hasaneyldrm (HASAN_UPPER_ACTIVE, config.ts) : tous les profils de matériel
// x maison / salle x 2 à 5 jours x trois niveaux. Aucun plafond protégé ne doit être dépassé : 24 séries principales par muscle (profil relevé) sinon 20,
// 20 (comptage 0,5) pour épaules / trapèzes / triceps / biceps / avant-bras / lombaires, plafonds des zones protégées, plafond par séance.
// SWEEP_REPORT=<fichier> écrit les maxima observés et les dépassements dans ce fichier.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { HASAN_UPPER_ACTIVE, HASAN_UPPER_EXCLUDED_MUSCLES, VOLUME, weekCountsSecondary } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { raisedCaps, sessionVol, weekCapFor, weekVol, weekMusclesOf } from '../../src/generator/plaf';
import { weekPoints } from '../../src/generator/zones-check';
import { capGroupPoints, isProtectedZone, zoneCaps } from '../../src/zones/zones';
import { FICHES, LEVELS, PROFILE_KEYS, mk } from './generator-helpers';

declare const process: { env: Record<string, string | undefined> };
const HASAN_UPPER_IDS = new Set(FICHES.filter((f) => Array.isArray(f.images) && f.images.length === 0 && /^(poussee_h|poussee_v|tirage_h|tirage_v)$/.test(f.schema)).map((f) => f.id));

describe('Fiches du haut du corps du jeu (HASAN_UPPER_ACTIVE) : balayage des plafonds protégés', () => {
  it('poussée horizontale active', () => { expect(HASAN_UPPER_ACTIVE).toContain('poussee_h'); });
  it('dos large (grand_dorsal) actif depuis le 27/11/2026', () => { expect(HASAN_UPPER_EXCLUDED_MUSCLES).not.toContain('grand_dorsal'); });
  it('tous profils x maison / salle x 2-5 jours x niveaux : aucun plafond protégé dépassé', () => {
    const max = new Map<string, { v: number; cap: number; where: string }>();
    const note = (k: string, v: number, cap: number, where: string) => { const o = max.get(k); if (!o || v / cap > o.v / o.cap) max.set(k, { v, cap, where }); };
    let n = 0, ko = 0, hasanUsed = 0;
    const bad: string[] = [];
    const check = (ok: boolean, msg: string) => { if (!ok) bad.push(msg); };
    for (const profile of PROFILE_KEYS) for (const place of ['maison', 'salle'] as const) for (let days = 2; days <= 5; days++) for (const level of LEVELS) {
      const label = `${profile} ${place} ${days}j ${level}`;
      const input = mk({ profile, place, days, level, goal: 'muscle', dur: 60 });
      const r = generateProgram(input);
      n++;
      if (!r.ok) { ko++; continue; }
      const p = r.program;
      const ctx = buildCtx(input);
      const raised = raisedCaps(ctx);
      hasanUsed += p.sessions.flatMap((s) => s.exercises).filter((e) => HASAN_UPPER_IDS.has(e.ficheId)).length;
      for (const m of weekMusclesOf(p.sessions)) {
        const v = p.sessions.reduce((a, s) => a + weekVol(s, m), 0);
        const cap = weekCapFor(ctx, m);
        note(`muscle ${m}`, v, cap, label);
        check(v <= cap, `${label} ${m} semaine ${v}/${cap}`);
        if (!raised) check(v <= VOLUME.maxPerMuscleWeek, `${label} ${m} (profil non relevé) ${v}`);
        if (weekCountsSecondary(m)) {
          const frac = p.sessions.reduce((a, s) => a + sessionVol(s, m), 0);
          note(`protégé ${m} (0,5)`, frac, VOLUME.maxPerMuscleWeek, label);
          check(frac <= VOLUME.maxPerMuscleWeek, `${label} ${m} (groupe protégé, comptage 0,5) ${frac}`);
        }
      }
      for (const [g, v] of capGroupPoints(weekPoints(p.sessions, ctx, raised))) {
        if (!isProtectedZone(v.zone)) continue;
        note(`zone ${g}`, v.points, zoneCaps(v.zone).week, label);
        // Zone protégée : jamais au-delà de max(plafond, même profil sans la poussée horizontale ni le dos large du jeu) ; un dépassement préexistant (trapèzes de C salle 5 j
        // intermédiaire : 20,25) ne doit pas augmenter (même règle que plafonds-releves.test.ts pour les plafonds relevés).
        if (v.points <= zoneCaps(v.zone).week + 1e-9) continue;
        const act = HASAN_UPPER_ACTIVE as string[];
        const exc = HASAN_UPPER_EXCLUDED_MUSCLES as string[];
        const i = act.indexOf('poussee_h');
        let ref = 0;
        if (i >= 0) act.splice(i, 1);
        exc.push('grand_dorsal');
        try { const r0 = generateProgram(input); if (r0.ok) ref = capGroupPoints(weekPoints(r0.program.sessions, ctx, raised)).get(g)?.points ?? 0; } finally { exc.pop(); if (i >= 0) act.splice(i, 0, 'poussee_h'); }
        check(v.points <= ref + 1e-9, `${label} zone protégée ${g} ${v.points} (sans poussee_h ni dos large : ${ref})`);
      }
      const sessCap = level === 'debutant' ? VOLUME.maxPerMuscleSession : VOLUME.maxPerMuscleSessionSlots;
      for (const s of p.sessions) for (const m of weekMusclesOf([s])) check(sessionVol(s, m) <= sessCap, `${label} ${s.label} ${m} séance ${sessionVol(s, m)}`);
    }
    if (process.env.SWEEP_REPORT) {
      const rows = [...max.entries()].sort((a, b) => b[1].v / b[1].cap - a[1].v / a[1].cap).slice(0, 25).map(([k, o]) => `${k}: ${o.v.toFixed(1)}/${o.cap} (${o.where})`);
      writeFileSync(process.env.SWEEP_REPORT as string, `programmes ${n}, échecs ${ko}, exercices du jeu (haut) placés ${hasanUsed}\n${rows.join('\n')}\nDÉPASSEMENTS\n${bad.join('\n')}\n`);
    }
    expect(bad).toEqual([]);
    expect(ko).toBe(0);
  }, 600_000);
});
