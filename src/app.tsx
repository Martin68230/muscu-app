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
import type { Program } from './data/model';
import { loadFiches, type Fiche as FicheData } from './data/fiches';
import { SessionController } from './session/store';
import { SessionPreview } from './ui/screens/Preview';
import { SessionPlayer } from './ui/screens/Player';
import { loadPlayerData, type PlayerData } from './ui/session/launch';

/** #/seance : aperçu de la séance du jour. */
const previewFromHash = (): boolean => location.hash === '#/seance';

interface Playing {
  controller: SessionController;
  data: PlayerData;
}

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
  const [preview, setPreview] = useState(previewFromHash());
  /** Séance en cours dans le lecteur (plein écran, sans barre d'onglets). */
  const [playing, setPlaying] = useState<Playing | null>(null);
  /** Parcours du profil : 'all' = les cartes à la suite ; sinon une seule carte (modification depuis Profil). */
  const [wizard, setWizard] = useState<ProfileStep | 'all' | null>(null);

  const load = () => ensureLocalUser().then(setProfile);

  useEffect(() => {
    load();
    const onHash = () => {
      setTab(tabFromHash());
      setFicheId(ficheFromHash());
      setPreview(previewFromHash());
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const go = (t: Tab) => {
    location.hash = `#/${t}`;
    setTab(t);
    setFicheId(null);
    setPreview(false);
  };

  const begin = async (program: Program, dayIndex: number, fiches: FicheData[]) => {
    if (!profile) return;
    const data = await loadPlayerData(fiches, profile);
    const controller = await SessionController.start(program, dayIndex, data.ctx);
    // Un rechargement pendant la séance revient sur l'Accueil, qui propose de la reprendre.
    location.hash = '#/accueil';
    setPlaying({ controller, data });
  };
  const resume = async (sessionId: string) => {
    if (!profile) return;
    const fiches = await loadFiches();
    const data = await loadPlayerData(fiches, profile, sessionId);
    const controller = await SessionController.resume(sessionId, data.ctx);
    setPlaying({ controller, data });
  };
  const closePlayer = () => {
    setPlaying(null);
    location.hash = '#/accueil';
    setPreview(false);
  };

  if (!profile) return null;

  if (!profile.healthDisclaimerAcceptedAt || !profile.adultConfirmedAt) {
    return <Onboarding onAccept={async () => setProfile(await acceptOnboarding(profile.id))} />;
  }

  if (playing) {
    return (
      <SessionPlayer
        controller={playing.controller}
        data={playing.data}
        profile={profile}
        onClose={closePlayer}
        onEditInjuries={() => {
          setPlaying(null);
          setWizard('blessures');
        }}
      />
    );
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
      <main class="screen" key={ficheId ? `fiche-${ficheId}` : preview ? 'seance' : tab}>
        {tab === 'accueil' && !preview && (
          <Home
            profile={profile}
            onStart={() => setWizard('all')}
            onEditStep={(s) => setWizard(s)}
            onResume={(id) => void resume(id)}
            onOpenSession={() => (location.hash = '#/seance')}
          />
        )}
        {tab === 'accueil' && preview && <SessionPreview profile={profile} onBegin={begin} />}
        {tab === 'calendrier' && <Calendar />}
        {tab === 'bibliotheque' && !ficheId && <Library />}
        {tab === 'bibliotheque' && ficheId && <Fiche id={ficheId} pregnancy={profile.pregnancy} />}
        {tab === 'profil' && <Profile profile={profile} onChange={setProfile} onWiped={load} onEditStep={(s) => setWizard(s ?? 'all')} />}
      </main>
      <TabBar current={tab} onSelect={go} />
    </div>
  );
}
