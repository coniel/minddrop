import { generateId } from '@minddrop/utils';
import { ResourceDocument } from '../types';

/**
 * Generates a new resource document.
 *
 * @param apiVersion The version number of the resource API.
 * @param data The resource data.
 * @param extensionApiVersion The version number of the resource extension API.
 * @returns A new resource document.
 */
export function generateResourceDocument<TData extends Object = {}>(
  apiVersion: number,
  data: TData,
  extensionApiVersion?: number,
): ResourceDocument<TData> {
  const document: ResourceDocument<TData> = {
    apiVersion,
    id: generateId(),
    revision: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };

  if (typeof extensionApiVersion !== 'undefined') {
    // Add the extension API version if defined
    document.extensionApiVersion = extensionApiVersion;
  }

  return document;
}
