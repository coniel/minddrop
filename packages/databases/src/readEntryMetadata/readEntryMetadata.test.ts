import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { readEntryMetadata } from './readEntryMetadata';

// The path of the entry's metadata sidecar
const sidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(objectDatabase),
  entryFilePath(objectEntry1),
);

// The date stored in the sidecar as an ISO string
const createdDate = new Date('2024-02-02T00:00:00.000Z');

describe('readEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty object when the entry has no sidecar', async () => {
    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
    );

    expect(metadata).toEqual({});
  });

  it('reads the metadata from the sidecar', async () => {
    // Write a sidecar with a color
    MockFs.addFiles([
      {
        path: sidecarPath,
        textContent: JSON.stringify({
          color: 'red',
        }),
      },
    ]);

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
    );

    expect(metadata).toEqual({
      color: 'red',
    });
  });

  it('restores serialized dates to Date objects', async () => {
    // Write a sidecar holding an ISO string date
    MockFs.addFiles([
      {
        path: sidecarPath,
        textContent: JSON.stringify({ created: createdDate }),
      },
    ]);

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
    );

    expect(metadata.created).toEqual(createdDate);
  });

  it('returns an empty object when the sidecar is unreadable', async () => {
    // Write a sidecar holding invalid JSON
    MockFs.addFiles([{ path: sidecarPath, textContent: 'not json' }]);

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
    );

    expect(metadata).toEqual({});
  });

  // Pins Issue 32: An unparseable entry sidecar is read as no metadata. Remove
  // .fails once fixed.
  it.fails(
    'rejects rather than reading an unparseable sidecar as no metadata',
    async () => {
      // Write a sidecar left with git conflict markers
      MockFs.addFiles([
        {
          path: sidecarPath,
          textContent:
            '<<<<<<< HEAD\n{"color":"red"}\n=======\n{"color":"blue"}\n>>>>>>> theirs',
        },
      ]);

      await expect(
        readEntryMetadata(
          databaseDirPath(objectDatabase),
          entryFilePath(objectEntry1),
        ),
      ).rejects.toThrow();
    },
  );
});
