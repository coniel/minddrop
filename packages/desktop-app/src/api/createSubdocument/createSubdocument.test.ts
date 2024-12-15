import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DOCUMENTS_TEST_DATA,
  Documents,
  DocumentsStore,
} from '@minddrop/documents';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { cleanup, setup } from '../../test-utils';
import { createSubdocument } from './createSubdocument';

const { documentFiles, documents, document1, wrappedDocument } =
  DOCUMENTS_TEST_DATA;
const NEW_FILE_NAME = `${i18n.t('documents.untitled')}.minddrop`;

const MockFs = initializeMockFileSystem(documentFiles);

describe('createSubdocument', () => {
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

  it('wraps parent document if it is not already wrapped', async () => {
    // Create a document as a child of document1 which is not wrapped
    await createSubdocument(document1.id);

    const updatedDocument1 = Documents.get(document1.id);

    // Parent document should be wrapped
    expect(Documents.isWrapped(updatedDocument1!.path)).toBeTruthy();
  });

  it('adds new document to parent wrapper dir if parent document is wrapped', async () => {
    // Create a document as a child of wrappedDocument
    const document = await createSubdocument(wrappedDocument.id);

    expect(document.path).toContain(Fs.parentDirPath(wrappedDocument.path));
  });

  it('creates new untitled document file', async () => {
    // Create a subdocument
    await createSubdocument(document1.id);

    const updatedDocument1 = Documents.get(document1.id);

    const newDocumentPath = Fs.concatPath(
      Fs.parentDirPath(updatedDocument1!.path),
      NEW_FILE_NAME,
    );

    // Should create new Untitled.minddrop file
    expect(MockFs.exists(newDocumentPath)).toBeTruthy();
  });

  it('creates the new document', async () => {
    // Create a subdocument
    const result = await createSubdocument(document1.id);

    const document = Documents.get(result.id);

    expect(document).toEqual(result);
  });
});
