import { isAtOrUnder } from '../../isAtOrUnder';

/**
 * Deletes the values stored under a path, and under everything below
 * it.
 *
 * @param contents - The map of values keyed by path, updated in place.
 * @param path - The key of the removed path.
 */
export function clearMockContents(
  contents: Record<string, unknown>,
  path: string,
): void {
  // Delete the path's own value and those of anything below it
  Object.keys(contents)
    .filter((key) => isAtOrUnder(key, path))
    .forEach((key) => {
      delete contents[key];
    });
}
