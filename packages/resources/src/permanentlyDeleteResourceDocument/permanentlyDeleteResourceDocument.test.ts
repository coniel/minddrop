import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { ResourceDocumentNotFoundError } from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { createResource } from '../createResource';
import { ResourceApisStore } from '../ResourceApisStore';
import { permanentlyDeleteResourceDocument as rawPermanentlyDeleteResourceDocument } from './permanentlyDeleteResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to delete
const document = generateResourceDocument('tests', {});

// Create a typed version of the function
const permanentlyDeleteResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<{}>>,
  config: ResourceConfig<{}>,
  documentId: string,
) => rawPermanentlyDeleteResourceDocument(core, store, config, documentId);

describe('permanentlyDeleteResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set test document in the store
    store.set(document);
  });

  afterEach(cleanup);

  it('removes the document from the store', () => {
    // Permanently delete a document
    permanentlyDeleteResourceDocument(core, store, config, document.id);

    // Document should no longer be in the store
    expect(store.get(document.id)).toBeUndefined();
  });

  it('throws if the document does not exist', () => {
    // Attempt to permanently delete a document which does not
    // exist. Should throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      permanentlyDeleteResourceDocument(core, store, config, 'missing'),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('runs schema delete hooks', () => {
    // Parent document data
    type ParentData = { childId?: string };

    // The config of the parent document (document being created)
    const parentConfig: ResourceConfig<ParentData> = {
      resource: 'parent',
      dataSchema: {
        childId: {
          type: 'resource-id',
          resource: 'child',
          addAsParent: true,
        },
      },
    };
    // The config of the child document (referenced in the document
    // being created).
    const childConfig: ResourceConfig<{ foo?: string }> = {
      resource: 'child',
      dataSchema: {
        foo: {
          type: 'string',
          required: false,
        },
      },
    };

    // Create and register the test resources
    const parentStore = createResourceStore<ResourceDocument<ParentData>>();
    const parentResource = {
      ...createResource(parentConfig, parentStore),
      extension: core.extensionId,
    };
    const childResource = {
      ...createResource(childConfig),
      extension: core.extensionId,
    };
    ResourceApisStore.register([parentResource, childResource]);

    // Generate test documents
    const childDocument = generateResourceDocument('child', {});
    const parentDocument = generateResourceDocument('parent', {
      childId: childDocument.id,
    });

    // Add the 'parent' document as a parent on the 'child' document
    childDocument.parents = [{ resource: 'parent', id: parentDocument.id }];

    // Load the test documents into their respective stores
    parentResource.store.load(core, [parentDocument]);
    childResource.store.load(core, [childDocument]);

    // Permanently delete the 'parent' document
    rawPermanentlyDeleteResourceDocument(
      core,
      parentStore,
      parentConfig,
      parentDocument.id,
    );

    // Get the updated 'child' document
    const child = childResource.get(childDocument.id);

    // 'child' document shold no longer have the 'parent' as a parent
    expect(child.parents).toEqual([]);
  });

  it('dispatches a `[resource]:delete-permanently` event', (done) => {
    // Listen to 'tests:delete-permanently' events
    core.addEventListener('tests:delete-permanently', (payload) => {
      // Payload data should be the deleted document
      expect(payload.data).toEqual(document);
      done();
    });

    // Permanently delete a document
    permanentlyDeleteResourceDocument(core, store, config, document.id);
  });

  it('returns the document', () => {
    // Permanently delete a document
    const deleted = permanentlyDeleteResourceDocument(
      core,
      store,
      config,
      document.id,
    );

    // Should return the document
    expect(deleted).toEqual(document);
  });
});
