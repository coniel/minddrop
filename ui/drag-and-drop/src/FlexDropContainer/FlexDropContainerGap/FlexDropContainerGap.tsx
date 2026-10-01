import React from 'react';
import { DragAndDrop, DropEventData } from '@minddrop/drag-and-drop';
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
   * The data types the gap accepts drops of from native drags only,
   * in addition to `accepts`.
   */
  nativeAccepts?: string[];

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

export const FlexDropContainerGap: React.FC<FlexDropContainerGapProps> = ({
  containerId,
  direction,
  size,
  index,
  isActive = false,
  accepts,
  nativeAccepts,
  grow = false,
  onDrop,
}) => {
  // Take drops on the gap
  const { droppableProps, isDraggingOver } = DragAndDrop.useDroppable({
    type: 'flex-drop-container',
    id: containerId,
    index,
    accepts,
    nativeAccepts,
    onDrop,
  });

  // Gap shows the drop line when directly dragged over OR
  // activated by a sibling element.
  const showLine = isDraggingOver || isActive;

  // Determine the active dimension based on layout direction
  const isRow = direction === 'row';

  // Size the gap along the main axis only
  const gapStyle: React.CSSProperties = {
    alignSelf: 'stretch',
    flexGrow: grow ? 1 : 0,
    ...(isRow ? { width: size } : { height: size }),
  };

  return (
    <div
      className="flex-drop-gap"
      style={gapStyle}
      data-gap-zone
      data-position={index}
      {...droppableProps}
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
