import React, { useState } from 'react';
import {
  DropEventData,
  DropIndicatorPosition,
  Selection,
} from '@minddrop/selection';
import { DropIndicator } from '../DropIndicator';

interface FlexDropContainerGapProps {
  /**
   * The ID of the parent container. Used as the drop event target ID.
   */
  containerId: string;

  /**
   * The index of the gap zone within its parent container.
   */
  index: number;

  /**
   * The direction of the container's main axis.
   */
  direction: React.CSSProperties['flexDirection'];

  /**
   * The size of the gap zone.
   */
  size: number;

  /**
   * If the gap is at the start or end of the container.
   */
  edge?: 'start' | 'end' | null;

  /**
   * Callback fired when the gap zone is dropped.
   */
  onDrop?: (data: DropEventData) => void;
}

export const FlexDropContainerGap: React.FC<FlexDropContainerGapProps> = ({
  containerId,
  direction,
  size,
  index,
  edge = null,
  onDrop,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  let dropIndicatorPosition: DropIndicatorPosition = 'inside';

  if (edge === 'start') {
    dropIndicatorPosition = 'end';
  } else if (edge === 'end') {
    dropIndicatorPosition = 'start';
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    if (
      e.currentTarget === e.target ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDraggingOver(false);

    if (onDrop) {
      onDrop({
        data: Selection.getEventData(e),
        index,
        targetId: containerId,
        targetType: 'flex-drop-container',
        event: e,
        position: 'inside',
      });
    }
  };

  // Calculate the gap style
  const style: React.CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    ...(direction === 'row'
      ? {
          width: edge ? 'auto' : size,
          flexGrow: edge ? 1 : 0,
          alignSelf: 'stretch',
        }
      : {
          height: edge ? 'auto' : size,
          flexGrow: edge ? 1 : 0,
          alignSelf: 'stretch',
        }),
  };

  return (
    <div
      style={style}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-gap-zone
      data-position={index}
    >
      <DropIndicator
        show={isDraggingOver}
        position={dropIndicatorPosition}
        axis={direction === 'row' ? 'vertical' : 'horizontal'}
      />
    </div>
  );
};
