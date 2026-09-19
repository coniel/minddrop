import React, { useCallback, useMemo } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator } from '@minddrop/ui-drag-and-drop';
import { propsToClass } from '@minddrop/ui-primitives';
import { composeRefs, entityIdType } from '@minddrop/utils';
import { EntityGroupItemProvider } from '../EntityGroupItemContext';
import { useEntityGroupList } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { useDraggedEntityGroupItemIds } from '../useDraggedEntityGroupItemIds';
import {
  resolveEntityGroupDragSourceId,
  resolveEntityGroupDrop,
} from '../utils';
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

  // The group the item is listed in, which an action on the
  // consumer's content acts within.
  const item = useMemo(() => ({ groupId, itemId }), [groupId, itemId]);

  // The selection item the entity is dragged as, typed by the entity
  // type its ID names.
  const selectionItem = useMemo(
    () => ({
      id: itemId,
      type: entityIdType(itemId) ?? '',
      data: { id: itemId },
    }),
    [itemId],
  );

  // Where a drag of the item starts from. A drop reads it to tell a
  // reorder within the group from a move into another.
  const origin = useMemo(() => ({ type, id: groupId }), [type, groupId]);

  // Check if the group is one of the app's own. An item dragged out
  // of one is copied rather than moved, so the group keeps listing it.
  const isProtected = EntityGroups.isProtected(groupId, config);

  // Subscribe to the group
  const group = EntityGroups.use(type, groupId);
  // The dragged items the group type accepts
  const draggedItemIds = useDraggedEntityGroupItemIds(config);
  // Drag the item, as a copy out of one of the app's groups
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem, {
    origin,
    effect: isProtected ? 'copy' : 'move',
  });

  // Whether the group takes drops. The app's own groups list what the
  // app puts in them, and the ungrouped group lists in no order, so
  // neither does.
  const isPlaced =
    groupId !== EntityGroups.constants.UngroupedId && !isProtected;

  // Whether the item takes the drag in progress. A drop lands above
  // or below the item.
  const acceptsDrop = isPlaced && draggedItemIds.length > 0;

  // Apply the drop to the groups
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      applyEntityGroupDrop(
        type,
        resolveEntityGroupDrop({
          position: drop.position,
          targetIndex: index,
          targetGroupId: groupId,
          targetItems: group?.items ?? [],
          sourceGroupId: resolveEntityGroupDragSourceId(drop.origin, type),
          itemIds: draggedItemIds,
        }),
      );
    },
    [type, index, groupId, group, draggedItemIds],
  );

  // Take drops on the item
  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    Selection.useDroppable({
      type: EntityGroups.constants.EntityType,
      id: itemId,
      index,
      axis: 'vertical',
      isLastChild,
      // Let the group react to drags over its items as well
      claim: false,
      onDrop: handleDrop,
    });

  // Compose the drag and drop refs, as both register on the item
  const ref = useMemo(
    () =>
      composeRefs(draggableProps.ref, acceptsDrop ? droppableProps.ref : null),
    [draggableProps.ref, droppableProps.ref, acceptsDrop],
  );

  return (
    <div
      className={propsToClass('entity-group-item', {
        // Collapse the item while dragged, unless a copy of it is
        // dragged and it stays where it is.
        dragging: isDragging && !isProtected,
      })}
      {...(acceptsDrop ? droppableProps : {})}
      {...draggableProps}
      ref={ref}
    >
      {/* Wrapped so that the row can be clipped as it collapses */}
      <div className="entity-group-item-content">
        <EntityGroupItemProvider value={item}>
          {children}
        </EntityGroupItemProvider>
      </div>
      <DropIndicator
        axis="horizontal"
        show={acceptsDrop && isDraggingOver}
        position={dropIndicatorPosition}
      />
    </div>
  );
};
