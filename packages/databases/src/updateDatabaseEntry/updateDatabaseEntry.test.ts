import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntryUpdatedEvent } from '../events';
import { MockFs, cleanup, objectEntry1, setup } from '../test-utils';
import { updateDatabaseEntry } from './updateDatabaseEntry';

const update = {
  properties: {
    Content: 'Updated content',
  },
};

describe('updateDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should update the entry with the provided data', async () => {
    const entry = await updateDatabaseEntry(objectEntry1.path, update);

    expect(entry.properties.Content).toBe(update.properties.Content);
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      updateDatabaseEntry('non/existent/Entry.md', update),
    ).rejects.toThrowError(DatabaseEntryNotFoundError);
  });

  it('throws if the update data contains a title', async () => {
    await expect(
      updateDatabaseEntry(objectEntry1.path, {
        // @ts-expect-error Testing invalid data
        title: 'New Title',
      }),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('updates the last modified date', async () => {
    const entry = await updateDatabaseEntry(objectEntry1.path, update);

    expect(entry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the entry in the store', async () => {
    const entry = await updateDatabaseEntry(objectEntry1.path, update);

    const storeDatabaseEntry = DatabaseEntriesStore.get(objectEntry1.path);

    expect(storeDatabaseEntry).toEqual(entry);
  });

  it('writes the entry files to the file system', async () => {
    // Delete the exisitng entry file
    MockFs.removeFile(objectEntry1.path);

    await updateDatabaseEntry(objectEntry1.path, update);

    expect(MockFs.exists(objectEntry1.path)).toBeTruthy();
  });

  it('does nothing if no valid update data is provided', async () => {
    const entry = await updateDatabaseEntry(objectEntry1.path, {});

    expect(entry).toEqual(objectEntry1);
  });

  it('dispatches a entry update event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryUpdatedEvent, 'test', (payload) => {
        // Payload data should be the updated entry
        expect(payload.data).toEqual({
          ...objectEntry1,
          lastModified: expect.any(Date),
          properties: {
            ...objectEntry1.properties,
            ...update.properties,
          },
        });
        done();
      });

      updateDatabaseEntry(objectEntry1.path, update);
    }));
});
