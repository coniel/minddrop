import { generateId } from '@minddrop/utils';
import { Drop, GenerateDropData } from '../types';

/**
 * Generates a new drop.
 *
 * @param data The drop data, `type` being the only required value.
 * @returns A new drop.
 */
export function generateDrop(data: GenerateDropData): Drop {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: generateId(),
    ...data,
  };
}
