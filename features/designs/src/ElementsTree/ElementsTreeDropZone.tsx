import { useCallback } from 'react';
import { DropEventData, useDroppable } from '@minddrop/selection';
import { Text } from '@minddrop/ui-primitives';
import { useDesignStudio } from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { handleDropOnGap } from '../handleDropOnGap';

export interface ElementsTreeDropZoneProps {
  /**
   * The ID of the empty element the zone drops elements into.
   */
  parentId: string;
}

/**
 * Renders the empty state of a tree node which can hold children:
 * a drop target for the element's first child, pointing out that
 * elements can also be dropped onto the canvas.
 */
export const ElementsTreeDropZone: React.FC<ElementsTreeDropZoneProps> = ({
  parentId,
}) => {
  const studio = useDesignStudio();
  const layoutId = useLayoutId();

  // The parent holds no children, so drops always land at its start
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      handleDropOnGap(studio, drop, parentId, 0, layoutId ?? undefined);
    },
    [studio, parentId, layoutId],
  );

  const { droppableProps, isDraggingOver } = useDroppable({
    type: 'design-element',
    id: parentId,
    axis: 'container',
    onDrop: handleDrop,
  });

  return (
    <div
      className="designs-elements-tree-drop-zone"
      data-dragging-over={isDraggingOver}
      {...droppableProps}
    >
      <Text
        block
        size="xs"
        color="subtle"
        text="designsStudio.tree.dropHint"
        className="designs-elements-tree-drop-zone-text"
      />
    </div>
  );
};
