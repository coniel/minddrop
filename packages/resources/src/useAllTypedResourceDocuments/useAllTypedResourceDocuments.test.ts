import { renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { TypedResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useAllTypedResourceDocuments } from './useAllTypedResourceDocuments';
import { generateResourceDocument } from '../generateResourceDocument';

const store = createResourceStore<TypedResourceDocument>();

// Create a couple of test documents
const document1 = generateResourceDocument('tests:test', { type: 'type-1' });
const document2 = generateResourceDocument('tests:test', { type: 'type-2' });

// Load the documents into the store
store.load([document1, document2]);

describe('useAllTypedResourceDocuments', () => {
  it('returns the requested documents', () => {
    // Get all documents
    const { result } = renderHook(() => useAllTypedResourceDocuments(store));

    // Should return all documents
    expect(result.current).toEqual(mapById([document1, document2]));
  });

  it('filters the results', () => {
    // Get all documents, filtering for 'type-1'
    const { result } = renderHook(() =>
      useAllTypedResourceDocuments(store, {
        type: ['type-1'],
      }),
    );

    // Returned map should contain only 'type-1' documents
    expect(result.current).toEqual(mapById([document1]));
  });
});
