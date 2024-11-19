import { Node, TextNode, TextNodeRendererConfig } from '../../types';
import { useNodeRendererConfig } from '../../NodeRendererConfigsStore';

interface NodeRendererProps {
  /**
   * The node to render.
   */
  node: Node;

  /**
   * Callback fired when the node changes.
   *
   * @param node - The updated node.
   */
  onChange: (node: Node) => void;

  /**
   * Callback fired when the node is deleted.
   *
   * @param node - The node to delete.
   */
  onDelete: (node: Node) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  onChange,
  onDelete,
}) => {
  const nodeRenderer = useNodeRendererConfig(
    node.type,
    node.display,
  ) as TextNodeRendererConfig;

  if (!nodeRenderer) {
    return null;
  }

  return (
    <nodeRenderer.component
      node={node as TextNode}
      onChange={onChange}
      onDelete={onDelete}
    />
  );
};
