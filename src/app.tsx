import { useEffect, useState } from 'preact/hooks';
import type { Profile as ProfileRow } from './data/model';
import { acceptOnboarding, ensureLocalUser } from './data/bootstrap';
import { TabBar, type Tab } from './ui/TabBar';
import { Onboarding } from './ui/screens/Onboarding';
import { Home } from './ui/screens/Home';
import { Calendar } from './ui/screens/Calendar';
import { Library } from './ui/screens/Library';
import { Fiche } from './ui/screens/Fiche';
import { Profile } from './ui/screens/Profile';
import { ProfileWizard } from './ui/screens/ProfileWizard';
import type { ProfileStep } from './data/profile-setup';

const TAB_IDS: Tab[] = ['accueil', 'calendrier', 'bibliotheque', 'profil'];

/** #/fiche/<id> : identifiant d'une fiche d'exercice, sinon null. */
function ficheFromHash(): string | null {
  const m = /^#\/fiche\/([a-z0-9-]+)$/.exec(location.hash);
  return m ? m[1] : null;
}

function tabFromHash(): Tab {
  if (ficheFromHash()) return 'bibliotheque';
  const h = location.hash.replace('#/', '') as Tab;
  return TAB_IDS.includes(h) ? h : 'accueil';
}

export function App() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [tab, setTab] = useState<Tab>(tabFromHash());
  const [ficheId, setFicheId] = useState<string | null>(ficheFromHash());
  /** Parcours du profil : 'all' = les cartes à la suite ; sinon une seule carte (modification depuis Profil). */
  const [wizard, setWizard] = useState<ProfileStep | 'all' | null>(null);

  const load = () => ensureLocalUser().then(setProfile);

  useEffect(() => {
    load();
    const onHash = () => {
      setTab(tabFromHash());
      setFicheId(ficheFromHash());
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const go = (t: Tab) => {
    location.hash = `#/${t}`;
    setTab(t);
    setFicheId(null);
  };

  if (!profile) return null;

  if (!profile.healthDisclaimerAcceptedAt || !profile.adultConfirmedAt) {
    return <Onboarding onAccept={async () => setProfile(await acceptOnboarding(profile.id))} />;
  }

  if (wizard) {
    return (
      <ProfileWizard
        profile={profile}
        onChange={setProfile}
        only={wizard === 'all' ? undefined : wizard}
        onExit={() => {
          const toProfile = wizard !== 'all';
          setWizard(null);
          go(toProfile ? 'profil' : 'accueil');
        }}
      />
    );
  }

  return (
    <div class="shell">
      <main class="screen" key={ficheId ? `fiche-${ficheId}` : tab}>
        {tab === 'accueil' && <Home profile={profile} onStart={() => setWizard('all')} />}
        {tab === 'calendrier' && <Calendar />}
        {tab === 'bibliotheque' && !ficheId && <Library />}
        {tab === 'bibliotheque' && ficheId && <Fiche id={ficheId} pregnancy={profile.pregnancy} />}
        {tab === 'profil' && <Profile profile={profile} onChange={setProfile} onWiped={load} onEditStep={(s) => setWizard(s ?? 'all')} />}
      </main>
      <TabBar current={tab} onSelect={go} />
    </div>
  );
}
