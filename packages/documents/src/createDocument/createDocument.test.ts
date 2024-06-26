import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  documentTypeConfig,
  configDefaultFileTextContent,
  configDefaultProperties,
} from '../test-utils';
import { createDocument } from './createDocument';
import { Document } from '../types';
import { getDocument } from '../getDocument';

const FILE_TYPE = documentTypeConfig.fileType;
const TITLE = 'Document';
const PARENT_DIR_PATH = 'path/to/Workspace';
const DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${TITLE}.${FILE_TYPE}`;
const WRAPPED_DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${TITLE}/${TITLE}.${FILE_TYPE}`;

const DOCUMENT: Document = {
  title: TITLE,
  fileType: FILE_TYPE,
  path: DOCUMENT_FILE_PATH,
  properties: configDefaultProperties,
  wrapped: false,
  fileTextContent: configDefaultFileTextContent,
  content: documentTypeConfig.initialize(TITLE).content,
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
    await createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE);

    // Should create document markdown file
    expect(MockFs.exists(DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('creates a wrapped document file if requested', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE, { wrap: true });

    // Should create document markdown file
    expect(MockFs.exists(WRAPPED_DOCUMENT_FILE_PATH)).toBeTruthy();
  });

  it('adds the document to the store', async () => {
    // Create a document
    await createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE);

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
      createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE);
    }));

  it('returns the new document', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE);

    // Should return the new document
    expect(document).toEqual(DOCUMENT);
  });

  describe('wrapped', () => {
    it('wraps the document', async () => {
      // Create a wrapped document
      const document = await createDocument(PARENT_DIR_PATH, FILE_TYPE, TITLE, {
        wrap: true,
      });

      // Document should be wrapped
      expect(document.wrapped).toBe(true);
    });
  });
});
