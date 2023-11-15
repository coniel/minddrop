/**
 * Concatenates path parts into a path, ensuring proper '/' separation
 * between parts.
 *
 * @param ...parts - The parts to concatenate into a pth.
 * @returns The concatenated path.
 */
export function concatPath(...parts: string[]): string {
  return (
    parts
      .reduce<string>(
        (path, part) =>
          `${path}${!path || path.endsWith('/') ? '' : '/'}${part}`,
        '',
      )
      // In case a part ends with / followed by one that
      // starts with /.
      .replaceAll('//', '/')
  );
}
