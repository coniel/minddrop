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
import { removeParentsFromResourceDocument as rawRemoveParentsFromResourceDocument } from './removeParentsFromResourceDocument';
import { addParentsToResourceDocument } from '../addParentsToResourceDocument';

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

// Test parent documents
const parent1 = generateResourceDocument<Data>({});
const parent2 = generateResourceDocument<Data>({});

// The parent resource references
const parent1Ref: ResourceReference = { resource: 'tests', id: parent1.id };
const parent2Ref: ResourceReference = { resource: 'tests', id: parent2.id };

// Test document to which to add the parents
const document = generateResourceDocument<Data>({});

// Create a typed version of the function
const removeParentsFromResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<Data>>,
  config: ResourceConfig<Data>,
  documentId: string,
  parentReferences: ResourceReference[],
) =>
  rawRemoveParentsFromResourceDocument<Data>(
    core,
    store,
    config,
    documentId,
    parentReferences,
  );

describe('removeParentsFromResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Register the 'tests' resource
    ResourceApisStore.register(createResource(config, store));

    // Load the test documents into the store
    store.load([document, parent1, parent2]);

    // Add the parent documents to the test document
    addParentsToResourceDocument(core, store, config, document.id, [
      parent1Ref,
      parent2Ref,
    ]);
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to add a parent reference to a non-existant
    // document. Should throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      removeParentsFromResourceDocument(core, store, config, 'missing', [
        parent1Ref,
      ]),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('returns the updated document', () => {
    // Remove a parent reference from a document
    const updated = removeParentsFromResourceDocument(
      core,
      store,
      config,
      document.id,
      [parent1Ref],
    );

    // Returned document should no longer contain the removed reference
    expect(updated.parents).toEqual([parent2Ref]);
  });

  it('sets the updated document in the store', () => {
    // Remove a parent reference from a document
    removeParentsFromResourceDocument(core, store, config, document.id, [
      parent1Ref,
    ]);

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Store document should no longer have the removed reference
    expect(updated.parents).toEqual([parent2Ref]);
  });
});
