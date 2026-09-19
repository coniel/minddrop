/**
 * Returns whether a drag is in progress. The document is marked for
 * the drag's duration.
 *
 * @returns Whether a drag is in progress.
 */
export function isDragInProgress(): boolean {
  return document.documentElement.hasAttribute('data-dragging');
}
