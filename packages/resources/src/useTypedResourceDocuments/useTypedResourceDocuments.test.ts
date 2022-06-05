import { renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { TypedResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useTypedResourceDocuments } from './useTypedResourceDocuments';
import { generateResourceDocument } from '../generateResourceDocument';

const store = createResourceStore<TypedResourceDocument>();

// Create a couple of test documents
const document1 = generateResourceDocument('tests:test', { type: 'type-1' });
const document2 = generateResourceDocument('tests:test', { type: 'type-2' });

// Load the documents into the store
store.load([document1, document2]);

describe('useTypedResourceDocuments', () => {
  it('returns the requested documents', () => {
    // Get a couple of documents
    const { result } = renderHook(() =>
      useTypedResourceDocuments(store, [document1.id, document2.id]),
    );

    // Should return the requested documents
    expect(result.current).toEqual(mapById([document1, document2]));
  });

  it('ignores missing documents', () => {
    // Get a couple of documents, one of which does not exist
    const { result } = renderHook(() =>
      useTypedResourceDocuments(store, [document1.id, 'missing']),
    );

    // Returned map should contain only existing documents
    expect(result.current).toEqual(mapById([document1]));
  });

  it('filters the results', () => {
    // Get a couple of documents with filtering for 'type-1' documents
    const { result } = renderHook(() =>
      useTypedResourceDocuments(store, [document1.id, document2.id], {
        type: ['type-1'],
      }),
    );

    // Returned map should contain only the active document
    expect(result.current).toEqual(mapById([document1]));
  });
});
