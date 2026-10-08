import { isAtOrUnder } from '../../isAtOrUnder';

/**
 * Copies the values stored under a path, and under everything below
 * it, to the same keys below a copy's path.
 *
 * @param contents - The map of values keyed by path, updated in place.
 * @param path - The key of the copied path.
 * @param copyPath - The key of the copy.
 */
export function copyMockContents(
  contents: Record<string, unknown>,
  path: string,
  copyPath: string,
): void {
  // Match the copied path itself and anything below it
  const keys = Object.keys(contents).filter((key) => isAtOrUnder(key, path));

  // Store each value again under the copy's path prefix
  keys.forEach((key) => {
    contents[`${copyPath}${key.slice(path.length)}`] = contents[key];
  });
}
