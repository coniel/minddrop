import { useCallback } from 'react';
import { NodeRendererProps, Node, useApi } from '@minddrop/extension';
import { BoardColumnNode } from '../BoardColumnNode';
import { BoardColumnsNode } from '../BoardColumnsNode';
import { useBoardDocument } from '../../BoardDocumentProvider';
import { updateNodeInBoard } from '../../updateNodeInBoard';
import { getBoardContent } from '../../getBoardContent';
import { removeNodeFromBoard } from '../../removeNodeFromBoard';

export const BoardNode: React.FC<Pick<NodeRendererProps, 'node'>> = ({
  node,
  ...other
}) => {
  const {
    Nodes: { isGroupNode, NodeRenderer },
  } = useApi();
  const API = useApi();
  const board = useBoardDocument();

  const onChange = useCallback(
    (node: Node) => {
      const content = updateNodeInBoard(getBoardContent(board), node);

      API.Documents.update(board.path, { content });
    },
    [board, API],
  );

  const onDelete = useCallback(
    (node: Node) => {
      removeNodeFromBoard(
        API,
        { ...board, content: getBoardContent(board) },
        node,
      );
    },
    [board, API],
  );

  if (!isGroupNode(node)) {
    return (
      <NodeRenderer
        node={node}
        onChange={onChange}
        onDelete={onDelete}
        {...other}
      />
    );
  }

  switch (node.display) {
    case 'board-columns':
      return <BoardColumnsNode node={node} {...other} />;
    case 'board-column':
      return <BoardColumnNode node={node} {...other} />;
    default:
      return (
        <NodeRenderer
          node={node}
          onChange={onChange}
          onDelete={onDelete}
          {...other}
        />
      );
  }
};
