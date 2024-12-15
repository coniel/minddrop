import { useCallback, useState } from 'react';
import { Block, DocumentViewProps, useApi } from '@minddrop/extension';
import { BoardListSection, BoardSection, BoardView } from '../../types';
import { ColumnsSection } from '../ColumnsSection';
import { GridSection } from '../GridSection';
import { ListSection } from '../ListSection';
import './BoardViewRenderer.css';

export const BoardViewRenderer: React.FC<DocumentViewProps<BoardView>> = ({
  view,
  documentId,
}) => {
  const {
    Selection,
    DocumentViews: { update: updateView },
    Documents: { addBlocks, useSelectAllBlocks },
    Blocks: { createFromDataTransfer },
    Utils: { useParentDir },
    Ui: {
      DocumentTitleField,
      DocumentContentToolbar,
      DocumentContentToolbarItem,
    },
  } = useApi();
  useSelectAllBlocks(view.blocks);
  const parentDir = useParentDir();

  const [layoutMode, setLayoutMode] = useState(false);

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode((prev) => !prev);
  }, []);

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
    <div className="board-view">
      <div className="board-view-header" onClick={Selection.clear}>
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
      <DocumentContentToolbar
        className="content-toolbar"
        mode={layoutMode ? 'custom' : 'default'}
        customActions={[
          <DocumentContentToolbarItem
            key="toggle-layout-mode"
            icon="pencil-ruler"
            tooltip="Toggle layout mode"
            onClick={toggleLayoutMode}
            toggled={layoutMode}
          />,
        ]}
        customModeActions={[
          <DocumentContentToolbarItem
            key="insert-columns-section"
            icon="layout-dashboard"
            tooltip="Drag to add a Columns section"
          />,
          <DocumentContentToolbarItem
            key="insert-grid-section"
            icon="layout-grid"
            tooltip="Drag to add a Grid section"
          />,
          <DocumentContentToolbarItem
            key="insert-list-section"
            icon="layout-list"
            tooltip="Drag to add a List section"
          />,
        ]}
      ></DocumentContentToolbar>
    </div>
  );
};
