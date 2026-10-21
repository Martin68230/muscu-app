import { useState } from 'preact/hooks';
import { HealthNoticeText } from '../HealthNotice';
import { IconShield } from '../icons';

export function Onboarding({ onAccept }: { onAccept: () => void }) {
  const [adult, setAdult] = useState(false);
  const [understood, setUnderstood] = useState(false);
  return (
    <div class="shell">
      <main class="screen">
        <div class="empty-state compact">
          <IconShield />
        </div>
        <h1>Avant de commencer</h1>
        <div class="notice">
          <HealthNoticeText />
        </div>
        <div class="card">
          <p class="small dim">
            Tes données restent sur ce téléphone. Rien n'est partagé sans ton accord.
          </p>
        </div>
        <label class="check">
          <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.currentTarget.checked)} />
          <span>J'ai 18 ans ou plus.</span>
        </label>
        <label class="check">
          <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.currentTarget.checked)} />
          <span>J'ai compris que ce n'est pas un avis médical.</span>
        </label>
        <div class="thumb-zone thumb-zone-alone">
          <button class="btn btn-primary" disabled={!adult || !understood} onClick={onAccept}>
            Commencer
          </button>
        </div>
      </main>
    </div>
  );
}
