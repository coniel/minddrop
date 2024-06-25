import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  setup,
  cleanup,
  document1,
  documentTypeConfig,
  wrappedDocument,
  childDocument,
} from '../test-utils';
import { getDocumentFromPath } from './getDocumentFromPath';
import { Document } from '../types';
import { DefaultDocumentIconString } from '../constants';
import { DocumentsStore } from '../DocumentsStore';

const emptyDocumentContent = '{"properties":{},"content":{}}';

const MockFs = initializeMockFileSystem([
  // Document file
  { path: childDocument.path, textContent: emptyDocumentContent },
  // Wrapped document file
  { path: wrappedDocument.path, textContent: wrappedDocument.fileTextContent },
  // Document file with content
  {
    path: document1.path,
    textContent: document1.fileTextContent,
  },
]);

describe('getDocumentFromPath', () => {
  beforeEach(() => {
    setup();
    DocumentsStore.getState().clear();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('returns default document data if document has no metadata', async () => {
    // Get a document with no metadata
    const document = await getDocumentFromPath(childDocument.path);

    // Should return a document with default data
    expect(document).toEqual<Document>({
      title: childDocument.title,
      fileType: documentTypeConfig.fileType,
      path: childDocument.path,
      wrapped: false,
      properties: {
        icon: DefaultDocumentIconString,
      },
      fileTextContent: emptyDocumentContent,
      content: null,
    });
  });

  it('returns ', async () => {
    // Get a document with content
    const document = await getDocumentFromPath(document1.path);

    // Should set contentRaw to the document markdown content
    expect(document.fileTextContent).toBe(document1.fileTextContent);
  });

  it('marks document as wrapped if it is wrapped', async () => {
    // Get a wrapped document
    const document = await getDocumentFromPath(wrappedDocument.path);

    // Document should be marked as wrapped
    expect(document.wrapped).toBe(true);
  });

  describe('with custom properties', () => {
    it('parses custom properties', async () => {
      // Get a document with custom properties
      const document = await getDocumentFromPath(document1.path);

      // Should parse the custom properties
      expect(document.properties).toEqual(document1.properties);
    });
  });
});
