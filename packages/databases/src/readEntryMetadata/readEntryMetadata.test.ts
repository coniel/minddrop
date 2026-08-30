import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { readEntryMetadata } from './readEntryMetadata';

// The path of the entry's metadata sidecar
const sidecarPath = resolveEntryMetadataFilePath(
  objectDatabase.path,
  objectEntry1.path,
);

// The date stored in the sidecar as an ISO string
const createdDate = new Date('2024-02-02T00:00:00.000Z');

describe('readEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty object when the entry has no sidecar', async () => {
    const metadata = await readEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
    );

    expect(metadata).toEqual({});
  });

  it('reads the metadata from the sidecar', async () => {
    // Write a sidecar holding view configs
    MockFs.addFiles([
      {
        path: sidecarPath,
        textContent: JSON.stringify({
          embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
        }),
      },
    ]);

    const metadata = await readEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
    );

    expect(metadata).toEqual({
      embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
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
      objectDatabase.path,
      objectEntry1.path,
    );

    expect(metadata.created).toEqual(createdDate);
  });

  it('returns an empty object when the sidecar is unreadable', async () => {
    // Write a sidecar holding invalid JSON
    MockFs.addFiles([{ path: sidecarPath, textContent: 'not json' }]);

    const metadata = await readEntryMetadata(
      objectDatabase.path,
      objectEntry1.path,
    );

    expect(metadata).toEqual({});
  });
});
