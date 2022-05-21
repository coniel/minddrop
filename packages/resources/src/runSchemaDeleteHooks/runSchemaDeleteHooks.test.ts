import { setup, cleanup, core } from '../test-utils';
import { RDDataSchema, ResourceReference } from '../types';
import { createResource } from '../createResource';
import { runSchemaDeleteHooks } from './runSchemaDeleteHooks';
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

const parentResource = {
  ...createResource<ParentData, {}, {}>({
    resource: 'tests:parent',
    dataSchema: schema,
  }),
  extension: core.extensionId,
};

const childResource = {
  ...createResource<ChildData, {}, {}>({
    resource: 'tests:child',
    dataSchema: {
      foo: { type: 'string' },
    },
  }),
  extension: core.extensionId,
};

// Create a resource reference for the parent document
const parentRef: ResourceReference = {
  resource: parentResource.resource,
  id: 'parent-id',
};

const childDocument1 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [parentRef],
};
const childDocument2 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [parentRef],
};
const childDocument3 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [parentRef],
};
const childDocument4 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [parentRef],
};
const childDocument5 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [parentRef],
};

const parentDocument = {
  ...generateResourceDocument<ParentData>('tests:parent', {
    childId: childDocument1.id,
    childIds: [childDocument2.id, childDocument3.id],
    noParentChildId: childDocument4.id,
    noParentChildIds: [childDocument5.id],
  }),
  id: 'parent-id',
};

describe('runSchemaDeleteHooks', () => {
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
      childDocument5,
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
    it('removes the parent reference when `addAsParent` is true', () => {
      runSchemaDeleteHooks(core, schema, parentDocument);

      // Get the updated child document
      const child = childResource.get(childDocument1.id);

      // Child document should no longer have document as parent
      expect(child.parents).toEqual([]);
    });

    it('does not remove a parent reference when `addAsParent` is not true', () => {
      runSchemaDeleteHooks(core, schema, parentDocument);

      // Get the child for which `addAsParent` is falsy
      const child = childResource.get(childDocument4.id);

      // Child document should still have document as parent
      expect(child.parents).toEqual([parentRef]);
    });
  });

  describe('`resource-ids` fields', () => {
    it('removes the parent reference for each item when `addAsParent` is true', () => {
      runSchemaDeleteHooks(core, schema, parentDocument);

      // Get the updated child documents
      const child2 = childResource.get(childDocument2.id);
      const child3 = childResource.get(childDocument3.id);

      // Child documents should no longer have document as parent
      expect(child2.parents).toEqual([]);
      expect(child3.parents).toEqual([]);
    });

    it('does not remove a parent reference when `addAsParent` is not true', () => {
      runSchemaDeleteHooks(core, schema, parentDocument);

      // Get the child for which `addAsParent` is falsy
      const child = childResource.get(childDocument5.id);

      // Child document should still have document as parent
      expect(child.parents).toEqual([parentRef]);
    });
  });
});
