import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { moveEntryMetadataFile } from './moveEntryMetadataFile';

const oldEntryPath = `${databaseDirPath(objectDatabase)}/Entry.md`;
const newEntryPath = `${databaseDirPath(objectDatabase)}/Renamed.md`;

const metadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
};

describe('moveEntryMetadataFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('moves the sidecar to the new entry path', async () => {
    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      oldEntryPath,
      metadata,
    );

    await moveEntryMetadataFile(
      databaseDirPath(objectDatabase),
      oldEntryPath,
      newEntryPath,
    );

    const newPath = resolveEntryMetadataFilePath(
      databaseDirPath(objectDatabase),
      newEntryPath,
    );

    expect(JSON.parse(MockFs.readTextFile(newPath))).toEqual(metadata);
    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(objectDatabase),
          oldEntryPath,
        ),
      ),
    ).toBe(false);
  });

  it('moves the sidecar when the entry moves into its own subdirectory', async () => {
    // Entry-based property storage nests the entry in a directory
    // named after it.
    const nestedEntryPath = `${databaseDirPath(objectDatabase)}/Renamed/Renamed.md`;

    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      oldEntryPath,
      metadata,
    );

    await moveEntryMetadataFile(
      databaseDirPath(objectDatabase),
      oldEntryPath,
      nestedEntryPath,
    );

    expect(
      JSON.parse(
        MockFs.readTextFile(
          resolveEntryMetadataFilePath(
            databaseDirPath(objectDatabase),
            nestedEntryPath,
          ),
        ),
      ),
    ).toEqual(metadata);
  });

  it('is a no-op when the entry has no sidecar', async () => {
    // Should not throw
    await moveEntryMetadataFile(
      databaseDirPath(objectDatabase),
      oldEntryPath,
      newEntryPath,
    );

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(objectDatabase),
          newEntryPath,
        ),
      ),
    ).toBe(false);
  });
});
