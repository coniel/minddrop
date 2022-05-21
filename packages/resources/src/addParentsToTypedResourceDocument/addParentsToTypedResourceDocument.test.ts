import { Core } from '@minddrop/core';
import { core, setup, cleanup } from '../test-utils';
import { ResourceDocumentNotFoundError } from '../errors';
import {
  ResourceStore,
  TypedResourceDocument,
  TRDBaseDataSchema,
  TRDTypeDataSchema,
  TypedResourceConfig,
  ResourceTypeConfig,
  ConfigStore,
  ResourceReference,
} from '../types';
import { ResourceApisStore } from '../ResourceApisStore';
import { createConfigsStore } from '../createConfigsStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { createResource } from '../createResource';
import { createResourceStore } from '../createResourceStore';
import { addParentsToTypedResourceDocument as rawAddParentsToTypedResourceDocument } from './addParentsToTypedResourceDocument';

interface BaseData {
  baseFoo: string;
}

interface TypeData {
  typeFoo: string;
}

type TestDocument = TypedResourceDocument<BaseData, TypeData>;

const resourceDataSchema: TRDBaseDataSchema<BaseData> = {
  baseFoo: { type: 'string' },
};

const typeDataSchema: TRDTypeDataSchema<BaseData, TypeData> = {
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

// Generate a test document
const document = generateResourceDocument<
  BaseData & TypeData & { type: string }
>('tests', {
  type: 'test-type',
  baseFoo: 'foo',
  typeFoo: 'foo',
});

// Generate test parent documents
const parent1 = generateResourceDocument<
  BaseData & TypeData & { type: string }
>('tests', {
  type: 'test-type',
  baseFoo: 'foo',
  typeFoo: 'foo',
});
const parent2 = generateResourceDocument<
  BaseData & TypeData & { type: string }
>('tests', {
  type: 'test-type',
  baseFoo: 'foo',
  typeFoo: 'foo',
});

// The parent resource references
const parent1Ref: ResourceReference = { resource: 'tests', id: parent1.id };
const parent2Ref: ResourceReference = { resource: 'tests', id: parent2.id };

// Create a typed version of the function
const addParentsToTypedResourceDocument = (
  core: Core,
  store: ResourceStore<TypedResourceDocument<BaseData>>,
  typeConfigsStore: ConfigStore<ResourceTypeConfig<BaseData, TypeData>>,
  config: TypedResourceConfig<BaseData>,
  documentId: string,
  parentReferences: ResourceReference[],
) =>
  rawAddParentsToTypedResourceDocument(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
    parentReferences,
  );

describe('addParentsToTypedResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Register the 'tests' resource
    ResourceApisStore.register({
      ...createResource(config, store),
      extension: core.extensionId,
    });

    // Load the test documents into the store
    store.load([document, parent1, parent2]);
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to add a parent reference to a non-existant
    // document. Should throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      addParentsToTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'missing',
        [parent1Ref],
      ),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('returns the updated document', () => {
    // Add a parent reference to a document
    const updated = addParentsToTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      [parent1Ref],
    );

    // Returned document should have the new parent
    expect(updated.parents).toEqual([parent1Ref]);
  });

  it('sets the updated document in the store', () => {
    // Add a parent reference to a document
    addParentsToTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      [parent1Ref],
    );

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Store document should have the new parent
    expect(updated.parents).toEqual([parent1Ref]);
  });

  it('does not overwrite existing parents', () => {
    // Add a parent reference to a document
    addParentsToTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      [parent1Ref],
    );
    // Add a second parent reference to the document
    addParentsToTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      [parent2Ref],
    );

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Document shold have both parents
    expect(updated.parents).toEqual([parent1Ref, parent2Ref]);
  });
});
