import React, { useCallback } from 'react';
import { useApi } from '@minddrop/extension';
import { useBoardDocument, useChildBlocks } from '../../BoardDocumentProvider';
import { BoardColumnsBlock as ColumnsBlock } from '../../types';
import { generateBoardContentBlocksFromDataTransfer } from '../../generateBoardContentBlocksFromDataTransfer';
import { addChildBlocksToBoard } from '../../addChildBlocksToBoard';
import { getBoardContent } from '../../getBoardContent';
import { BoardBlock } from '../BoardBlock';
import { BoardDropZone } from '../BoardDropZone';
import './BoardColumnsBlock.css';

export interface BoardColumnsBlockProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The board columns block.
   */
  block: ColumnsBlock;
}

export const BoardColumnsBlock: React.FC<BoardColumnsBlockProps> = ({
  block: columnsBlock,
  className,
  ...other
}) => {
  const API = useApi();
  const board = useBoardDocument();
  const blocks = useChildBlocks(columnsBlock.children);

  const onDropVerticalZone = useCallback(
    async (event: React.DragEvent, index: number) => {
      // Generate a new column block
      const newColumn = API.Blocks.generateBlock('board-column');

      // Add the new column block as a child to the columns block
      let updatedContent = addChildBlocksToBoard(
        getBoardContent(board),
        columnsBlock,
        [newColumn],
        index,
      );

      // Generate new content blocks from the data transfer
      const [blocks, boardPath] =
        await generateBoardContentBlocksFromDataTransfer(
          API,
          board.path,
          event.dataTransfer,
        );

      // Add new content blocks as children to the new column block
      updatedContent = addChildBlocksToBoard(updatedContent, newColumn, blocks);

      // Update the board document
      API.Documents.update(boardPath, { content: updatedContent });
    },
    [columnsBlock, board, API],
  );

  return (
    <div className="board-columns-block" {...other}>
      <div className="board-columns-block-content">
        {blocks.map((childBlock, index) => (
          <div key={childBlock.id} className="board-column-block-container">
            <BoardDropZone
              className="vertical-drop-zone"
              onDrop={(event) => onDropVerticalZone(event, index)}
            />
            <BoardBlock block={childBlock} />
          </div>
        ))}
      </div>
      <BoardDropZone
        className="vertical-drop-zone"
        onDrop={(event) => onDropVerticalZone(event, blocks.length)}
      />
    </div>
  );
};
