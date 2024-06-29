import { useCallback } from 'react';
import {
  Node,
  NodeRenderer,
  NodeRendererProps,
  Nodes,
  TextNode,
} from '@minddrop/nodes';
import { mapPropsToClasses } from '@minddrop/utils';
import './BoardNode.css';
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
