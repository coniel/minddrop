import React, { useCallback, useMemo, useState } from 'react';
import {
  EntityGroup as EntityGroupType,
  EntityGroups,
} from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import {
  SidebarGroup,
  SidebarGroupPopoverContext,
} from '@minddrop/ui-components';
import {
  MenuContents,
  NamePopover,
  propsToClass,
} from '@minddrop/ui-primitives';
import { EntityGroupItem } from '../EntityGroupItem';
import { useEntityGroupList } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { EntityGroupsDataKey } from '../constants';
import { useDraggedEntityGroupItems } from '../useDraggedEntityGroupItems';
import { resolveEntityGroupDragSource, resolveEntityGroupDrop } from '../utils';
import './EntityGroup.css';

export interface EntityGroupProps {
  /**
   * The group to render.
   */
  group: EntityGroupType;
}

/**
 * Renders a group: its chrome, the items it lists, and the drop
 * target which adds an item to the end of it.
 *
 * The app's own groups are named and filled by the app rather than
 * the user, so they offer neither a drop target nor the actions
 * which would edit them.
 */
export const EntityGroup: React.FC<EntityGroupProps> = ({ group }) => {
  const [renaming, setRenaming] = useState(false);
  const { config, emptyLabel, protectedGroupComponents, renderItem, type } =
    useEntityGroupList();

  const selectionItem = useMemo(
    () => ({ id: group.id, type: EntityGroupsDataKey, data: group }),
    [group],
  );

  const draggedItems = useDraggedEntityGroupItems(config);
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem);

  // The app's own groups hold what the app puts in them, so they
  // take no drops and offer no actions of their own.
  const isProtected = EntityGroups.isProtected(group.id, config);

  // The group itself takes drops of what the type can hold, adding
  // them after the items it already lists.
  const acceptsDrop = !isProtected && draggedItems.length > 0;

  // The component rendering the group's contents in place of the
  // items it lists, for groups whose contents are not stored items.
  const ProtectedGroup = protectedGroupComponents?.[group.id];

  const menu = useMemo(
    (): MenuContents => [
      {
        type: 'menu-item',
        icon: 'pencil',
        label: 'entityGroups.actions.rename',
        onSelect: () => setRenaming(true),
      },
      {
        type: 'menu-item',
        danger: true,
        icon: 'trash-2',
        label: 'entityGroups.actions.delete',
        onSelect: () => EntityGroups.delete(type, group.id),
      },
    ],
    [type, group.id],
  );

  // Route the drop to the model call it stands for
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      applyEntityGroupDrop(
        type,
        resolveEntityGroupDrop({
          position: drop.position,
          targetGroupId: group.id,
          targetItems: group.items,
          sourceGroupId: resolveEntityGroupDragSource(drop.event),
          itemIds: draggedItems,
        }),
      );
    },
    [type, group.id, group.items, draggedItems],
  );

  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: EntityGroups.constants.EntityType,
    id: group.id,
    onDrop: handleDrop,
  });

  function handleRename(name: string) {
    EntityGroups.update(type, group.id, { name });
  }

  // Anchor the rename popover where the menu which opened it was
  function renderPopovers({ anchor }: SidebarGroupPopoverContext) {
    return (
      <NamePopover
        open={renaming}
        anchor={anchor}
        defaultValue={group.name}
        placeholder="entityGroups.name.placeholder"
        onOpenChange={setRenaming}
        onSubmit={handleRename}
      />
    );
  }

  return (
    <div
      className={propsToClass('entity-group', {
        dragging: isDragging,
        draggingOver: acceptsDrop && isDraggingOver,
      })}
      {...(acceptsDrop ? droppableProps : {})}
      {...draggableProps}
    >
      <SidebarGroup
        stringLabel={group.name}
        emptyLabel={emptyLabel}
        menu={isProtected ? undefined : menu}
        popovers={isProtected ? undefined : renderPopovers}
      >
        {ProtectedGroup ? (
          <ProtectedGroup group={group} />
        ) : (
          group.items.map((itemId, index) => (
            <EntityGroupItem
              key={itemId}
              itemId={itemId}
              groupId={group.id}
              index={index}
              isLastChild={index === group.items.length - 1}
            >
              {renderItem(itemId)}
            </EntityGroupItem>
          ))
        )}
      </SidebarGroup>
    </div>
  );
};
