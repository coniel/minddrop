/**
 * Resolves the view instance id of a space's view.
 *
 * @param spaceId - The id of the space.
 * @returns The space view's instance id.
 */
export function resolveSpaceViewId(spaceId: string): string {
  return `spaces:space:${spaceId}`;
}
