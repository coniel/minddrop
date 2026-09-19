import React from 'react';

export interface DragPress {
  /**
   * Whether the Shift key was held when the drag was pressed.
   */
  shiftKey: boolean;
}

export interface DraggableProps {
  /**
   * Registers the element as the drag's source.
   */
  ref: (element: HTMLElement | null) => VoidFunction | void;

  /**
   * Marks the element as a drag source.
   */
  'data-draggable-key': string;

  /**
   * Prevents the browser from starting a native drag of the element.
   */
  draggable: false;

  /**
   * Prevents images and links inside the element from starting a
   * native drag.
   */
  onDragStart: (event: React.DragEvent) => void;

  /**
   * Records the press which may become the drag.
   */
  onPointerDown: (event: React.PointerEvent) => void;

  /**
   * Prevents the press from anchoring a text selection.
   */
  onMouseDown: (event: React.MouseEvent) => void;
}

export interface DraggableUtils {
  /**
   * Props spread onto the element which is dragged.
   */
  draggableProps: DraggableProps;

  /**
   * Whether the item is currently being dragged.
   */
  isDragging: boolean;
}
