import { FileNode } from '../../types';

interface FileNodeRendererProps {
  /**
   * The node to render.
   */
  node: FileNode;

  /**
   * Callback to call when the node changes.
   */
  onChange: (node: FileNode) => void;
}

export const FileNodeRenderer: React.FC<FileNodeRendererProps> = ({ node }) => {
  return <div className="file-node">{node.path?.split('/').slice(-1)[0]}</div>;
};
