import { generateId } from '@minddrop/utils';
import { CreateTagData, Tag } from '../types';

/**
 * Generates a new tag.
 *
 * @param data The tag data.
 * @returns A new tag.
 */
export function generateTag(data: CreateTagData): Tag {
  return {
    id: generateId(),
    color: 'blue',
    ...data,
  };
}
