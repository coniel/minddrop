import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionConfigDirName,
  CollectionPropertiesDirName,
} from '../constants';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
  InvalidCollectionTypeError,
} from '../errors';
import {
  cleanup,
  filesEntry1,
  itemsEntry1,
  linksCollection,
  linksEntry1,
  notesCollection,
  notesEntry1,
  setup,
} from '../test-utils';
import { writeTextCollectionEntry } from './writeTextCollectionEntry';

const notesPropertiesDir = `${notesCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;
const linksPropertiesDir = `${linksCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;

const MockFs = initializeMockFileSystem([
  notesCollection.path,
  notesPropertiesDir,
  linksCollection.path,
  linksPropertiesDir,
]);

describe('createTextCollectionEntry', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    }),
  );

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    await expect(() =>
      writeTextCollectionEntry({
        ...notesEntry1,
        collectionPath: '/non-existent',
      }),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(() => writeTextCollectionEntry(itemsEntry1)).rejects.toThrow(
      CollectionTypeNotRegisteredError,
    );
  });

  it('throws if the collection type is not text', async () => {
    await expect(() => writeTextCollectionEntry(filesEntry1)).rejects.toThrow(
      InvalidCollectionTypeError,
    );
  });

  it('writes a text file in the collection directory', async () => {
    await writeTextCollectionEntry(notesEntry1);

    const expectedPath = `${notesCollection.path}/${notesEntry1.properties.title}.md`;

    expect(MockFs.exists(expectedPath)).toBe(true);
  });
  //
  // it('uses an incrementing number suffix to avoid file name conflicts', async () => {
  //   // Create the first entry
  //   await writeTextCollectionEntry(notesCollection.path, properties);
  //   // Create the second entry with the same title
  //   await writeTextCollectionEntry(notesCollection.path, properties);
  //   // Create the third entry with the same title
  //   await writeTextCollectionEntry(notesCollection.path, properties);
  //
  //   const expectedPath1 = `${notesCollection.path}/Untitled.md`;
  //   const expectedPath2 = `${notesCollection.path}/Untitled 1.md`;
  //   const expectedPath3 = `${notesCollection.path}/Untitled 2.md`;
  //   expect(MockFs.exists(expectedPath1)).toBe(true);
  //   expect(MockFs.exists(expectedPath2)).toBe(true);
  //   expect(MockFs.exists(expectedPath3)).toBe(true);
  // });

  it('writes the provided text content into the text file', async () => {
    await writeTextCollectionEntry(notesEntry1);

    // Markdown collection type returns note content with prepended title
    // as the content.
    const fileContent = MockFs.readTextFile(notesEntry1.path);
    expect(fileContent).toBe(
      `# ${notesEntry1.properties.title}\n\n${notesEntry1.properties.note}`,
    );
  });

  it('writes the provided properties into a properties file', async () => {
    await writeTextCollectionEntry(notesEntry1);

    const expectedPropertiesPath = `${notesPropertiesDir}/${notesEntry1.properties.title}.json`;

    expect(MockFs.exists(expectedPropertiesPath)).toBe(true);

    const fileContent = MockFs.readTextFile(expectedPropertiesPath);

    // Markdown collection removes title and note properties before storing
    // the rest in a properties file.
    const { title, note, ...otherProperties } = notesEntry1.properties;

    expect(fileContent).toEqual(JSON.stringify(otherProperties, null, 2));
  });

  it('does not create a properties file if the entry does not need it', async () => {
    await writeTextCollectionEntry(linksEntry1);

    const expectedPropertiesPath = `${linksPropertiesDir}/Untitled.json`;

    expect(MockFs.exists(expectedPropertiesPath)).toBe(false);
  });
});
