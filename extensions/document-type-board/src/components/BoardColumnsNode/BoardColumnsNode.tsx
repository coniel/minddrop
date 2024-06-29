import React from 'react';
import { useCallback } from 'react';
import { useChildNodes } from '../../BoardNodesProvider';
import { BoardColumnsNode as ColumnsNode } from '../../types';
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
  node,
  className,
  ...other
}) => {
  const nodes = useChildNodes(node.children);

  const onDropVerticalZone = useCallback((event: React.DragEvent) => {
    console.log(event);
  }, []);

  return (
    <div className="board-columns-node" {...other}>
      <div className="board-columns-node-content">
        {nodes.map((childNode) => (
          <BoardNode key={childNode.id} node={childNode} />
        ))}
      </div>
      <BoardDropZone
        className="vertical-drop-zone"
        onDrop={onDropVerticalZone}
      />
    </div>
  );
};
