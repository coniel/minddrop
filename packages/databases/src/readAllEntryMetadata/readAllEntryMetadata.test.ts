import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
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
    expect(await readAllEntryMetadata(objectDatabase.path)).toEqual({});
  });

  it('reads every sidecar keyed by entry name', async () => {
    const entryPath = `${objectDatabase.path}/Entry.md`;

    await writeEntryMetadata(objectDatabase.path, entryPath, metadata);

    expect(await readAllEntryMetadata(objectDatabase.path)).toEqual({
      Entry: metadata,
    });
  });

  it('resolves an entry stored in its own subdirectory to the same key', async () => {
    // Entry-based property storage nests the entry in a directory
    // named after it, which is the same entry
    const nestedEntryPath = `${objectDatabase.path}/Entry/Entry.md`;

    await writeEntryMetadata(objectDatabase.path, nestedEntryPath, metadata);

    expect(await readAllEntryMetadata(objectDatabase.path)).toEqual({
      Entry: metadata,
    });
  });

  it('skips sidecars which are not valid JSON', async () => {
    await writeEntryMetadata(
      objectDatabase.path,
      `${objectDatabase.path}/Entry.md`,
      metadata,
    );
    MockFs.writeTextFile(
      resolveEntryMetadataFilePath(
        objectDatabase.path,
        `${objectDatabase.path}/Broken.md`,
      ),
      'not json',
    );

    expect(await readAllEntryMetadata(objectDatabase.path)).toEqual({
      Entry: metadata,
    });
  });
});
