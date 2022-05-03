import { Core } from '@minddrop/core';
import { createConfigsStore } from '../createConfigsStore';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { deleteTypedResourceDocument } from '../deleteTypedResourceDocument';
import {
  TypedResourceDocument,
  ResourceStore,
  TypedResourceConfig,
  TypedResourceBaseDocumentDataSchema,
  TypedResourceTypeDocumentDataSchema,
  ResourceTypeConfig,
  ConfigStore,
} from '../types';
import { restoreTypedResourceDocument as rawRestoreTypedResourceDocument } from './restoreTypedResourceDocument';

interface BaseData {
  baseFoo: string;
}

interface TypeData {
  typeFoo: string;
}

type TestDocument = TypedResourceDocument<BaseData, TypeData>;

const resourceDataSchema: TypedResourceBaseDocumentDataSchema<BaseData> = {
  baseFoo: { type: 'string' },
};

const typeDataSchema: TypedResourceTypeDocumentDataSchema<BaseData, TypeData> =
  {
    typeFoo: { type: 'string' },
  };

// Test resource config
const config: TypedResourceConfig<BaseData> = {
  resource: 'tests',
  dataSchema: resourceDataSchema,
};

// Create a resource store for the test resource
const store = createResourceStore<TestDocument>();

// Create a configs store for the test resource type configs
const typeConfigsStore = createConfigsStore<
  ResourceTypeConfig<BaseData, TypeData>
>({
  idField: 'type',
});

// Register a test type
typeConfigsStore.register({
  type: 'test-type',
  dataSchema: typeDataSchema,
});

// Test document to update
const document = generateResourceDocument<
  BaseData & TypeData & { type: string }
>({
  type: 'test-type',
  baseFoo: 'foo',
  typeFoo: 'foo',
});

// Create a typed version of the function
const restoreTypedResourceDocument = (
  core: Core,
  store: ResourceStore<TypedResourceDocument<BaseData>>,
  typeConfigsStore: ConfigStore<ResourceTypeConfig<BaseData, TypeData>>,
  config: TypedResourceConfig<BaseData>,
  documentId: string,
) =>
  rawRestoreTypedResourceDocument(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
  );

describe('restoreTypedResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set test document in the store
    store.set(document);
    // Delete the document
    deleteTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
    );
  });

  afterEach(cleanup);

  it('marks the document as restored', () => {
    // Delete a document
    restoreTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
    );

    // Get the restored document from the store
    const restored = store.get(document.id);

    // Deletion related fields should be removed
    expect(restored.deleted).toBeUndefined();
    expect(restored.deletedAt).toBeUndefined();
  });

  it('returns the restored document', () => {
    // Delete a document
    const restored = restoreTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
    );

    // Get the restored document from the store
    const storeDoc = store.get(document.id);

    // Should return the restored document
    expect(restored).toEqual(storeDoc);
  });

  it('dispatches a `[resource]:restore` event', (done) => {
    // Listen to 'tests:restore' events
    core.addEventListener('tests:restore', (payload) => {
      // Get the restored document
      const restored = store.get(document.id);

      // Payload data should be the restored document
      expect(payload.data).toEqual(restored);
      done();
    });

    // Delete a document
    restoreTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
    );
  });
});
