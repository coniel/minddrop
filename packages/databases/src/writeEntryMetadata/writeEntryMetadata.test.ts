import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import {
  resolveDatabaseMetadataDirPath,
  resolveEntryMetadataFilePath,
} from '../utils';
import { writeEntryMetadata } from './writeEntryMetadata';

// The path of the entry's metadata sidecar
const sidecarPath = resolveEntryMetadataFilePath(
  objectDatabase.path,
  objectEntry1.path,
);

// The metadata to write
const entryMetadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: {
    'card:Tasks': { options: {}, data: {} },
  },
};

describe('writeEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the metadata to the sidecar', async () => {
    await writeEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
      entryMetadata,
    );

    expect(JSON.parse(MockFs.readTextFile(sidecarPath))).toEqual(entryMetadata);
  });

  it('creates the metadata directory if it does not exist', async () => {
    await writeEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
      entryMetadata,
    );

    expect(
      MockFs.exists(resolveDatabaseMetadataDirPath(objectDatabase.path)),
    ).toBe(true);
  });

  it('replaces an existing sidecar', async () => {
    // Write a sidecar holding superseded metadata
    MockFs.addFiles([
      {
        path: sidecarPath,
        textContent: JSON.stringify({
          embeddedViewConfigs: { 'list:Tags': { options: {}, data: {} } },
        }),
      },
    ]);

    await writeEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
      entryMetadata,
    );

    expect(JSON.parse(MockFs.readTextFile(sidecarPath))).toEqual(entryMetadata);
  });
});
