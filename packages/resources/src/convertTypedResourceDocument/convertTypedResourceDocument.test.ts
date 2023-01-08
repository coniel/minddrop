import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
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
  TRDTypeData,
} from '../types';
import { createConfigsStore } from '../createConfigsStore';
import { convertTypedResourceDocument as rawConvertTypedResourceDocument } from './convertTypedResourceDocument';
import {
  ResourceDocumentNotFoundError,
  ResourceTypeNotRegisteredError,
  ResourceValidationError,
} from '../errors';
import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore';
import { FieldValue } from '@minddrop/utils';
import { ResourceApisStore } from '../ResourceApisStore';
import { createTypedResource } from '../createTypedResource';

interface BaseData {
  staticBaseField: string;
  stringBaseField?: string;
  child?: string;
}

interface Type1Data {
  type1Field: string;
}

interface Type2Data {
  type2Field: string;
}

type TestDocument = TypedResourceDocument<BaseData, Type1Data | Type2Data>;

const resourceDataSchema: TRDBaseDataSchema<BaseData> = {
  staticBaseField: { type: 'string', static: true },
  stringBaseField: { type: 'string', required: false },
  child: {
    type: 'resource-id',
    resource: 'tests',
    required: false,
    addAsParent: true,
  },
};

const type1DataSchema: TRDTypeDataSchema<BaseData, Type1Data> = {
  type1Field: { type: 'string' },
};

const type2DataSchema: TRDTypeDataSchema<BaseData, Type2Data> = {
  type2Field: { type: 'string' },
};

// Test resource config
const config: TypedResourceConfig<BaseData, TypedResourceDocument<BaseData>> = {
  resource: 'tests',
  dataSchema: resourceDataSchema,
  defaultData: { staticBaseField: 'base-value' },
};

// Create a resource store for the test resource
const store = createResourceStore<TestDocument>();

// Create a configs store for the test resource type configs
const typeConfigsStore = createConfigsStore<
  ResourceTypeConfig<BaseData, Type1Data | Type2Data>
>({
  idField: 'type',
});

// Create test resource type configs
const type1Config = {
  type: 'type-1',
  dataSchema: type1DataSchema,
  defaultData: { type1Field: 'type-1-value' },
};
const type2Config = {
  type: 'type-2',
  dataSchema: type2DataSchema,
  defaultData: { type2Field: 'type-2-default-value', child: 'child-2' },
};

// Register the test resource types
typeConfigsStore.register(type1Config);
typeConfigsStore.register(type2Config);

// Register a resource type with an `onCreate` callback.
typeConfigsStore.register({
  type: 'with-on-create',
  dataSchema: type2DataSchema,
  onCreate: (core, document) => ({
    ...document,
    // Return a custom value for 'type2Field'
    type2Field: 'on-create-value',
  }),
});

// Register a resource type with both `onCreate` and
// `onConvert` callbacks.
typeConfigsStore.register({
  type: 'with-on-convert',
  dataSchema: type2DataSchema,
  onCreate: (core, document) => ({
    ...document,
    // Return a custom value for 'type2Field'
    type2Field: 'on-create-value',
  }),
  onConvert: <Type1Data>(core, original) => ({
    // Use the value of 'type1Field' for 'type2Field'
    type2Field: original.type1Field,
  }),
});

// Register a resource type with an `onConvert` callback
// that modifies a static field on the core data.
typeConfigsStore.register({
  type: 'with-static-core-value',
  dataSchema: type2DataSchema,
  // @ts-ignore
  onConvert: () => ({
    // Modify a core field value which should remain static
    id: 'modified',
  }),
});

// Register a resource type with an `onConvert` callback
// that modifies a protected field on the core data.
typeConfigsStore.register({
  type: 'with-protected-core-value',
  dataSchema: type2DataSchema,
  // @ts-ignore
  onConvert: () => ({
    // Modify a protected core field
    updatedAt: new Date(),
  }),
});

// Register a resource type with an `onConvert` callback
// that modifies a static field on the base data.
typeConfigsStore.register({
  type: 'with-static-base-value',
  dataSchema: type2DataSchema,
  onConvert: () => ({
    // Modify a base field value wich should remain static
    staticBaseField: 'modified',
  }),
});

// Register a resource type with an `onConvert` callback
// that sets an invalid base value.
typeConfigsStore.register({
  type: 'with-invalid-base-value',
  dataSchema: type2DataSchema,
  // @ts-ignore
  onConvert: () => ({
    // Set an invalid value
    // @ts-ignore
    stringBaseField: 1,
  }),
});

// Register a resource type with an `onConvert` callback
// that sets an invalid type value.
typeConfigsStore.register({
  type: 'with-invalid-type-value',
  dataSchema: type2DataSchema,
  // @ts-ignore
  onConvert: () => ({
    // Set an invalid value
    // @ts-ignore
    type2Field: 1,
  }),
});

// Test documents to convert
const document: TypedResourceDocument<BaseData, Type1Data> = {
  ...generateResourceDocument('tests', {
    type: 'type-1',
    staticBaseField: 'base-value',
    type1Field: 'type-1-value',
    child: 'child-1',
  }),
};
const unregisteredDocument = generateResourceDocument<
  BaseData & Type1Data & { type: string }
>('tests', {
  type: 'unregistered-type',
  staticBaseField: 'base-value',
  type1Field: 'type-1-value',
});
// Test parent documents
const child1: TypedResourceDocument<BaseData, Type1Data> = {
  ...generateResourceDocument('tests', {
    type: 'type-1',
    staticBaseField: 'base-value',
    type1Field: 'type-1-value',
    child: document.id,
  }),
  id: 'child-1',
  parents: [{ resource: 'tests', id: document.id }],
};
const child2: TypedResourceDocument<BaseData, Type1Data> = {
  ...generateResourceDocument('tests', {
    type: 'type-1',
    staticBaseField: 'base-value',
    type1Field: 'type-1-value',
    child: document.id,
  }),
  id: 'child-2',
};

// Create a typed version of the function
const convertTypedResourceDocument = <
  T extends TRDTypeData<BaseData> = Type2Data,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<BaseData, Type1Data | Type2Data>>,
  typeConfigsStore: ConfigsStore<
    ResourceTypeConfig<BaseData, Type1Data | Type2Data>
  >,
  config: TypedResourceConfig<
    BaseData,
    TypedResourceDocument<BaseData, Type1Data | Type2Data>
  >,
  documentId: string,
  newType: string,
) =>
  rawConvertTypedResourceDocument<BaseData, Type1Data | Type2Data>(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
    newType,
  ) as TypedResourceDocument<BaseData, T>;

describe('convertTypedResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Create a test typed resource
    const resource = createTypedResource(config, store);

    // Register the test resource API
    ResourceApisStore.register({
      ...resource,
      extension: core.extensionId,
    });

    // Register test resource types
    resource.register(core, type1Config);
    resource.register(core, type2Config);

    // Load the test documents
    store.load([document, unregisteredDocument, child1, child2]);
  });

  afterEach(() => {
    cleanup();
    ResourceApisStore.clear();
    store.clear();
  });

  it('throws if the document does not exist', () => {
    // Attempt to convert a document that does not exist.
    // Should throw a `ResourceDocumentNotFoundError`.
    expect(() =>
      convertTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'missing-document',
        'type-2',
      ),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('throws if the original type is not registered', () => {
    // Attempt to convert a document from a type that is not
    // registered. Should throw a `ResourceTypeNotRegisteredError`.
    expect(() =>
      convertTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        unregisteredDocument.id,
        'type-2',
      ),
    ).toThrowError(ResourceTypeNotRegisteredError);
  });

  it('throws if the new type is not registered', () => {
    // Attempt to convert a document to a type that is not
    // registered. Should throw a `ResourceTypeNotRegisteredError`.
    expect(() =>
      convertTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        document.id,
        'unregistered-type',
      ),
    ).toThrowError(ResourceTypeNotRegisteredError);
  });

  it('updates the element type', () => {
    // Convert a document from 'type-1' to 'type-2'.
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Should set `type` to 'type-2'.
    expect(converted.type).toBe('type-2');
  });

  it('preserves base data', () => {
    // Convert a document from 'type-1' to 'type-2'
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Should contain base document data
    expect(converted.staticBaseField).toBe(document.staticBaseField);
  });

  it('updates `revision` and `updatedAt`', () => {
    // Convert a document from 'type-1' to 'type-2'
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Should update `updatedAt`
    expect(converted.updatedAt).not.toEqual(document.updatedAt);
    // Should update `revision`
    expect(converted.revision).not.toEqual(document.revision);
  });

  it("adds the new type's `defaultData`", () => {
    // Convert a document from 'type-1' to 'type-2',
    // which defines a `defaultData` field.
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Should contain the data set by `defaultValue`
    expect(converted.type2Field).toBe('type-2-default-value');
  });

  it("adds the new type's `onCreate` data, overwiting `defaultData`", () => {
    // Convert a document from 'type-1' to 'with-on-create',
    // which defines a `onCreate` callback.
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'with-on-create',
    );

    // Should contain the data set by `onCreate`, which
    // overwrites the data from `defaultData`
    expect(converted.type2Field).toBe('on-create-value');
  });

  it("adds the new type's `onConvert` data, overwiting `onCreate` data", () => {
    // Convert a document from 'type-1' to 'with-on-convert',
    // which defines a `onConvert` callback.
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'with-on-convert',
    );

    // Should contain the data set by `onConvert` which is
    // taken from the original document and overwrites the
    // data from `onCreate`.
    expect(converted.type2Field).toBe('type-1-value');
  });

  describe('validation', () => {
    it('validates protected fields on core data', () => {
      // Convert a document from 'type-1' to 'with-protected-core-value',
      // which attempts to modify the protected core field 'updatedAt'.
      // Should throw a `ResourceValidationError` error.
      expect(() =>
        convertTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          'with-protected-core-value',
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('validates static fields on core data', () => {
      // Convert a document from 'type-1' to 'with-static-core-value',
      // which attempts to modify the static core field 'id'.
      // Should throw a `ValidationError` error.
      expect(() =>
        convertTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          'with-static-core-value',
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('validates the base data', () => {
      // Convert a document from 'type-1' to 'with-invalid-base-value',
      // which attempts to set a string type base value to a number.
      // Should throw a `ResourceValidationError` error.
      expect(() =>
        convertTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          'with-invalid-base-value',
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('validates static fields on base data', () => {
      // Convert a document from 'type-1' to 'with-static-base-value',
      // which attempts to modify the static core field 'staticBaseField'.
      // Should throw a `ResourceValidationError` error.
      expect(() =>
        convertTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          'with-static-base-value',
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('validates the type data', () => {
      // Convert a document from 'type-1' to 'with-invalid-type-value',
      // which attempts to set a string type type value to a number.
      // Should throw a `ResourceValidationError` error.
      expect(() =>
        convertTypedResourceDocument(
          core,
          store,
          typeConfigsStore,
          config,
          document.id,
          'with-invalid-type-value',
        ),
      ).toThrowError(ResourceValidationError);
    });
  });

  it('sets the updated document in the store', () => {
    // Convert a document from 'type-1' to 'type-2'
    convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Should update the document in the store
    expect(store.get(document.id).type).toBe('type-2');
  });

  it('adds the document to the document changes store', () => {
    // Convert a document from 'type-1' to 'type-2'
    const converted = convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Document update should be in the document changes
    // store's `updated` map.
    expect(ResourceDocumentChangesStore.updated[document.id]).toEqual({
      before: document,
      after: converted,
      changes: {
        updatedAt: converted.updatedAt,
        revision: converted.revision,
        type: 'type-2',
        staticBaseField: 'base-value',
        child: 'child-2',
        type1Field: FieldValue.delete(),
        type2Field: 'type-2-default-value',
      },
    });
  });

  it('runs schema delete hooks on the orignal document', () => {
    // Convert a document from 'type-1' to 'type-2'
    convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Get the original document's child document
    const child = store.get(child1.id);

    // Should remove converted document as a child
    // from parent.
    expect(child.parents).toEqual([]);
  });

  it('runs schema create hooks on the converted document', () => {
    // Convert a document from 'type-1' to 'type-2'
    convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );

    // Get the converted document's child document
    const child = store.get(child2.id);

    // Should add converted document as parent on
    // child document.
    expect(child.parents[0]).toEqual({ resource: 'tests', id: document.id });
  });

  it('dispatches a `[resource]:update` event', (done) => {
    // Listen to 'tests:update' events
    core.addEventListener('tests:update', (payload) => {
      // Ignore events dispatched by delete/create hooks
      if (payload.data.after.id !== document.id) {
        return;
      }

      // Get the converted document
      const converted = store.get(document.id);

      // Payload data should be the update
      expect(payload.data).toEqual({
        before: document,
        after: converted,
        changes: {
          updatedAt: converted.updatedAt,
          revision: converted.revision,
          type: 'type-2',
          staticBaseField: 'base-value',
          child: 'child-2',
          type1Field: FieldValue.delete(),
          type2Field: 'type-2-default-value',
        },
      });
      done();
    });

    // Convert a document from 'type-1' to 'type-2'
    convertTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      document.id,
      'type-2',
    );
  });
});
