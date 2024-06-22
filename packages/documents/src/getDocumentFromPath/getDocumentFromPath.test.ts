import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Icons, UserIconType } from '@minddrop/icons';
import { setup, cleanup, document1, document1FileContent } from '../test-utils';
import { getDocumentFromPath } from './getDocumentFromPath';
import { Document } from '../types';
import { DefaultDocumentIconString } from '../constants';

const DOCUMENT_TITLE = 'Document';
const DOCUMENT_FILE_PATH = `path/to/${DOCUMENT_TITLE}.md`;
const WRAPPED_DOCUMENT_FILE_PATH = `path/to/${DOCUMENT_TITLE}/${DOCUMENT_TITLE}.md`;
const ICON = Icons.stringify({
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
});

const MockFs = initializeMockFileSystem([
  // Document file
  DOCUMENT_FILE_PATH,
  // Wrapped document file
  WRAPPED_DOCUMENT_FILE_PATH,
  // Document file with content
  {
    path: document1.path,
    textContent: document1FileContent,
  },
]);

describe('getDocumentFromPath', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('returns default document data if document has no metadata', async () => {
    // Get a document with no metadata
    const document = await getDocumentFromPath(DOCUMENT_FILE_PATH);

    // Should return a document with default data
    expect(document).toEqual<Document>({
      title: DOCUMENT_TITLE,
      path: DOCUMENT_FILE_PATH,
      wrapped: false,
      icon: DefaultDocumentIconString,
      fileTextContent: '',
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
    const document = await getDocumentFromPath(WRAPPED_DOCUMENT_FILE_PATH);

    // Document should be marked as wrapped
    expect(document.wrapped).toBe(true);
  });

  describe('with icon', () => {
    it('gets document icon from document metadata', async () => {
      // Add a document with metadata
      MockFs.setFiles([
        {
          path: DOCUMENT_FILE_PATH,
          textContent: `---\nicon: ${ICON}\n---`,
        },
      ]);

      // Get a document with a content-icon
      const document = await getDocumentFromPath(DOCUMENT_FILE_PATH);

      // Document should have the icon specified in the metadata
      expect(document.icon).toEqual(ICON);
    });
  });
});
