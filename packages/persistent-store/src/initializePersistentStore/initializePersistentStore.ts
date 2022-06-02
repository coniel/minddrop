import { Core } from '@minddrop/core';
import { getPersistentStoreDocument } from '../getPersistentStoreDocument';
import {
  GlobalPersistentStoreData,
  GlobalPersistentStoreDataSchema,
  GlobalPersistentStoreResourceApi,
  LocalPersistentStoreData,
  LocalPersistentStoreDataSchema,
  LocalPersistentStoreResourceApi,
} from '../types';

/**
 * Initializes an extension's persistent store.
 *
 * @param core - A MindDrop core instance.
 * @param resource - The persistent store resource.
 * @param schema - The store's data schema.
 * @param defaultData - The default data set when first creating the store document.
 */
export function initializePersistentStore(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
  schema: GlobalPersistentStoreDataSchema | LocalPersistentStoreDataSchema,
  defaultData: GlobalPersistentStoreData | LocalPersistentStoreData,
): void {
  const Resource = resource as LocalPersistentStoreResourceApi;
  // Register the extension's resource type
  Resource.register(core, {
    type: core.extensionId,
    dataSchema: schema as LocalPersistentStoreDataSchema,
  });

  // Get the extension's persistent store document
  const document = getPersistentStoreDocument(core, resource);

  if (!document) {
    // If not document exists, create one using the default data
    Resource.create(core, core.extensionId, defaultData);
  }
}
