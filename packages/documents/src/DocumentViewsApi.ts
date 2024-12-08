import { getDocumentView } from './getDocumentView';
import { getDocumentViews } from './getDocumentViews';
import { DocumentView } from './types';

export { createDocumentView as create } from './createDocumentView';
export { deleteDocumentView as delete } from './deleteDocumentView';
export { updateDocumentView as update } from './updateDocumentView';
export { getDocumentViewTypeConfig as getTypeConfig } from './DocumentViewTypeConfigsStore';

/**
 * Returns one or more document views with the given IDs.
 *
 * If the ID is a string, a single document view is returned.
 * Throws if the view does not exist.
 *
 * If the ID is an array of strings, an array of document views is returned.
 * Filters out any views that do not exist.
 *
 * @param id - The ID(s) of the view to return.
 * @returns A document view or an array of document views.
 *
 * @throws {DocumentViewNotFoundError} If a view with the given ID does not exist when a single ID is passed.
 */
export function get(id: string): DocumentView;
export function get(id: string[]): DocumentView[];
export function get(id: string | string[]): DocumentView | DocumentView[] {
  return Array.isArray(id) ? getDocumentViews(id) : getDocumentView(id);
}
