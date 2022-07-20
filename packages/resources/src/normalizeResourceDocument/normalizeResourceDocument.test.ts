import { setup, cleanup, core } from '../test-utils';
import { createResource } from '../createResource';
import { generateResourceDocument } from '../generateResourceDocument';
import { registerResource } from '../registerResource';
import { unregisterResource } from '../unregisterResource';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { createResourceStore } from '../createResourceStore';
import { normalizeResourceDocument as rawNormalizeResourceDocument } from './normalizeResourceDocument';
import { Core } from '@minddrop/core';

interface ChildResource {
  foo?: string;
}

interface ParentResource {
  children?: string[];
  child?: string;
}

const childResource = createResource<
  ChildResource,
  Partial<ChildResource>,
  Partial<ChildResource>
>({
  resource: 'tests:child-resource',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});

const config: ResourceConfig<ParentResource> = {
  resource: 'tests:parent-resource',
  dataSchema: {
    children: {
      type: 'resource-ids',
      resource: 'tests:child-resource',
      required: false,
    },
    child: {
      type: 'resource-id',
      resource: 'tests:child-resource',
      required: false,
    },
  },
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<ParentResource>>();

const childDocument = generateResourceDocument<ChildResource>(
  'tests:child-resource',
  {
    foo: 'foo',
  },
);

// Create a typed version of the function
const normalizeResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<ParentResource>>,
  config: ResourceConfig<ParentResource>,
  documentId: string,
) =>
  rawNormalizeResourceDocument<
    ParentResource,
    ResourceDocument<ParentResource>
  >(core, store, config, documentId);

describe('normalizeResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Register test resources
    registerResource(core, childResource);

    // Load test documents
    childResource.store.load(core, [childDocument]);
  });

  afterEach(() => {
    cleanup();

    // Unregister test resources
    unregisterResource(core, childResource);

    // Clear test documents
    childResource.store.clear();
  });

  it('removes IDs of resources which do not exist from `resource-ids` fields', () => {
    // Generate a document containing the IDs of
    // child documents which do not exist.
    const document = generateResourceDocument<ParentResource>(
      'tests:parent-resource',
      {
        children: ['missing-1', 'missing-2', childDocument.id],
      },
    );

    // Load the document into the store
    store.load([document]);

    // Normalize the document
    normalizeResourceDocument(core, store, config, document.id);

    // Get the updated document
    const updated = store.get(document.id);

    // Should remove the missing children from the document
    expect(updated.children).toEqual([childDocument.id]);
  });

  it('removes `resource-id` fields for which the resource does not exist', () => {
    // Generate a document containing the ID of
    // a child document which do not exist.
    const document = generateResourceDocument<ParentResource>(
      'tests:parent-resource',
      {
        child: 'missing',
      },
    );

    // Load the document into the store
    store.load([document]);

    // Normalize the document
    normalizeResourceDocument(core, store, config, document.id);

    // Get the updated document
    const updated = store.get(document.id);

    // Should remove the missing child field
    expect(updated.child).toBeUndefined();
  });
});
