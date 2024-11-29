import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import {
  DOCUMENTS_TEST_DATA,
  Documents,
  DocumentsStore,
} from '@minddrop/documents';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { moveDocument } from './moveDocument';

const {
  document1,
  document2,
  childDocument,
  workspaceDir,
  documentFiles,
  documents,
} = DOCUMENTS_TEST_DATA;

const MockFs = initializeMockFileSystem(documentFiles);

describe('moveDocument', () => {
  beforeEach(() => {
    setup();

    // Add test documents to the store
    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    // Clear documents store
    DocumentsStore.getState().clear();

    // Reset the mock file system
    MockFs.reset();
  });

  it('wraps the destination document if it is not wrapped', async () => {
    // Move document1 into document2 which is not wrapped
    await moveDocument(document1.id, document2.path);

    const updatedDocument2 = Documents.get(document2.id);

    expect(Documents.isWrapped(updatedDocument2!.path)).toBeTruthy();
  });

  it('moves the document', async () => {
    // Move document1 into document2 which is not wrapped
    await moveDocument(document1.id, document2.path);

    const updatedDocument1 = Documents.get(document1.id);
    const updatedDocument2 = Documents.get(document2.id);

    // Document1 should path should start with document2 dir path
    expect(updatedDocument1!.path).toContain(
      Fs.parentDirPath(updatedDocument2!.path),
    );
  });

  it('supports moving a document into a workspace', async () => {
    // Move childDocument into workspace
    await moveDocument(childDocument.id, workspaceDir);

    const updatedChildDocument = Documents.get(childDocument.id);

    expect(updatedChildDocument!.path).toBe(
      `${workspaceDir}/${childDocument.title}.minddrop`,
    );
  });
});
