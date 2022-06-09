import { GlobalStoreResource } from '../GlobalStoreResource';
import {
  cleanup,
  coreA1,
  coreA2,
  StoreData,
  storeDataSchema,
  storeDefaultData,
} from '../test-utils';
import { getPersistentStoreDocument } from '../getPersistentStoreDocument';
import { initializePersistentStore } from './initializePersistentStore';
import {
  GlobalPersistentStoreDocument,
  LocalPersistentStoreDocument,
} from '../types';
import { LocalStoreResource } from '../LocalStoreResource';

describe('initializePersistentStore', () => {
  afterEach(cleanup);

  describe('global store', () => {
    it('registers a resource type using the extension ID', () => {
      // Initialize a global persistent store
      initializePersistentStore(
        coreA1,
        GlobalStoreResource,
        storeDataSchema,
        storeDefaultData,
      );

      // Should register a new resource type using the
      // extension ID as the type.
      expect(
        GlobalStoreResource.getTypeConfig(coreA1.extensionId),
      ).toBeDefined();
    });

    it('creates a store document if it does not exist', () => {
      // Initialize a global persistent store
      initializePersistentStore(
        coreA1,
        GlobalStoreResource,
        storeDataSchema,
        storeDefaultData,
      );

      // Get the store document
      const document = getPersistentStoreDocument(
        coreA1,
        GlobalStoreResource,
      ) as GlobalPersistentStoreDocument<StoreData>;

      // Document should exist
      expect(document).not.toBeNull();
      // Document should contain default data
      expect(document.foo).toBe(storeDefaultData.foo);
      expect(document.bar).toBe(storeDefaultData.bar);
    });
  });

  describe('local store', () => {
    it('registers a resource type using the extension ID', () => {
      // Initialize a local persistent store
      initializePersistentStore(
        coreA1,
        LocalStoreResource,
        storeDataSchema,
        storeDefaultData,
      );

      // Should register a new resource type using the
      // extension ID as the type.
      expect(
        LocalStoreResource.getTypeConfig(coreA1.extensionId),
      ).toBeDefined();
    });

    it('creates a store document if it does not exist', () => {
      // Initialize a local persistent store
      initializePersistentStore(
        coreA1,
        LocalStoreResource,
        storeDataSchema,
        storeDefaultData,
      );

      // Get the store document
      const a1Document = getPersistentStoreDocument(
        coreA1,
        LocalStoreResource,
      ) as LocalPersistentStoreDocument<StoreData>;

      // Document should exist
      expect(a1Document).not.toBeNull();
      // Document should contain default data
      expect(a1Document.foo).toBe(storeDefaultData.foo);
      expect(a1Document.bar).toBe(storeDefaultData.bar);

      // Initialize the same local persistent store but with
      // a different app ID.
      initializePersistentStore(
        coreA2,
        LocalStoreResource,
        storeDataSchema,
        storeDefaultData,
      );

      // Should create a second local store document
      expect(Object.keys(LocalStoreResource.getAll()).length).toBe(2);
    });
  });
});
