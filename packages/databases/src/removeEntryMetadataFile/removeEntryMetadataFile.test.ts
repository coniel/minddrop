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
const sidecarPath = resolveEntryMetadataFilePath(
  databasePath,
  objectEntry1.path,
);

describe('removeEntryMetadataFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("removes the entry's sidecar", async () => {
    await writeEntryMetadata(databasePath, objectEntry1.path, {
      color: 'red',
    });

    // The sidecar should exist before it is removed
    expect(MockFs.exists(sidecarPath)).toBe(true);

    await removeEntryMetadataFile(databasePath, objectEntry1.path);

    expect(MockFs.exists(sidecarPath)).toBe(false);
  });

  it('does nothing for an entry without a sidecar', async () => {
    await expect(
      removeEntryMetadataFile(databasePath, objectEntry1.path),
    ).resolves.toBeUndefined();
  });
});
