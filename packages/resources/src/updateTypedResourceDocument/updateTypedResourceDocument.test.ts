import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import { createResourceStore } from '../createResourceStore';
import {
  ResourceDocumentNotFoundError,
  ResourceValidationError,
} from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import {
  TRDBaseDataSchema,
  TRDTypeDataSchema,
  TypedResourceDocument,
  ResourceTypeConfig,
  ResourceStore,
  ConfigsStore,
  TypedResourceConfig,
  ResourceConfig,
} from '../types';
import { createTypedResource } from '../createTypedResource';
import { createResource } from '../createResource';
import { ResourceApisStore } from '../ResourceApisStore';
import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore';
import { createConfigsStore } from '../createConfigsStore';
import { updateTypedResourceDocument as rawUpdateResourceDocument } from './updateTypedResourceDocument';

interface BaseData {
  baseFoo: string;
  baseBar: string;
  baseBaz: string;
}

interface TypeData {
  typeFoo: string;
  typeBar: string;
  typeBaz: string;
}

interface BaseUpdateData {
  baseFoo?: string;
  baseBar?: string;
}

interface TypeUpdateData {
  typeFoo?: string;
  typeBar?: string;
  type?: string;
}

type TestDocument = TypedResourceDocument<BaseData, TypeData>;

const resourceDataSchema: TRDBaseDataSchema<BaseData> = {
  baseFoo: { type: 'string' },
  baseBar: { type: 'string' },
  baseBaz: { type: 'string', static: true },
};

const typeDataSchema: TRDTypeDataSchema<BaseData, TypeData> = {
  typeFoo: { type: 'string' },
  typeBar: { type: 'string' },
  typeBaz: { type: 'string', static: true },
};

// Test resource config
const config: TypedResourceConfig<BaseData> = {
  resource: 'tests',
  dataSchema: resourceDataSchema,
  defaultData: { baseBar: 'bar', baseBaz: 'baz' },
};

// Create a resource store for the test resource
const store = createResourceStore<TestDocument>();

// Create a configs store for the test resource type configs
const typeConfigsStore = createConfigsStore<
  ResourceTypeConfig<BaseData, TypeData>
>({
  idField: 'type',
});

// Create a test resource type config
const typeConfig = {
  type: 'test-type',
  dataSchema: typeDataSchema,
  defaultData: { typeBar: 'bar', typeBaz: 'baz' },
};

// Register the test resource type
typeConfigsStore.register(typeConfig);

// Create a config with an `onUpdate` callback
const onUpdateConfig: TypedResourceConfig<BaseData> = {
  ...config,
  onUpdate: (core, update) => ({
    ...update.after,
    baseFoo: 'onUpdate foo',
  }),
};

// Register a resource type with an `onUpdate` callback
typeConfigsStore.register({
  type: 'with-onupdate',
  dataSchema: typeDataSchema,
  onUpdate: (core, update) => ({
    ...update.after,
    typeFoo: 'onUpdate foo',
  }),
});

// Test document to update
const document = generateResourceDocument<
  BaseData & TypeData & { type: string }
>('tests', {
  type: 'test-type',
  baseFoo: 'foo',
  baseBar: 'bar',
  baseBaz: 'baz',
  typeFoo: 'foo',
  typeBar: 'bar',
  typeBaz: 'baz',
});

// Create a typed version of the function
const updateTypedResourceDocument = (
  core: Core,
  store: ResourceStore<TypedResourceDocument<BaseData>>,
  typeConfigsStore: ConfigsStore<ResourceTypeConfig<BaseData, TypeData>>,
  config: TypedResourceConfig<BaseData>,
  documentId: string,
  data: Partial<BaseData & TypeData & { type?: string }>,
) =>
  rawUpdateResourceDocument<BaseData, TypeData, BaseUpdateData, TypeUpdateData>(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
    data,
  );

describe('updateTypedResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set the test document in the store
    store.set(document);
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to update a non-existant document. Should
    // throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      updateTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'missing',
        {},
      ),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('returns the updated document', () => {
    // Update a document
    const updated = updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      {
        baseFoo: 'updated foo',
        typeFoo: 'updated foo',
      },
    );

    // Should return the updated document
    expect(updated.baseFoo).toBe('updated foo');
    expect(updated.typeFoo).toBe('updated foo');
  });

  it("calls the config's `onUpdate` callback", () => {
    // Update a doument using a config which contains an
    // `onUpdate` callback.
    const updated = updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      onUpdateConfig,
      document.id,
      { baseFoo: 'updated foo', baseBar: 'updated bar' },
    );

    // Should merge the update data into the document
    expect(updated.baseBar).toBe('updated bar');
    // Should merge `onUpdate` data over the update data
    expect(updated.baseFoo).toBe('onUpdate foo');
  });

  it("calls the type config's `onUpdate` callback", () => {
    // Reset the test document in the store to be of
    // type 'with-onupdate'.
    store.set({ ...document, type: 'with-onupdate' });

    // Update the 'with-onupdate' document
    const updated = updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      { typeFoo: 'updated foo', typeBar: 'updated bar' },
    );

    // Should merge the update data into the document
    expect(updated.typeBar).toBe('updated bar');
    // Should merge `onUpdate` data over the update data
    expect(updated.typeFoo).toBe('onUpdate foo');
  });

  it('supports all methods of data setting at once', () => {
    // Reset the test document in the store to be of
    // type 'with-onupdate'.
    store.set({ ...document, type: 'with-onupdate' });

    // Update the 'with-onupdate' doument using a config
    // which contains an `onUpdate` callback.
    const updated = updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      onUpdateConfig,
      document.id,
      {
        baseFoo: 'updated foo',
        baseBar: 'updated bar',
        typeFoo: 'updated foo',
        typeBar: 'updated bar',
      },
    );

    // Should merge the update data into the document
    expect(updated.baseBar).toBe('updated bar');
    expect(updated.typeBar).toBe('updated bar');
    // Should merge `onUpdate` data over the update data
    expect(updated.baseFoo).toBe('onUpdate foo');
    expect(updated.typeFoo).toBe('onUpdate foo');
  });

  it('validates the updated base data', () => {
    // Attempt to update a static base field on a document.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      updateTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        document.id,
        {
          // @ts-ignore
          baseBaz: 'updated baz',
        },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('validates the updated type data', () => {
    // Attempt to update a static type field on a document.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      updateTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        document.id,
        {
          // @ts-ignore
          typeBaz: 'updated baz',
        },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('sets the updated document in the store', () => {
    // Update a dcoument
    updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      {
        baseFoo: 'updated foo',
        typeFoo: 'updated foo',
      },
    );

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Store document should be updated
    expect(updated.baseFoo).toBe('updated foo');
    expect(updated.typeFoo).toBe('updated foo');
  });

  it('adds the document to the document changes store', () => {
    // Update a dcoument
    const updated = updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      {
        baseFoo: 'updated foo',
        typeFoo: 'updated foo',
      },
    );

    // Document update should be in the document changes
    // store's `updated` map.
    expect(ResourceDocumentChangesStore.updated[document.id]).toEqual({
      before: document,
      after: updated,
      changes: {
        baseFoo: 'updated foo',
        typeFoo: 'updated foo',
        updatedAt: updated.updatedAt,
        revision: updated.revision,
      },
    });
  });

  it('runs schema update hooks', () => {
    type ParentData = { childId?: string };

    // The config of the parent document (document being created)
    const parentConfig: TypedResourceConfig<ParentData> = {
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
    const parentStore =
      createResourceStore<TypedResourceDocument<ParentData>>();
    const parentResource = {
      ...createTypedResource(parentConfig, parentStore),
      extension: core.extensionId,
    };
    const childResource = {
      ...createResource(childConfig),
      extension: core.extensionId,
    };
    ResourceApisStore.register([parentResource, childResource]);

    // Register the 'test-type' parent resource type
    parentResource.register(core, typeConfig);

    // Generate test documents
    const childDocument = generateResourceDocument('child', {});
    const parentDocument = generateResourceDocument('parent', {
      type: 'test-type',
    });

    // Load test documents into their respective stores
    childResource.store.load(core, [childDocument]);
    parentResource.store.load(core, [parentDocument]);

    // Update the 'parent' document, adding the 'child' document as a child
    rawUpdateResourceDocument<ParentData, { foo: 'string' }, {}, {}>(
      core,
      parentStore,
      typeConfigsStore,
      parentConfig,
      parentDocument.id,
      {
        childId: childDocument.id,
      },
    );

    // Get the updated 'child' document
    const child = childResource.get(childDocument.id);

    // 'child' document should have the created document as a parent
    expect(child.parents).toEqual([
      { resource: 'parent', id: parentDocument.id },
    ]);
  });

  it('dispatches a `[resource]:update` event', (done) => {
    // The changes to apply to the document
    const changes = { baseFoo: 'updated foo', typeFoo: 'updated foo' };

    // Listen to 'tests:update' events
    core.addEventListener('tests:update', (payload) => {
      // Get the updated document
      const updated = store.get(document.id);

      // Payload data should be the update
      expect(payload.data).toEqual({
        before: document,
        after: updated,
        changes: {
          ...changes,
          updatedAt: updated.updatedAt,
          revision: updated.revision,
        },
      });
      done();
    });

    // Update a document
    updateTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      changes,
    );
  });

  describe('internal updates', () => {
    it('throws if `updatedAt` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `updatedAt` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          {
            // @ts-ignore
            updatedAt: new Date(),
          },
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `deleted` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `deleted` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          {
            // @ts-ignore
            deleted: true,
          },
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `deletedAt` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `deletedAt` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          {
            // @ts-ignore
            deletedAt: true,
          },
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('allows internal only prperties to be updated if `isInternalUpdate` is true', () => {
      // Update a document's `deleted` and `deletedAt` properties with the
      // `isInternalUpdate` flag set to true.
      const updated = rawUpdateResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        document.id,
        { deleted: true, deletedAt: new Date() },
        true,
      );

      // Document should be updated
      expect(updated.deleted).toBe(true);
    });
  });

  describe('type change', () => {
    it('throws if the type has changed', () => {
      // Update a document, changing it from one type to another.
      // Should throw a `InvalidParameterError`.
      expect(() =>
        updateTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          { type: 'new-type' },
        ),
      ).toThrowError(InvalidParameterError);
    });
  });
});
