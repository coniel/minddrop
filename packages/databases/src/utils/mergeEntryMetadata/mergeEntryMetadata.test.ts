import { describe, expect, it } from 'vitest';
import {
  objectDatabase,
  objectEntry1,
  timestampDatabase,
  timestampEntry1,
} from '../../test-utils';
import { mergeEntryMetadata } from './mergeEntryMetadata';

const sidecarDate = new Date('2020-03-03T00:00:00.000Z');

describe('mergeEntryMetadata', () => {
  it('uses the sidecar timestamps over the stat derived ones', () => {
    const { entry } = mergeEntryMetadata(
      objectEntry1,
      objectDatabase.properties,
      { created: sidecarDate, lastModified: sidecarDate },
    );

    expect(entry.created).toEqual(sidecarDate);
    expect(entry.lastModified).toEqual(sidecarDate);
  });

  it('uses the timestamp properties over the sidecar', () => {
    const { entry } = mergeEntryMetadata(
      timestampEntry1,
      timestampDatabase.properties,
      { created: sidecarDate, lastModified: sidecarDate },
    );

    expect(entry.created).toEqual(timestampEntry1.properties.Created);
    expect(entry.lastModified).toEqual(
      timestampEntry1.properties['Last Modified'],
    );
  });

  it('seeds from the stat derived timestamps when the sidecar has none', () => {
    const { entry, sidecarOutdated } = mergeEntryMetadata(
      objectEntry1,
      objectDatabase.properties,
      {},
    );

    // The entry keeps its stat derived timestamps
    expect(entry.created).toEqual(objectEntry1.created);
    expect(entry.lastModified).toEqual(objectEntry1.lastModified);

    // Which are written to the sidecar
    expect(entry.metadata.created).toEqual(objectEntry1.created);
    expect(entry.metadata.lastModified).toEqual(objectEntry1.lastModified);
    expect(sidecarOutdated).toBe(true);
  });

  it('reports an up to date sidecar as such', () => {
    const { sidecarOutdated } = mergeEntryMetadata(
      objectEntry1,
      objectDatabase.properties,
      { created: sidecarDate, lastModified: sidecarDate },
    );

    expect(sidecarOutdated).toBe(false);
  });

  it('reports a sidecar which drifted from the timestamp properties', () => {
    const { sidecarOutdated } = mergeEntryMetadata(
      timestampEntry1,
      timestampDatabase.properties,
      { created: sidecarDate, lastModified: sidecarDate },
    );

    expect(sidecarOutdated).toBe(true);
  });

  it("preserves the sidecar's other metadata", () => {
    const embeddedViewConfigs = {
      'card:Related': { options: {}, data: {} },
    };

    const { entry } = mergeEntryMetadata(
      objectEntry1,
      objectDatabase.properties,
      { embeddedViewConfigs },
    );

    expect(entry.metadata.embeddedViewConfigs).toEqual(embeddedViewConfigs);
  });
});
