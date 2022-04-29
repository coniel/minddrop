import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { ResourceValidationError } from '../errors';
import { setup, cleanup, core } from '../test-utils';
import {
  ResourceConfig,
  ResourceDocumentDataSchema,
  ResourceDocument,
  ResourceStore,
} from '../types';
import { createResourceDocument as rawCreateResourceDocument } from './createResourceDocument';

interface Data {
  foo: string;
  bar: string;
  baz: string;
}

interface CreateData {
  foo: string;
  bar?: string;
}

type TestDocument = ResourceDocument<Data>;

const dataSchema: ResourceDocumentDataSchema<Data> = {
  foo: { type: 'string' },
  bar: { type: 'string' },
  baz: { type: 'string' },
};

const baseConfig: ResourceConfig<Data> = {
  resource: 'tests',
  dataSchema,
  defaultData: { bar: 'bar', baz: 'baz' },
};

const store = createResourceStore<Data>();

// Create a typed version of the function
const createResourceDocument = (
  core: Core,
  store: ResourceStore<TestDocument>,
  config: ResourceConfig<Data>,
  data: CreateData,
) => rawCreateResourceDocument(core, store, config, data);

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
