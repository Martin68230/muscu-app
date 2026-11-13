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
import { recordCatchUpLog } from './zones/catchup-log';
import { applyEnvOf, catchUpOf, loadPlayerData, type PlayerData } from './ui/session/launch';
import { applyAccepted } from './session/adapt-accept';
import { recordAdaptResult } from './session/progression-store';
import { list, listTrusted } from './data/repo';
import { planReprise } from './session/reprise-plan';
import { programWeek, rotationFreeze, withProgramWeek } from './session/program';
import { repriseOf } from './session/missed-config';
import { saveReprise } from './session/missed-store';
import { CreateSessionScreen } from './ui/screens/CreateSession';
import { NoteSport } from './ui/screens/MySport';
import type { CreatedSession, CreateSessionRequest } from './generator';
import { createdDay, metaOf, scheduleCreated, type ScheduledCreated } from './session/create-store';

/** #/seance : aperçu de la séance du jour. */
const previewFromHash = (): boolean => location.hash === '#/seance';
/** #/creer : écran « Créer une séance » (D28). */
const createFromHash = (): boolean => location.hash === '#/creer';
/** #/sport : écran « Noter une séance de sport » (Mon sport). */
const sportFromHash = (): boolean => location.hash === '#/sport';

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
  /** D28 : écran « Créer une séance » ouvert ; prefill = séance ajoutée au calendrier que l'on prépare. */
  const [create, setCreate] = useState<{ prefill: ScheduledCreated | null } | null>(createFromHash() ? { prefill: null } : null);
  const [sportNote, setSportNote] = useState(sportFromHash());
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
      setCreate((c) => (createFromHash() ? c ?? { prefill: null } : null));
      setSportNote(sportFromHash());
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const go = (t: Tab) => {
    location.hash = `#/${t}`;
    setTab(t);
    setFicheId(null);
    setPreview(false);
    setCreate(null);
    setSportNote(false);
  };
  const openSport = () => {
    setSportNote(true);
    location.hash = '#/sport';
  };
  const openCreate = (prefill: ScheduledCreated | null = null) => {
    setTab('accueil');
    setCreate({ prefill });
    location.hash = '#/creer';
  };

  const begin = async (program: Program, dayIndex: number, fiches: FicheData[]) => {
    if (!profile) return;
    const data = await loadPlayerData(fiches, profile);
    // R-DEM (seance-manquee-v1.md) : palier de reprise calculé et enregistré au démarrage d'une séance de musculation.
    const [profiles, programs, sessions, sets, injuries] = await Promise.all([list('profile'), list('programs'), listTrusted('sessions'), listTrusted('sets'), list('injuries')]);
    // D34 (PV3-VAR-4, 5 d) : jeu de la semaine en cours (gel après une douleur) AVANT la reprise douce, qui s'applique sur cette copie.
    const weekDay = withProgramWeek(program.days[dayIndex], programWeek(program, Date.now()), rotationFreeze(sets, injuries, Date.now()));
    const plan = planReprise(weekDay, { reprise: repriseOf(profiles[0]), sessions, programs, sets, now: new Date(), ctx: data.ctx });
    // Changements acceptés après la séance précédente (série en plus, version plus dure, repos, décharge) : revérifiés ici, jamais en reprise douce.
    const accepted = applyAccepted(weekDay, applyEnvOf(data, !!plan?.state.actif, { program, dayIndex, nowMs: Date.now() }));
    // Niveau 2, étape 3 : séries de rattrapage des zones peu travaillées la semaine écoulée (première séance de la semaine, recalculé).
    const catchUp = catchUpOf(data, program, dayIndex, accepted.day, !!plan?.state.actif, Date.now());
    // RAT-2 / RAT-3 : petit journal local (zones basses de la semaine, exercice rattrapé, cause) ; jamais une donnée de santé.
    if (catchUp?.weekKey) await recordCatchUpLog(catchUp.weekKey, catchUp.log);
    const controller = await SessionController.start(program, dayIndex, data.ctx, undefined, { day: plan?.state.actif ? plan.day : catchUp?.day ?? accepted.day });
    await recordAdaptResult(accepted).catch(() => undefined);
    if (plan) await saveReprise(() => plan.state);
    data.repriseActive = !!plan?.state.actif;
    // Un rechargement pendant la séance revient sur l'Accueil, qui propose de la reprendre.
    location.hash = '#/accueil';
    setPlaying({ controller, data });
  };
  /** D28 : lance une séance créée dans le lecteur existant, sans toucher au programme actif. */
  const launchCreated = async (session: CreatedSession, request: CreateSessionRequest, scheduledId: string | null) => {
    if (!profile) return;
    const fiches = await loadFiches();
    const data = await loadPlayerData(fiches, profile);
    const controller = await SessionController.startCreated(createdDay(session), metaOf(session, request), data.ctx, undefined, scheduledId);
    data.repriseActive = false;
    setCreate(null);
    location.hash = '#/accueil';
    setPlaying({ controller, data });
  };
  const scheduleCreatedDay = async (session: CreatedSession, request: CreateSessionRequest, key: string) => {
    await scheduleCreated(createdDay(session), metaOf(session, request), key);
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
    setCreate(null);
    setSportNote(false);
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
      <main class="screen" key={ficheId ? `fiche-${ficheId}` : sportNote ? 'sport' : create ? 'creer' : preview ? 'seance' : tab}>
        {sportNote && <NoteSport profile={profile} onBack={() => go('accueil')} onEditPlan={() => go('profil')} />}
        {tab === 'accueil' && !sportNote && create && (
          <CreateSessionScreen
            profile={profile}
            prefill={create.prefill}
            onBack={() => go('accueil')}
            onEditProfile={() => setWizard('all')}
            onLaunch={launchCreated}
            onSchedule={scheduleCreatedDay}
          />
        )}
        {tab === 'accueil' && !sportNote && !preview && !create && (
          <Home
            profile={profile}
            onStart={() => setWizard('all')}
            onEditStep={(s) => setWizard(s)}
            onResume={(id) => void resume(id)}
            onOpenSession={() => (location.hash = '#/seance')}
            onOpenHistory={() => go('calendrier')}
            onCreateSession={() => openCreate()}
            onNoteSport={openSport}
          />
        )}
        {tab === 'accueil' && !sportNote && preview && <SessionPreview profile={profile} onBegin={begin} />}
        {tab === 'calendrier' && !sportNote && <Calendar profile={profile} onPrepareCreated={(c) => openCreate(c)} onNoteSport={openSport} />}
        {tab === 'bibliotheque' && !sportNote && !ficheId && <Library />}
        {tab === 'bibliotheque' && !sportNote && ficheId && <Fiche id={ficheId} pregnancy={profile.pregnancy} />}
        {tab === 'profil' && !sportNote && <Profile profile={profile} onChange={setProfile} onWiped={load} onEditStep={(s) => setWizard(s ?? 'all')} onNoteSport={openSport} />}
      </main>
      <TabBar current={tab} onSelect={go} />
    </div>
  );
}
