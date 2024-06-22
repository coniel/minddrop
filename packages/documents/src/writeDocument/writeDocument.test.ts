import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  initializeMockFileSystem,
  FileNotFoundError,
} from '@minddrop/file-system';
import { cleanup, document1, setup } from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { serializeDocumentMetadata, getDocumentMetadata } from '../utils';
import { writeDocument } from './writeDocument';

const DOCUMENT_PATH = document1.path;
const SERIALIZED_METADATA = serializeDocumentMetadata(getDocumentMetadata(document1));
const NEW_DOCUMENT_CONTENT = '# Title\n\nNew content';

const MockFs = initializeMockFileSystem([
  // Document file
  {
    path: DOCUMENT_PATH,
    textContent: `${SERIALIZED_METADATA}# Title\n\nOld content`,
  },
]);

describe('writeDocument', () => {
  beforeEach(() => {
    setup();

    // Load a workspace into the store
    DocumentsStore.getState().add(document1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the document file does not exist', () => {
    // Attempt to write a document missing its file. Should throw
    // a FileNotFoundError.
    expect(() => writeDocument('missing', '')).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('writes the document content to the document file', async () => {
    // Wite the document
    await writeDocument(DOCUMENT_PATH, `${SERIALIZED_METADATA}${NEW_DOCUMENT_CONTENT}`);

    // Should write content to file
    expect(MockFs.readTextFile(DOCUMENT_PATH)).toBe(
      `${SERIALIZED_METADATA}${NEW_DOCUMENT_CONTENT}`,
    );
  });
});
