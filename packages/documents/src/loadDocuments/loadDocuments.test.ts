import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  document1,
  wrappedDocument,
  childDocument,
  parentDir,
} from '../test-utils';
import { loadDocuments } from './loadDocuments';
import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';

const SOURCE_DIR = parentDir;
const DOCUMENTS: Document[] = [document1, wrappedDocument, childDocument];

initializeMockFileSystem([
  // Document files
  ...DOCUMENTS.map((document) => ({
    path: document.path,
    textContent: document.fileTextContent,
  })),
  // Image files
  ...DOCUMENTS.map(
    (document) => `${Fs.parentDirPath(document.path)}/image.png`,
  ),
]);

describe('loadDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads documents into the store', async () => {
    // Load documents
    await loadDocuments([SOURCE_DIR]);

    // Documents should be in the store
    expect(DocumentsStore.getState().documents).toEqual(DOCUMENTS);
  });

  it('does not load duplicates of documents already in the store', async () => {
    // Load documents twice
    await loadDocuments([SOURCE_DIR]);
    await loadDocuments([SOURCE_DIR]);

    // Store should not contain duplicates
    expect(DocumentsStore.getState().documents).toEqual(DOCUMENTS);
  });

  it('dispatches a `documents:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:load' events
      Events.addListener('documents:load', 'test', (payload) => {
        // Payload data should be the loaded documents
        expect(payload.data).toEqual(DOCUMENTS);
        done();
      });

      // Load documents
      loadDocuments([SOURCE_DIR]);
    }));
});
