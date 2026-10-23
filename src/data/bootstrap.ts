import { create, list, update } from './repo';
import { DEFAULT_SHARES, type Profile, type ShareDataType } from './model';

/** Premier lancement : crée le profil vide, le matériel implicite et les partages (tous désactivés). */
export async function ensureLocalUser(): Promise<Profile> {
  const [profile] = await list('profile');
  const result =
    profile ??
    (await create('profile', {
      displayName: '',
      adultConfirmedAt: null,
      healthDisclaimerAcceptedAt: null,
      level: null,
      daysPerWeek: null,
      blockedWeekdays: [],
      sessionDurationMin: null,
      sports: [],
      heightCm: null,
      aiEnabled: false,
      place: null,
      pregnancy: null,
      profileCompletedAt: null,
    }));

  if ((await list('equipment')).length === 0) {
    await create('equipment', {
      preset: 'A',
      tags: [],
      disabledImplicit: [],
      dumbbellWeightsKg: [],
      kettlebellWeightsKg: [],
      dumbbellKind: null,
      platesKg: [],
      other: '',
    });
  }

  const existing = new Set((await list('shares')).filter((s) => s.friendId === null).map((s) => s.dataType));
  for (const [dataType, enabled] of Object.entries(DEFAULT_SHARES) as [ShareDataType, boolean][]) {
    if (!existing.has(dataType)) await create('shares', { dataType, friendId: null, enabled });
  }
  return result;
}

export async function acceptOnboarding(profileId: string): Promise<Profile> {
  const now = new Date().toISOString();
  return update('profile', profileId, { adultConfirmedAt: now, healthDisclaimerAcceptedAt: now });
}
