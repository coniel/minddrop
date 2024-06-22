import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { UserIconContentIcon, UserIconType } from '@minddrop/icons';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { loadDocuments } from './loadDocuments';
import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';

const DOCUMENT_ICON: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

const SOURCE_DIRS = ['path/to/documents/1', 'path/to/document/2'];
const DOCUMENTS: Document[] = SOURCE_DIRS.flatMap<Document>((dirPath) => [
  {
    title: 'Document 1',
    path: `${dirPath}/Document 1.md`,
    icon: DOCUMENT_ICON,
    wrapped: false,
    contentRaw: '',
    contentParsed: null,
  },
  {
    title: 'Document 2',
    path: `${dirPath}/Document 2/Document 2.md`,
    icon: DOCUMENT_ICON,
    wrapped: true,
    contentRaw: '',
    contentParsed: null,
  },
  {
    title: 'Document 3',
    path: `${dirPath}/subdir/Document 3.md`,
    icon: DOCUMENT_ICON,
    wrapped: false,
    contentRaw: '',
    contentParsed: null,
  },
]);

initializeMockFileSystem([
  // Document files
  ...DOCUMENTS.map((document) => ({
    path: document.path,
    textContent: '---\nicon: "content-icon:cat:cyan"\n---',
  })),
  // Image files
  ...SOURCE_DIRS.map((dir) => `${dir}/image.png`),
]);

describe('loadDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads documents into the store', async () => {
    // Load documents
    await loadDocuments(SOURCE_DIRS);

    // Documents should be in the store
    expect(DocumentsStore.getState().documents).toEqual(DOCUMENTS);
  });

  it('does not load duplicates of documents already in the store', async () => {
    // Load documents twice
    await loadDocuments(SOURCE_DIRS);
    await loadDocuments(SOURCE_DIRS);

    // Store should not contain duplicates
    expect(DocumentsStore.getState().documents).toEqual(DOCUMENTS);
  });

  it('dispatches a `documents:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:load' events
      Events.addListener('documents:load', 'test', (payload) => {
        // Payload data should be the loaded documents
        expect(payload.data).toEqual(DOCUMENTS);
        done();
      });

      // Load documents
      loadDocuments(SOURCE_DIRS);
    }));
});
