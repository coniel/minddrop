import { renderHook, act } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { ResourceTypeNotRegisteredError } from '../errors';
import {
  ResourceTypeConfig,
  TRDBaseDataSchema,
  TypedResourceDocument,
  TRDTypeDataSchema,
  ResourceReference,
} from '../types';
import { createResourceStore } from '../createResourceStore';
import { createTypedResource } from './createTypedResource';
import { ResourceApisStore } from '../ResourceApisStore';

interface BaseData {
  baseFoo: string;
  baseBar: string;
}

interface BaseCreateData {
  baseFoo?: string;
  basebar?: string;
}

interface BaseUpdateData {
  baseFoo?: string;
  baseBar?: string;
}

interface TypeData {
  typeFoo: string;
  typeBar: string;
}

interface TypeCreateData {
  typeFoo?: string;
  typeBar?: string;
}

interface TypeUpdateData {
  typeFoo?: string;
  typeBar?: string;
}

const baseDataSchema: TRDBaseDataSchema<BaseData> = {
  baseFoo: {
    type: 'string',
  },
  baseBar: {
    type: 'string',
  },
};

const typeDataScehma: TRDTypeDataSchema<BaseData, TypeData> = {
  typeFoo: {
    type: 'string',
  },
  typeBar: {
    type: 'string',
  },
};

const typeConfig: ResourceTypeConfig<BaseData, TypeData> = {
  type: 'test-type',
  dataSchema: typeDataScehma,
  defaultData: {
    typeFoo: 'foo',
    typeBar: 'bar',
  },
};

const Api = {
  ...createTypedResource<BaseData, BaseCreateData, BaseUpdateData>({
    resource: 'tests:test',
    dataSchema: baseDataSchema,
    defaultData: {
      baseFoo: 'foo',
      baseBar: 'bar',
    },
  }),
  extension: core.extensionId,
};

describe('createTypedResource', () => {
  beforeEach(() => {
    act(() => {
      setup();
    });
  });

  afterEach(() => {
    act(() => {
      cleanup();
      Api.store.clear();
      Api.typeConfigsStore.clear();
    });
  });

  describe('register', () => {
    it('registers a new resource type', () => {
      // Register a new resource type
      Api.register(core, typeConfig);

      // Type should be registered
      expect(Api.getTypeConfig('test-type')).toEqual({
        ...typeConfig,
        extension: core.extensionId,
      });
    });
  });

  describe('unregister', () => {
    it('unregisters a resource type', () => {
      // Register a new resource type
      Api.register(core, typeConfig);
      // Unregister the resource type
      Api.unregister(core, typeConfig);

      // Type should no longer be registered
      expect(() => Api.getTypeConfig('test-type')).toThrowError(
        ResourceTypeNotRegisteredError,
      );
    });
  });

  describe('getTypeConfig', () => {
    it('returns the type config', () => {
      // Register a new resource type
      Api.register(core, typeConfig);

      // Get all type configs
      const config = Api.getTypeConfig('test-type');

      // Should return all registered types
      expect(config).toEqual({ ...typeConfig, extension: core.extensionId });
    });
  });

  describe('getAllTypeConfigs', () => {
    it('returns all registered type configs', () => {
      const typeConfig2 = { ...typeConfig, type: 'test-type-2' };

      // Register two resource types
      Api.register(core, typeConfig);
      Api.register(core, typeConfig2);

      // Get the type config
      const configs = Api.getAllTypeConfigs();

      // Should return the requested config
      expect(configs).toEqual([
        { ...typeConfig, extension: core.extensionId },
        { ...typeConfig2, extension: core.extensionId },
      ]);
    });

    it('supports filtering', () => {
      const typeConfig2 = { ...typeConfig, type: 'test-type-2' };

      // Register two resource types
      Api.register(core, typeConfig);
      Api.register(core, typeConfig2);

      // Get the type config
      const configs = Api.getAllTypeConfigs({ type: [typeConfig2.type] });

      // Should return only the filtered configs
      expect(configs).toEqual([
        { ...typeConfig2, extension: core.extensionId },
      ]);
    });
  });

  describe('create', () => {
    beforeAll(() => {
      // Register a test resource type
      Api.register(core, typeConfig);
    });

    it('creates a typed document', () => {
      // Create a new 'test-type' document
      const document = Api.create<TypeCreateData, TypeData>(core, 'test-type', {
        baseFoo: 'provided foo',
        typeFoo: 'provided foo',
      });

      // Document should contain the provided data
      expect(document.baseFoo).toBe('provided foo');
      expect(document.typeFoo).toBe('provided foo');
      // Document should contain default data
      expect(document.baseBar).toBe('bar');
      expect(document.typeBar).toBe('bar');
    });
  });

  describe('udapting', () => {
    let document: TypedResourceDocument<BaseData, TypeData>;

    beforeEach(() => {
      // Register a test resource type
      Api.register(core, typeConfig);
      // Create a new 'test-type' document
      document = Api.create<TypeCreateData, TypeData>(core, 'test-type');
    });

    it('updates the document', () => {
      // Update a document
      Api.update<TypeUpdateData>(core, document.id, {
        baseFoo: 'updated foo',
        typeBar: 'updated bar',
      });

      // Get the updated document
      const updated = Api.get<TypeData>(document.id);

      // Document should contain the updated data
      expect(updated.baseFoo).toBe('updated foo');
      expect(updated.typeBar).toBe('updated bar');
    });

    it('soft deletes the document', () => {
      // Delete a document
      Api.delete(core, document.id);

      // Get the updated document
      const updated = Api.get<TypeData>(document.id);

      // Document should be deleted
      expect(updated.deleted).toBe(true);
    });

    it('restores a soft deleted document', () => {
      // Delete a document
      Api.delete(core, document.id);
      // Restore the document
      Api.restore(core, document.id);

      // Get the updated document
      const updated = Api.get<TypeData>(document.id);

      // Document should no longer be deleted
      expect(updated.deleted).toBeUndefined();
    });
  });

  describe('parents', () => {
    let childDocument: TypedResourceDocument<BaseData, TypeData>;
    let parentDocument: TypedResourceDocument<BaseData, TypeData>;
    let parentRef: ResourceReference;

    beforeEach(() => {
      // Register the resource
      ResourceApisStore.register(Api);
      // Register a test resource type
      Api.register(core, typeConfig);
      // Create test documents
      childDocument = Api.create<TypeCreateData, TypeData>(core, 'test-type');
      parentDocument = Api.create<TypeCreateData, TypeData>(core, 'test-type');
      // Create a parent reference
      parentRef = { id: parentDocument.id, resource: Api.resource };
    });

    describe('addParents', () => {
      it('adds parents to the document', () => {
        // Add a parent to a document
        Api.addParents(core, childDocument.id, [parentRef]);

        // Get the updated document
        const document = Api.get(childDocument.id);

        // Document should contain the parent
        expect(document.parents).toEqual([parentRef]);
      });
    });

    describe('removeParents', () => {
      it('removes parents from the document', () => {
        // Add a parent to a document
        Api.addParents(core, childDocument.id, [parentRef]);
        // Remove the parent from a document
        Api.removeParents(core, childDocument.id, [parentRef]);

        // Get the updated document
        const document = Api.get(childDocument.id);

        // Document should not contain the parent
        expect(document.parents).toEqual([]);
      });
    });
  });

  it('accepts a custom store', () => {
    // Create a resource store
    const store = createResourceStore<TypedResourceDocument<BaseData>>();

    // Create a resource using the custom store
    const withCustomStore = createTypedResource<
      BaseData,
      BaseCreateData,
      BaseUpdateData
    >(
      {
        resource: 'tests:test',
        dataSchema: {
          baseFoo: { type: 'string' },
          baseBar: { type: 'string' },
        },
      },
      store,
    );

    // Register the 'test-type' resource type
    withCustomStore.register(core, typeConfig);

    // Create a document
    const document = withCustomStore.create(core, 'test-type', {
      baseFoo: 'foo',
      typeFoo: 'foo',
    });

    // Should have set the document in the provided store
    expect(store.get(document.id)).toEqual(document);
  });

  describe('hooks', () => {
    // Create some test documents
    const document1: TypedResourceDocument<BaseData, TypeData> = {
      resource: 'tests',
      id: 'doc-1',
      revision: 'rev-1',
      type: 'type-1',
      parents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      baseFoo: 'foo',
      baseBar: 'bar',
      typeFoo: 'foo',
      typeBar: 'bar',
    };
    const document2 = { ...document1, id: 'doc-2', type: 'type-2' };

    beforeEach(() => {
      // Clear the store
      Api.store.clear();
      // Register a test resource type
      Api.register(core, typeConfig);
      // Load test documents
      Api.store.load(core, [document1, document2]);
    });

    describe('useDocument', () => {
      it('returns the requested document', () => {
        // Get a document
        const { result } = renderHook(() =>
          Api.hooks.useDocument(document1.id),
        );

        // Should return the document
        expect(result.current).toEqual(document1);
      });

      it('returns null if the document does not exist', () => {
        // Get a missing document
        const { result } = renderHook(() => Api.hooks.useDocument('missing'));

        // Should return null
        expect(result.current).toBeNull();
      });
    });

    describe('useDocuments', () => {
      it('returns the requested documents', () => {
        // Get a couple of documents
        const { result } = renderHook(() =>
          Api.hooks.useDocuments([document1.id, document2.id]),
        );

        // Should return the requested docuemnts
        expect(result.current).toEqual(mapById([document1, document2]));
      });

      it('filters the results', () => {
        // Get a couple of documents and filter for 'type-1'
        const { result } = renderHook(() =>
          Api.hooks.useDocuments([document1.id, document2.id], {
            type: ['type-1'],
          }),
        );

        // Returned map should contain only the active document
        expect(result.current).toEqual(mapById([document1]));
      });
    });

    describe('useAllDocuments', () => {
      it('returns all documents', () => {
        // Get a all documents
        const { result } = renderHook(() => Api.hooks.useAllDocuments());

        // Should return all documents
        expect(result.current).toEqual(mapById([document1, document2]));
      });

      it('filters the results', () => {
        // Get all documents, filtering for 'type-1'
        const { result } = renderHook(() =>
          Api.hooks.useAllDocuments({
            type: ['type-1'],
          }),
        );

        // Returned map should contain only the active documents
        expect(result.current).toEqual(mapById([document1]));
      });
    });
  });
});
