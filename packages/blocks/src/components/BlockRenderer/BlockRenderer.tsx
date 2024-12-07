import { useCallback } from 'react';
import { useSelectionItem } from '@minddrop/selection';
import { Block } from '../../types';
import { useBlockVariant } from '../../BlockVariantsStore';
import { updateBlock } from '../../updateBlock';
import { deleteBlock } from '../../deleteBlock';
import { useBlock } from '../../useBlock';

interface BlockRendererProps {
  /**
   * The ID of the block to render.
   */
  blockId: string;
}

const noBlock = {} as Block;

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blockId }) => {
  const block = useBlock(blockId) || noBlock;
  const blockRenderer = useBlockVariant(block.type, block.variant);

  // Make the block selectable
  const { selected, onClick, onDragStart } = useSelectionItem({
    type: 'block',
    id: block.id,
  });

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
      draggable
      block={block}
      selected={selected}
      updateBlock={updateBlockCallback}
      deleteBlock={deleteBlockCallback}
      toggleSelected={onClick}
      onDragStart={onDragStart}
    />
  );
};
