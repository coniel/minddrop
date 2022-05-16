import { renderHook } from '@minddrop/test-utils';
import { createResourceStore } from '../createResourceStore';
import { TypedResourceDocument } from '../types';
import { useTypedResourceDocument } from './useTypedResourceDocument';

interface BaseData {
  foo: string;
}

interface TypeData {
  bar: string;
}

const store = createResourceStore<TypedResourceDocument<BaseData, TypeData>>();

// Create a test document
const document: TypedResourceDocument<BaseData, TypeData> = {
  id: 'document-id',
  revision: 'rev-1',
  type: 'type-1',
  foo: 'foo',
  bar: 'bar',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Add the document to the store
store.set(document);

describe('useTypedResourceDocument', () => {
  it('returns the requested document', () => {
    // Get a document
    const { result } = renderHook(() =>
      useTypedResourceDocument(store, document.id),
    );

    // Should return the document
    expect(result.current).toEqual(document);
  });

  it('returns null if the document does not exist', () => {
    // Get a missing document
    const { result } = renderHook(() =>
      useTypedResourceDocument(store, 'missing'),
    );

    // Should return null
    expect(result.current).toBeNull();
  });
});
