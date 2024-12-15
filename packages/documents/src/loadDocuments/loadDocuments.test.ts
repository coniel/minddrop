import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { Events } from '@minddrop/events';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { getDocument } from '../getDocument';
import {
  cleanup,
  documentBlocks,
  documentFiles,
  documentViews,
  documentViewsObject,
  documents,
  setup,
  workspaceDir,
} from '../test-utils';
import { loadDocuments } from './loadDocuments';

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

  it('loads views itno the store', async () => {
    // Load documents
    await loadDocuments([workspaceDir]);

    // Views should be in the store
    expect(DocumentViewsStore.getState().documents).toEqual(
      documentViewsObject,
    );
  });

  it('loads blocks into the store', async () => {
    // Load documents
    await loadDocuments([workspaceDir]);

    // Blocks should be in the store
    expect(Blocks.getAll()).toEqual(
      documentBlocks.reduce(
        (acc, block) => ({ ...acc, [block.id]: block }),
        {},
      ),
    );
  });

  it('dispatches a `documents:load` event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:load', 'test', (payload) => {
        // Payload data should be the loaded documents
        expect(payload.data).toEqual(documents);
        done();
      });

      // Load documents
      loadDocuments([workspaceDir]);
    }));

  it('dispatches a `documents:views:load` event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:views:load', 'test', (payload) => {
        // Payload data should be the loaded views
        expect(payload.data).toEqual(documentViews);
        done();
      });

      // Load documents
      loadDocuments([workspaceDir]);
    }));
});
