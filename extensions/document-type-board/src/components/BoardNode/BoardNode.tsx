import { useCallback } from 'react';
import { Node, NodeRenderer, NodeRendererProps, Nodes } from '@minddrop/nodes';
import { Documents } from '@minddrop/documents';
import { BoardColumnNode } from '../BoardColumnNode';
import { BoardColumnsNode } from '../BoardColumnsNode';
import { useBoardDocument } from '../../BoardDocumentProvider';
import { updateNodeInBoard } from '../../updateNodeInBoard';
import { getBoardContent } from '../../getBoardContent';

export const BoardNode: React.FC<Pick<NodeRendererProps, 'node'>> = ({
  node,
  ...other
}) => {
  const board = useBoardDocument();

  const onChange = useCallback(
    (node: Node) => {
      const content = updateNodeInBoard(getBoardContent(board), node);

      Documents.update(board.path, { content });
    },
    [board],
  );

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
