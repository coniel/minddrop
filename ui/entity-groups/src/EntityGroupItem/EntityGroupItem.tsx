import React, { useCallback, useMemo } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator } from '@minddrop/ui-drag-and-drop';
import { propsToClass } from '@minddrop/ui-primitives';
import { entityIdType } from '@minddrop/utils';
import { useEntityGroupList } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { EntityGroupSourceDataKey } from '../constants';
import { useDraggedEntityGroupItems } from '../useDraggedEntityGroupItems';
import { resolveEntityGroupDragSource, resolveEntityGroupDrop } from '../utils';
import './EntityGroupItem.css';

export interface EntityGroupItemProps {
  /**
   * The ID of the entity the item points to.
   */
  itemId: string;

  /**
   * The ID of the group listing the item.
   */
  groupId: string;

  /**
   * The item's position among the group's items.
   */
  index: number;

  /**
   * Whether the item is the last one listed in the group.
   *
   * @default false
   */
  isLastChild?: boolean;

  /**
   * The item's content, rendered by the consumer.
   */
  children: React.ReactNode;
}

/**
 * Renders one of a group's items, adding the drag and drop the
 * group list rearranges its items with. The consumer's content is
 * rendered as-is inside it.
 */
export const EntityGroupItem: React.FC<EntityGroupItemProps> = ({
  itemId,
  groupId,
  index,
  isLastChild = false,
  children,
}) => {
  const { config, type } = useEntityGroupList();

  // A dragged entity is a selection item whose ID is the entity's,
  // typed by the entity type its ID carries.
  const selectionItem = useMemo(
    () => ({
      id: itemId,
      type: entityIdType(itemId) ?? '',
      data: { id: itemId },
    }),
    [itemId],
  );

  const group = EntityGroups.use(type, groupId);
  const draggedItems = useDraggedEntityGroupItems(config);
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem);

  // The app's own groups hold what the app puts in them, so they
  // take no drops.
  const isProtected = EntityGroups.isProtected(groupId, config);

  // An item takes drops of what the group type can hold, landing
  // them above or below itself.
  const acceptsDrop = !isProtected && draggedItems.length > 0;

  // Route the drop to the model call it stands for
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      applyEntityGroupDrop(
        type,
        resolveEntityGroupDrop({
          position: drop.position,
          targetIndex: index,
          targetGroupId: groupId,
          targetItems: group?.items ?? [],
          sourceGroupId: resolveEntityGroupDragSource(drop.event),
          itemIds: draggedItems,
        }),
      );
    },
    [type, index, groupId, group, draggedItems],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    Selection.useDroppable({
      type: EntityGroups.constants.EntityType,
      id: itemId,
      index,
      axis: 'vertical',
      isLastChild,
      onDrop: handleDrop,
    });

  // Send the group the item is dragged out of along with the drag,
  // which is what tells a drop whether it moves the item or adds it.
  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      draggableProps.onDragStart(event);

      event.dataTransfer.setData(
        Selection.toMimeType(EntityGroupSourceDataKey),
        JSON.stringify(groupId),
      );
    },
    [groupId, draggableProps],
  );

  return (
    <div
      className={propsToClass('entity-group-item', { dragging: isDragging })}
      {...(acceptsDrop ? droppableProps : {})}
      {...draggableProps}
      onDragStart={handleDragStart}
    >
      {children}
      <DropIndicator
        axis="horizontal"
        show={acceptsDrop && isDraggingOver}
        position={dropIndicatorPosition}
      />
    </div>
  );
};
