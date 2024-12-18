import { useCallback } from 'react';
import { Document, DocumentViews } from '@minddrop/documents';
import { DocumentViewRenderer } from '../DocumentViewRenderer';

export interface DocumentViewsRendererProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The document to render.
   */
  document: Document;
}

export const DocumentViewsRenderer: React.FC<DocumentViewsRendererProps> = ({
  document,
}) => {
  const createView = useCallback(
    (type: string) => {
      DocumentViews.create(document.id, type);
    },
    [document],
  );

  return (
    <>
      {!document.views.length && (
        <div style={{ paddingTop: 200 }}>
          <button onClick={() => createView('board')}>Create board view</button>
        </div>
      )}
      {document.views[0] && (
        <DocumentViewRenderer viewId={document.views[0]} document={document} />
      )}
    </>
  );
};
