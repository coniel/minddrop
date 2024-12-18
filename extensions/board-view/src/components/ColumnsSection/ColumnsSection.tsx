import React, { useCallback } from 'react';
import { Block } from '@minddrop/extension';
import { BoardColumn, BoardColumnsSection } from '../../types';
import { BoardDropZone } from '../BoardDropZone';
import { Column } from './Column';
import './ColumnsSection.css';

export interface ColumnsSectionProps {
  className?: string;

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

  /**
   * Callback to move blocks within the board's sections.
   */
  moveBlocksWithinBoard: (
    blockIds: string[],
    dropIndex: number,
    columnIndex?: number,
  ) => void;
}

export const ColumnsSection: React.FC<ColumnsSectionProps> = ({
  className,
  section,
  updateSection,
  createBlocksFromDataTransfer,
  moveBlocksWithinBoard,
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
      const columns = [...section.columns];
      columns.splice(index, 0, newColumn);

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

  const columnMoveBlocksWithinBoard = useCallback(
    (columnIndex: number, blockIds: string[], dropIndex: number) => {
      moveBlocksWithinBoard(blockIds, dropIndex, columnIndex);
    },
    [moveBlocksWithinBoard],
  );

  return (
    <div className={`board-columns-section ${className}`}>
      <div className="board-columns-section-content">
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
              moveBlocksWithinBoard={(blocks, dropIndex) =>
                columnMoveBlocksWithinBoard(index, blocks, dropIndex)
              }
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
