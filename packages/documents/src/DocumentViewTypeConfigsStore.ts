/* eslint-disable @typescript-eslint/no-explicit-any */
import { createItemStore } from '@minddrop/core';
import { DocumentView, DocumentViewTypeConfig } from './types';
import { DocumentViewTypeConfigNotRegisteredError } from './errors';

export const DocumentViewTypeConfigsStore =
  createItemStore<DocumentViewTypeConfig<any>>();

/**
 * Registers a DocumentViewTypeConfig.
 *
 * @param config - The config to register.
 */
export function registerDocumentViewTypeConfig<
  TView extends DocumentView = DocumentView,
>(config: DocumentViewTypeConfig<TView>): void {
  DocumentViewTypeConfigsStore.set(config);
}

/**
 * Unregisters a DocumentViewTypeConfig by ID.
 *
 * @param id - The type of the config to unregister.
 */
export function unregisterDocumentViewTypeConfig(id: string): void {
  DocumentViewTypeConfigsStore.remove(id);
}

/**
 * Retrieves a DocumentViewTypeConfig by ID.
 *
 * @param ID - The ID of the config to retrieve.
 * @returns The config.
 *
 * @throws {DocumentViewTypeConfigNotRegisteredError} - If the config is not registered.
 */
export function getDocumentViewTypeConfig(id: string): DocumentViewTypeConfig {
  const config = DocumentViewTypeConfigsStore.get(id);

  if (!config) {
    throw new DocumentViewTypeConfigNotRegisteredError(id);
  }

  return config;
}
