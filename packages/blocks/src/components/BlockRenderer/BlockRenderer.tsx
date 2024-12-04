import { useDraggable, useSelectable } from '@minddrop/selection';
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

  // Make the block selectable
  const { selected, onClick } = useSelectable({
    id: block.id,
    getPlainTextContent: () => block.text || block.url || block.file || '',
    onDelete: deleteBlockCallback,
  });

  // Make the block draggable
  const { onDragStart } = useDraggable({ id: block.id });

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
