import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import {
  setup,
  cleanup,
  document1,
  wrappedDocument,
  documentFiles,
} from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentParseError } from '../errors';
import { getDocumentFromPath } from './getDocumentFromPath';

const MockFs = initializeMockFileSystem([
  ...documentFiles,
  { path: 'invalid.minddrop', textContent: 'invalid-json' },
]);

describe('getDocumentFromPath', () => {
  beforeEach(() => {
    setup();
    DocumentsStore.getState().clear();
    MockFs.reset();
  });

  afterEach(cleanup);

  it('thows if the document file does not exist', async () => {
    // Get a document from a non-existing path
    const getDocument = getDocumentFromPath('non-existing-path');

    // Should throw an error
    await expect(getDocument).rejects.toThrow(FileNotFoundError);
  });

  it('throws if the document file could not be parsed', async () => {
    // Get a document from a path with invalid JSON
    const getDocument = getDocumentFromPath('invalid.minddrop');

    // Should throw an error
    await expect(getDocument).rejects.toThrow(DocumentParseError);
  });

  it('returns a document object', async () => {
    // Read a dicument from path
    const document = await getDocumentFromPath(document1.path);

    // Should return a document object
    expect(document).toEqual(document1);
  });

  it('marks document as wrapped if it is wrapped', async () => {
    // Get a wrapped document
    const document = await getDocumentFromPath(wrappedDocument.path);

    // Document should be marked as wrapped
    expect(document.wrapped).toBe(true);
  });
});
