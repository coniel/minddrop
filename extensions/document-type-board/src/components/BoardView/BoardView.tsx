import { useMemo } from 'react';
import { Node } from '@minddrop/nodes';
import { DocumentViewProps } from '@minddrop/documents';
import { BoardData } from '../../types';
import { BoardNodesProvider } from '../../BoardNodesProvider';
import { BoardNode } from '../BoardNode';
import './BoardView.css';

export const BoardView: React.FC<DocumentViewProps<BoardData>> = ({
  document,
}) => {
  const content = useMemo(
    () =>
      document.content
        ? document.content
        : (JSON.parse(document.fileTextContent).content as BoardData),
    [document.content, document.fileTextContent],
  );

  const rootNodes = useMemo(() => {
    return content.rootNodes
      .map((id) => content.nodes.find((node) => node.id === id))
      .filter(isNode);
  }, [content]);

  return (
    <BoardNodesProvider value={content.nodes}>
      <div className="board-view">
        {rootNodes.map((node) => (
          <BoardNode key={node.id} node={node} />
        ))}
      </div>
    </BoardNodesProvider>
  );
};

function isNode(node: Node | undefined): node is Node {
  return node !== undefined;
}
