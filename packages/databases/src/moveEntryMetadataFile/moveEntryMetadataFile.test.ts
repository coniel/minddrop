import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { moveEntryMetadataFile } from './moveEntryMetadataFile';

const oldEntryPath = `${objectDatabase.path}/Entry.md`;
const newEntryPath = `${objectDatabase.path}/Renamed.md`;

const metadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
};

describe('moveEntryMetadataFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('moves the sidecar to the new entry path', async () => {
    await writeEntryMetadata(objectDatabase.path, oldEntryPath, metadata);

    await moveEntryMetadataFile(
      objectDatabase.path,
      oldEntryPath,
      newEntryPath,
    );

    const newPath = resolveEntryMetadataFilePath(
      objectDatabase.path,
      newEntryPath,
    );

    expect(JSON.parse(MockFs.readTextFile(newPath))).toEqual(metadata);
    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(objectDatabase.path, oldEntryPath),
      ),
    ).toBe(false);
  });

  it('moves the sidecar when the entry moves into its own subdirectory', async () => {
    // Entry-based property storage nests the entry in a directory
    // named after it
    const nestedEntryPath = `${objectDatabase.path}/Renamed/Renamed.md`;

    await writeEntryMetadata(objectDatabase.path, oldEntryPath, metadata);

    await moveEntryMetadataFile(
      objectDatabase.path,
      oldEntryPath,
      nestedEntryPath,
    );

    expect(
      JSON.parse(
        MockFs.readTextFile(
          resolveEntryMetadataFilePath(objectDatabase.path, nestedEntryPath),
        ),
      ),
    ).toEqual(metadata);
  });

  it('is a no-op when the entry has no sidecar', async () => {
    // Should not throw
    await moveEntryMetadataFile(
      objectDatabase.path,
      oldEntryPath,
      newEntryPath,
    );

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(objectDatabase.path, newEntryPath),
      ),
    ).toBe(false);
  });
});
