import React, { useState } from 'react';
import { DropEventData, dragContainsType } from '@minddrop/selection';
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
   * Whether this gap is active (triggered by a child element
   * detecting a before/after drag position).
   */
  isActive?: boolean;

  /**
   * The data types the gap accepts drops of. Drags not containing
   * any accepted type are ignored, falling through to ancestor
   * drop targets.
   *
   * When omitted, all drags are accepted.
   */
  accepts?: string[];

  /**
   * Whether the gap animates open to make room for the dragged
   * element while active.
   */
  expandOnActive?: boolean;

  /**
   * Whether the gap takes a share of the container's free space,
   * standing in for the distribution its children would otherwise
   * be given.
   */
  grow?: boolean;

  /**
   * Callback fired when the gap zone is dropped.
   */
  onDrop?: (data: DropEventData) => void;
}

// Expanded size (in px) of an active gap with expansion enabled
const EXPANDED_SIZE = 32;

export const FlexDropContainerGap: React.FC<FlexDropContainerGapProps> = ({
  containerId,
  direction,
  size,
  index,
  isActive = false,
  accepts,
  expandOnActive = false,
  grow = false,
  onDrop,
}) => {
  // Track direct drags over this gap zone
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Gap shows the drop line when directly dragged over OR
  // activated by a sibling element
  const showLine = isDraggingOver || isActive;

  const handleDragOver = (event: React.DragEvent) => {
    // Ignore drags without an accepted data type, letting them
    // fall through to ancestor drop targets
    if (accepts && !dragContainsType(event, accepts)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    // Ignore drags without an accepted data type
    if (accepts && !dragContainsType(event, accepts)) {
      return;
    }

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
    // Let unaccepted drops bubble to ancestor drop targets
    if (accepts && !dragContainsType(event, accepts)) {
      return;
    }

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

  // Expand the gap while active when expansion is enabled,
  // otherwise keep the layout stable regardless of drag state
  const activeSize = expandOnActive && showLine ? EXPANDED_SIZE : size;

  // Size the gap along the main axis only
  const gapStyle: React.CSSProperties = {
    alignSelf: 'stretch',
    flexGrow: grow ? 1 : 0,
    ...(isRow ? { width: activeSize } : { height: activeSize }),
  };

  return (
    <div
      className={`flex-drop-gap${expandOnActive ? ' flex-drop-gap-expandable' : ''}`}
      style={gapStyle}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-gap-zone
      data-position={index}
    >
      {/* Line indicating the drop location */}
      {showLine && (
        <div
          className={`flex-drop-gap-line flex-drop-gap-line-${isRow ? 'vertical' : 'horizontal'}`}
        />
      )}
    </div>
  );
};
