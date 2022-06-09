import { renderHook } from '@minddrop/test-utils';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { useResourceDocument } from './useResourceDocument';

const store = createResourceStore();

// Create a test document
const document = generateResourceDocument('tests:test', {});

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
