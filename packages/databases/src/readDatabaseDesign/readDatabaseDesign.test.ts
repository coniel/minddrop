import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseDesignFilePath } from '../utils';
import { readDatabaseDesign } from './readDatabaseDesign';

const { ownedCardDesign_1 } = DesignFixtures;

// The design as stored in the database's designs directory
const { owner: _owner, ...storedDesign } = ownedCardDesign_1;
const designPath = resolveDatabaseDesignFilePath(
  databaseDirPath(objectDatabase),
  storedDesign.id,
);

describe('readDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the design with the database as its owner', async () => {
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);

    expect(await readDatabaseDesign(designPath, objectDatabase.id)).toEqual({
      status: 'read',
      value: { ...storedDesign, owner: objectDatabase.id },
    });
  });

  it('reports a file which is not a valid design as unreadable', async () => {
    MockFs.addFiles([{ path: designPath, textContent: '{}' }]);

    expect(await readDatabaseDesign(designPath, objectDatabase.id)).toEqual({
      status: 'unreadable',
    });
  });

  it('reports a file which cannot be parsed as unreadable', async () => {
    MockFs.addFiles([{ path: designPath, textContent: 'not json' }]);

    expect(await readDatabaseDesign(designPath, objectDatabase.id)).toEqual({
      status: 'unreadable',
    });
  });

  it('reports a missing file as missing', async () => {
    expect(await readDatabaseDesign(designPath, objectDatabase.id)).toEqual({
      status: 'missing',
    });
  });
});
