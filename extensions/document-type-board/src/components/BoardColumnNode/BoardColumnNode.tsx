import { mapPropsToClasses } from '@minddrop/utils';
import './BoardColumnNode.css';
import { BoardColumnNode as ColumnNode } from '../../types';
import { useBoardNodes, useChildNodes } from '../../BoardNodesProvider';
import { BoardNode } from '../BoardNode';

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

  return (
    <div
      className={mapPropsToClasses({ className }, 'board-column-node')}
      {...other}
    >
      {nodes.map((childNode) => (
        <BoardNode key={childNode.id} node={childNode} />
      ))}
    </div>
  );
};
