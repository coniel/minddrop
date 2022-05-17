import { generateId } from '@minddrop/utils';
import { ResourceDocument, RDData } from '../types';

/**
 * Generates a new resource document containing
 * the provided data.
 *
 * @param resource - The resource name.
 * @param data - The resource document data.
 * @returns A new resource document.
 */
export function generateResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument = ResourceDocument<TData>,
>(resource: string, data: TData): TResourceDocument {
  const document = {
    resource,
    id: generateId(),
    revision: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };

  return document as unknown as TResourceDocument;
}
