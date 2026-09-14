import { SpacesStore } from '../../SpacesStore';
import { Space } from '../../types';

/**
 * Returns the most recently created spaces, newest first.
 *
 * @param limit - Maximum number of spaces to return.
 * @returns The most recently created spaces.
 */
export function getRecentSpaces(limit: number): Space[] {
  // Sort a copy by creation date, newest first, and cap the result
  // at the limit.
  return [...SpacesStore.getAllArray()]
    .sort(
      (spaceA, spaceB) => spaceB.created.getTime() - spaceA.created.getTime(),
    )
    .slice(0, limit);
}
