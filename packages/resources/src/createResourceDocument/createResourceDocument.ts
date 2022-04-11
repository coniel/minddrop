import { Core } from '@minddrop/core';
import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { validateResourceDocument } from '../validation';

/**
 * Creates a new resource document and dispatches a
 * `[resource]:create` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param data The document creation data.
 * @returns A new resource document.
 */
export function createResourceDocument<TData, TCreateData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  data?: TCreateData,
): ResourceDocument<TData> {
  // Merge the default and provided data to create
  // the complete document data.
  const completeData = { ...config.defaultData, ...data } as unknown as TData;

  // Generate a document using the complete data
  let document = generateResourceDocument(completeData);

  if (config.onCreate) {
    // Call `onCreate` callback if defined
    document = config.onCreate(core, document);
  }

  // Validate the document
  validateResourceDocument(config.resource, config.dataSchema, document);

  // Add the document to the store
  store.set(document);

  // Dispatch a `[resource]:create` event
  core.dispatch(`${config.resource}:create`, document);

  // Return the new document
  return document;
}
