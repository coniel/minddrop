import { Core } from '@minddrop/core';
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
  ConfigStore,
  TypedResourceConfig,
} from '../types';
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

// Register a test type
typeConfigsStore.register({
  type: 'test-type',
  dataSchema: typeDataSchema,
  defaultData: { typeBar: 'bar', typeBaz: 'baz' },
});

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
>({
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
  typeConfigsStore: ConfigStore<ResourceTypeConfig<BaseData, TypeData>>,
  config: TypedResourceConfig<BaseData>,
  documentId: string,
  data: Partial<BaseData & TypeData>,
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
    it('throws if `revision` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `revision` field without the
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
            revision: 'new-rev',
          },
        ),
      ).toThrowError(ResourceValidationError);
    });

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
});
