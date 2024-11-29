import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  workspaceDir,
  documentFiles,
  documents,
} from '../test-utils';
import { loadDocuments } from './loadDocuments';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';

initializeMockFileSystem([
  // Document files
  ...documentFiles,
  // Image files
  ...documents.map(
    (document) => `${Fs.parentDirPath(document.path)}/image.png`,
  ),
]);

describe('loadDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('ignores invalid sources', async () => {
    // Load documents from an invalid source, should not throw
    expect(loadDocuments(['invalid-source'])).resolves.not.toThrow();
  });

  it('loads documents into the store', async () => {
    // Load documents
    await loadDocuments([workspaceDir]);

    // Documents should be in the store
    documents.forEach((document) => {
      expect(getDocument(document.id)).toEqual(document);
    });
  });

  it('does not load duplicates of documents already in the store', async () => {
    // Load documents twice
    await loadDocuments([workspaceDir]);
    await loadDocuments([workspaceDir]);

    // Store should not contain duplicates
    expect(DocumentsStore.getState().documents.length).toEqual(
      documents.length,
    );
  });

  it('dispatches a `documents:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:load' events
      Events.addListener('documents:load', 'test', (payload) => {
        // Payload data should be the loaded documents
        expect(payload.data).toEqual(documents);
        done();
      });

      // Load documents
      loadDocuments([workspaceDir]);
    }));
});
