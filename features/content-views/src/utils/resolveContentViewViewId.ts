/**
 * Resolves the view instance id of a content view's view.
 *
 * @param contentViewId - The id of the content view.
 * @returns The content view view's instance id.
 */
export function resolveContentViewViewId(contentViewId: string): string {
  return `content-views:content-view:${contentViewId}`;
}
