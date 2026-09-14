/**
 * Resolves the view instance id of a data view's view.
 *
 * @param dataViewId - The id of the data view.
 * @returns The data view view's instance id.
 */
export function resolveDataViewViewId(dataViewId: string): string {
  return `data-views:data-view:${dataViewId}`;
}
