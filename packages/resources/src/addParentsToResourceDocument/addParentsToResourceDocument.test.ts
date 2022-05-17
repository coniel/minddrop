import { Core } from '@minddrop/core';
import { core, setup, cleanup } from '../test-utils';
import { ResourceDocumentNotFoundError } from '../errors';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceStore,
  RDDataSchema,
  ResourceReference,
} from '../types';
import { ResourceApisStore } from '../ResourceApisStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { createResource } from '../createResource';
import { createResourceStore } from '../createResourceStore';
import { addParentsToResourceDocument as rawAddParentsToResourceDocument } from './addParentsToResourceDocument';

// Test resource data
interface Data {
  foo?: string;
}

// Test resource data schema
const dataSchema: RDDataSchema<Data> = {
  foo: { type: 'string' },
};

// Test resource config
const config: ResourceConfig<Data> = {
  resource: 'tests',
  dataSchema,
  defaultData: { foo: 'foo' },
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<Data>>();

// Test document to which to add the parents
const document = generateResourceDocument<Data>('tests', {});

// Test parent documents
const parent1 = generateResourceDocument<Data>('tests', {});
const parent2 = generateResourceDocument<Data>('tests', {});

// The parent resource references
const parent1Ref: ResourceReference = { resource: 'tests', id: parent1.id };
const parent2Ref: ResourceReference = { resource: 'tests', id: parent2.id };

// Create a typed version of the function
const addParentsToResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<Data>>,
  config: ResourceConfig<Data>,
  documentId: string,
  parentReferences: ResourceReference[],
) =>
  rawAddParentsToResourceDocument<Data>(
    core,
    store,
    config,
    documentId,
    parentReferences,
  );

describe('addParentsToResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Register the 'tests' resource
    ResourceApisStore.register(createResource(config, store));

    // Load the test documents into the store
    store.load([document, parent1, parent2]);
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to add a parent reference to a non-existant
    // document. Should throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      addParentsToResourceDocument(core, store, config, 'missing', [
        parent1Ref,
      ]),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('returns the updated document', () => {
    // Add a parent reference to a document
    const updated = addParentsToResourceDocument(
      core,
      store,
      config,
      document.id,
      [parent1Ref],
    );

    // Returned document should have the new parent
    expect(updated.parents).toEqual([parent1Ref]);
  });

  it('sets the updated document in the store', () => {
    // Add a parent reference to a document
    addParentsToResourceDocument(core, store, config, document.id, [
      parent1Ref,
    ]);

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Store document should have the new parent
    expect(updated.parents).toEqual([parent1Ref]);
  });

  it('does not overwrite existing parents', () => {
    // Add a parent reference to a document
    addParentsToResourceDocument(core, store, config, document.id, [
      parent1Ref,
    ]);
    // Add a second parent reference to the document
    addParentsToResourceDocument(core, store, config, document.id, [
      parent2Ref,
    ]);

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Document shold have both parents
    expect(updated.parents).toEqual([parent1Ref, parent2Ref]);
  });
});
