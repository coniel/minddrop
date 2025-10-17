import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  cleanup,
  filesCollection,
  filesPropertiesDir,
  itemsCollection,
  itemsPropertiesDir,
  setup,
} from '../test-utils';
import { createCollectionEntriesFromDataTransfer } from './createCollectionEntriesFromDataTransfer';

const MockFs = initializeMockFileSystem([
  filesCollection.path,
  filesPropertiesDir,
  itemsCollection.path,
  itemsPropertiesDir,
]);

describe('createCollectionEntryFromDataTransfer', () => {
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

  it('creates file entries from data transfer containing files', async () => {
    const pdfDataTransfer = {
      files: [
        new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' }),
      ],
      types: ['Files'],
    } as unknown as DataTransfer;

    const entries =
      await createCollectionEntriesFromDataTransfer(pdfDataTransfer);

    // Should match the files collection type config which allows PDF files
    expect(entries[0].collectionPath).toBe(filesCollection.path);
  });

  it('creates text entries from data transfer containing text', async () => {
    const textDataTransfer = {
      files: [],
      types: ['text/plain'],
      getData: (type: string) => (type === 'text/plain' ? 'Hello, world!' : ''),
    } as unknown as DataTransfer;

    const entries =
      await createCollectionEntriesFromDataTransfer(textDataTransfer);

    // No entries should be created as there is no text collection type config
    expect(entries[0].collectionPath).toBe(itemsCollection.path);
  });

  it('returns an empty array if no entries could be created', async () => {
    // Data transfer with unsupported file type
    const unsupportedDataTransfer = {
      files: [
        new File(['<svg></svg>'], 'image.svg', { type: 'image/svg+xml' }),
      ],
      types: ['Files'],
    } as unknown as DataTransfer;

    const entries = await createCollectionEntriesFromDataTransfer(
      unsupportedDataTransfer,
    );

    // No entries should be created as there is no matching collection type config
    expect(entries).toHaveLength(0);
  });
});
