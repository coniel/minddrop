import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentParseError } from '../errors';
import {
  cleanup,
  document1,
  document1Blocks,
  document1Views,
  documentFiles,
  setup,
  wrappedDocument,
} from '../test-utils';
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
    const { document } = await getDocumentFromPath(document1.path);

    // Should return a document object
    expect(document).toEqual(document1);
  });

  it('marks document as wrapped if it is wrapped', async () => {
    // Get a wrapped document
    const { document } = await getDocumentFromPath(wrappedDocument.path);

    // Document should be marked as wrapped
    expect(document.wrapped).toBe(true);
  });

  it('returns the document views', async () => {
    // Read a document from path
    const { views } = await getDocumentFromPath(document1.path);

    // Should return the document's views
    expect(views).toEqual(document1Views);
  });

  it('returns the document blocks', async () => {
    // Read a document from path
    const { blocks } = await getDocumentFromPath(document1.path);

    // Should return the document's blocks
    expect(blocks).toEqual(document1Blocks);
  });

  it('handles invalid date strings', async () => {
    // Replace date strings with invalid date strings in the document file
    MockFs.writeTextFile(
      document1.path,
      JSON.stringify({
        ...document1,
        created: 'invalid-date',
        lastModified: 'invalid-date',
        blocks: document1Blocks,
      }),
    );

    // Get a document with invalid date strings
    const { document } = await getDocumentFromPath(document1.path);

    // Document dates should be valid
    expect(document.created).toBeInstanceOf(Date);
    expect(document.lastModified).toBeInstanceOf(Date);
    expect(document.created.getTime()).not.toBeNaN();
    expect(document.lastModified.getTime()).not.toBeNaN();
  });
});
