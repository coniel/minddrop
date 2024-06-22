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
  document1FileContent,
  documents,
  setup,
  wrappedDocument,
} from '../test-utils';
import { renameDocument } from './renameDocument';

const DOCUMENT_PATH = document1.path;
const NEW_DOCUMENT_NAME = 'new-name';
const NEW_DOCUMENT_PATH = `${Fs.parentDirPath(
  DOCUMENT_PATH,
)}/${NEW_DOCUMENT_NAME}.md`;
const WRAPPED_DOCUMENT_PATH = wrappedDocument.path;
const WRAPPED_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.pathSlice(WRAPPED_DOCUMENT_PATH, 0, -2),
  NEW_DOCUMENT_NAME,
  `${NEW_DOCUMENT_NAME}.md`,
);
const CHILD_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_DOCUMENT_NEW_PATH),
  Fs.fileNameFromPath(childDocument.path),
);

const MockFs = initializeMockFileSystem([
  // The document files
  { path: DOCUMENT_PATH, textContent: document1FileContent },
  WRAPPED_DOCUMENT_PATH,
]);

describe('renameDocument', () => {
  beforeEach(() => {
    setup();

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
      MockFs.exists(`${Fs.parentDirPath(DOCUMENT_PATH)}/new-name.md`),
    ).toBe(true);
  });

  it('updates the markdown heading', async () => {
    // Rename the document
    await renameDocument(DOCUMENT_PATH, 'New name');

    // The markdown content should be updated with the new heading
    const content = MockFs.readTextFile(
      `${Fs.parentDirPath(DOCUMENT_PATH)}/New name.md`,
    );

    expect(content).toContain('# New name');
  });

  it('updates the document in the store', async () => {
    // Rename the document
    await renameDocument(DOCUMENT_PATH, 'new-name');

    // Old path should not exist in the store
    expect(getDocument(DOCUMENT_PATH)).toBeNull();

    // New path should exist in the store and have
    // the new path and title.
    expect(getDocument(NEW_DOCUMENT_PATH)?.path).toBe(NEW_DOCUMENT_PATH);
    expect(getDocument(NEW_DOCUMENT_PATH)?.title).toBe(NEW_DOCUMENT_NAME);
    // The document heading should be updated
    expect(getDocument(NEW_DOCUMENT_PATH)?.fileTextContent).toContain(
      `# ${NEW_DOCUMENT_NAME}`,
    );
  });

  it('dispatches a "documents:document:renamed" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:renamed' events
      Events.addListener('documents:document:renamed', 'test', (payload) => {
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
    expect(updatedDocument.fileTextContent).toContain(`# ${NEW_DOCUMENT_NAME}`);
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
