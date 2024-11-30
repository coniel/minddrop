import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  document1,
  documentFiles,
  document1Data,
  documentViews,
  documentBlocks,
} from '../test-utils';
import { updateDocument } from './updateDocument';
import { DocumentNotFoundError } from '../errors';
import { DocumentsStore } from '../DocumentsStore';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { getDocument } from '../getDocument';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { Blocks } from '@minddrop/blocks';

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

  it('throws an error if the document does not exist', async () => {
    expect(async () =>
      updateDocument('does-not-exist', UPDATE_DATA),
    ).rejects.toThrow(DocumentNotFoundError);
  });

  it('throws an error if the document file does not exist', async () => {
    expect(async () =>
      updateDocument(NO_FILE_DOCUMENT.id, UPDATE_DATA),
    ).rejects.toThrow(FileNotFoundError);
  });

  it('updates the document in the store', async () => {
    await updateDocument(document1.id, UPDATE_DATA);

    const updatedDocument = getDocument(document1.id);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('writes the updated document to the file', async () => {
    await updateDocument(document1.id, UPDATE_DATA, false);

    const fileContent = MockFs.readTextFile(document1.path);

    expect(fileContent).toEqual(
      JSON.stringify({ ...document1Data, ...UPDATE_DATA }),
    );
  });

  it('updates the document lastModified timestamp', async () => {
    const updatedDocument = await updateDocument(document1.id, UPDATE_DATA);

    expect(updatedDocument.lastModified > document1.lastModified).toBeTruthy();
  });

  it('returns the updated document', async () => {
    const updatedDocument = await updateDocument(document1.id, UPDATE_DATA);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('dispatches a `documents:document:update` event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:document:update', 'test', (payload) => {
        expect(payload.data).toEqual(UPDATED_DOCUMENT);
        done();
      });

      updateDocument(document1.id, UPDATE_DATA);
    }));
});
