import { renderHook } from '@minddrop/test-utils';
import { TypedResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useAllTypedResourceDocuments } from './useAllTypedResourceDocuments';
import { mapById } from '@minddrop/utils';

const store = createResourceStore<TypedResourceDocument>();

// Create a couple of test documents
const document1: TypedResourceDocument = {
  resource: 'tests',
  id: 'doc-1',
  revision: 'rev-1',
  type: 'type-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const document2: TypedResourceDocument = {
  resource: 'tests',
  id: 'doc-2',
  revision: 'rev-1',
  type: 'type-2',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
