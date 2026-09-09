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
import { readAllEntryMetadata } from './readAllEntryMetadata';

const metadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
};

describe('readAllEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty map when the database has no metadata directory', async () => {
    expect(await readAllEntryMetadata(databaseDirPath(objectDatabase))).toEqual(
      {},
    );
  });

  it('reads every sidecar keyed by entry name', async () => {
    const entryPath = `${databaseDirPath(objectDatabase)}/Entry.md`;

    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      entryPath,
      metadata,
    );

    expect(await readAllEntryMetadata(databaseDirPath(objectDatabase))).toEqual(
      {
        Entry: metadata,
      },
    );
  });

  it('resolves an entry stored in its own subdirectory to the same key', async () => {
    // Entry-based property storage nests the entry in a directory
    // named after it, which is the same entry.
    const nestedEntryPath = `${databaseDirPath(objectDatabase)}/Entry/Entry.md`;

    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      nestedEntryPath,
      metadata,
    );

    expect(await readAllEntryMetadata(databaseDirPath(objectDatabase))).toEqual(
      {
        Entry: metadata,
      },
    );
  });

  it('skips sidecars which are not valid JSON', async () => {
    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      `${databaseDirPath(objectDatabase)}/Entry.md`,
      metadata,
    );
    MockFs.writeTextFile(
      resolveEntryMetadataFilePath(
        databaseDirPath(objectDatabase),
        `${databaseDirPath(objectDatabase)}/Broken.md`,
      ),
      'not json',
    );

    expect(await readAllEntryMetadata(databaseDirPath(objectDatabase))).toEqual(
      {
        Entry: metadata,
      },
    );
  });
});
