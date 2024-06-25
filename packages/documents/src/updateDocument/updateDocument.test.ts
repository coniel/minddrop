import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  document1,
  documentTypeConfig,
  document1Content,
} from '../test-utils';
import { updateDocument } from './updateDocument';
import { DocumentNotFoundError } from '../errors';
import { DocumentsStore } from '../DocumentsStore';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { getDocument } from '../getDocument';

const UPDATE_DATA = {
  properties: { icon: 'new-icon' },
  content: 'new-content',
};

const NO_CONTENT_UPDATE_DATA = {
  properties: { icon: 'new-icon' },
};

const NO_FILE_DOCUMENT = {
  ...document1,
  path: 'no-file',
};

const UPDATED_DOCUMENT = {
  ...document1,
  ...UPDATE_DATA,
  fileTextContent: documentTypeConfig.stringify(
    UPDATE_DATA.properties,
    UPDATE_DATA.content,
  ),
};

const MockFs = initializeMockFileSystem([
  { path: document1.path, textContent: document1.fileTextContent },
]);

describe('updateDocument', () => {
  beforeEach(() => {
    setup();

    // Add a valid test document to the store
    DocumentsStore.getState().add(document1);
    // Add a document with no file to the store
    DocumentsStore.getState().add(NO_FILE_DOCUMENT);
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
      updateDocument(NO_FILE_DOCUMENT.path, UPDATE_DATA),
    ).rejects.toThrow(FileNotFoundError);
  });

  it('updates the document in the store', async () => {
    await updateDocument(document1.path, UPDATE_DATA);

    const updatedDocument = getDocument(document1.path);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('writes the updated document to the file', async () => {
    await updateDocument(document1.path, UPDATE_DATA);

    const fileContent = MockFs.readTextFile(document1.path);

    expect(fileContent).toEqual(UPDATED_DOCUMENT.fileTextContent);
  });

  it('works with updates involving no content on documents with content: null', async () => {
    // Documents which have not been opened have content: null.
    // Updating the non-content values should maintain the document's
    // content in the file as it was.
    await updateDocument(document1.path, NO_CONTENT_UPDATE_DATA);

    const fileContent = MockFs.readTextFile(document1.path);

    expect(fileContent.includes(document1Content)).toBe(true);
  });

  it('returns the updated document', async () => {
    const updatedDocument = await updateDocument(document1.path, UPDATE_DATA);

    expect(updatedDocument).toEqual(UPDATED_DOCUMENT);
  });

  it('dispatches a `documents:document:update` event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:document:update', 'test', (payload) => {
        expect(payload.data).toEqual(UPDATED_DOCUMENT);
        done();
      });

      updateDocument(document1.path, UPDATE_DATA);
    }));
});
