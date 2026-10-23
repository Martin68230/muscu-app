// Son de fin de repos. Sur iPhone, le son n'est permis qu'après un appui : « Commencer la séance » le débloque.
// Tant qu'il n'est pas débloqué, aucun bip. Vibration seulement si le téléphone sait le faire (pas Safari iPhone).
type Ctor = typeof AudioContext;
let audio: AudioContext | null = null;
let unlocked = false;

function makeContext(): AudioContext | null {
  const g = globalThis as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  const C = g.AudioContext ?? g.webkitAudioContext;
  if (!C) return null;
  try {
    return new C();
  } catch {
    return null;
  }
}

function tone(ctx: AudioContext, seconds: number, volume: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + seconds);
}

/** À appeler DANS l'appui sur « Commencer la séance ». Bip très court et discret. */
export async function unlockSound(): Promise<boolean> {
  try {
    audio ??= makeContext();
    if (!audio) return false;
    const p = audio.resume();
    tone(audio, 0.05, 0.02);
    await p;
    unlocked = audio.state !== 'suspended';
    return unlocked;
  } catch {
    return false;
  }
}

export function isSoundUnlocked(): boolean {
  return unlocked;
}

/** Fin de repos : deux bips, seulement si le son est débloqué. */
export function playRestEnd(): boolean {
  if (!unlocked || !audio) return false;
  try {
    tone(audio, 0.18, 0.25);
    const ctx = audio;
    setTimeout(() => {
      try {
        tone(ctx, 0.25, 0.25);
      } catch {
        /* ignoré */
      }
    }, 260);
    return true;
  } catch {
    return false;
  }
}

export function vibrateRestEnd(): void {
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {
    /* ignoré */
  }
}

export function resetSoundForTests(): void {
  audio = null;
  unlocked = false;
}
