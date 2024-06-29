import { useChildNodes } from '../../BoardNodesProvider';
import { BoardColumnsNode as ColumnsNode } from '../../types';
import { BoardNode } from '../BoardNode';
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

  return (
    <div className="board-columns-node" {...other}>
      {nodes.map((childNode) => (
        <BoardNode key={childNode.id} node={childNode} />
      ))}
    </div>
  );
};
