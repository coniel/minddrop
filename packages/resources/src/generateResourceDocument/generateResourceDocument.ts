import { generateId } from '@minddrop/utils';
import { ResourceDocument } from '../types';

/**
 * Generates a new resource document containing
 * the provided data.
 *
 * @param data The resource data.
 * @returns A new resource document.
 */
export function generateResourceDocument<TData extends Object = {}>(
  data: TData,
): ResourceDocument<TData> {
  const document: ResourceDocument<TData> = {
    id: generateId(),
    revision: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };

  return document;
}
