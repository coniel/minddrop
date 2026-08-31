import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroup } from '../types';

/**
 * Retrieves all tag groups.
 *
 * @returns All tag groups.
 */
export function getAllTagGroups(): TagGroup[] {
  return TagGroupsStore.getAllArray();
}
