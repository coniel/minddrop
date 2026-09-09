import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design } from '@minddrop/designs-next';
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
import { removeDatabaseDesignFile } from './removeDatabaseDesignFile';

const { ownedCardDesign_1 } = DesignFixtures;

// A design owned by the object database
const design: Design = { ...ownedCardDesign_1, owner: objectDatabase.id };

// Path to the design's file
const designFilePath = resolveDatabaseDesignFilePath(
  databaseDirPath(objectDatabase),
  design.id,
);

describe('removeDatabaseDesignFile', () => {
  beforeEach(() => {
    setup();

    // Add the design's file to the file system
    MockFs.addFiles([designFilePath]);
  });

  afterEach(cleanup);

  it("deletes the design's file", async () => {
    await removeDatabaseDesignFile(design);

    expect(MockFs.exists(designFilePath)).toBe(false);
  });

  it("throws when the design's database does not exist", async () => {
    // Create a design owned by a missing database
    const orphanedDesign: Design = { ...design, owner: 'database_missing' };

    await expect(removeDatabaseDesignFile(orphanedDesign)).rejects.toThrow(
      DatabaseNotFoundError,
    );

    // The file should be untouched
    expect(MockFs.exists(designFilePath)).toBe(true);
  });

  it('does nothing when the file does not exist', async () => {
    // Remove the design's file
    MockFs.removeFile(designFilePath);

    // Should not throw
    await expect(removeDatabaseDesignFile(design)).resolves.toBeUndefined();
  });
});
