import { generateId } from '@minddrop/utils';
import { CreateViewInstanceData, ViewInstance } from '../types';

/**
 * Generates a new view instance with all
 * default data set.
 *
 * @param data The view instance data.
 * @returns A view instance.
 */
export function generateViewInstance<
  D extends CreateViewInstanceData = CreateViewInstanceData,
  I extends ViewInstance = ViewInstance,
>(data: D): I {
  return {
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as I;
}
