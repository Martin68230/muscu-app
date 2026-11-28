// Rapport de la semaine : carte des zones travaillées depuis lundi (programme + séances créées) et nombre de séries. Lecture locale seulement.
import { useEffect, useState } from 'preact/hooks';
import { listTrusted } from '../data/repo';
import { loadFiches } from '../data/fiches';
import { mainGoalKey } from '../zones/main-goal';
import { weekDoneMap } from '../zones/week-done';
import { MuscleMapCard } from './MuscleMapCard';

export function WeekDoneCard({ today = new Date() }: { today?: Date }) {
  const [res, setRes] = useState<ReturnType<typeof weekDoneMap>>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [sets, sessions, fiches, goal] = await Promise.all([listTrusted('sets'), listTrusted('sessions'), loadFiches(), mainGoalKey()]);
        if (alive) setRes(weekDoneMap(sets, sessions, today, fiches, goal));
      } catch {
        if (alive) setRes(null);
      }
    })();
    return () => { alive = false; };
  }, []);
  if (!res) return null;
  const intro = `${res.sets} ${res.sets > 1 ? 'séries faites' : 'série faite'} depuis lundi${res.created ? `, dont ${res.created} ${res.created > 1 ? 'séances créées' : 'séance créée'} par toi` : ''}.`;
  return <MuscleMapCard id="semaine-carte" title="Muscles travaillés cette semaine" intro={intro} statuses={res.map.statuses} points={res.map.points} period="sur la semaine" />;
}
