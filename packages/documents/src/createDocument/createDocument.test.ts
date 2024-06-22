import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { createDocument } from './createDocument';
import { Document } from '../types';
import { DefaultDocumentIcon } from '../constants';
import { getDocument } from '../getDocument';

const DOCUMENT_TITLE = 'Document';
const PARENT_DIR_PATH = 'path/to/Workspace';
const DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${DOCUMENT_TITLE}.md`;
const WRAPPED_DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${DOCUMENT_TITLE}/${DOCUMENT_TITLE}.md`;

const DOCUMENT: Document = {
  title: DOCUMENT_TITLE,
  path: DOCUMENT_FILE_PATH,
  icon: DefaultDocumentIcon,
  wrapped: false,
  contentRaw: '',
  contentParsed: null,
};

const MockFs = initializeMockFileSystem([
  // New document's parent dir
  PARENT_DIR_PATH,
]);

describe('createDocument', () => {
  beforeEach(() => {
    setup();

    MockFs.reset();
  });

  afterEach(cleanup);

  it('creates the document file', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE);

    // Should create document markdown file
    expect(MockFs.exists(DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('creates a wrapped document file if requested', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE, { wrap: true });

    // Should create document markdown file
    expect(MockFs.exists(WRAPPED_DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('adds the document to the store', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE);

    // Document should be in the store
    expect(getDocument(DOCUMENT_FILE_PATH)).toEqual(DOCUMENT);
  });

  it('dispatches a `documents:document:create` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:create' events
      Events.addListener('documents:document:create', 'test', (payload) => {
        // Payload data should be the document
        expect(payload.data).toEqual(DOCUMENT);
        done();
      });

      // Create a document
      createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE);
    }));

  it('returns the new document', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE);

    // Should return the new document
    expect(document).toEqual(DOCUMENT);
  });

  describe('wrapped', () => {
    it('wraps the document', async () => {
      // Create a wrapped document
      const document = await createDocument(PARENT_DIR_PATH, DOCUMENT_TITLE, {
        wrap: true,
      });

      // Document should be wrapped
      expect(document.wrapped).toBe(true);
    });
  });
});
