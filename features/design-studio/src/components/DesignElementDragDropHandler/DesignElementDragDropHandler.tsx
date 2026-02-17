import { DropIndicator } from '@minddrop/feature-drag-and-drop';
import { useDraggable, useDroppable } from '@minddrop/selection';
import { DesignElementsDataKey } from '../../constants';
import { handleDropOnDesignElement } from '../../handleDropOnDesignElement';
import { FlatDesignElement } from '../../types';
import './DesignElementDragDropHandler.css';

export interface DropHandlerProps {
  index: number;
  element: FlatDesignElement;
  children: React.ReactNode;
  disabled?: boolean;
  isLastChild?: boolean;
  gap?: number;
}

export const DesignElementDragDropHandler: React.FC<DropHandlerProps> = ({
  index,
  element,
  children,
  disabled = false,
  isLastChild = false,
  gap = 0,
}) => {
  const { draggableProps } = useDraggable({
    id: element.id,
    type: DesignElementsDataKey,
    data: element,
  });
  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    useDroppable({
      index,
      type: 'design-element',
      id: element.id,
      axis: 'vertical',
      enableInside: false,
      edgeThreshold: 0.5,
      isLastChild,
      onDrop: handleDropOnDesignElement,
    });

  if (disabled) {
    return children;
  }

  return (
    <div
      className="design-element-drop-handler"
      {...draggableProps}
      {...droppableProps}
    >
      {children}
      <DropIndicator
        axis="horizontal"
        show={isDraggingOver}
        position={dropIndicatorPosition}
        gap={gap}
      />
    </div>
  );
};
