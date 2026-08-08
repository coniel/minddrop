import { useEffect, useRef } from 'react';
import { DropIndicatorPosition } from '@minddrop/selection';
import { useFlexDropContainer } from './FlexDropContainer';

export interface UseFlexDropGapActivationOptions {
  /**
   * The index of the element within its parent FlexDropContainer.
   */
  index: number;

  /**
   * Whether the element is currently being dragged over.
   */
  isDraggingOver: boolean;

  /**
   * The element's current drop indicator position.
   */
  dropIndicatorPosition: DropIndicatorPosition;
}

/**
 * Activates the parent FlexDropContainer gap adjacent to a droppable
 * child element's before/after drag position, showing the gap's drop
 * line while the element is dragged over.
 *
 * Does nothing when the element is not inside a FlexDropContainer.
 */
export function useFlexDropGapActivation({
  index,
  isDraggingOver,
  dropIndicatorPosition,
}: UseFlexDropGapActivationOptions): void {
  // Get the parent FlexDropContainer context for gap activation
  const flexDropContainer = useFlexDropContainer();

  // Track the previous position to avoid redundant context calls
  const previousPositionRef = useRef(dropIndicatorPosition);

  // Communicate before/after positions to the parent FlexDropContainer
  // so it can activate the appropriate gap
  useEffect(() => {
    if (!flexDropContainer) {
      return;
    }

    // Skip if position hasn't changed
    if (previousPositionRef.current === dropIndicatorPosition) {
      return;
    }

    previousPositionRef.current = dropIndicatorPosition;

    if (!isDraggingOver || !dropIndicatorPosition) {
      flexDropContainer.deactivateGap();

      return;
    }

    // Map element drop position to the adjacent gap index
    if (
      dropIndicatorPosition === 'before' ||
      dropIndicatorPosition === 'start'
    ) {
      // Activate the gap before this element
      flexDropContainer.activateGap(index);
    } else if (
      dropIndicatorPosition === 'after' ||
      dropIndicatorPosition === 'end'
    ) {
      // Activate the gap after this element
      flexDropContainer.activateGap(index + 1);
    } else {
      // "inside" position - deactivate any active gap
      flexDropContainer.deactivateGap();
    }
  }, [flexDropContainer, isDraggingOver, dropIndicatorPosition, index]);
}
