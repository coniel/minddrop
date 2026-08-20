import { fuzzySearchBy } from '@minddrop/utils';
import { SpacesStore } from '../../SpacesStore';
import { Space } from '../../types';

/**
 * Performs a fuzzy search on space names.
 *
 * @param query - The search query.
 * @returns The matched spaces ranked by match quality.
 */
export function searchSpaces(query: string): Space[] {
  return fuzzySearchBy(SpacesStore.getAllArray(), query, (space) => space.name);
}
