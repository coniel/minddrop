import { useCallback } from 'react';
import { Document, DocumentView } from '../../types';
import { getDocumentViewTypeConfig } from '../../DocumentViewTypeConfigsStore';
import { DocumentViewTypeConfigNotRegisteredError } from '../../errors';
import { uuid } from '@minddrop/utils';
import { DocumentViewsStore } from '../../DocumentViewsStore';
import { updateDocument } from '../../updateDocument';
import { DocumentViewRenderer } from '../DocumentViewRenderer';

interface DocumentViewsRendererProps extends React.HTMLProps<HTMLDivElement> {
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
      const viewTypeConfig = getDocumentViewTypeConfig(type);

      if (!viewTypeConfig) {
        throw new DocumentViewTypeConfigNotRegisteredError(type);
      }

      let view: DocumentView = {
        type,
        id: uuid(),
        blocks: [],
      };

      if (viewTypeConfig.initialize) {
        view = { ...view, ...viewTypeConfig.initialize(document) };
      }

      DocumentViewsStore.getState().add(view);
      updateDocument(document.id, { views: [...document.views, view.id] });
    },
    [document],
  );

  return (
    <div>
      <h1>{document.title}</h1>
      {!document.views.length && (
        <div style={{ paddingTop: 200 }}>
          <button onClick={() => createView('board')}>Create board view</button>
        </div>
      )}
      {document.views[0] && (
        <DocumentViewRenderer viewId={document.views[0]} document={document} />
      )}
    </div>
  );
};
