import { useCallback } from 'react';
import { useDragImage } from '@minddrop/utils';
import { Blocks, BlockType } from '@minddrop/blocks';
import { BlockContainer, ContentIcon } from '@minddrop/ui-elements';
import { DocumentContentToolbarItem } from '../DocumentContentToolbarItem';
import './DocumentContentToolbarBlockItem.css';

export interface DocumentContentToolbarBlockItemProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The block type configuration.
   */
  blockType: BlockType;
}

export const DocumentContentToolbarBlockItem: React.FC<
  DocumentContentToolbarBlockItemProps
> = ({ blockType: blockTypeConfig, onDragStart }) => {
  const { setDragImage, clearDragImage } = useDragImage(
    <BlockContainer
      style={{
        minWidth: 300,
        display: 'flex',
        columnGap: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ContentIcon name={blockTypeConfig.icon} size={24} />
      {`${blockTypeConfig.description['en-GB'].name}`}
    </BlockContainer>,
  );

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      setDragImage(event);
      onDragStart?.(event);

      Blocks.addTemplatesToDataTransfer(event.dataTransfer, [
        {
          type: blockTypeConfig.id,
          ...(blockTypeConfig.initialProperties ?? {}),
        },
      ]);
    },
    [setDragImage, onDragStart, blockTypeConfig],
  );

  return (
    <DocumentContentToolbarItem
      draggable
      tooltip={`Drag to add a ${blockTypeConfig.description['en-GB'].name} block`}
      icon={blockTypeConfig.icon}
      className="document-content-toolbar-block-item"
      onDragStart={handleDragStart}
      onDragEnd={clearDragImage}
    />
  );
};
