import { Core } from '@minddrop/core';
import {
  GlobalPersistentStoreDocument,
  GlobalPersistentStoreResourceApi,
  LocalPersistentStoreDocument,
  LocalPersistentStoreResourceApi,
} from '../types';

/**
 * Retrieves the persistent store document for a
 * given extension or `null` if it does not exist.
 *
 * @param core - A MindDrop core instance.
 * @param resource - The persistent store resource.
 * @returns A persistent store document or `null`.
 */
export function getPersistentStoreDocument(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
): LocalPersistentStoreDocument | GlobalPersistentStoreDocument | null {
  const Resource = resource as LocalPersistentStoreResourceApi;

  // Ensure that extension initialized the persistent store
  // by checking for its resource type config.
  Resource.getTypeConfig(core.extensionId);

  // Get all the store documents
  const allDocuments = Resource.getAll();

  // Get the extension's documents
  const extensionDocuments = Object.values(allDocuments).filter(
    (document) => document.extension === core.extensionId,
  );

  if (!extensionDocuments.length) {
    // Return null if the extension does not have a
    // persistent store document.
    return null;
  }

  if (extensionDocuments[0].resource === 'persistent-stores:local') {
    // If the documents are local persistent store documents,
    // return the document with the matching app ID.
    return (
      extensionDocuments.find((document) => document.app === core.appId) || null
    );
  }

  // The documents are global persistent store documents.
  // Return the first (an only) one.
  return extensionDocuments[0];
}
