import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { createResource } from '../createResource';
import { ResourceValidationError } from '../errors';
import { setup, cleanup, core } from '../test-utils';
import {
  ResourceConfig,
  RDDataSchema,
  ResourceDocument,
  ResourceStore,
  RDData,
} from '../types';
import { generateResourceDocument } from '../generateResourceDocument';
import { createResourceDocument as rawCreateResourceDocument } from './createResourceDocument';
import { ResourceApisStore } from '../ResourceApisStore';

interface Data {
  foo: string;
  bar: string;
  baz: string;
}

interface CreateData extends RDData {
  foo: string;
  bar?: string;
}

type TestDocument = ResourceDocument<Data>;

const dataSchema: RDDataSchema<Data> = {
  foo: { type: 'string' },
  bar: { type: 'string' },
  baz: { type: 'string' },
};

const baseConfig: ResourceConfig<Data> = {
  resource: 'tests',
  dataSchema,
  defaultData: { bar: 'bar', baz: 'baz' },
};

const store = createResourceStore<TestDocument>();

// Create a typed version of the function
const createResourceDocument = (
  core: Core,
  store: ResourceStore<TestDocument>,
  config: ResourceConfig<Data>,
  data: CreateData,
) => rawCreateResourceDocument<Data, CreateData>(core, store, config, data);

describe('createResourceDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the new document', () => {
    // Create a new document
    const document = createResourceDocument(core, store, baseConfig, {
      foo: 'foo',
    });

    // Document should have an ID
    expect(document.id).toBeDefined();
    // Document should have a revision
    expect(document.revision).toBeDefined();
    // Document should have a created at date
    expect(document.createdAt instanceof Date).toBeTruthy();
    // Docuemt should have an updatedAt date
    expect(document.updatedAt instanceof Date).toBeTruthy();
  });

  it('merges `defaultData` into the generated document', () => {
    // Create a new document using a config which specifies `defaultData`
    const document = createResourceDocument(core, store, baseConfig, {
      foo: 'foo',
    });

    // Document should contain default data
    expect(document.bar).toBe('bar');
  });

  it('merges provided data into the generated document', () => {
    // Create a new document
    const document = createResourceDocument(core, store, baseConfig, {
      foo: 'foo',
      bar: 'provided bar',
    });

    // Document should contain the provided data
    expect(document.foo).toBe('foo');
    // Provided data should overwrite default data
    expect(document.bar).toBe('provided bar');
  });

  it("merges the config's `onCreate` data into the document", () => {
    // Add an `onCreate` callback to the config
    const config: ResourceConfig<Data> = {
      ...baseConfig,
      onCreate: (c, document) => ({
        ...document,
        bar: 'onCreate bar',
      }),
    };

    // Create a resource document using a config containg an `onCreate`
    // callback. Should merge the returned data into the document.
    const document = createResourceDocument(core, store, config, {
      foo: 'foo',
    });

    // Document should contain the data added by `onCreate`
    expect(document.bar).toBe('onCreate bar');
  });

  it('validates the document', () => {
    // Create a document with an invalid value. Should throw a
    // `ResourceValidationError`.
    expect(() =>
      // @ts-ignore
      createResourceDocument(core, store, baseConfig, { foo: 1 }),
    ).toThrowError(ResourceValidationError);
  });

  it('adds the document to the store', () => {
    // Create a new document
    const document = createResourceDocument(core, store, baseConfig, {
      foo: 'foo',
    });

    // Document should be in the store
    expect(store.get(document.id)).toEqual(document);
  });

  it('runs schema create hooks', () => {
    type ParentData = { childId: string };

    // The config of the parent document (document being created)
    const parentConfig: ResourceConfig<ParentData> = {
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
    const parentStore = createResourceStore<ResourceDocument<ParentData>>();
    const parentResource = {
      ...createResource(parentConfig, parentStore),
      extension: core.extensionId,
    };
    const childResource = {
      ...createResource(childConfig),
      extension: core.extensionId,
    };
    ResourceApisStore.register([parentResource, childResource]);

    // Generate a 'child' document
    const childDocument = generateResourceDocument('child', {});

    // Load the child document into the 'child' resource store
    childResource.store.load(core, [childDocument]);

    // Create a 'parent' document that references the child document
    // created above.
    const parentDocument = rawCreateResourceDocument<ParentData, {}>(
      core,
      parentStore,
      parentConfig,
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
    createResourceDocument(core, store, baseConfig, {
      foo: 'foo',
    });
  });
});
