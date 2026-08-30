import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { resolveDatabaseMetadataDirPath } from '../utils';
import { listEntryMetadataKeys } from './listEntryMetadataKeys';

// The database's metadata directory
const metadataDirPath = resolveDatabaseMetadataDirPath(objectDatabase.path);

describe('listEntryMetadataKeys', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty array when the metadata directory does not exist', async () => {
    const keys = await listEntryMetadataKeys(objectDatabase.path);

    expect(keys).toEqual([]);
  });

  it('returns the sidecar names without their extension', async () => {
    // Write two sidecars into the metadata directory
    MockFs.addFiles([
      { path: `${metadataDirPath}/Entry One.json`, textContent: '{}' },
      { path: `${metadataDirPath}/Entry Two.json`, textContent: '{}' },
    ]);

    const keys = await listEntryMetadataKeys(objectDatabase.path);

    expect(keys.sort()).toEqual(['Entry One', 'Entry Two']);
  });

  it('ignores files which are not JSON sidecars', async () => {
    // Write a sidecar alongside an unrelated file
    MockFs.addFiles([
      { path: `${metadataDirPath}/Entry One.json`, textContent: '{}' },
      { path: `${metadataDirPath}/notes.txt`, textContent: 'notes' },
    ]);

    const keys = await listEntryMetadataKeys(objectDatabase.path);

    expect(keys).toEqual(['Entry One']);
  });
});
