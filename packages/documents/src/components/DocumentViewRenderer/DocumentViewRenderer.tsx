import { useCallback } from 'react';
import { Document, DocumentView } from '../../types';
import { DocumentViewsStore } from '../../DocumentViewsStore';
import { useDocumentViewTypeConfig } from '../../useDocumentViewTypeConfig';
import { Block } from '@minddrop/blocks';

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
  console.log('viewId', viewId);
  const view = DocumentViewsStore.getState().documents.find(
    ({ id }) => id === viewId,
  )!;

  console.log('view', view);

  const viewConfig = useDocumentViewTypeConfig(view.type)!;

  const addBlocks = useCallback((blocks: Block[]) => {}, []);
  const updateBlock = useCallback((id: string, data: Partial<Block>) => {}, []);
  const removeBlocks = useCallback((ids: string[]) => {}, []);
  const updateDocument = useCallback(async (data: Partial<Document>) => {}, []);
  const updateView = useCallback(async (data: Partial<DocumentView>) => {}, []);
  const createBlocksFromDataInsert = useCallback(
    async (dataInsert: DataTransfer): Promise<Block[]> => {
      console.log('createBlocksFromDataInsert', dataInsert);

      return [] as Block[];
    },
    [],
  );

  return (
    <div>
      <viewConfig.component
        document={document}
        view={view}
        addBlocks={addBlocks}
        updateBlock={updateBlock}
        removeBlocks={removeBlocks}
        updateDocument={updateDocument}
        updateView={updateView}
        createBlocksFromDataInsert={createBlocksFromDataInsert}
      />
    </div>
  );
};
