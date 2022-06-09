import { renderHook, act } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { createResourceStore } from '../createResourceStore';
import {
  InvalidResourceSchemaError,
  ResourceDocumentNotFoundError,
  ResourceValidationError,
} from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceApisStore } from '../ResourceApisStore';
import { cleanup, core } from '../test-utils';
import { ResourceApi, RDDataSchema, ResourceDocument } from '../types';
import { createResource } from './createResource';

interface Data {
  foo: string;
  bar: string;
  baz: string;
  qux: string;
}

interface CreateData {
  foo?: string;
  qux?: string;
}

interface UpdateData {
  foo?: string;
  bar?: string;
}

const dataSchema: RDDataSchema<Data> = {
  foo: {
    type: 'string',
    required: true,
  },
  bar: {
    type: 'string',
    required: true,
  },
  baz: {
    type: 'string',
    required: true,
  },
  qux: {
    type: 'string',
    static: true,
  },
};

const onClear = jest.fn();

const ResourceApi = {
  ...createResource<Data, CreateData, UpdateData>({
    resource: 'tests:test',
    dataSchema,
    defaultData: {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
      qux: 'qux',
    },
    onClear,
    onCreate: (core, document) => ({
      ...document,
      baz: 'onCreate baz',
      qux: 'onCreate qux',
    }),
    onUpdate: (core, update) => ({ ...update.changes, bar: 'onUpdate bar' }),
    onGet: (document) => ({ ...document, qux: 'onGet qux' }),
  }),
  extension: core.extensionId,
};

describe('resource API', () => {
  let existingDoc1: ResourceDocument<Data>;
  let existingDoc2: ResourceDocument<Data>;

  afterEach(() => {
    act(() => {
      ResourceApi.store.clear();
      cleanup();
    });
  });

  beforeEach(() => {
    act(() => {
      // Register the test resource type
      ResourceApisStore.register(ResourceApi);
      // Create a couple of test documents
      existingDoc1 = ResourceApi.create(core, {});
      existingDoc2 = ResourceApi.create(core, {});
    });
  });

  it('validates the data schema', () => {
    // Create a resource using an invalid data schema.
    // Should throw a `InvalidResourceDocumentSchema` error.
    expect(() =>
      createResource({
        resource: 'test',
        // @ts-ignore
        dataSchema: { foo: { type: 'string', allowEmpty: 1 } },
      }),
    ).toThrowError(InvalidResourceSchemaError);
  });

  it('accepts a custom store', () => {
    // Create a resource store
    const store = createResourceStore<ResourceDocument<{ foo: string }>>();

    // Create a resource using the custom store
    const withCustomStore = createResource(
      {
        resource: 'tests:test',
        dataSchema: { foo: { type: 'string' } },
      },
      store,
    );

    // Create a document
    const document = withCustomStore.create(core, { foo: 'foo' });

    // Should have set the document in the provided store
    expect(store.get(document.id)).toEqual(document);
  });

  describe('create', () => {
    it('creates a document using the default data', () => {
      // Create a new document
      const document = ResourceApi.create(core, {});

      // Document should contain default data
      expect(document.bar).toBe('bar');
    });

    it('merges in the provided data', () => {
      // Create a new document
      const document = ResourceApi.create(core, { foo: 'data foo' });

      // Document should contain provided data which overwrites
      // default data.
      expect(document.foo).toBe('data foo');
    });

    it("merges in the `onCreate` callback's data", () => {
      // Create a new document
      const document = ResourceApi.create(core, {
        qux: 'data qux',
      });

      // Document should contain `onCreate` callback data which
      // overwrites default and provided data.
      expect(document.baz).toBe('onCreate baz');
      expect(document.qux).toBe('onCreate qux');
    });

    it('adds the document to the store', () => {
      // Create a new document
      const document = ResourceApi.create(core, {});

      // Document should be in the store
      expect(ResourceApi.store.get(document.id)).toEqual(document);
    });

    it('validates the created document', () => {
      // Attempt to create an invalid document. Should throw a
      // `ResourceDocumentValidationError`.
      // @ts-ignore
      expect(() => ResourceApi.create(core, { foo: 1234 })).toThrowError(
        ResourceValidationError,
      );
    });

    it('dispatches a `tests:test:create` event', (done) => {
      // Listen to 'tests:test:create' events
      core.addEventListener('tests:test:create', (payload) => {
        // Get the created document
        const document = ResourceApi.store.get(payload.data.id);

        // Payload data should be the created document
        expect(payload.data).toEqual(document);
        done();
      });

      // Create a new document
      ResourceApi.create(core, { foo: 'provided foo' });
    });
  });

  describe('update', () => {
    it('updates a document using the provided data', () => {
      // Update a document
      const updated = ResourceApi.update(core, existingDoc1.id, {
        foo: 'updated foo',
      });

      // Document should be updated
      expect(updated.foo).toBe('updated foo');
    });

    it("uses the config's `onUpdate` data", () => {
      // Update a document
      const updated = ResourceApi.update(core, existingDoc1.id, {
        bar: 'updated bar',
      });

      // Document should contain `onUpdate` data
      expect(updated.bar).toBe('onUpdate bar');
    });

    it('sets the updated document in the store', () => {
      // Update a document
      ResourceApi.update(core, existingDoc1.id, {
        foo: 'updated foo',
      });

      // Get the document from the store
      const storeDoc = ResourceApi.get(existingDoc1.id);

      // Store document should be updated
      expect(storeDoc.foo).toBe('updated foo');
    });

    it('dispatches a `tests:test:update` event', (done) => {
      // Listen to 'tests:test:update' events
      core.addEventListener('tests:test:update', (payload) => {
        // Get the updated document
        const updatedDocument = ResourceApi.store.get(existingDoc1.id);

        // Payload data should be an update object
        expect(payload.data).toEqual({
          before: existingDoc1,
          after: updatedDocument,
          changes: {
            foo: 'updated foo',
            bar: 'onUpdate bar',
            revision: updatedDocument.revision,
            updatedAt: updatedDocument.updatedAt,
          },
        });
        done();
      });

      // Update a document
      ResourceApi.update(core, existingDoc1.id, { foo: 'updated foo' });
    });
  });

  describe('delete', () => {
    it('soft-deletes the document', () => {
      // Delete a document
      const document = ResourceApi.delete(core, existingDoc1.id);

      // Document should be deleted
      expect(document.deleted).toBe(true);
    });

    it('sets the deleted document in the store', () => {
      // Delete a document
      ResourceApi.delete(core, existingDoc1.id);

      // Get the document from the store
      const document = ResourceApi.get(existingDoc1.id);

      // Document should be deleted
      expect(document.deleted).toBe(true);
    });

    it('dispatches a `tests:test:delete` event', (done) => {
      // Listen to 'tests:test:delete' events
      core.addEventListener('tests:test:delete', (payload) => {
        // Get the deleted document
        const deletedDocument = ResourceApi.store.get(existingDoc1.id);

        // Payload data should be the deleted document
        expect(payload.data).toEqual(deletedDocument);
        done();
      });

      // Delete a document
      ResourceApi.delete(core, existingDoc1.id);
    });
  });

  describe('restore', () => {
    beforeEach(() => {
      // Delete the document
      ResourceApi.delete(core, existingDoc1.id);
    });

    it('restores the document', () => {
      // Restore a document
      const document = ResourceApi.restore(core, existingDoc1.id);

      // Document should be restored
      expect(document.deleted).toBeUndefined();
    });

    it('sets the restored document in the store', () => {
      // Restore a document
      ResourceApi.restore(core, existingDoc1.id);

      // Get the document from the store
      const document = ResourceApi.get(existingDoc1.id);

      // Document should be restored
      expect(document.deleted).toBeUndefined();
    });

    it('dispatches a `tests:test:restore` event', (done) => {
      // Listen to 'tests:test:restore' events
      core.addEventListener('tests:test:restore', (payload) => {
        // Get the restored document
        const restoredDocument = ResourceApi.store.get(existingDoc1.id);

        // Payload data should be the restored document
        expect(payload.data).toEqual(restoredDocument);
        done();
      });

      // Restore a document
      ResourceApi.restore(core, existingDoc1.id);
    });
  });

  describe('deletePermanently', () => {
    it('removes the document from the store', () => {
      // Permanently delete a document
      ResourceApi.deletePermanently(core, existingDoc1.id);

      // Document should no longer be in the store
      expect(() => ResourceApi.get(existingDoc1.id)).toThrowError(
        ResourceDocumentNotFoundError,
      );
    });

    it('dispatches a `tests:test:delete-permanently` event', (done) => {
      // Listen to 'tests:test:delete-permanently' events
      core.addEventListener('tests:test:delete-permanently', (payload) => {
        // Payload data should be the deleted document
        expect(payload.data).toEqual(existingDoc1);
        done();
      });

      // Permanently delete a document
      ResourceApi.deletePermanently(core, existingDoc1.id);
    });

    it('returns the deleted document', () => {
      // Permanently delete a document
      const document = ResourceApi.deletePermanently(core, existingDoc1.id);

      // Should return the document
      expect(document).toEqual(existingDoc1);
    });
  });

  describe('addParents', () => {
    it('adds parents to the document', () => {
      // Create a parent reference
      const parentRef = { id: existingDoc2.id, resource: ResourceApi.resource };

      // Add a parent to a document
      ResourceApi.addParents(core, existingDoc1.id, [parentRef]);

      // Get the updated document
      const document = ResourceApi.get(existingDoc1.id);

      // Document should contain the parent
      expect(document.parents).toEqual([parentRef]);
    });
  });

  describe('removeParents', () => {
    it('removes parents from the document', () => {
      // Create a parent reference
      const parentRef = { id: existingDoc2.id, resource: ResourceApi.resource };

      // Add a parent to a document
      ResourceApi.addParents(core, existingDoc1.id, [parentRef]);
      // Remove the parent from a document
      ResourceApi.removeParents(core, existingDoc1.id, [parentRef]);

      // Get the updated document
      const document = ResourceApi.get(existingDoc1.id);

      // Document should not contain the parent
      expect(document.parents).toEqual([]);
    });
  });

  describe('get', () => {
    describe('single document', () => {
      it('returns the requested document given a single ID', () => {
        // Get a document
        const document = ResourceApi.get(existingDoc1.id);

        // Should return the document
        expect(document).toBeDefined();
        expect(document.id).toBe(existingDoc1.id);
      });

      it("merges in the config's `onGet` data", () => {
        // Get a document
        const document = ResourceApi.get(existingDoc2.id);

        // Should merge the data returned by the config's `onGet`
        // callback into the returned document.
        expect(document.qux).toBe('onGet qux');
      });
    });

    describe('multiple documents', () => {
      it('returns the requested documents given multiple IDs', () => {
        // Get some documents
        const documents = ResourceApi.get([existingDoc1.id, existingDoc2.id]);

        // Should return the documents mapped by ID
        expect(documents[existingDoc1.id]).toBeDefined();
        expect(documents[existingDoc2.id]).toBeDefined();
      });

      it("merges in the config's `onGet` data", () => {
        // Get some documents
        const documents = ResourceApi.get([existingDoc1.id, existingDoc2.id]);

        // Should merge the data returned by the config's `onGet`
        // callback into the returned documents.
        expect(documents[existingDoc2.id].qux).toBe('onGet qux');
      });
    });
  });

  describe('getAll', () => {
    it('returns all the documents from the store', () => {
      // Get some documents
      const documents = ResourceApi.getAll();

      // Should return the documents mapped by ID
      expect(documents[existingDoc1.id]).toBeDefined();
      expect(documents[existingDoc2.id]).toBeDefined();
    });

    it("merges in the config's `onGet` data", () => {
      // Get some documents
      const documents = ResourceApi.get([existingDoc1.id, existingDoc2.id]);

      // Should merge the data returned by the config's `onGet`
      // callback into the returned documents.
      expect(documents[existingDoc2.id].qux).toBe('onGet qux');
    });
  });

  describe('store', () => {
    // Generate a test document that is not in the store
    const document = generateResourceDocument<Data>('tests:test', {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
      qux: 'qux',
    });

    describe('get', () => {
      describe('single document', () => {
        it('returns the requested document given a single ID', () => {
          // Get a document
          const document = ResourceApi.store.get(existingDoc1.id);

          // Should return the document
          expect(document).toBe(existingDoc1);
        });
      });

      describe('multiple documents', () => {
        it('returns the requested documents given multiple IDs', () => {
          // Get some documents
          const documents = ResourceApi.store.get([
            existingDoc1.id,
            existingDoc2.id,
          ]);

          // Should return the documents mapped by ID
          expect(documents).toEqual(mapById([existingDoc1, existingDoc2]));
        });
      });
    });

    describe('getAll', () => {
      it('returns all the documents from the store', () => {
        // Get some documents
        const documents = ResourceApi.store.getAll();

        // Should return all store documents mapped by ID
        expect(documents).toEqual(mapById([existingDoc1, existingDoc2]));
      });
    });

    describe('store', () => {
      describe('load', () => {
        it('loads documents into the store', () => {
          // Load a document
          ResourceApi.store.load(core, [document]);

          // Document should be in the store
          expect(ResourceApi.store.get(document.id)).toEqual(document);
        });

        it('dispatches a `tests:test:load` event', (done) => {
          // Listen to 'tests:test:load' events
          core.addEventListener('tests:test:load', (payload) => {
            // Payload data should be the loaded documents
            expect(payload.data).toEqual([document]);
            done();
          });

          // Load a document
          ResourceApi.store.load(core, [document]);
        });
      });

      describe('hooks', () => {
        // Create some test documents, including a delted one
        const document1 = document;
        const document2 = { ...document, id: 'doc-2' };
        const deletedDocument: ResourceDocument<Data> = {
          ...document,
          id: 'doc-3',
          deleted: true,
          deletedAt: new Date(),
        };

        beforeEach(() => {
          act(() => {
            // Clear the store
            ResourceApi.store.clear();
            // Load test documents
            ResourceApi.store.load(core, [
              document1,
              document2,
              deletedDocument,
            ]);
          });
        });

        describe('useDocument', () => {
          it('returns the requested document', () => {
            // Get a document
            const { result } = renderHook(() =>
              ResourceApi.hooks.useDocument(document.id),
            );

            // Should return the document
            expect(result.current).toEqual(document);
          });

          it('returns null if the document does not exist', () => {
            // Get a missing document
            const { result } = renderHook(() =>
              ResourceApi.hooks.useDocument('missing'),
            );

            // Should return null
            expect(result.current).toBeNull();
          });
        });

        describe('useDocuments', () => {
          it('returns the requested documents', () => {
            // Get a couple of documents
            const { result } = renderHook(() =>
              ResourceApi.hooks.useDocuments([document1.id, document2.id]),
            );

            // Should return the requested docuemnts
            expect(result.current).toEqual(mapById([document1, document2]));
          });

          it('filters the results', () => {
            // Get a couple of documents, filtering out deleted ones
            const { result } = renderHook(() =>
              ResourceApi.hooks.useDocuments(
                [document1.id, deletedDocument.id],
                {
                  deleted: false,
                },
              ),
            );

            // Returned map should contain only the active document
            expect(result.current).toEqual(mapById([document1]));
          });
        });

        describe('useAllDocuments', () => {
          it('returns all documents', () => {
            // Get a all documents
            const { result } = renderHook(() =>
              ResourceApi.hooks.useAllDocuments(),
            );

            // Should return all documents
            expect(result.current).toEqual(
              mapById([document1, document2, deletedDocument]),
            );
          });

          it('filters the results', () => {
            // Get all documents, filtering out deleted ones
            const { result } = renderHook(() =>
              ResourceApi.hooks.useAllDocuments({
                deleted: false,
              }),
            );

            // Returned map should contain only the active documents
            expect(result.current).toEqual(mapById([document1, document2]));
          });
        });
      });

      describe('add', () => {
        it('adds a document to the store', () => {
          // Add a document
          ResourceApi.store.add(core, document);

          // Document should be in the store
          expect(ResourceApi.store.get(document.id)).toEqual(document);
        });

        it('dispatches a `tests:test:add` event', (done) => {
          // Listen to 'tests:test:add' events
          core.addEventListener('tests:test:add', (payload) => {
            // Payload data should be the added document
            expect(payload.data).toEqual(document);
            done();
          });

          // Add a document
          ResourceApi.store.add(core, document);
        });
      });

      describe('set', () => {
        it('sets a document in the store', () => {
          // Set a document
          ResourceApi.store.set(core, document);

          // Document should be in the store
          expect(ResourceApi.store.get(document.id)).toEqual(document);
        });

        it('dispatches a `tests:test:set` event', (done) => {
          // Listen to 'tests:test:set' events
          core.addEventListener('tests:test:set', (payload) => {
            // Payload data should be the set document
            expect(payload.data).toEqual(document);
            done();
          });

          // Set a document
          ResourceApi.store.set(core, document);
        });
      });

      describe('remove', () => {
        it('removes a document from the store', () => {
          // Remove a document
          ResourceApi.store.remove(core, existingDoc1.id);

          // Document should no longer be in the store
          expect(ResourceApi.store.get(existingDoc1.id)).toBeUndefined();
        });

        it('dispatches a `tests:test:remove` event', (done) => {
          // Listen to 'tests:test:remove' events
          core.addEventListener('tests:test:remove', (payload) => {
            // Payload data should be the removed document
            expect(payload.data).toEqual(existingDoc1);
            done();
          });

          // Remove a document
          ResourceApi.store.remove(core, existingDoc1.id);
        });
      });

      describe('clear', () => {
        it('clears the store', () => {
          // Clear the store
          ResourceApi.store.clear();

          // Store should be empty
          expect(ResourceApi.store.getAll()).toEqual({});
        });
      });
    });
  });
});
