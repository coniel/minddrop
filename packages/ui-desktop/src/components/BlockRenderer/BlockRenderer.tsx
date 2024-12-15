import { useCallback, useRef } from 'react';
import { Block, Blocks, useBlock, useBlockVariant } from '@minddrop/blocks';
import { useSelectionItem } from '@minddrop/selection';
import { BlockContainer } from '@minddrop/ui-elements';
import { BlockOptionsMenu } from '../BlockOptionsMenu';
import './BlockRenderer.css';

export interface BlockRendererProps {
  /**
   * The ID of the block to render.
   */
  blockId: string;
}

const noBlock = {} as Block;

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blockId }) => {
  const blockContainerRef = useRef<HTMLDivElement>(null);
  const block = useBlock(blockId) || noBlock;
  const blockVariant = useBlockVariant(block.type, block.variant);

  // Make the block selectable
  const { selected, onClick, onDragStart } = useSelectionItem({
    type: 'block',
    id: block.id,
  });

  const updateBlockCallback = useCallback(
    (data: Partial<Block>) => Blocks.update(block.id, data),
    [block.id],
  );

  const deleteBlockCallback = useCallback(
    () => Blocks.delete(block.id),
    [block.id],
  );

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (blockContainerRef.current) {
        event.dataTransfer.setDragImage(blockContainerRef.current, 0, 0);
      }
      onDragStart(event);
    },
    [onDragStart],
  );

  if (!block.id) {
    return <div>Block with ID &quot;{blockId}&quot; not found</div>;
  }

  if (!blockVariant) {
    return (
      <div>
        No variant &quot;{block.variant}&quot; for block type &quot;{block.type}
        &quot;
      </div>
    );
  }

  if (!blockVariant.component) {
    return (
      <div>
        Missing component of variant &quot;{block.variant || 'default'}&quot;
        for block type &quot;{block.type}&quot;
      </div>
    );
  }

  return (
    <BlockContainer
      ref={blockContainerRef}
      className={blockVariant.className}
      color={block.color}
      selected={selected}
    >
      <blockVariant.component
        block={block}
        selected={selected}
        updateBlock={updateBlockCallback}
        deleteBlock={deleteBlockCallback}
      />
      <div
        draggable
        className="drag-handle"
        onDragStart={handleDragStart}
        onClick={onClick}
      />
      <BlockOptionsMenu blockId={block.id} />
    </BlockContainer>
  );
};
