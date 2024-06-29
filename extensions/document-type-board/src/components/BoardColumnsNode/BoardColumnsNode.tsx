import React from 'react';
import { useCallback } from 'react';
import { Nodes } from '@minddrop/nodes';
import { Documents } from '@minddrop/documents';
import { useBoardDocument, useChildNodes } from '../../BoardDocumentProvider';
import { BoardColumnsNode as ColumnsNode } from '../../types';
import { generateBoardContentNodesFromDataTransfer } from '../../generateBoardContentNodesFromDataTransfer';
import { addChildNodesToBoard } from '../../addChildNodesToBoard';
import { getBoardContent } from '../../getBoardContent';
import { BoardNode } from '../BoardNode';
import { BoardDropZone } from '../BoardDropZone';
import './BoardColumnsNode.css';

export interface BoardColumnsNodeProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The board columns node.
   */
  node: ColumnsNode;
}

export const BoardColumnsNode: React.FC<BoardColumnsNodeProps> = ({
  node: columnsNode,
  className,
  ...other
}) => {
  const board = useBoardDocument();
  const nodes = useChildNodes(columnsNode.children);

  const onDropVerticalZone = useCallback(
    async (event: React.DragEvent, index: number) => {
      // Generate a new column node
      const newColumn = Nodes.generateGroupNode([], 'board-column');

      // Add the new column node as a child to the columns node
      let updatedContent = addChildNodesToBoard(
        getBoardContent(board),
        columnsNode,
        [newColumn],
        index,
      );

      // Generate new content nodes from the data transfer
      const [nodes, boardPath] =
        await generateBoardContentNodesFromDataTransfer(
          board.path,
          event.dataTransfer,
        );

      // Add new content nodes as children to the new column node
      updatedContent = addChildNodesToBoard(updatedContent, newColumn, nodes);

      // Update the board document
      Documents.update(boardPath, { content: updatedContent });
    },
    [columnsNode, board],
  );

  return (
    <div className="board-columns-node" {...other}>
      <div className="board-columns-node-content">
        {nodes.map((childNode, index) => (
          <div key={childNode.id} className="board-column-node-container">
            <BoardDropZone
              className="vertical-drop-zone"
              onDrop={(event) => onDropVerticalZone(event, index)}
            />
            <BoardNode node={childNode} />
          </div>
        ))}
      </div>
      <BoardDropZone
        className="vertical-drop-zone"
        onDrop={(event) => onDropVerticalZone(event, nodes.length)}
      />
    </div>
  );
};
