import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabasePropertyRenamed } from './database-property-renamed';

const { objectDatabase } = DatabaseFixtures;

describe('onDatabasePropertyRenamed', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('records the rename in the rename ledger', async () => {
    await onDatabasePropertyRenamed({
      database: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
    });

    // The ledger should contain a property rename event recording
    // the database name and property names
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects/Content',
        to: 'Objects/Body',
        kind: 'property',
      }),
    ]);
  });
});
