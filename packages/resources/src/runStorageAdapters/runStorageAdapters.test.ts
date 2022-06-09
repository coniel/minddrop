import { core } from '../test-utils';
import { createUpdate } from '@minddrop/utils';
import {
  RDChanges,
  ResourceDocument,
  ResourceStorageAdapterConfig,
} from '../types';
import { generateResourceDocument } from '../generateResourceDocument';
import { registerResourceStorageAdapter } from '../registerResourceStorageAdapter';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore';
import { runStorageAdapters } from './runStorageAdapters';

const storageAdapter: ResourceStorageAdapterConfig = {
  id: 'test',
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAll: jest.fn(),
};

const document1 = generateResourceDocument('tests:test', { foo: 'foo' });
const document2 = generateResourceDocument('tests:test', { foo: 'bar' });

const update1 = createUpdate<RDChanges, ResourceDocument>(document1, {
  revision: 'new-rev',
  updatedAt: new Date(),
});
const update2 = createUpdate<RDChanges, ResourceDocument>(document2, {
  revision: 'new-rev',
  updatedAt: new Date(),
});

describe('runStorageAdapters', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    // Register a test storage adapter
    registerResourceStorageAdapter(core, storageAdapter);
  });

  afterEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    // Clear registered storage adapters
    ResourceStorageAdaptersStore.clear();
    // Clear the document changes store
    ResourceDocumentChangesStore.clear();
  });

  it('calls the `create` method on storage adapters with each created document', () => {
    // Add a couple of created documents to the
    // document changes store.
    ResourceDocumentChangesStore.addCreated(document1);
    ResourceDocumentChangesStore.addCreated(document2);

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);

    // Run timers
    jest.runAllTimers();

    // Should call the storage adapter's `create`
    // method once for each created document.
    expect(storageAdapter.create).toHaveBeenCalledTimes(2);
    // Should call the `create` method with the document
    expect(storageAdapter.create).toHaveBeenCalledWith(document1);
  });

  it('calls the `update` method on storage adapters with each updated document update', () => {
    // Add a couple of updated document updates to the
    // document changes store.
    ResourceDocumentChangesStore.addUpdated(document1.id, update1);
    ResourceDocumentChangesStore.addUpdated(document2.id, update2);

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);

    // Run timers
    jest.runAllTimers();

    // Should call the storage adapter's `update`
    // method once for each updated document.
    expect(storageAdapter.update).toHaveBeenCalledTimes(2);
    // Should call the `update` method with the
    // document ID and changes.
    expect(storageAdapter.update).toHaveBeenCalledWith(document1.id, update1);
  });

  it('calls the `delete` method on storage adapters with each deleted document', () => {
    // Add a couple of deleted documents to the
    // document changes store.
    ResourceDocumentChangesStore.addDeleted(document1);
    ResourceDocumentChangesStore.addDeleted(document2);

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);

    // Run timers
    jest.runAllTimers();

    // Should call the storage adapter's `deleted`
    // method once for each deleted document.
    expect(storageAdapter.delete).toHaveBeenCalledTimes(2);
    // Should call the `delete` method with the document
    expect(storageAdapter.delete).toHaveBeenCalledWith(document1);
  });
});
