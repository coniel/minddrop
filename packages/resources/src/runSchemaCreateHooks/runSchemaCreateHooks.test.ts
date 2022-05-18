import { setup, cleanup, core } from '../test-utils';
import { RDDataSchema, ResourceReference } from '../types';
import { createResource } from '../createResource';
import { runSchemaCreateHooks } from './runSchemaCreateHooks';
import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceApisStore } from '../ResourceApisStore';

interface ChildData {
  foo: string;
}

interface ParentData {
  childId: string;
  noParentChildId: string;
  optionalChildId?: string;
  childIds: string[];
  noParentChildIds: string[];
  optionalChildIds?: string[];
}

const schema: RDDataSchema<ParentData> = {
  childId: {
    type: 'resource-id',
    resource: 'tests:child',
    addAsParent: true,
  },
  noParentChildId: {
    type: 'resource-id',
    resource: 'tests:child',
  },
  optionalChildId: {
    type: 'resource-id',
    resource: 'tests:child',
    addAsParent: true,
    required: false,
  },
  childIds: {
    type: 'resource-ids',
    resource: 'tests:child',
    addAsParent: true,
  },
  noParentChildIds: {
    type: 'resource-ids',
    resource: 'tests:child',
  },
  optionalChildIds: {
    type: 'resource-ids',
    resource: 'tests:child',
    addAsParent: true,
    required: false,
  },
};

const parentResource = createResource<ParentData, {}, {}>({
  resource: 'tests:parent',
  dataSchema: schema,
});

const childResource = createResource<ChildData, {}, {}>({
  resource: 'tests:child',
  dataSchema: {
    foo: { type: 'string' },
  },
});

const childDocument1 = generateResourceDocument<ChildData>('tests:child', {
  foo: 'foo',
});
const childDocument2 = generateResourceDocument<ChildData>('tests:child', {
  foo: 'foo',
});
const childDocument3 = generateResourceDocument<ChildData>('tests:child', {
  foo: 'foo',
});
const childDocument4 = generateResourceDocument<ChildData>('tests:child', {
  foo: 'foo',
});

const parentDocument = generateResourceDocument<ParentData>('tests:parent', {
  childId: childDocument1.id,
  childIds: [childDocument2.id, childDocument3.id],
  noParentChildId: childDocument4.id,
  noParentChildIds: [childDocument4.id],
});

// Create a resource reference for the parent document
const parentRef: ResourceReference = {
  resource: parentResource.resource,
  id: parentDocument.id,
};

describe('runSchemaCreateHooks', () => {
  beforeEach(() => {
    setup();

    // Register the resources
    ResourceApisStore.register([parentResource, childResource]);

    // Load test documents into their respective stores
    childResource.store.load(core, [
      childDocument1,
      childDocument2,
      childDocument3,
      childDocument4,
    ]);
    parentResource.store.load(core, [parentDocument]);
  });

  afterEach(() => {
    cleanup();

    // Clear test resource stores
    childResource.store.clear();
    parentResource.store.clear();
  });

  describe('`resource-id` fields', () => {
    it('adds a parent reference when `addAsParent` is true', () => {
      runSchemaCreateHooks(core, schema, parentDocument);

      // Get the updated child document
      const child = childResource.get(childDocument1.id);

      // Child document should have document as parent
      expect(child.parents).toEqual([parentRef]);
    });

    it('does not add a parent reference when `addAsParent` is not true', () => {
      runSchemaCreateHooks(core, schema, parentDocument);

      // Get the child for which `addAsParent` is falsy
      const child = childResource.get(childDocument4.id);

      // Child document should not have a parent reference
      expect(child.parents).not.toBeDefined();
    });
  });

  describe('`resource-ids` field', () => {
    it('adds a parent reference for each item when `addAsParent` is true', () => {
      runSchemaCreateHooks(core, schema, parentDocument);

      // Get the updated child documents
      const child2 = childResource.get(childDocument2.id);
      const child3 = childResource.get(childDocument3.id);

      // Child documents should have document as parent
      expect(child2.parents).toEqual([parentRef]);
      expect(child3.parents).toEqual([parentRef]);
    });

    it('does not add a parent reference when `addAsParent` is not true', () => {
      runSchemaCreateHooks(core, schema, parentDocument);

      // Get the child for which `addAsParent` is falsy
      const child = childResource.get(childDocument4.id);

      // Child document should not have a parent reference
      expect(child.parents).not.toBeDefined();
    });
  });
});
