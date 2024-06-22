import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { DOCUMENTS_TEST_DATA, Documents, DocumentsStore } from '@minddrop/documents';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { moveDocument } from './moveDocument';

const { document1 } = DOCUMENTS_TEST_DATA;

const WORKSPACE_PATH = 'path/to/workspace';
const PATH_TO_MOVE = 'path/to/Document to move.md';
const DOCUMENT_TO_MOVE = { ...document1, path: PATH_TO_MOVE };
const NEW_SUBDOCUMENT_PATH = Fs.concatPath(
  Fs.parentDirPath(Documents.getWrappedPath(document1.path)),
  Fs.fileNameFromPath(PATH_TO_MOVE),
);
const NEW_WORKSPACE_DOCUMENT_PATH = Fs.concatPath(
  WORKSPACE_PATH,
  Fs.fileNameFromPath(PATH_TO_MOVE),
);

const MockFs = initializeMockFileSystem([
  // Documents
  document1.path,
  PATH_TO_MOVE,
  // Workspace
  WORKSPACE_PATH,
]);

describe('moveDocument', () => {
  beforeEach(() => {
    setup();

    // Add test documents to the store
    DocumentsStore.getState().load([document1, DOCUMENT_TO_MOVE]);

    // Reset the mock file system
    MockFs.reset();
  });

  afterEach(() => {
    cleanup();

    // Clear documents store
    DocumentsStore.getState().clear();
  });

  it('wraps the destination document if it is not wrapped', async () => {
    // Move a document into another document which is not wrapped
    await moveDocument(PATH_TO_MOVE, document1.path);

    // Should wrap the destination document
    expect(Documents.get(Documents.getWrappedPath(document1.path))).not.toBeNull();
  });

  it('moves the document', async () => {
    // Move a document into another document which is not wrapped
    await moveDocument(PATH_TO_MOVE, document1.path);

    // Should move the document
    expect(Documents.get(PATH_TO_MOVE)).toBeNull();
    expect(Documents.get(NEW_SUBDOCUMENT_PATH)).not.toBeNull();
  });

  it('supports moving a document into a workspace', async () => {
    // Move a document into a workspace
    await moveDocument(PATH_TO_MOVE, WORKSPACE_PATH);

    // Should move the document
    expect(Documents.get(PATH_TO_MOVE)).toBeNull();
    expect(Documents.get(NEW_WORKSPACE_DOCUMENT_PATH)).not.toBeNull();
  });
});
