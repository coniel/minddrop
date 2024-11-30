import { Document } from '../../types';
import { DocumentViewsStore } from '../../DocumentViewsStore';
import { useDocumentViewTypeConfig } from '../../useDocumentViewTypeConfig';

interface DocumentViewRendererProps extends React.HTMLProps<HTMLDivElement> {
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
  const view = DocumentViewsStore.getState().documents.find(
    ({ id }) => id === viewId,
  )!;

  const viewConfig = useDocumentViewTypeConfig(view.type)!;

  return (
    <div>
      <viewConfig.component
        documentId={document.id}
        documentPath={document.path}
        view={view}
      />
    </div>
  );
};
