import React, { useCallback } from 'react';
import { useApi } from '@minddrop/extension';
import { BoardColumnBlock as ColumnBlock } from '../../types';
import { useBoardDocument, useChildBlocks } from '../../BoardDocumentProvider';
import { generateBoardContentBlocksFromDataTransfer } from '../../generateBoardContentBlocksFromDataTransfer';
import { addChildBlocksToBoard } from '../../addChildBlocksToBoard';
import { getBoardContent } from '../../getBoardContent';
import { BoardBlock } from '../BoardBlock';
import { BoardDropZone } from '../BoardDropZone';
import './BoardColumnBlock.css';

export interface BoardColumnBlockProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The board column block.
   */
  block: ColumnBlock;
}

export const BoardColumnBlock: React.FC<BoardColumnBlockProps> = ({
  block: columnBlock,
  className,
  ...other
}) => {
  const API = useApi();
  const board = useBoardDocument();
  const blocks = useChildBlocks(columnBlock.children);

  const onDrop = useCallback(
    async (event: React.DragEvent, index: number) => {
      console.log(event.dataTransfer.files);
      // Generate new content blocks from the data transfer
      const [blocks, boardPath] =
        await generateBoardContentBlocksFromDataTransfer(
          API,
          board.path,
          event.dataTransfer,
        );
      console.log(event.dataTransfer.files);

      // Add new content blocks as children to the column block
      const updatedContent = addChildBlocksToBoard(
        getBoardContent(board),
        columnBlock,
        blocks,
        index,
      );

      // Update the board document
      API.Documents.update(boardPath, { content: updatedContent });
    },
    [board, columnBlock, API],
  );

  const onDropColumnEnd = useCallback(
    async (event: React.DragEvent) => {
      onDrop(event, blocks.length);
    },
    [blocks, onDrop],
  );

  const onClickDelete = useCallback(() => {
    console.log('delete column');
  }, []);

  return (
    <div
      className={API.Utils.mapPropsToClasses(
        { className },
        'board-column-block',
      )}
      {...other}
    >
      {blocks.map((childBlock, blockIndex) => (
        <div key={childBlock.id}>
          <SpacerDropZone
            parentBlockId={columnBlock.id}
            blockIndex={blockIndex}
            onDrop={onDrop}
          />
          <BoardBlock key={childBlock.id} block={childBlock} />
        </div>
      ))}
      <BoardColumnBlockEnd
        enableDelete={blocks.length === 0}
        onClickDelete={onClickDelete}
        onDrop={onDropColumnEnd}
      />
    </div>
  );
};

const SpacerDropZone: React.FC<{
  onDrop(event: React.DragEvent<HTMLDivElement>, blockIndex: number): void;
  parentBlockId: string;
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
  } = useApi();

  return (
    <div className="board-column-block-end">
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
