import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Database } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabasePropertyRenamed } from './database-property-renamed';

const { objectDatabase } = DatabaseFixtures;

/**
 * Returns a copy of a database with the named property renamed
 * in its schema, matching the updated config carried by the
 * property renamed event.
 */
function renameProperty(
  database: Database,
  oldName: string,
  newName: string,
): Database {
  return {
    ...database,
    properties: database.properties.map((property) =>
      property.name === oldName ? { ...property, name: newName } : property,
    ),
  };
}

describe('onDatabasePropertyRenamed', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('records the rename in the rename ledger', async () => {
    await onDatabasePropertyRenamed({
      original: objectDatabase,
      updated: renameProperty(objectDatabase, 'Content', 'Body'),
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
