import { createResourceStore } from '../createResourceStore';
import { ResourceDocumentNotFoundError } from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup } from '../test-utils';
import { ResourceConfig } from '../types';
import { getResourceDocument } from './getResourceDocument';

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
const storeDoc = generateResourceDocument({ foo: 'foo' });

describe('getResourceDocument', () => {
  beforeAll(() => {
    setup();

    // Set test document in the store
    store.set(storeDoc);
  });

  afterAll(cleanup);

  it('returns the document from the store', () => {
    // Get a document
    const document = getResourceDocument(store, config, storeDoc.id);

    // Should return the document from the store
    expect(document).toEqual(storeDoc);
  });

  it('throws if the document does not exist', () => {
    // Attempt to get a non-existant document. Should throw a
    // `ResourceDocumentNotFoundError`.
    expect(() => getResourceDocument(store, config, 'missing')).toThrowError(
      ResourceDocumentNotFoundError,
    );
  });

  it("calls the config's `onGetOne` callback", () => {
    // Add an `onGetOne` callback to the resource config
    const onGetOneConfig: ResourceConfig<Data> = {
      ...config,
      onGetOne: (doc) => ({ ...doc, foo: 'bar' }),
    };

    // Get a document
    const document = getResourceDocument(store, onGetOneConfig, storeDoc.id);

    // Should return the document returned by the `onGetOne` callback
    expect(document).toEqual({ ...storeDoc, foo: 'bar' });
  });
});
