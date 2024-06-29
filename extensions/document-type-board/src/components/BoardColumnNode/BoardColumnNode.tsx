import React, { useCallback } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Button } from '@minddrop/ui';
import { Documents } from '@minddrop/documents';
import { BoardColumnNode as ColumnNode } from '../../types';
import { useBoardDocument, useChildNodes } from '../../BoardDocumentProvider';
import { generateBoardContentNodesFromDataTransfer } from '../../generateBoardContentNodesFromDataTransfer';
import { addChildNodesToBoard } from '../../addChildNodesToBoard';
import { getBoardContent } from '../../getBoardContent';
import { BoardNode } from '../BoardNode';
import { BoardDropZone } from '../BoardDropZone';
import './BoardColumnNode.css';

export interface BoardColumnNodeProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The board column node.
   */
  node: ColumnNode;
}

export const BoardColumnNode: React.FC<BoardColumnNodeProps> = ({
  node: columnNode,
  className,
  ...other
}) => {
  const board = useBoardDocument();
  const nodes = useChildNodes(columnNode.children);

  const onDrop = useCallback(
    async (event: React.DragEvent, index: number) => {
      console.log(event.dataTransfer.files);
      // Generate new content nodes from the data transfer
      const [nodes, boardPath] =
        await generateBoardContentNodesFromDataTransfer(
          board.path,
          event.dataTransfer,
        );
      console.log(event.dataTransfer.files);

      // Add new content nodes as children to the column node
      const updatedContent = addChildNodesToBoard(
        getBoardContent(board),
        columnNode,
        nodes,
        index,
      );

      // Update the board document
      Documents.update(boardPath, { content: updatedContent });
    },
    [board, columnNode],
  );

  const onDropColumnEnd = useCallback(
    async (event: React.DragEvent) => {
      onDrop(event, nodes.length);
    },
    [nodes, onDrop],
  );

  const onClickDelete = useCallback(() => {
    console.log('delete column');
  }, []);

  return (
    <div
      className={mapPropsToClasses({ className }, 'board-column-node')}
      {...other}
    >
      {nodes.map((childNode, nodeIndex) => (
        <div key={childNode.id}>
          <SpacerDropZone
            parentNodeId={columnNode.id}
            nodeIndex={nodeIndex}
            onDrop={onDrop}
          />
          <BoardNode key={childNode.id} node={childNode} />
        </div>
      ))}
      <BoardColumnNodeEnd
        enableDelete={nodes.length === 0}
        onClickDelete={onClickDelete}
        onDrop={onDropColumnEnd}
      />
    </div>
  );
};

const SpacerDropZone: React.FC<{
  onDrop(event: React.DragEvent<HTMLDivElement>, nodeIndex: number): void;
  parentNodeId: string;
  nodeIndex: number;
}> = ({ onDrop, nodeIndex }) => {
  const handleOnDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => onDrop(event, nodeIndex),
    [onDrop, nodeIndex],
  );

  return <BoardDropZone className="spacer-drop-zone" onDrop={handleOnDrop} />;
};

const BoardColumnNodeEnd: React.FC<{
  enableDelete: boolean;
  onClickDelete(): void;
  onDrop(event: React.DragEvent<HTMLDivElement>): void;
}> = ({ enableDelete, onClickDelete, onDrop }) => {
  return (
    <div className="board-column-node-end">
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
