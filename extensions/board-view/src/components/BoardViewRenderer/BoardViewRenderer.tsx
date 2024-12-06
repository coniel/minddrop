import { useCallback } from 'react';
import { useApi, DocumentViewProps, Block } from '@minddrop/extension';
import { BoardListSection, BoardSection, BoardView } from '../../types';
import { ColumnsSection } from '../ColumnsSection';
import { ListSection } from '../ListSection';
import { GridSection } from '../GridSection';
import './BoardViewRenderer.css';

export const BoardViewRenderer: React.FC<DocumentViewProps<BoardView>> = ({
  view,
  documentId,
}) => {
  const {
    Selection,
    DocumentViews: { update: updateView },
    Documents: { addBlocks },
    Blocks: { createFromDataTransfer },
    Utils: { useParentDir },
    Ui: { DocumentTitleField },
  } = useApi();
  const parentDir = useParentDir();

  const updateSection = useCallback(
    (index: number, data: Partial<BoardSection>) => {
      const updatedSections = [...view.sections];

      updatedSections.splice(index, 1, {
        ...view.sections[index],
        ...data,
      } as BoardListSection);

      updateView<BoardView>(view.id, { sections: updatedSections });
    },
    [view.id, view.sections, updateView],
  );

  const createBlocksFromDataTransfer = useCallback(
    async (dataTransfer: DataTransfer): Promise<Block[]> => {
      const blocks = await createFromDataTransfer(dataTransfer, parentDir);

      if (blocks.length) {
        addBlocks(documentId, blocks, view.id);
        updateView(view.id, {
          blocks: [...view.blocks, ...blocks.map((block) => block.id)],
        });
      }

      return blocks;
    },
    [
      createFromDataTransfer,
      addBlocks,
      updateView,
      view.blocks,
      parentDir,
      documentId,
      view.id,
    ],
  );

  return (
    <div className="board-view" onClick={Selection.clear}>
      <div className="board-view-header">
        <DocumentTitleField key={documentId} documentId={documentId} />
      </div>
      {view.sections.map((section, index) => {
        switch (section.type) {
          case 'columns':
            return (
              <ColumnsSection
                key={section.id}
                section={section}
                createBlocksFromDataTransfer={createBlocksFromDataTransfer}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          case 'list':
            return (
              <ListSection
                key={section.id}
                section={section}
                createBlocksFromDataTransfer={createBlocksFromDataTransfer}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          case 'grid':
            return (
              <GridSection
                key={section.id}
                section={section}
                createBlocksFromDataTransfer={createBlocksFromDataTransfer}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
