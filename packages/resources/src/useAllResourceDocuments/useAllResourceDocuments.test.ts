import { renderHook } from '@minddrop/test-utils';
import { ResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useAllResourceDocuments } from './useAllResourceDocuments';
import { mapById } from '@minddrop/utils';

const store = createResourceStore();

// Create a couple of test documents
const document1: ResourceDocument = {
  id: 'doc-1',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const document2: ResourceDocument = {
  id: 'doc-2',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
// Create a test deleted document
const deletedDocument: ResourceDocument = {
  id: 'doc-3',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: true,
  deletedAt: new Date(),
};

// Load the documents into the store
store.load([document1, document2, deletedDocument]);

describe('useAllResourceDocuments', () => {
  it('returns the requested documents', () => {
    // Get all documents
    const { result } = renderHook(() => useAllResourceDocuments(store));

    // Should return all documents
    expect(result.current).toEqual(
      mapById([document1, document2, deletedDocument]),
    );
  });

  it('filters the results', () => {
    // Get all documents, filtering out deleted ones
    const { result } = renderHook(() =>
      useAllResourceDocuments(store, {
        deleted: false,
      }),
    );

    // Returned map should contain only the active documents
    expect(result.current).toEqual(mapById([document1, document2]));
  });
});
