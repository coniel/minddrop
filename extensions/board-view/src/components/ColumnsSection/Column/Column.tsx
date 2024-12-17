import React, { useCallback } from 'react';
import { Block, useApi } from '@minddrop/extension';
import { BoardColumn } from '../../../types';
import { BoardDropZone } from '../../BoardDropZone';
import './Column.css';

export interface ColumnProps {
  /**
   * The column object.
   */
  column: BoardColumn;

  /**
   * Callback to delete the column.
   */
  deleteColumn(): void;

  /**
   * Callback to update the column.
   */
  updateColumn: (data: Partial<BoardColumn>) => void;

  /**
   * Callback to create blocks from a data transfer.
   */
  createBlocksFromDataTransfer: (
    dataTransfer: DataTransfer,
  ) => Promise<Block[]>;

  /**
   * Callback to move blocks within the board's sections.
   */
  moveBlocksWithinBoard: (blockIds: string[], dropIndex: number) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createBlocksFromDataTransfer,
  moveBlocksWithinBoard,
}) => {
  const {
    Blocks: { getFromDataTransfer },
    Ui: { BlockRenderer },
  } = useApi();

  const onDrop = useCallback(
    async (event: React.DragEvent, index: number) => {
      // Check if there are existing blocks in the data transfer,
      // indicating that the blocks are being moved.
      let blocks = getFromDataTransfer(event.dataTransfer);

      if (blocks.length > 0) {
        moveBlocksWithinBoard(
          blocks.map((b) => b.id),
          index,
        );

        return;
      }

      // Create blocks from the data insert
      blocks = await createBlocksFromDataTransfer(event.dataTransfer);

      // Insert the blocks into the column
      const newBlocks = [...column.blocks];
      newBlocks.splice(index, 0, ...blocks.map((block) => block.id));

      const columnUpdate = {
        blocks: newBlocks,
      };

      // Update the column
      updateColumn(columnUpdate);
    },
    [
      getFromDataTransfer,
      createBlocksFromDataTransfer,
      moveBlocksWithinBoard,
      updateColumn,
      column.blocks,
    ],
  );

  const onDropColumnEnd = useCallback(
    async (event: React.DragEvent) => {
      onDrop(event, column.blocks.length);
    },
    [column.blocks.length, onDrop],
  );

  return (
    <div className="board-column-block">
      {column.blocks.map((blockId, blockIndex) => (
        <div key={blockId}>
          <SpacerDropZone blockIndex={blockIndex} onDrop={onDrop} />
          <BlockRenderer blockId={blockId} />
        </div>
      ))}
      <BoardColumnBlockEnd
        enableDelete={column.blocks.length === 0}
        onClickDelete={deleteColumn}
        onDrop={onDropColumnEnd}
      />
    </div>
  );
};

const SpacerDropZone: React.FC<{
  onDrop(event: React.DragEvent<HTMLDivElement>, blockIndex: number): void;
  blockIndex: number;
}> = ({ onDrop, blockIndex }) => {
  const handleOnDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => onDrop(event, blockIndex),
    [onDrop, blockIndex],
  );

  return <BoardDropZone className="spacer-drop-zone" onDrop={handleOnDrop} />;
};

const BoardColumnBlockEnd: React.FC<{
  enableDelete: boolean;
  onClickDelete(): void;
  onDrop(event: React.DragEvent<HTMLDivElement>): void;
}> = ({ enableDelete, onClickDelete, onDrop }) => {
  const {
    Ui: { Button },
    Selection,
  } = useApi();

  return (
    <div className="board-column-block-end" onClick={Selection.clear}>
      <BoardDropZone
        className="bottom-drop-zone"
        dragIndicator={false}
        onDrop={onDrop}
      >
        {enableDelete && (
          <Button
            variant="neutral"
            label="deleteColumn"
            className="delete-column-button"
            onClick={onClickDelete}
          />
        )}
      </BoardDropZone>
    </div>
  );
};
