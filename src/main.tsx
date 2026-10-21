import { render } from 'preact';
import { App } from './app';
import './styles.css';

// Demande au navigateur de ne pas purger les données (utile sur iPhone si l'app n'est pas installée).
navigator.storage?.persist?.().catch(() => undefined);

render(<App />, document.getElementById('app')!);
