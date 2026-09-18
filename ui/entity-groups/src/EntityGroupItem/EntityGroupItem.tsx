import React, { useCallback, useMemo } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator, useHoveredItem } from '@minddrop/ui-drag-and-drop';
import { propsToClass } from '@minddrop/ui-primitives';
import { entityIdType } from '@minddrop/utils';
import { EntityGroupItemProvider } from '../EntityGroupItemContext';
import { useEntityGroupList } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { EntityGroupSourceDataKey } from '../constants';
import { EntityGroupDragSource } from '../types';
import { useDraggedEntityGroupItemIds } from '../useDraggedEntityGroupItemIds';
import {
  resolveEntityGroupDragSource,
  resolveEntityGroupDrop,
  resolveEntityGroupDropTypes,
  resolveEntityGroupSourceTypeKey,
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
  const draggedItemIds = useDraggedEntityGroupItemIds(config);
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem);

  // Hover is tracked here rather than left to `:hover`, which a
  // native drag freezes and the browser does not retire. The list
  // reorders around the drop, and the frozen state surfaces on
  // whichever item the released DOM node is reused for.
  const { hoveredProps } = useHoveredItem(`${groupId}:${itemId}`);

  // The app's groups hold what the app puts in them, and the
  // 'ungrouped' group lists in no order, so neither takes drops.
  const isPlaced =
    groupId !== EntityGroups.constants.UngroupedId &&
    !EntityGroups.isProtected(groupId, config);

  // An item takes drops of what the group type can hold, landing
  // them above or below itself.
  const acceptsDrop = isPlaced && draggedItemIds.length > 0;

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
          sourceGroupId: resolveEntityGroupDragSource(drop.event, type),
          itemIds: draggedItemIds,
        }),
      );
    },
    [type, index, groupId, group, draggedItemIds],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    Selection.useDroppable({
      type: EntityGroups.constants.EntityType,
      id: itemId,
      index,
      axis: 'vertical',
      isLastChild,
      // The group takes over what is dragged over its items as well
      claim: false,
      accepts: resolveEntityGroupDropTypes(config),
      onDrop: handleDrop,
    });

  // Send the group the item is dragged out of along with the drag,
  // and mark the drag with the group's type. The group tells a drop
  // whether it reorders the group or moves the item into another;
  // the mark tells a drop target, before it can read the group,
  // whether the drag is one of its own type's.
  //
  // Marked in the capture phase, since a consumer whose content is
  // draggable in its own right starts the drag there and stops it
  // from reaching this element.
  const handleDragStartCapture = useCallback(
    (event: React.DragEvent) => {
      const source: EntityGroupDragSource = { type, groupId };

      event.dataTransfer.setData(
        Selection.toMimeType(EntityGroupSourceDataKey),
        JSON.stringify(source),
      );
      event.dataTransfer.setData(
        Selection.toMimeType(resolveEntityGroupSourceTypeKey(type)),
        JSON.stringify(true),
      );
    },
    [type, groupId],
  );

  return (
    <div
      className={propsToClass('entity-group-item', { dragging: isDragging })}
      {...hoveredProps}
      {...(acceptsDrop ? droppableProps : {})}
      {...draggableProps}
      onDragStartCapture={handleDragStartCapture}
    >
      <EntityGroupItemProvider value={item}>{children}</EntityGroupItemProvider>
      <DropIndicator
        axis="horizontal"
        show={acceptsDrop && isDraggingOver}
        position={dropIndicatorPosition}
      />
    </div>
  );
};
