import { useCallback } from 'react';
import { DesignElement as DesignElementType } from '@minddrop/designs';
import { DropEventData, useDroppable } from '@minddrop/selection';
import { DatabasePropertiesDataKey } from '../constants';
import './PropertyDropTarget.css';

export interface PropertyDropTargetProps {
  /**
   * The design element that this drop target wraps.
   */
  element: DesignElementType;

  /**
   * Callback fired when a property is dropped onto this element.
   * Receives the element ID and the drop event data.
   */
  onDrop: (elementId: string, drop: DropEventData) => void;

  /**
   * The child content to render (the design element).
   */
  children: React.ReactNode;
}

/**
 * Wraps a design element to make it a drop target for
 * database properties during property-to-element mapping.
 * Shows a visual highlight when a property is dragged over.
 */
export const PropertyDropTarget: React.FC<PropertyDropTargetProps> = ({
  element,
  onDrop,
  children,
}) => {
  // Handle drop events, forwarding the element ID
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      // Only handle drops that contain database property data
      const data = drop.data as Record<string, unknown>;

      if (!data[DatabasePropertiesDataKey]) {
        return;
      }

      onDrop(element.id, drop);
    },
    [element.id, onDrop],
  );

  const { droppableProps, isDraggingOver } = useDroppable({
    type: 'design-element',
    id: element.id,
    onDrop: handleDrop,
  });

  return (
    <div
      className={`property-drop-target${isDraggingOver ? ' dragging-over' : ''}`}
      {...droppableProps}
    >
      {children}
    </div>
  );
};
