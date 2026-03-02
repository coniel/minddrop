import React, { useState } from 'react';
import { DropEventData } from '@minddrop/selection';
import { getTransferData } from '@minddrop/utils';
import './FlexDropContainerGap.css';

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
   * Whether this gap is expanded (triggered by a child element
   * detecting a before/after drag position).
   */
  isExpanded?: boolean;

  /**
   * Whether this gap should grow to fill all remaining space
   * in the container.
   */
  fill?: boolean;

  /**
   * Callback fired when the gap zone is dropped.
   */
  onDrop?: (data: DropEventData) => void;
}

// Expanded size (in px) when dragging over a gap
const EXPANDED_SIZE = 32;

export const FlexDropContainerGap: React.FC<FlexDropContainerGapProps> = ({
  containerId,
  direction,
  size,
  index,
  isExpanded = false,
  fill = false,
  onDrop,
}) => {
  // Track direct drags over this gap zone
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Gap is active when directly dragged over OR expanded by a sibling element
  const isActive = isDraggingOver || isExpanded;

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();

    if (
      event.currentTarget === event.target ||
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDraggingOver(false);

    if (onDrop) {
      onDrop({
        data: getTransferData(event),
        index,
        targetId: containerId,
        targetType: 'flex-drop-container',
        event,
        position: 'inside',
      });
    }
  };

  // Determine the active dimension based on layout direction
  const isRow = direction === 'row';

  // Use expanded size when active, otherwise use the prop size
  const activeSize = isActive ? EXPANDED_SIZE : size;

  // Calculate the gap style.
  // Fill gaps grow to consume remaining space in the container.
  // Other gaps use a fixed size.
  const gapStyle: React.CSSProperties = {
    alignSelf: 'stretch',
    flexGrow: fill ? 1 : 0,
    ...(isRow
      ? {
          width: fill ? 'auto' : activeSize,
          minWidth: fill && isActive ? EXPANDED_SIZE : undefined,
        }
      : {
          height: fill ? 'auto' : activeSize,
          minHeight: fill && isActive ? EXPANDED_SIZE : undefined,
        }),
  };

  // Build the class name
  const className = `flex-drop-gap${isActive ? ' flex-drop-gap-active' : ''}`;

  return (
    <div
      className={className}
      style={gapStyle}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-gap-zone
      data-position={index}
    />
  );
};
