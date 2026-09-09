import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, StoredDesign } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabaseNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseDesignFilePath } from '../utils';
import { writeDatabaseDesign } from './writeDatabaseDesign';

const { ownedCardDesign_1 } = DesignFixtures;

// A design owned by the object database
const design: Design = { ...ownedCardDesign_1, owner: objectDatabase.id };

// Path to the design's file
const designFilePath = resolveDatabaseDesignFilePath(
  databaseDirPath(objectDatabase),
  design.id,
);

describe('writeDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the design to its file without the owner', async () => {
    await writeDatabaseDesign(design);

    const storedDesign = MockFs.readJsonFile<StoredDesign>(designFilePath);

    // The stored design should not contain the derived owner field
    expect(storedDesign).not.toHaveProperty('owner');
    expect(storedDesign?.id).toBe(design.id);
  });

  it("throws when the design's database does not exist", async () => {
    // Create a design owned by a missing database
    const orphanedDesign: Design = { ...design, owner: 'database_missing' };

    await expect(writeDatabaseDesign(orphanedDesign)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });
});
