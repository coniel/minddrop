import { TagsStore } from '../TagsStore';
import { Tag } from '../types';

/**
 * Retrieves all tags.
 *
 * @returns All tags.
 */
export function getAllTags(): Tag[] {
  return TagsStore.getAllArray();
}
