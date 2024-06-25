import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import {
  childDocument,
  cleanup,
  document1,
  document1Content,
  documentTypeConfig,
  documents,
  setup,
  wrappedDocument,
} from '../test-utils';
import { renameDocument } from './renameDocument';
import { registerDocumentTypeConfig } from '../DocumentTypeConfigsStore';
import { DocumentProperties, DocumentTypeConfig } from '../types';

const DOCUMENT_PATH = document1.path;
const FILE_TYPE = document1.fileType;
const NEW_DOCUMENT_NAME = 'new-name';
const NEW_DOCUMENT_PATH = `${Fs.parentDirPath(
  DOCUMENT_PATH,
)}/${NEW_DOCUMENT_NAME}.${FILE_TYPE}`;
const NEW_DOCUMENT_CONTENT = `${NEW_DOCUMENT_NAME}\n\n${document1Content}`;
const NEW_DOCUMENT_PROPERTIES = { ...document1.properties, renamed: true };
const NEW_DOCUMENT_FILE_TEXT_CONTENT = JSON.stringify({
  properties: NEW_DOCUMENT_PROPERTIES,
  content: NEW_DOCUMENT_CONTENT,
});
const WRAPPED_DOCUMENT_PATH = wrappedDocument.path;
const WRAPPED_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.pathSlice(WRAPPED_DOCUMENT_PATH, 0, -2),
  NEW_DOCUMENT_NAME,
  `${NEW_DOCUMENT_NAME}.${FILE_TYPE}`,
);
const CHILD_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_DOCUMENT_NEW_PATH),
  Fs.fileNameFromPath(childDocument.path),
);

const customDocumentTypeConfig: DocumentTypeConfig<
  string,
  { renamed: boolean }
> = {
  ...documentTypeConfig,
  // Add new name to content and set renamed to true
  // when renaming a document
  onRename: (newName, document) => ({
    content: `${newName}\n\n${JSON.parse(document.fileTextContent).content}`,
    properties: { renamed: true },
  }),
  initialize: () => ({ content: '', properties: { renamed: false } }),
  parseProperties: (textContent) =>
    JSON.parse(textContent) as DocumentProperties<{ renamed: boolean }>,
  parseContent: (textContent) => JSON.parse(textContent).content as string,
  component: () => null,
};

const MockFs = initializeMockFileSystem([
  // The document files
  { path: DOCUMENT_PATH, textContent: document1.fileTextContent },
  WRAPPED_DOCUMENT_PATH,
]);

describe('renameDocument', () => {
  beforeEach(() => {
    setup();
    registerDocumentTypeConfig(customDocumentTypeConfig);

    // Add test documents to store
    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    // Attempt to rename a document that does not exist. Should throw
    // a DocumentNotFoundError.
    expect(() => renameDocument('does-not-exist', 'new-name')).rejects.toThrow(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Remove the document file
    MockFs.removeFile(DOCUMENT_PATH);

    // Attempt to rename the document. Should throw a FileNotFoundError.
    expect(() => renameDocument(DOCUMENT_PATH, 'new-name')).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if a document with the same name already exists', () => {
    // Attempt to rename the document to the same name. Should throw
    // a PathConflictError.
    expect(() =>
      renameDocument(DOCUMENT_PATH, document1.title),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the document file', async () => {
    // Rename the document
    await renameDocument(DOCUMENT_PATH, 'new-name');

    // Old path should not exist
    expect(MockFs.exists(DOCUMENT_PATH)).toBe(false);
    // New path should exist
    expect(
      MockFs.exists(`${Fs.parentDirPath(DOCUMENT_PATH)}/new-name.${FILE_TYPE}`),
    ).toBe(true);
  });

  it('updates the document in the store', async () => {
    // Rename the document
    await renameDocument(DOCUMENT_PATH, 'new-name');

    // Old path should not exist in the store
    expect(getDocument(DOCUMENT_PATH)).toBeNull();

    // Get the updated document
    const document = getDocument(NEW_DOCUMENT_PATH)!;

    // Title, content, properties, and fileTextContent should be updated
    expect(document.title).toBe(NEW_DOCUMENT_NAME);
    expect(document.content).toBe(NEW_DOCUMENT_CONTENT);
    expect(document.properties).toEqual(NEW_DOCUMENT_PROPERTIES);
    expect(document.fileTextContent).toBe(NEW_DOCUMENT_FILE_TEXT_CONTENT);
  });

  it('presists the data changes to the document file', async () => {
    // Rename the document
    await renameDocument(DOCUMENT_PATH, 'new-name');

    // Get the updated document file text content
    const fileTextContent = MockFs.readTextFile(NEW_DOCUMENT_PATH);

    // The file text content should be updated
    expect(fileTextContent).toBe(NEW_DOCUMENT_FILE_TEXT_CONTENT);
  });

  it('dispatches a "documents:document:rename" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:rename' events
      Events.addListener('documents:document:rename', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: DOCUMENT_PATH,
          newPath: NEW_DOCUMENT_PATH,
        });
        done();
      });

      // Rename a document
      renameDocument(DOCUMENT_PATH, NEW_DOCUMENT_NAME);
    }));

  it('returns the updated document', async () => {
    // Rename the document
    const updatedDocument = await renameDocument(
      DOCUMENT_PATH,
      NEW_DOCUMENT_NAME,
    );

    // Path, title, and markdown heading should be updated
    expect(updatedDocument.path).toBe(NEW_DOCUMENT_PATH);
    expect(updatedDocument.title).toBe(NEW_DOCUMENT_NAME);
  });

  describe('wrapped document', () => {
    it('renames the wrapping dir', async () => {
      // Rename a wrapped document
      const renamed = await renameDocument(
        WRAPPED_DOCUMENT_PATH,
        NEW_DOCUMENT_NAME,
      );

      // It should rename the wrapping dir as well as the document file
      expect(MockFs.exists(WRAPPED_DOCUMENT_NEW_PATH)).toBe(true);
      // It should update the document's path including the wrapping dir
      expect(renamed.path).toBe(WRAPPED_DOCUMENT_NEW_PATH);
    });

    it('recursively updates child document paths', async () => {
      // Rename a wrapped document
      await renameDocument(WRAPPED_DOCUMENT_PATH, NEW_DOCUMENT_NAME);

      // Child document should have new path in the store
      expect(getDocument(CHILD_DOCUMENT_NEW_PATH)).not.toBeNull();
    });
  });
});
