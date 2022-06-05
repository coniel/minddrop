import { renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { ResourceDocument } from '../types';
import { createResourceStore } from '../createResourceStore';
import { useResourceDocuments } from './useResourceDocuments';
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

describe('useResourceDocuments', () => {
  it('returns the requested documents', () => {
    // Get a couple of documents
    const { result } = renderHook(() =>
      useResourceDocuments(store, [document1.id, document2.id]),
    );

    // Should return the requested documents
    expect(result.current).toEqual(mapById([document1, document2]));
  });

  it('ignores missing documents', () => {
    // Get a couple of documents, one of which does not exist
    const { result } = renderHook(() =>
      useResourceDocuments(store, [document1.id, 'missing']),
    );

    // Returned map should contain only existing documents
    expect(result.current).toEqual(mapById([document1]));
  });

  it('filters the results', () => {
    // Get a couple of documents, filtering out deleted ones
    const { result } = renderHook(() =>
      useResourceDocuments(store, [document1.id, deletedDocument.id], {
        deleted: false,
      }),
    );

    // Returned map should contain only the active document
    expect(result.current).toEqual(mapById([document1]));
  });
});
