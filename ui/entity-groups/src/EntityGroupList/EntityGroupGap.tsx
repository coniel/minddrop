import React, { useCallback } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator } from '@minddrop/ui-drag-and-drop';
import { useEntityGroupList } from '../EntityGroupListContext';
import { useDraggedEntityGroup } from '../useDraggedEntityGroup';
import { useDraggedEntityGroupItems } from '../useDraggedEntityGroupItems';
import { resolveEntityGroupDragSource } from '../utils';
import './EntityGroupGap.css';

export interface EntityGroupGapProps {
  /**
   * The position in the list the gap sits above.
   */
  index: number;

  /**
   * Called with the dragged group when a group is dropped in the
   * gap, moving it to the gap's position.
   */
  onDropGroup: (groupId: string, index: number) => void;

  /**
   * Called with the dragged items and the group they were dragged
   * out of when items are dropped in the gap, standing up a group at
   * the gap's position.
   */
  onDropItems: (
    itemIds: string[],
    index: number,
    sourceGroupId: string | null,
  ) => void;
}

/**
 * Renders the space between two groups, above the first or below
 * the last. Dropping a group there moves it to that position, and
 * dropping items there stands up a group holding them.
 */
export const EntityGroupGap: React.FC<EntityGroupGapProps> = ({
  index,
  onDropGroup,
  onDropItems,
}) => {
  const { config, type } = useEntityGroupList();
  const draggedGroup = useDraggedEntityGroup(type);
  const draggedItems = useDraggedEntityGroupItems(config);

  // The gap takes both the type's groups and the entities its
  // groups can hold, each landing differently.
  const acceptsDrop = Boolean(draggedGroup) || draggedItems.length > 0;

  const handleDrop = useCallback(
    (drop: DropEventData) => {
      if (draggedGroup) {
        onDropGroup(draggedGroup, index);

        return;
      }

      onDropItems(
        draggedItems,
        index,
        resolveEntityGroupDragSource(drop.event),
      );
    },
    [draggedGroup, draggedItems, index, onDropGroup, onDropItems],
  );

  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: EntityGroups.constants.EntityType,
    id: `${type}:${index}`,
    onDrop: handleDrop,
  });

  return (
    <div className="entity-group-gap" {...(acceptsDrop ? droppableProps : {})}>
      <DropIndicator
        axis="horizontal"
        position="inside"
        show={acceptsDrop && isDraggingOver}
      />
    </div>
  );
};
