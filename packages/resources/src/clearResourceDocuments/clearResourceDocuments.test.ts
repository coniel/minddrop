import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup } from '../test-utils';
import { ResourceConfig, ResourceDocument } from '../types';
import { clearResourceDocuments } from './clearResourceDocuments';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: { foo: { type: 'string' } },
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to restore
const document1 = generateResourceDocument({ foo: 'foo' });
const document2 = generateResourceDocument({ foo: 'foo' });

describe('getAllResourceDocuments', () => {
  beforeEach(() => {
    setup();

    // Load test documents into the store
    store.load([document1, document2]);
  });

  afterEach(cleanup);

  it('clears the store', () => {
    // Clear the store
    clearResourceDocuments(store, config);

    // Store should no longer contain any documents
    expect(store.getAll()).toEqual({});
  });

  it("calls the config's `onClear` callback", () => {
    const onClear = jest.fn();

    // Add a `onClear` callback to the resource config
    const onClearConfig: ResourceConfig<{}> = { ...config, onClear };

    // Clear the store using the config with an `onClear` callback
    clearResourceDocuments(store, onClearConfig);

    // Should have called the `onClear` callback
    expect(onClear).toHaveBeenCalled();
  });
});
