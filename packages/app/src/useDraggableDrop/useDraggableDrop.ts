import React from 'react';
import { setDataTransferData } from '@minddrop/utils';
import { getSelectedDrops } from '../getSelectedDrops';
import { useSelectableDrop } from '../useSelectableDrop';
import { useAppStore } from '../useAppStore';

export interface DropDragging {
  /**
   * Indicates whether or not the drop is currently
   * being dragged.
   */
  isBeingDragged: boolean;

  /**
   * Callback fired when dragging starts.
   */
  onDragStart(event: React.DragEvent): void;
}

/**
 * Provides utilities for handling drop dragging behaviour.
 */
export function useDraggableDrop(dropId: string): DropDragging {
  const { draggedData } = useAppStore();
  const { isSelected, select } = useSelectableDrop(dropId);

  return {
    isBeingDragged: draggedData.drops.includes(dropId),
    onDragStart: (event) => {
      // Select the drop
      if (!isSelected) {
        select();
      }

      setDataTransferData(event, { action: 'sort', drops: getSelectedDrops() });
    },
  };
}
