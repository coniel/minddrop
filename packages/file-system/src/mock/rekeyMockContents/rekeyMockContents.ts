import { isAtOrUnder } from '../../isAtOrUnder';

/**
 * Moves the values stored under a path, and under everything below
 * it, to the same keys below a new path.
 *
 * @param contents - The map of values keyed by path, updated in place.
 * @param path - The key of the moved path.
 * @param newPath - The key of the path it moved to.
 */
export function rekeyMockContents(
  contents: Record<string, unknown>,
  path: string,
  newPath: string,
): void {
  // Match the moved path itself and anything below it
  const keys = Object.keys(contents).filter((key) => isAtOrUnder(key, path));

  keys.forEach((key) => {
    // Swap the old path prefix for the new one
    const rekeyed = `${newPath}${key.slice(path.length)}`;
    // Get the value to move
    const value = contents[key];

    // Move the value. Delete before setting, or a move to the same key
    // would lose the value.
    delete contents[key];
    contents[rekeyed] = value;
  });
}
