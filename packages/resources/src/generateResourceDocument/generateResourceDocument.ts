import { generateId } from '@minddrop/utils';
import { ResourceDocument, ResourceDocumentCustomData } from '../types';

/**
 * Generates a new resource document containing
 * the provided data.
 *
 * @param data The resource data.
 * @returns A new resource document.
 */
export function generateResourceDocument<
  TData extends ResourceDocumentCustomData,
  TResourceDocument extends ResourceDocument = ResourceDocument<TData>,
>(data: TData): TResourceDocument {
  const document = {
    id: generateId(),
    revision: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };

  return document as unknown as TResourceDocument;
}
