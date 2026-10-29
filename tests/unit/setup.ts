import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';
import { configure } from '@testing-library/dom';
import { wipeAllData } from '../../src/data/backup';
import { setClock } from '../../src/data/repo';

afterEach(async () => {
  await wipeAllData();
  setClock(() => new Date());
});

// Machine chargée (suite complète en parallèle) : les attentes d'écran (waitFor, findBy) ne doivent pas échouer au bout d'1 s.
configure({ asyncUtilTimeout: 6000 });
