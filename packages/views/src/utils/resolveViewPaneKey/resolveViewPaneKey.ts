/**
 * Resolves the key identifying a view pane.
 *
 * @param viewAreaId - The ID of the view area.
 * @param pane - The pane of the view area.
 * @returns The view pane key.
 */
export function resolveViewPaneKey(viewAreaId: string, pane: string): string {
  return `${viewAreaId}:${pane}`;
}
