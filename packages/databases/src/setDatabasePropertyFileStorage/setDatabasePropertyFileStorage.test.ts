import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseUpdatedEvent, DatabaseUpdatedEventData } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  entryStorageDatabase,
  entryStorageEntry1,
  propertyStorageDatabase,
  propertyStorageEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath, databaseEntryAddress } from '../utils';
import { setDatabasePropertyFileStorage } from './setDatabasePropertyFileStorage';

describe('setDatabasePropertyFileStorage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does nothing when the mode and directory are unchanged', async () => {
    const result = await setDatabasePropertyFileStorage(
      rootStorageDatabase.id,
      'root',
    );

    // The mode is unchanged and the property file stays in place
    expect(result.propertyFileStorage).toBe('root');
    expect(await Fs.exists(`${rootStorageDatabase.path}/image.png`)).toBe(true);
  });

  it('moves property files from root to common storage', async () => {
    await setDatabasePropertyFileStorage(rootStorageDatabase.id, 'common');

    // The file moves into the common directory
    expect(await Fs.exists(`${rootStorageDatabase.path}/image.png`)).toBe(
      false,
    );
    expect(await Fs.exists(`${rootStorageDatabase.path}/Media/image.png`)).toBe(
      true,
    );
    // The entry file itself is untouched
    expect(getDatabaseEntry(rootStorageEntry1.id).path).toBe(
      rootStorageEntry1.path,
    );
    expect(getDatabase(rootStorageDatabase.id).propertyFileStorage).toBe(
      'common',
    );
  });

  it('moves property files from common to root and removes the empty dir', async () => {
    await setDatabasePropertyFileStorage(commonStorageDatabase.id, 'root');

    expect(
      await Fs.exists(`${commonStorageDatabase.path}/Media/image.png`),
    ).toBe(false);
    expect(await Fs.exists(`${commonStorageDatabase.path}/image.png`)).toBe(
      true,
    );
    // The now-empty common directory is removed
    expect(await Fs.exists(`${commonStorageDatabase.path}/Media`)).toBe(false);
  });

  it('moves property files from root to per-property directories', async () => {
    await setDatabasePropertyFileStorage(rootStorageDatabase.id, 'property');

    expect(await Fs.exists(`${rootStorageDatabase.path}/image.png`)).toBe(
      false,
    );
    expect(await Fs.exists(`${rootStorageDatabase.path}/Image/image.png`)).toBe(
      true,
    );
  });

  it('moves property files from per-property directories to root', async () => {
    await setDatabasePropertyFileStorage(propertyStorageDatabase.id, 'root');

    expect(
      await Fs.exists(`${propertyStorageDatabase.path}/Image/image.png`),
    ).toBe(false);
    expect(await Fs.exists(`${propertyStorageDatabase.path}/image.png`)).toBe(
      true,
    );
    // The now-empty property directory is removed
    expect(await Fs.exists(`${propertyStorageDatabase.path}/Image`)).toBe(
      false,
    );
  });

  it('renames the common directory, moving its contents', async () => {
    await setDatabasePropertyFileStorage(
      commonStorageDatabase.id,
      'common',
      'Photos',
    );

    expect(
      await Fs.exists(`${commonStorageDatabase.path}/Media/image.png`),
    ).toBe(false);
    expect(
      await Fs.exists(`${commonStorageDatabase.path}/Photos/image.png`),
    ).toBe(true);
    expect(await Fs.exists(`${commonStorageDatabase.path}/Media`)).toBe(false);
    expect(getDatabase(commonStorageDatabase.id).propertyFilesDir).toBe(
      'Photos',
    );
  });

  it('wraps entries in directories when switching to entry storage', async () => {
    await setDatabasePropertyFileStorage(rootStorageDatabase.id, 'entry');

    const path = rootStorageDatabase.path;
    const entryTitle = rootStorageEntry1.title;

    // The entry file is wrapped in a per-entry directory
    expect(await Fs.exists(`${path}/${entryTitle}/${entryTitle}.md`)).toBe(
      true,
    );
    expect(getDatabaseEntry(rootStorageEntry1.id).path).toBe(
      `${path}/${entryTitle}/${entryTitle}.md`,
    );
    // The property file moves into the entry directory
    expect(await Fs.exists(`${path}/${entryTitle}/image.png`)).toBe(true);
    expect(await Fs.exists(`${path}/image.png`)).toBe(false);

    // Entries without property files are wrapped too
    const emptyTitle = rootStorageEntry_empty_value.title;
    expect(await Fs.exists(`${path}/${emptyTitle}/${emptyTitle}.md`)).toBe(
      true,
    );
  });

  it('dispatches address changes when crossing the entry boundary', async () => {
    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener<ItemAddressesChangedEventData>(
      ItemAddressesChangedEvent,
      'test',
      (payload) => {
        dispatched = payload.data;
      },
    );

    await setDatabasePropertyFileStorage(rootStorageDatabase.id, 'entry');

    // The dispatch carries the moved entry's old and new addresses
    expect(dispatched).toContainEqual({
      id: rootStorageEntry1.id,
      oldReference: databaseEntryAddress(rootStorageEntry1.path),
      newReference: databaseEntryAddress(
        getDatabaseEntry(rootStorageEntry1.id).path,
      ),
    });
  });

  it('unwraps entries when switching away from entry storage', async () => {
    await setDatabasePropertyFileStorage(entryStorageDatabase.id, 'root');

    const path = entryStorageDatabase.path;
    const entryTitle = entryStorageEntry1.title;

    // The entry file is unwrapped back into the database root
    expect(await Fs.exists(`${path}/${entryTitle}.md`)).toBe(true);
    expect(getDatabaseEntry(entryStorageEntry1.id).path).toBe(
      `${path}/${entryTitle}.md`,
    );
    // The property file moves to the database root
    expect(await Fs.exists(`${path}/image.png`)).toBe(true);
    // The wrapper directory is removed
    expect(await Fs.exists(`${path}/${entryTitle}`)).toBe(false);
  });

  it('increments colliding file names when collapsing to a shared dir', async () => {
    // A second entry whose image file shares the first entry's file name
    const secondEntry = {
      ...entryStorageEntry1,
      id: 'database-entry_entry-storage-entry-2' as const,
      title: 'Entry Storage Entry 2',
      path: `${entryStorageDatabase.path}/Entry Storage Entry 2/Entry Storage Entry 2.md`,
    };
    DatabaseEntriesStore.load([secondEntry]);
    MockFs.addFiles([
      secondEntry.path,
      `${entryStorageDatabase.path}/Entry Storage Entry 2/image.png`,
    ]);

    await setDatabasePropertyFileStorage(entryStorageDatabase.id, 'root');

    const path = entryStorageDatabase.path;

    // Both files land in the root, the second incremented to avoid a collision
    expect(await Fs.exists(`${path}/image.png`)).toBe(true);
    expect(await Fs.exists(`${path}/image 1.png`)).toBe(true);

    // The incremented file's property value is rewritten
    const values = [
      getDatabaseEntry(entryStorageEntry1.id).properties.Image,
      getDatabaseEntry(secondEntry.id).properties.Image,
    ];
    expect(values.sort()).toEqual(['image 1.png', 'image.png']);
  });

  it('increments collisions when property dirs collapse to common', async () => {
    // Give the entry a second file property whose file shares the same name,
    // living in a different property directory
    DatabaseEntriesStore.update(propertyStorageEntry1.id, {
      properties: { Image: 'image.png', File: 'image.png' },
    });
    MockFs.addFiles([`${propertyStorageDatabase.path}/File/image.png`]);

    await setDatabasePropertyFileStorage(propertyStorageDatabase.id, 'common');

    const path = propertyStorageDatabase.path;

    // Both files collapse into the common directory, the second incremented
    expect(await Fs.exists(`${path}/Media/image.png`)).toBe(true);
    expect(await Fs.exists(`${path}/Media/image 1.png`)).toBe(true);

    // The first property keeps its name, the second is rewritten
    const entry = getDatabaseEntry(propertyStorageEntry1.id);
    expect(entry.properties.Image).toBe('image.png');
    expect(entry.properties.File).toBe('image 1.png');
  });

  it('increments a property file that collides with the wrapped entry file', async () => {
    const entryTitle = propertyStorageEntry1.title;

    // Give the entry a file property whose file matches the entry's own file name
    DatabaseEntriesStore.update(propertyStorageEntry1.id, {
      properties: { File: `${entryTitle}.md` },
    });
    MockFs.addFiles([`${propertyStorageDatabase.path}/File/${entryTitle}.md`]);

    await setDatabasePropertyFileStorage(propertyStorageDatabase.id, 'entry');

    const path = propertyStorageDatabase.path;

    // The entry file wins its name inside the wrapper directory
    expect(await Fs.exists(`${path}/${entryTitle}/${entryTitle}.md`)).toBe(
      true,
    );
    expect(getDatabaseEntry(propertyStorageEntry1.id).path).toBe(
      `${path}/${entryTitle}/${entryTitle}.md`,
    );

    // The colliding property file is incremented rather than overwriting it
    expect(await Fs.exists(`${path}/${entryTitle}/${entryTitle} 1.md`)).toBe(
      true,
    );
    expect(getDatabaseEntry(propertyStorageEntry1.id).properties.File).toBe(
      `${entryTitle} 1.md`,
    );
  });

  it('rejects an unsafe common directory name', async () => {
    await expect(
      setDatabasePropertyFileStorage(
        commonStorageDatabase.id,
        'common',
        'Foo/Bar',
      ),
    ).rejects.toThrow(InvalidParameterError);

    // The file system is left untouched
    expect(
      await Fs.exists(`${commonStorageDatabase.path}/Media/image.png`),
    ).toBe(true);
  });

  it('skips property files that are missing on disk', async () => {
    // Point an entry's image at a file that does not exist on disk
    DatabaseEntriesStore.update(rootStorageEntry1.id, {
      properties: { Image: 'ghost.png' },
    });

    await expect(
      setDatabasePropertyFileStorage(rootStorageDatabase.id, 'property'),
    ).resolves.toBeDefined();

    // No phantom destination file is created
    expect(await Fs.exists(`${rootStorageDatabase.path}/Image/ghost.png`)).toBe(
      false,
    );
  });

  it('dispatches an update event and persists the config', async () => {
    let dispatchedMode: string | undefined;

    Events.addListener<DatabaseUpdatedEventData>(
      DatabaseUpdatedEvent,
      'test',
      (payload) => {
        dispatchedMode = payload.data.updated.propertyFileStorage;
      },
    );

    await setDatabasePropertyFileStorage(rootStorageDatabase.id, 'common');

    // The event carries the new mode
    expect(dispatchedMode).toBe('common');

    // The persisted config reflects the new mode
    const config = MockFs.readJsonFile<Database>(
      databaseConfigFilePath(rootStorageDatabase.path),
    );
    expect(config.propertyFileStorage).toBe('common');
  });
});
