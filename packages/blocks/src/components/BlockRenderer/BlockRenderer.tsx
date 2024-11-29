import { Block } from '../../types';
import { useBlockVariant } from '../../BlockVariantsStore';
import { useCallback } from 'react';
import { updateBlock } from '../../updateBlock';
import { deleteBlock } from '../../deleteBlock';
import { useBlock } from '../../useBlock';

interface BlockRendererProps {
  /**
   * The ID of the block to render.
   */
  blockId: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blockId }) => {
  const block = useBlock(blockId) || ({} as Block);

  const blockRenderer = useBlockVariant(block.type, block.variant);

  const updateBlockCallback = useCallback(
    (data: Partial<Block>) => updateBlock(block.id, data),
    [block.id],
  );

  const deleteBlockCallback = useCallback(
    () => deleteBlock(block.id),
    [block.id],
  );

  if (!block.id) {
    return <div>Block with ID &quot;{blockId}&quot; not found</div>;
  }

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
      updateBlock={updateBlockCallback}
      deleteBlock={deleteBlockCallback}
    />
  );
};
