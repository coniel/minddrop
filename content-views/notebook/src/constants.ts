import { NotebookViewOptions } from './types';

// Minimum width of the list panel in pixels
export const MIN_LIST_COLUMN_WIDTH = 200;

// Maximum width of the list panel in pixels
export const MAX_LIST_COLUMN_WIDTH = 600;

export const defaultNotebookViewOptions: NotebookViewOptions = {
  listColumnWidth: 300,
};

// Estimated height of a list row in pixels, corrected once
// the row has been measured.
export const LIST_ITEM_HEIGHT_ESTIMATE = 80;
