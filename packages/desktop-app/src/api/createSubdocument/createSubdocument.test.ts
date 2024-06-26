import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem, Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup } from '../../test-utils';
import { createSubdocument } from './createSubdocument';
import { Documents } from '@minddrop/documents';

const PARENT_DOCUMENT_PATH = 'path/to/Document.test';
const WRAPPRED_PARENT_DOCUMENT_PATH = 'path/to/Document/Document.test';
const UNTITLED_MD = `${i18n.t('documents.untitled')}.test`;
const SUBDOCUMENT_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPRED_PARENT_DOCUMENT_PATH),
  UNTITLED_MD,
);

const MockFs = initializeMockFileSystem([
  // Parent document
  PARENT_DOCUMENT_PATH,
]);

describe('createSubdocument', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Reset mock file system
    MockFs.reset();
  });

  it('wraps parent document if it is not already wrapped', async () => {
    // Create a document as a child of another document that is not wrapped
    await createSubdocument(PARENT_DOCUMENT_PATH, 'test');

    // Parent document should be wrapped
    expect(MockFs.exists(WRAPPRED_PARENT_DOCUMENT_PATH)).toBeTruthy();
    expect(MockFs.exists(PARENT_DOCUMENT_PATH)).toBeFalsy();
  });

  it('creates new untitled document', async () => {
    // Create a subdocument
    await createSubdocument(PARENT_DOCUMENT_PATH, 'test');

    // Should create new untitled document
    expect(MockFs.exists(SUBDOCUMENT_PATH)).toBeTruthy();
  });

  it('returns the new document', async () => {
    // Create a subdocument
    const document = await createSubdocument(PARENT_DOCUMENT_PATH, 'test');

    // Should create new untitled document
    expect(document).toEqual(Documents.get(SUBDOCUMENT_PATH));
  });
});
