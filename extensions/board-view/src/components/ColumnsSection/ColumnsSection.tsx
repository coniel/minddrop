import React, { useCallback } from 'react';
import { Block, DocumentViewProps } from '@minddrop/extension';
import { BoardDropZone } from '../BoardDropZone';
import { BoardColumn, BoardColumnsSection } from '../../types';
import './ColumnsSection.css';
import { Column } from './Column/Column';

export interface ColumnsSectionProps {
  /**
   * The board columns block.
   */
  section: BoardColumnsSection;

  /**
   * Callback to update the section.
   */
  updateSection: (data: Partial<BoardColumnsSection>) => void;

  /**
   * Callback to create blocks from a data transfer.
   */
  createBlocksFromDataTransfer: (
    dataTransfer: DataTransfer,
  ) => Promise<Block[]>;
}

export const ColumnsSection: React.FC<ColumnsSectionProps> = ({
  section,
  updateSection,
  createBlocksFromDataTransfer,
}) => {
  const onDropVerticalZone = useCallback(
    async (event: React.DragEvent, index: number) => {
      // Create blocks from the data insert
      const blocks = await createBlocksFromDataTransfer(event.dataTransfer);
      // Create a new column with the blocks
      const newColumn: BoardColumn = {
        id: `${Date.now()}`,
        blocks: blocks.map((block) => block.id),
      };
      // Add the new column to the section
      const columns = [...section.columns].splice(index, 0, newColumn);

      updateSection({ columns });
    },
    [updateSection, section.columns, createBlocksFromDataTransfer],
  );

  const onUpdateColumn = useCallback(
    (index: number, data: Partial<BoardColumn>) => {
      const columns = [...section.columns];
      columns[index] = { ...columns[index], ...data };
      updateSection({ columns });
    },
    [updateSection, section.columns],
  );

  const onDeleteColumn = useCallback(
    (index: number) => {
      const columns = [...section.columns];
      columns.splice(index, 1);
      updateSection({ columns });
    },
    [updateSection, section.columns],
  );

  return (
    <div className="board-columns-block">
      <div className="board-columns-block-content">
        {section.columns.map((column, index) => (
          <div key={column.id} className="board-column-block-container">
            <BoardDropZone
              className="vertical-drop-zone"
              onDrop={(event) => onDropVerticalZone(event, index)}
            />
            <Column
              column={column}
              updateColumn={(data) => onUpdateColumn(index, data)}
              deleteColumn={() => onDeleteColumn(index)}
              createBlocksFromDataTransfer={createBlocksFromDataTransfer}
            />
          </div>
        ))}
      </div>
      <BoardDropZone
        className="vertical-drop-zone"
        onDrop={(event) => onDropVerticalZone(event, section.columns.length)}
      />
    </div>
  );
};
