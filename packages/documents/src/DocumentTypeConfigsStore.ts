import { createItemStore } from '@minddrop/core';
import { DocumentPropertiesMap, DocumentTypeConfig } from './types';
import { DocumentTypeConfigNotFoundError } from './errors';

export const DocumentTypeConfigsStore = createItemStore<
  DocumentTypeConfig<any> & {
    id: string;
  }
>();

/**
 * Registers a DocumentTypeConfig.
 *
 * @param config - The config to register.
 */
export function registerDocumentTypeConfig<
  TContent = unknown,
  TProperties extends DocumentPropertiesMap = {},
>(config: DocumentTypeConfig<TContent, TProperties>): void {
  // Use the file type as the ID for the config to prevent
  // duplicate configs from being registered for the same
  // file type.
  const registeredConfig = {
    ...config,
    id: config.fileType,
  };

  DocumentTypeConfigsStore.set(registeredConfig);
}

/**
 * Unregisters a DocumentTypeConfig by file type.
 *
 * @param fileType - The file type of the config to unregister.
 */
export function unregisterDocumentTypeConfig(fileType: string): void {
  DocumentTypeConfigsStore.remove(fileType);
}

/**
 * Retrieves a DocumentTypeConfig by file type.
 *
 * @param fileType - The file type of the config to retrieve.
 * @returns The config.
 *
 * @throws {DocumentTypeConfigNotFoundError} - If the config is not registered.
 */
export function getDocumentTypeConfig(fileType: string): DocumentTypeConfig {
  const config = DocumentTypeConfigsStore.get(fileType);

  if (!config) {
    throw new DocumentTypeConfigNotFoundError(fileType);
  }

  return config;
}
