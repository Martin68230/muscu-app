const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function Calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // lundi en premier
  const label = first.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <>
      <h1>Calendrier</h1>
      <div class="card">
        <h2 class="capitalize">{label}</h2>
        <div class="calendar" role="grid" aria-label={label}>
          {DOW.map((d, i) => (
            <div class="dow" key={`d${i}`}>{d}</div>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div class="day empty" key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => (
            <div class={`day${i + 1 === today.getDate() ? ' today' : ''}`} key={i}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <p class="dim small">Tes séances faites, reportées ou sautées apparaîtront ici.</p>
    </>
  );
}
