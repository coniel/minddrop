import { LinkNode } from '../../types';

interface LinkNodeRendererProps {
  /**
   * The node to render.
   */
  node: LinkNode;

  /**
   * Callback to call when the node changes.
   */
  onChange: (node: LinkNode) => void;
}

export const LinkNodeRenderer: React.FC<LinkNodeRendererProps> = ({ node }) => {
  return <div className="link-node">{node.url}</div>;
};
