import { setup, cleanup, core } from '../test-utils';
import { RDDataSchema, ResourceReference } from '../types';
import { createResource } from '../createResource';
import { runSchemaUpdateHooks } from './runSchemaUpdateHooks';
import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceApisStore } from '../ResourceApisStore';

interface ChildData {
  foo: string;
}

interface ParentData {
  childId?: string;
  childIds?: string[];
}

const schema: RDDataSchema<ParentData> = {
  childId: {
    type: 'resource-id',
    resource: 'tests:child',
    addAsParent: true,
  },
  childIds: {
    type: 'resource-ids',
    resource: 'tests:child',
    addAsParent: true,
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

// Create a resource reference for the parent document
const parentRef: ResourceReference = {
  resource: parentResource.resource,
  id: 'parent-id',
};

// Generate test child documents
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
  parents: [],
};
const childDocument4 = {
  ...generateResourceDocument<ChildData>('tests:child', {
    foo: 'foo',
  }),
  parents: [],
};

describe('runSchemaUpdateHooks', () => {
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
  });

  afterEach(() => {
    cleanup();

    // Clear test resource stores
    childResource.store.clear();
    parentResource.store.clear();
  });

  describe('`resource-id` fields', () => {
    const originalDocument = {
      ...generateResourceDocument<ParentData>('tests:parent', {
        childId: childDocument1.id,
      }),
      id: 'parent-id',
    };

    const updatedDocument = {
      ...generateResourceDocument<ParentData>('tests:parent', {
        childId: childDocument3.id,
      }),
      id: 'parent-id',
    };

    beforeEach(() => {
      // Load the original document into the 'parent' resource store
      parentResource.store.load(core, [originalDocument]);
    });

    describe('changed', () => {
      it('removes the document as a parent from the old child', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, updatedDocument);

        // Get the updated child document
        const child = childResource.get(childDocument1.id);

        // Child document should no longer have document as parent
        expect(child.parents).toEqual([]);
      });

      it('adds the document as a parent on the new child', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, updatedDocument);

        // Get the updated child document
        const child = childResource.get(childDocument3.id);

        // Child document should have document as parent
        expect(child.parents).toEqual([parentRef]);
      });
    });

    describe('added', () => {
      // Remove the child from the original document
      const withoutChild = { ...originalDocument };
      delete withoutChild.childId;

      it('adds the document as a parent on the new child', () => {
        runSchemaUpdateHooks(core, schema, withoutChild, updatedDocument);

        // Get the updated child document
        const child = childResource.get(childDocument3.id);

        // Child document should have document as parent
        expect(child.parents).toEqual([parentRef]);
      });
    });

    describe('removed', () => {
      // Remove the child from the updated document
      const withoutChild = { ...updatedDocument };
      delete withoutChild.childId;

      it('removes the document as a parent from the old child', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, withoutChild);

        // Get the updated child document
        const child = childResource.get(childDocument1.id);

        // Child document should no longer have document as parent
        expect(child.parents).toEqual([]);
      });
    });
  });

  describe('`resource-ids` fields', () => {
    const originalDocument = {
      ...generateResourceDocument<ParentData>('tests:parent', {
        childIds: [childDocument1.id, childDocument2.id],
      }),
      id: 'parent-id',
    };

    const updatedDocument = {
      ...generateResourceDocument<ParentData>('tests:parent', {
        childIds: [childDocument1.id, childDocument3.id],
      }),
      id: 'parent-id',
    };

    beforeEach(() => {
      // Load the original document into the 'parent' resource store
      parentResource.store.load(core, [originalDocument]);
    });

    describe('changed', () => {
      it('removes the document as a parent from the removed children', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, updatedDocument);

        // Get the updated child documents
        const child = childResource.get(childDocument2.id);

        // Child document should no longer have document as parent
        expect(child.parents).toEqual([]);
      });

      it('adds the document as a parent on the added children', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, updatedDocument);

        // Get the updated child document
        const child = childResource.get(childDocument3.id);

        // Child document should have document as parent
        expect(child.parents).toEqual([parentRef]);
      });

      it('leaves existing children as is', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, updatedDocument);

        // Get the updated child document
        const child = childResource.get(childDocument1.id);

        // Child document should have document as parent
        expect(child.parents).toEqual([parentRef]);
      });
    });

    describe('added', () => {
      // Remove the child from the original document
      const withoutChildren = { ...originalDocument };
      delete withoutChildren.childIds;
      // Set parentless children as children in updated document
      const withChildren = {
        ...updatedDocument,
        childIds: [childDocument3.id, childDocument4.id],
      };

      it('adds the document as a parent on the new children', () => {
        runSchemaUpdateHooks(core, schema, withoutChildren, withChildren);

        // Get the updated child documents
        const child4 = childResource.get(childDocument1.id);
        const child3 = childResource.get(childDocument3.id);

        // Child documents should have document as parent
        expect(child3.parents).toEqual([parentRef]);
        expect(child4.parents).toEqual([parentRef]);
      });
    });

    describe('removed', () => {
      // Remove the child from the updated document
      const withoutChildren = { ...updatedDocument };
      delete withoutChildren.childIds;

      it('removes the document as a parent from the removed children', () => {
        runSchemaUpdateHooks(core, schema, originalDocument, withoutChildren);

        // Get the updated child documents
        const child1 = childResource.get(childDocument1.id);
        const child2 = childResource.get(childDocument2.id);

        // Child documents should no longer have document as parent
        expect(child1.parents).toEqual([]);
        expect(child2.parents).toEqual([]);
      });
    });
  });
});
