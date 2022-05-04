import { setup, cleanup, core } from '../test-utils';
import { ResourceTypeNotRegisteredError } from '../errors';
import {
  ResourceTypeConfig,
  TypedResourceBaseDocumentDataSchema,
  TypedResourceDocument,
  TypedResourceTypeDocumentDataSchema,
} from '../types';
import { createTypedResource } from './createTypedResource';

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

const baseDataSchema: TypedResourceBaseDocumentDataSchema<BaseData> = {
  baseFoo: {
    type: 'string',
  },
  baseBar: {
    type: 'string',
  },
};

const typeDataScehma: TypedResourceTypeDocumentDataSchema<BaseData, TypeData> =
  {
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

const Api = createTypedResource<BaseData, BaseCreateData, BaseUpdateData>({
  resource: 'tests:test',
  dataSchema: baseDataSchema,
  defaultData: {
    baseFoo: 'foo',
    baseBar: 'bar',
  },
});

describe('createTypedResource', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    Api.store.clear();
    Api.typeConfigsStore.clear();
  });

  describe('register', () => {
    it('registers a new resource type', () => {
      // Register a new resource type
      Api.register(core, typeConfig);

      // Type should be registered
      expect(Api.getTypeConfig('test-type')).toEqual(typeConfig);
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
      expect(config).toEqual(typeConfig);
    });
  });

  describe('getAllTypeConfig', () => {
    it('returns all registered type configs', () => {
      const typeConfig2 = { ...typeConfig, type: 'test-type-2' };

      // Register two resource types
      Api.register(core, typeConfig);
      Api.register(core, typeConfig2);

      // Get the type config
      const configs = Api.getAllTypeConfigs();

      // Should return the requested config
      expect(configs).toEqual([typeConfig, typeConfig2]);
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
});
