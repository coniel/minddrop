import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { markdownEntrySerializer } from '../entry-serializers';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  timestampDatabase,
  timestampEntry1,
} from '../test-utils';
import { Database } from '../types';
import { readDatabaseEntry } from './readDatabaseEntry';

const statCreatedDate = new Date('2025-01-01T00:00:00.000Z');
const statLastModifiedDate = new Date('2025-01-02T00:00:00.000Z');

describe('readDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads and deserializes entries', async () => {
    const entry = await readDatabaseEntry(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
    );

    expect(entry).toEqual(objectEntry1);
  });

  it('uses timestamp properties when available instead of file stat', async () => {
    // Set file stats to different values than the property values
    MockFs.setFileStats(timestampEntry1.path, {
      created: statCreatedDate,
      lastModified: statLastModifiedDate,
    });

    const entry = (await readDatabaseEntry(
      timestampEntry1.path,
      timestampDatabase,
      markdownEntrySerializer,
    ))!;

    // Should use the property values, not file stat
    expect(entry.created).toEqual(timestampEntry1.created);
    expect(entry.lastModified).toEqual(timestampEntry1.lastModified);
  });

  it('falls back to file stat when timestamp properties are not in the schema', async () => {
    // Set file stats
    MockFs.setFileStats(objectEntry1.path, {
      created: statCreatedDate,
      lastModified: statLastModifiedDate,
    });

    const entry = (await readDatabaseEntry(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
    ))!;

    // objectDatabase has no created/last-modified properties, so should
    // fall back to file stat
    expect(entry.created).toEqual(statCreatedDate);
    expect(entry.lastModified).toEqual(statLastModifiedDate);
  });

  it('falls back to file stat for individual missing timestamp properties', async () => {
    // Database with only a created property (no last-modified)
    const createdOnlyDatabase: Database = {
      ...timestampDatabase,
      properties: timestampDatabase.properties.filter(
        (property) => property.type !== 'last-modified',
      ),
    };

    // Set file stats
    MockFs.setFileStats(timestampEntry1.path, {
      created: statCreatedDate,
      lastModified: statLastModifiedDate,
    });

    const entry = (await readDatabaseEntry(
      timestampEntry1.path,
      createdOnlyDatabase,
      markdownEntrySerializer,
    ))!;

    // Created should come from the property
    expect(entry.created).toEqual(timestampEntry1.created);
    // Last modified should fall back to file stat
    expect(entry.lastModified).toEqual(statLastModifiedDate);
  });

  it('falls back to file stat for invalid timestamp property values', async () => {
    // Entry file where Created is valid but Last Modified is not a date
    const invalidTimestampFile = `---
Created: ${timestampEntry1.created.toISOString()}
Last Modified: not-a-date
---`;

    MockFs.setFiles([
      { path: timestampEntry1.path, textContent: invalidTimestampFile },
    ]);

    MockFs.setFileStats(timestampEntry1.path, {
      created: statCreatedDate,
      lastModified: statLastModifiedDate,
    });

    const entry = (await readDatabaseEntry(
      timestampEntry1.path,
      timestampDatabase,
      markdownEntrySerializer,
    ))!;

    // Created should come from the valid property
    expect(entry.created).toEqual(timestampEntry1.created);
    // Last modified should fall back to file stat
    expect(entry.lastModified).toEqual(statLastModifiedDate);
  });

  it('does not call Fs.stat when both timestamp properties are present', async () => {
    const statSpy = vi.spyOn(Fs, 'stat');

    await readDatabaseEntry(
      timestampEntry1.path,
      timestampDatabase,
      markdownEntrySerializer,
    );

    expect(statSpy).not.toHaveBeenCalled();

    statSpy.mockRestore();
  });
});
