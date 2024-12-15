import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import {
  cleanup,
  document1,
  documentBlocks,
  documentFiles,
  documentViews,
  setup,
} from '../test-utils';
import { updateDocument } from './updateDocument';

const UPDATE_DATA = {
  icon: 'new-icon',
};

const NO_FILE_DOCUMENT = {
  ...document1,
  id: 'no-file',
  path: 'no-file',
};

const UPDATED_DOCUMENT = {
  ...document1,
  icon: 'new-icon',
  lastModified: expect.any(Date),
};

const MockFs = initializeMockFileSystem(documentFiles);

describe('updateDocument', () => {
  beforeEach(() => {
    setup();

    // Add a valid test document to the store
    DocumentsStore.getState().add(document1);
    // Add a document with no file to the store
    DocumentsStore.getState().add(NO_FILE_DOCUMENT);

    // Add document views and blocks to the store
    DocumentViewsStore.getState().load(documentViews);
    Blocks.load(documentBlocks);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws an error if the document does not exist', () => {
    expect(() => updateDocument('does-not-exist', UPDATE_DATA)).toThrow(
      DocumentNotFoundError,
    );
  });

  it('updates the document in the store', () => {
    updateDocument(document1.id, UPDATE_DATA);

    const updatedDocument = getDocument(document1.id);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('updates the document lastModified timestamp', () => {
    const updatedDocument = updateDocument(document1.id, UPDATE_DATA);

    expect(updatedDocument.lastModified > document1.lastModified).toBeTruthy();
  });

  it('returns the updated document', () => {
    const updatedDocument = updateDocument(document1.id, UPDATE_DATA);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('dispatches a `documents:document:update` event', () =>
    new Promise<void>((done) => {
      Events.addListener('documents:document:update', 'test', (payload) => {
        expect(payload.data).toEqual(UPDATED_DOCUMENT);
        done();
      });

      updateDocument(document1.id, UPDATE_DATA);
    }));
});
