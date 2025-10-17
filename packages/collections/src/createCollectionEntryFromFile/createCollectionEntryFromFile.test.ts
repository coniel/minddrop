import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionPropertiesDirPath } from '../constants';
import {
  cleanup,
  fileCollectionTypeConfig,
  filesCollection,
  filesPropertiesDir,
  setup,
} from '../test-utils';
import { createCollectionEntryFromFile } from './createCollectionEntryFromFile';

const MockFs = initializeMockFileSystem([
  filesCollection.path,
  filesPropertiesDir,
]);

describe('createCollectionEntryFromFile', () => {
  beforeEach(() => {
    setup({
      loadCollectionTypeConfigs: true,
      loadCollections: true,
    });
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('creates a collection entry from a file', async () => {
    const file = new File(['%PDF-1.4'], 'document.pdf', {
      type: 'application/pdf',
    });

    const entry = await createCollectionEntryFromFile(file);

    // The files collection type config matches PDF files
    expect(entry?.collectionPath).toBe(filesCollection.path);
  });

  it('matches generic file collection type configs', async () => {
    // Add a generic file collection type config without specific file extensions
    const genericFileCollectionTypeConfig = {
      ...fileCollectionTypeConfig,
      id: 'generic-files',
    };
    delete genericFileCollectionTypeConfig.fileExtensions;
    CollectionTypeConfigsStore.add(genericFileCollectionTypeConfig);

    // Add a collection using the generic file collection type config
    const genericFilesCollection = {
      ...filesCollection,
      path: 'collections/generic-files',
      type: genericFileCollectionTypeConfig.id,
    };
    CollectionsStore.getState().add(genericFilesCollection);

    // Add the collection directory to the mock file system
    MockFs.addFiles([
      genericFilesCollection.path,
      `${genericFilesCollection.path}/${CollectionPropertiesDirPath}`,
    ]);

    const textFile = new File(['Hello, world!'], 'document.txt', {
      type: 'text/plain',
    });

    const entry = await createCollectionEntryFromFile(textFile);

    // The generic file collection type config should match any file
    expect(entry?.collectionPath).toBe(genericFilesCollection.path);
  });

  it('returns null if no matching collection is found', async () => {
    const imageFile = new File(['\x89PNG\r\n\x1a\n'], 'image.png', {
      type: 'image/png',
    });

    const entry = await createCollectionEntryFromFile(imageFile);

    // No collection type config matches PNG files
    expect(entry).toBeNull();
  });
});
