import { useEffect, useState } from 'preact/hooks';
import type { Profile as ProfileRow } from './data/model';
import { acceptOnboarding, ensureLocalUser } from './data/bootstrap';
import { TabBar, type Tab } from './ui/TabBar';
import { Onboarding } from './ui/screens/Onboarding';
import { Home } from './ui/screens/Home';
import { Calendar } from './ui/screens/Calendar';
import { Library } from './ui/screens/Library';
import { Profile } from './ui/screens/Profile';

const TAB_IDS: Tab[] = ['accueil', 'calendrier', 'bibliotheque', 'profil'];

function tabFromHash(): Tab {
  const h = location.hash.replace('#/', '') as Tab;
  return TAB_IDS.includes(h) ? h : 'accueil';
}

export function App() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [tab, setTab] = useState<Tab>(tabFromHash());

  const load = () => ensureLocalUser().then(setProfile);

  useEffect(() => {
    load();
    const onHash = () => setTab(tabFromHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const go = (t: Tab) => {
    location.hash = `#/${t}`;
    setTab(t);
  };

  if (!profile) return null;

  if (!profile.healthDisclaimerAcceptedAt || !profile.adultConfirmedAt) {
    return <Onboarding onAccept={async () => setProfile(await acceptOnboarding(profile.id))} />;
  }

  return (
    <div class="shell">
      <main class="screen" key={tab}>
        {tab === 'accueil' && <Home profile={profile} go={go} />}
        {tab === 'calendrier' && <Calendar />}
        {tab === 'bibliotheque' && <Library />}
        {tab === 'profil' && <Profile profile={profile} onChange={setProfile} onWiped={load} />}
      </main>
      <TabBar current={tab} onSelect={go} />
    </div>
  );
}
