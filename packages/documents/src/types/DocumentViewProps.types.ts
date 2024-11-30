import { DocumentView } from './DocumentView.types';

export interface DocumentViewProps<TView extends DocumentView = DocumentView> {
  /**
   * ID of the parent document.
   */
  documentId: string;

  /**
   * The path of the parent document file.
   */
  documentPath: string;

  /**
   * The view instance to render.
   */
  view: TView;
}
