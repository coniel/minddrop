import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { removeEntryMetadataFile } from './removeEntryMetadataFile';

const databasePath = databaseDirPath(objectDatabase);

describe('removeEntryMetadataFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("removes the entry's sidecar", async () => {
    await writeEntryMetadata(databasePath, objectEntry1.path, {
      color: 'red',
    });

    await removeEntryMetadataFile(databasePath, objectEntry1.path);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(databasePath, objectEntry1.path),
      ),
    ).toBe(false);
  });

  it('does nothing for an entry without a sidecar', async () => {
    await expect(
      removeEntryMetadataFile(databasePath, objectEntry1.path),
    ).resolves.toBeUndefined();
  });
});
