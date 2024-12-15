import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { cleanup, document1, setup } from '../test-utils';
import { getDocumentByPath } from './getDocumentByPath';

describe('getDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested document if it exists', () => {
    // Add a document to the store
    DocumentsStore.getState().add(document1);

    // Should return document from the store
    expect(getDocumentByPath(document1.path)).toEqual(document1);
  });

  it('returns null if the document does not exist', () => {
    // Get a missing document, should return null
    expect(getDocumentByPath('foo')).toBeNull();
  });
});
