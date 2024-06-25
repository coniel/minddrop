import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  document1,
  wrappedDocument,
  documentTypeConfig,
} from '../test-utils';
import { removeChildDocuments } from './removeChildDocuments';
import { Fs } from '@minddrop/file-system';
import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';

const PARENT_PATH = 'path/to/parent';
const EXT = documentTypeConfig.fileType;

let child1: Document;
let child2: Document;
let child3: Document;

function setupChildDocuments(parentPath: string): void {
  child1 = {
    ...document1,
    path: `${parentPath}/child1.${EXT}`,
  };
  child2 = {
    ...document1,
    path: `${parentPath}/child2/child2.${EXT}`,
  };
  child3 = {
    ...document1,
    path: `${parentPath}/child2/child3.${EXT}`,
  };

  // Add the child documents to the store
  DocumentsStore.getState().load([child1, child2, child3]);
}

describe('removeChildDocuments', () => {
  beforeEach(() => {
    setup();

    // Initialize the child documents
    setupChildDocuments(PARENT_PATH);
  });

  afterEach(cleanup);

  it('recursively removes all child documents of the child documents', () => {
    // Remove all child documents of the parent
    removeChildDocuments(PARENT_PATH);

    // Child documents should no longer exist in the store
    expect(getDocument(child1.path)).toBeNull();
    expect(getDocument(child2.path)).toBeNull();
    // Nested child documents should no longer exist in the store
    expect(getDocument(child3.path)).toBeNull();
  });

  describe('children of wrapped document', () => {
    it('removes all child documents of the wrapped document', () => {
      // Clear the store
      DocumentsStore.getState().clear();
      // Add a wrapped document to the store
      DocumentsStore.getState().add(wrappedDocument);

      // Initialize the child documents to be children of the
      // wrapped document.
      setupChildDocuments(Fs.parentDirPath(wrappedDocument.path));

      // Remove all child documents of the wrapped document
      removeChildDocuments(wrappedDocument.path);

      // Child documents should no longer exist in the store
      expect(getDocument(child1.path)).toBeNull();
      expect(getDocument(child2.path)).toBeNull();
      expect(getDocument(child3.path)).toBeNull();
    });
  });
});
