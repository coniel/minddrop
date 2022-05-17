import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup } from '../test-utils';
import { ResourceConfig, ResourceDocument } from '../types';
import { getAllResourceDocuments } from './getAllResourceDocuments';

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
const store = createResourceStore<ResourceDocument<Data>>();

// Test document to restore
const storeDoc1 = generateResourceDocument('tests', { foo: 'foo' });
const storeDoc2 = generateResourceDocument('tests', { foo: 'foo' });

describe('getAllResourceDocuments', () => {
  beforeAll(() => {
    setup();

    // Set test documents in the store
    store.set(storeDoc1);
    store.set(storeDoc2);
  });

  afterAll(cleanup);

  it('returns all the documents from the store', () => {
    // Get all documents
    const documents = getAllResourceDocuments(store, config);

    // Should return all the documents from the store
    expect(documents).toEqual(store.getAll());
  });

  it("calls the config's `onGetAll` callback", () => {
    // Add an `onGetAll` callback to the resource config
    const onGetAllConfig: ResourceConfig<Data> = {
      ...config,
      onGet: (document) => ({ ...document, foo: 'bar' }),
    };

    // Get all documents
    const documents = getAllResourceDocuments(store, onGetAllConfig);

    // Should return the documents returned by the `onGetAll` callback
    expect(documents[storeDoc1.id]).toEqual({ ...storeDoc1, foo: 'bar' });
  });
});
