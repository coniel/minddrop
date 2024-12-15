import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { cleanup, document1, setup } from '../test-utils';
import { getDocument } from './getDocument';

describe('getDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested document if it exists', () => {
    // Add a document to the store
    DocumentsStore.getState().add(document1);

    // Should return document from the store
    expect(getDocument(document1.id)).toEqual(document1);
  });

  it('returns null if the document does not exist', () => {
    // Get a missing document, should return null
    expect(getDocument('foo')).toBeNull();
  });
});
