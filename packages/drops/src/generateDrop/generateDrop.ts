import { generateId } from '@minddrop/utils';
import { Drop, GenerateDropData } from '../types';

/**
 * Generates a new drop.
 *
 * @param data The drop data, `type` being the only required value.
 * @returns A new drop.
 */
export function generateDrop<D extends GenerateDropData = GenerateDropData>(
  data: D,
): Drop & D {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    parents: [],
    id: generateId(),
    ...data,
  };
}
