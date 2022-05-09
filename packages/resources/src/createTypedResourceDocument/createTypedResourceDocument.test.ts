import { Core } from '@minddrop/core';
import { setup, cleanup, core } from '../test-utils';
import {
  ResourceValidationError,
  ResourceTypeNotRegisteredError,
} from '../errors';
import { createResourceStore } from '../createResourceStore';
import {
  ResourceTypeConfigsStore,
  TypedResourceDocument,
  ResourceStore,
  ResourceTypeConfig,
  TRDBaseDataSchema,
  TRDTypeDataSchema,
  TypedResourceConfig,
} from '../types';
import { createTypedResourceDocument as rawCreateTypedResourceDocument } from './createTypedResourceDocument';
import { createConfigsStore } from '../createConfigsStore';

interface BaseData {
  resourceFoo: string;
  resourceBar: string;
  resourceBaz: string;
}

interface BaseCreateData {
  resourceFoo: string;
  resourceBar?: string;
}

interface TypeData {
  typeFoo: string;
  typeBar: string;
  typeBaz: string;
}

interface TypeCreateData {
  typeFoo: string;
  typeBar?: string;
}

type TestDocument = TypedResourceDocument<BaseData, TypeData>;

const resourceDataSchema: TRDBaseDataSchema<BaseData> = {
  resourceFoo: { type: 'string' },
  resourceBar: { type: 'string' },
  resourceBaz: { type: 'string' },
};

const typeDataSchema: TRDTypeDataSchema<BaseData, TypeData> = {
  typeFoo: { type: 'string' },
  typeBar: { type: 'string' },
  typeBaz: { type: 'string' },
};

const config: TypedResourceConfig<BaseData> = {
  resource: 'tests',
  dataSchema: resourceDataSchema,
  defaultData: { resourceBar: 'bar', resourceBaz: 'baz' },
};

const store = createResourceStore<TestDocument>();
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

// Create a typed version of the function
const createTypedResourceDocument = (
  core: Core,
  store: ResourceStore<TestDocument>,
  typeConfigsStore: ResourceTypeConfigsStore<BaseData, TypeData>,
  config: TypedResourceConfig<BaseData>,
  type: string,
  data?: BaseCreateData & TypeCreateData,
) =>
  rawCreateTypedResourceDocument<
    BaseData,
    TypeData,
    BaseCreateData,
    TypeCreateData
  >(core, store, typeConfigsStore, config, type, data);

describe('createTypedResourceDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the resource type is not registered', () => {
    // Attempt to create a resource document of a type which is not
    // registered. Should throw a `ResourceTypeNotRegisteredError`.
    expect(() =>
      createTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'unregistered',
      ),
    ).toThrowError(ResourceTypeNotRegisteredError);
  });

  it('returns the new document', () => {
    // Create a new document
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should have an ID
    expect(document.id).toBeDefined();
    // Document should have a revision
    expect(document.revision).toBeDefined();
    // Document should have a created at date
    expect(document.createdAt instanceof Date).toBeTruthy();
    // Docuemt should have an updatedAt date
    expect(document.updatedAt instanceof Date).toBeTruthy();
  });

  it('adds the type to the document', () => {
    // Create a new document
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should have the specified type
    expect(document.type).toBe('test-type');
  });

  it('merges the base resource `defaultData` into the generated document', () => {
    // Create a new document using a config which specifies `defaultData`
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should contain default base resource data
    expect(document.resourceBar).toBe('bar');
  });

  it('merges the resource type `defaultData` into the generated document', () => {
    // Create a new document using a resource type config which specifies `defaultData`
    let document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should contain default data
    expect(document.typeBar).toBe('bar');

    // Create a new document using a resource type config which specifies `defaultData`,
    // wihout providing a data argument.
    document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
    );

    // Document should contain default data
    expect(document.typeBar).toBe('bar');
  });

  it('merges provided base resource data into the generated document', () => {
    // Create a new document
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
        resourceBar: 'provided bar',
      },
    );

    // Document should contain the provided data
    expect(document.resourceFoo).toBe('foo');
    // Provided data should overwrite default data
    expect(document.resourceBar).toBe('provided bar');
  });

  it('merges provided type specific resource data into the generated document', () => {
    // Create a new document
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
        typeBar: 'provided bar',
      },
    );

    // Document should contain the provided data
    expect(document.typeFoo).toBe('foo');
    // Provided data should overwrite default data
    expect(document.typeBar).toBe('provided bar');
  });

  it("merges the resource config's `onCreate` data into the document", () => {
    // Add an `onCreate` callback to the config
    const onCreateConfig: TypedResourceConfig<BaseData> = {
      ...config,
      onCreate: (c, document) => ({
        ...document,
        resourceBar: 'onCreate bar',
      }),
    };

    // Create a resource document using a config containg an `onCreate`
    // callback. Should merge the returned data into the document.
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      onCreateConfig,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should contain the data added by `onCreate`
    expect(document.resourceBar).toBe('onCreate bar');
  });

  it("merges the type config's `onCreate` data into the document", () => {
    // Register a resource type which provides an `onCreate` callback
    typeConfigsStore.register({
      type: 'type-with-oncreate',
      dataSchema: typeDataSchema,
      defaultData: { typeBar: 'bar', typeBaz: 'baz' },
      onCreate: (c, document) => ({
        ...document,
        typeBar: 'onCreate bar',
      }),
    });

    // Create a resource document using a type which has an `onCreate`
    // callback. Should merge the returned data into the document.
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'type-with-oncreate',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should contain the data added by `onCreate`
    expect(document.typeBar).toBe('onCreate bar');
  });

  it('validates the base document data', () => {
    // Create a document with an invalid value for a field defined
    // by the base resource. Should throw a `ResourceValidationError`.
    expect(() =>
      createTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'test-type',
        {
          // @ts-ignore
          resourceFoo: 1,
          typeFoo: 'foo',
        },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('validates the type specific document data', () => {
    // Create a document with an invalid value for a field
    // defined by the resource type. Should throw a
    // `ResourceValidationError`.
    expect(() =>
      createTypedResourceDocument(
        core,
        store,
        typeConfigsStore,
        config,
        'test-type',
        {
          // @ts-ignore
          typeFoo: 1,
          resourceFoo: 'foo',
        },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('adds the document to the store', () => {
    // Create a new document
    const document = createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );

    // Document should be in the store
    expect(store.get(document.id)).toEqual(document);
  });

  it('dispatches a `[resource]:create` event', (done) => {
    // Listen to 'tests:create' events
    core.addEventListener('tests:create', (payload) => {
      // Get the created document
      const document = store.get(payload.data.id);

      // Payload data should be the created document
      expect(payload.data).toEqual(document);
      done();
    });

    // Create a new document
    createTypedResourceDocument(
      core,
      store,
      typeConfigsStore,
      config,
      'test-type',
      {
        resourceFoo: 'foo',
        typeFoo: 'foo',
      },
    );
  });
});