import { renderHook } from '@minddrop/test-utils';
import { createResourceStore } from '../createResourceStore';
import { ResourceDocument } from '../types';
import { useResourceDocument } from './useResourceDocument';

const store = createResourceStore();

// Create a test document
const document: ResourceDocument = {
  id: 'document-id',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Add the document to the store
store.set(document);

describe('useResourceDocument', () => {
  it('returns the requested document', () => {
    // Get a document
    const { result } = renderHook(() =>
      useResourceDocument(store, document.id),
    );

    // Should return the document
    expect(result.current).toEqual(document);
  });

  it('returns null if the document does not exist', () => {
    // Get a missing document
    const { result } = renderHook(() => useResourceDocument(store, 'missing'));

    // Should return null
    expect(result.current).toBeNull();
  });
});
