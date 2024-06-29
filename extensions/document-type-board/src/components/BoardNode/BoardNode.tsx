import { useCallback } from 'react';
import { NodeRenderer, NodeRendererProps, Nodes } from '@minddrop/nodes';
import { BoardColumnNode } from '../BoardColumnNode';
import { BoardColumnsNode } from '../BoardColumnsNode';

export const BoardNode: React.FC<Pick<NodeRendererProps, 'node'>> = ({
  node,
  ...other
}) => {
  const onChange = useCallback(() => {
    console.log('changed');
  }, []);

  if (!Nodes.isGroupNode(node)) {
    return <NodeRenderer node={node} onChange={onChange} {...other} />;
  }

  switch (node.display) {
    case 'board-columns':
      return <BoardColumnsNode node={node} {...other} />;
    case 'board-column':
      return <BoardColumnNode node={node} {...other} />;
    default:
      return <NodeRenderer node={node} onChange={onChange} {...other} />;
  }
};
