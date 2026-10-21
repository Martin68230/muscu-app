import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';
import { wipeAllData } from '../../src/data/backup';
import { setClock } from '../../src/data/repo';

afterEach(async () => {
  await wipeAllData();
  setClock(() => new Date());
});
