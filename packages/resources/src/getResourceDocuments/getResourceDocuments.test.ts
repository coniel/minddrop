import { mapById } from '@minddrop/utils';
import { createResourceStore } from '../createResourceStore';
import { ResourceDocumentNotFoundError } from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup } from '../test-utils';
import { ResourceConfig } from '../types';
import { getResourceDocuments } from './getResourceDocuments';

// Test document custom data
interface Data {
  foo: string;
}

// Test resource config
const config: ResourceConfig<Data> = {
  resource: 'tests',
  dataSchema: { foo: { type: 'string' } },
};

// Create a resource store for the test resource
const store = createResourceStore<Data>();

// Test document to restore
const storeDoc1 = generateResourceDocument({ foo: 'foo' });
const storeDoc2 = generateResourceDocument({ foo: 'foo' });

describe('getResourceDocuments', () => {
  beforeAll(() => {
    setup();

    // Set test documents in the store
    store.set(storeDoc1);
    store.set(storeDoc2);
  });

  afterAll(cleanup);

  it('returns the documents from the store', () => {
    // Get some documents
    const documents = getResourceDocuments(store, config, [
      storeDoc1.id,
      storeDoc2.id,
    ]);

    // Should return the document from the store
    expect(documents).toEqual(mapById([storeDoc1, storeDoc2]));
  });

  it('throws if any of the documents do not exist', () => {
    // Attempt to get a non-existant document. Should throw a
    // `ResourceDocumentNotFoundError`.
    expect(() =>
      getResourceDocuments(store, config, [storeDoc1.id, 'missing']),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it("calls the config's `onGetMany` callback", () => {
    // Add an `onGetMany` callback to the resource config
    const onGetManyConfig: ResourceConfig<Data> = {
      ...config,
      onGet: (doc) => ({ ...doc, foo: 'bar' }),
    };

    // Get some documents
    const documents = getResourceDocuments(store, onGetManyConfig, [
      storeDoc1.id,
      storeDoc2.id,
    ]);

    // Should return the documents returned by the `onGetMany` callback
    expect(documents[storeDoc1.id]).toEqual({ ...storeDoc1, foo: 'bar' });
  });
});
