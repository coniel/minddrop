import {
  Document,
  useDocumentView,
  useDocumentViewTypeConfig,
} from '@minddrop/documents';

export interface DocumentViewRendererProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The document to render.
   */
  document: Document;

  /**
   * The ID of the view to render.
   */
  viewId: string;
}

export const DocumentViewRenderer: React.FC<DocumentViewRendererProps> = ({
  viewId,
  document,
}) => {
  const view = useDocumentView(viewId);
  const viewConfig = useDocumentViewTypeConfig(view?.type || '');

  if (!view) {
    return `Document view ${viewId} not found.`;
  }

  if (!viewConfig) {
    return `Document view type ${view.type} not found.`;
  }

  return (
    <viewConfig.component
      documentId={document.id}
      documentPath={document.path}
      view={view}
    />
  );
};
