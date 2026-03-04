import { View } from '@minddrop/views';

export interface NotebookView extends View {
  type: 'notebook';
  options: Partial<NotebookViewOptions>;
}

export interface NotebookViewOptions {
  /**
   * The width of the list panel in pixels.
   */
  listColumnWidth: number;
}
