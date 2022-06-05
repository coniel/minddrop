import { renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { ResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useAllResourceDocuments } from './useAllResourceDocuments';
import { generateResourceDocument } from '../generateResourceDocument';

const store = createResourceStore();

// Create a couple of test documents
const document1 = generateResourceDocument('tests:test', {});
const document2 = generateResourceDocument('tests:test', {});
// Create a test deleted document
const deletedDocument: ResourceDocument = {
  ...generateResourceDocument('tests:test', {}),
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
