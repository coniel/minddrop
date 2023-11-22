/**
 * Returns a slice of a path. A negative index can be used,
 * indicating an offset from the end of the path.
 *
 * @param path - The path to slice.
 * @param start - The index to start the slice at.
 * @param end - The index to end the slice at.
 * @returns The path slice.
 */
export function getPathSlice(
  path: string,
  start: number,
  end?: number,
): string {
  return path.split('/').slice(start, end).join('/');
}
