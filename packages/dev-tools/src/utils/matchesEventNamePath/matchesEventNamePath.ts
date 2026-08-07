/**
 * Checks whether an event name sits at or below a path in the
 * event name tree.
 *
 * @param name - The event name to check.
 * @param path - The path to match against, or null to match all names.
 * @returns Whether the name matches the path.
 */
export function matchesEventNamePath(
  name: string,
  path: string | null,
): boolean {
  // No path selected means no filtering
  if (!path) {
    return true;
  }

  return name === path || name.startsWith(`${path}:`);
}
