import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabaseRenamed } from './database-renamed';

const { objectDatabase } = DatabaseFixtures;

describe('onDatabaseRenamed', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('records the rename in the rename ledger', async () => {
    await onDatabaseRenamed({
      original: objectDatabase,
      updated: { ...objectDatabase, name: 'Renamed Objects' },
    });

    // The ledger should contain a database rename event recording
    // the old and new names
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects',
        to: 'Renamed Objects',
        kind: 'database',
      }),
    ]);
  });
});
