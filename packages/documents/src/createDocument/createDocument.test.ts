import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { createDocument } from './createDocument';
import { Document, SerializableDocumentData } from '../types';
import { getDocument } from '../getDocument';

const TITLE = 'Document';
const PARENT_DIR_PATH = 'path/to/Workspace';
const DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${TITLE}.minddrop`;
const WRAPPED_DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${TITLE}/${TITLE}.minddrop`;

const DOCUMENT: Document = {
  id: expect.any(String),
  created: expect.any(Date),
  lastModified: expect.any(Date),
  path: DOCUMENT_FILE_PATH,
  title: TITLE,
  wrapped: false,
  blocks: [],
  views: [],
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

  it('returns the new document', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH, TITLE);

    // Should return the new document
    expect(document).toEqual(DOCUMENT);
  });

  it('creates the document file', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, TITLE);

    // Should create document markdown file
    expect(MockFs.exists(DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('creates a wrapped document file if requested', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, TITLE, { wrap: true });

    // Should create document markdown file
    expect(MockFs.exists(WRAPPED_DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('serializes the document data to file', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH, TITLE);

    const serializedDocument: SerializableDocumentData = {
      id: document.id,
      created: document.created,
      lastModified: document.lastModified,
      title: document.title,
      blocks: [],
      views: [],
    };

    // Document file should contain serialized data
    expect(MockFs.readTextFile(DOCUMENT_FILE_PATH)).toEqual(
      JSON.stringify(serializedDocument),
    );
  });

  it('adds the document to the store', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH, TITLE);

    // Document should be in the store
    expect(getDocument(document.id)).toEqual(DOCUMENT);
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
      createDocument(PARENT_DIR_PATH, TITLE);
    }));

  describe('wrapped', () => {
    it('wraps the document', async () => {
      // Create a wrapped document
      const document = await createDocument(PARENT_DIR_PATH, TITLE, {
        wrap: true,
      });

      // Document should be wrapped
      expect(document.wrapped).toBe(true);
    });
  });
});
