import React, { useCallback } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { BoardColumnNode as ColumnNode } from '../../types';
import { useChildNodes } from '../../BoardNodesProvider';
import { BoardNode } from '../BoardNode';
import { Button } from '@minddrop/ui';
import { BoardDropZone } from '../BoardDropZone';
import './BoardColumnNode.css';

export interface BoardColumnNodeProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The board column node.
   */
  node: ColumnNode;
}

export const BoardColumnNode: React.FC<BoardColumnNodeProps> = ({
  node,
  className,
  ...other
}) => {
  const nodes = useChildNodes(node.children);

  const onDropSpacerDropZone = useCallback(
    (event: React.DragEvent, nodeId: string) => {
      console.log(event, nodeId);
    },
    [],
  );

  const onDropVerticalZone = useCallback((event: React.DragEvent) => {
    console.log(event);
  }, []);

  const onDropColumnEnd = useCallback((event: React.DragEvent) => {
    console.log(event);
  }, []);

  const onClickDelete = useCallback(() => {
    console.log('delete column');
  }, []);

  return (
    <div
      className={mapPropsToClasses({ className }, 'board-column-node')}
      {...other}
    >
      <BoardDropZone
        className="vertical-drop-zone"
        onDrop={onDropVerticalZone}
      />
      <div className="board-column-node-content">
        {nodes.map((childNode) => (
          <div key={childNode.id}>
            <SpacerDropZone
              nodeId={childNode.id}
              onDrop={onDropSpacerDropZone}
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
    </div>
  );
};

const SpacerDropZone: React.FC<{
  onDrop(event: React.DragEvent<HTMLDivElement>, nodeId: string): void;
  nodeId: string;
}> = ({ onDrop, nodeId }) => {
  const handleOnDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => onDrop(event, nodeId),
    [onDrop, nodeId],
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
