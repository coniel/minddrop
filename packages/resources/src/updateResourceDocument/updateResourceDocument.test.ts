import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import {
  ResourceDocumentNotFoundError,
  ResourceValidationError,
} from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import {
  ResourceConfig,
  RDDataSchema,
  ResourceDocument,
  ResourceStore,
} from '../types';
import { updateResourceDocument as rawUpdateResourceDocument } from './updateResourceDocument';

// Test resource data
interface Data {
  foo: string;
  bar: string;
  baz: string;
}

// Test resource data schema
const dataSchema: RDDataSchema<Data> = {
  foo: { type: 'string' },
  bar: { type: 'string' },
  baz: { type: 'string', static: true },
};

// Test resource config
const config: ResourceConfig<Data> = {
  resource: 'tests',
  dataSchema,
  defaultData: { bar: 'bar', baz: 'baz' },
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<Data>>();

// Test document to update
const document = generateResourceDocument<Data>('tests', {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
});

// Create a typed version of the function
const updateResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<Data>>,
  config: ResourceConfig<Data>,
  documentId: string,
  data: Partial<Data>,
) =>
  rawUpdateResourceDocument<Data, ResourceDocument<Data>>(
    core,
    store,
    config,
    documentId,
    data,
  );

describe('updateResourceDocument', () => {
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
      updateResourceDocument(core, store, config, 'missing', {}),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('returns the updated document', () => {
    // Update a document
    const updated = updateResourceDocument(core, store, config, document.id, {
      foo: 'updated foo',
    });

    // Should return the updated document
    expect(updated.foo).toBe('updated foo');
  });

  it("calls the config's `onUpdate` callback", () => {
    // Add an `onUpdate` callback to the config
    const onUpdateConfig: ResourceConfig<Data> = {
      ...config,
      onUpdate: (core, update) => ({ ...update.after, foo: 'onUpdate foo' }),
    };

    // Update a doument using a config which contains an
    // `onUpdate` callback.
    const updated = updateResourceDocument(
      core,
      store,
      onUpdateConfig,
      document.id,
      { foo: 'updated foo', bar: 'updated bar' },
    );

    // Should merge the update data into the document
    expect(updated.bar).toBe('updated bar');
    // Should merge `onUpdate` data over the update data
    expect(updated.foo).toBe('onUpdate foo');
  });

  it('validates the updated document', () => {
    // Attempt to update a static field on a document.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      updateResourceDocument(core, store, config, document.id, {
        // @ts-ignore
        baz: 'updated baz',
      }),
    ).toThrowError(ResourceValidationError);
  });

  it('sets the updated document in the store', () => {
    // Update a dcoument
    updateResourceDocument(core, store, config, document.id, {
      foo: 'updated foo',
    });

    // Get the updated document from the store
    const updated = store.get(document.id);

    // Store document should be updated
    expect(updated.foo).toBe('updated foo');
  });

  it('dispatches a `[resource]:update` event', (done) => {
    // The changes to apply to the document
    const changes = { foo: 'updated foo' };

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
    updateResourceDocument(core, store, config, document.id, changes);
  });

  describe('internal updates', () => {
    it('throws if `revision` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `revision` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateResourceDocument(core, store, config, document.id, {
          // @ts-ignore
          revision: 'new-rev',
        }),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `updatedAt` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `updatedAt` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateResourceDocument(core, store, config, document.id, {
          // @ts-ignore
          updatedAt: new Date(),
        }),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `deleted` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `deleted` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateResourceDocument(core, store, config, document.id, {
          // @ts-ignore
          deleted: true,
        }),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `deletedAt` is updated without `isInternalUpdate`', () => {
      // Attempt to update a document's `deletedAt` field without the
      // `isInternalUpdate` flag being set. Should throw a
      // `ResourceValidationError`.
      expect(() =>
        updateResourceDocument(core, store, config, document.id, {
          // @ts-ignore
          deletedAt: true,
        }),
      ).toThrowError(ResourceValidationError);
    });

    it('allows internal only prperties to be updated if `isInternalUpdate` is true', () => {
      // Update a document's `deleted` and `deletedAt` properties with the
      // `isInternalUpdate` flag set to true.
      const updated = rawUpdateResourceDocument(
        core,
        store,
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
