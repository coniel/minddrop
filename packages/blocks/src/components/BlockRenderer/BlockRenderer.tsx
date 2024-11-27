import { Block } from '../../types';
import { useBlockVariant } from '../../BlockVariantsStore';

interface BlockRendererProps {
  /**
   * The block to render.
   */
  block: Block;

  /**
   * Callback fired when the block changes.
   *
   * @param block - The updated block.
   */
  onChange: (block: Block) => void;

  /**
   * Callback fired when the block is deleted.
   *
   * @param block - The block to delete.
   */
  onDelete: (block: Block) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  onChange,
  onDelete,
}) => {
  const blockRenderer = useBlockVariant(block.type, block.variant);

  if (!blockRenderer) {
    return (
      <div>
        No variant &quot;{block.variant}&quot; for block type &quot;{block.type}
        &quot;
      </div>
    );
  }

  if (!blockRenderer.component) {
    return (
      <div>
        Missing component of variant &quot;{block.variant || 'default'}&quot;
        for block type &quot;{block.type}&quot;
      </div>
    );
  }

  return (
    <blockRenderer.component
      block={block}
      onChange={onChange}
      onDelete={onDelete}
    />
  );
};
