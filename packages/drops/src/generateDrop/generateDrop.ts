import { generateId } from '@minddrop/utils';
import { Drop, CreateDropData } from '../types';

/**
 * Generates a new drop, including all required fields.
 *
 * @param type The drop type.
 * @param data Optional default data.
 * @returns A new drop.
 */
export function generateDrop(type: string, data?: CreateDropData): Drop {
  return {
    type,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: generateId(),
  };
}
