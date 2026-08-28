import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { setEntryColor } from './setEntryColor';

// The sidecar path the entry's metadata is written to
const sidecarPath = resolveEntryMetadataFilePath(
  objectDatabase.path,
  objectEntry1.path,
);

describe('setEntryColor', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the color on the stored entry metadata', async () => {
    await setEntryColor(objectEntry1.id, 'red');

    expect(DatabaseEntriesStore.get(objectEntry1.id)?.metadata.color).toBe(
      'red',
    );
  });

  it('persists the color to the metadata sidecar', async () => {
    await setEntryColor(objectEntry1.id, 'blue');

    expect(JSON.parse(MockFs.readTextFile(sidecarPath))).toEqual({
      color: 'blue',
    });
  });

  it('preserves the rest of the metadata', async () => {
    // Give the entry existing metadata
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
      },
    });

    await setEntryColor(objectEntry1.id, 'green');

    expect(DatabaseEntriesStore.get(objectEntry1.id)?.metadata).toEqual({
      embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
      color: 'green',
    });
  });

  it('clears the color when set to null', async () => {
    await setEntryColor(objectEntry1.id, 'red');
    await setEntryColor(objectEntry1.id, null);

    expect(DatabaseEntriesStore.get(objectEntry1.id)?.metadata).toEqual({});
  });

  describe('with a declared color property', () => {
    beforeEach(() => {
      // Declare a Color property on the database
      DatabasesStore.update(objectDatabase.id, {
        properties: [
          ...objectDatabase.properties,
          { type: 'color', name: 'Color' },
        ],
      });
    });

    it('mirrors the color into the property value', async () => {
      await setEntryColor(objectEntry1.id, 'red');

      const entry = DatabaseEntriesStore.get(objectEntry1.id);

      // Both the metadata and the file backed property hold the color
      expect(entry?.metadata.color).toBe('red');
      expect(entry?.properties.Color).toBe('red');
    });

    it('clears the property value along with the color', async () => {
      await setEntryColor(objectEntry1.id, 'red');
      await setEntryColor(objectEntry1.id, null);

      const entry = DatabaseEntriesStore.get(objectEntry1.id);

      expect(entry?.metadata.color).toBeUndefined();
      expect(entry?.properties.Color).toBeNull();
    });
  });

  it('throws if the entry does not exist', async () => {
    await expect(setEntryColor('missing-entry', 'red')).rejects.toThrowError(
      DatabaseEntryNotFoundError,
    );
  });
});
