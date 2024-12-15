import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import {
  childDocument,
  cleanup,
  grandChildDocument,
  setup,
  wrappedChildDocument,
  wrappedDocument,
} from '../test-utils';
import { removeChildDocuments } from './removeChildDocuments';

describe('removeChildDocuments', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load([
      wrappedDocument,
      // Children of wrappedDocument
      childDocument,
      wrappedChildDocument,
      // Child of wrappedChildDocument
      grandChildDocument,
    ]);
  });

  afterEach(cleanup);

  it('recursively removes all child documents', () => {
    // Remove all child documents of the parent
    removeChildDocuments(wrappedDocument.path);

    // Child documents should no longer exist in the store
    expect(getDocument(childDocument.id)).toBeNull();
    expect(getDocument(wrappedChildDocument.id)).toBeNull();
    // Nested child documents should no longer exist in the store
    expect(getDocument(grandChildDocument.id)).toBeNull();
  });
});
