import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  EntityGroup as EntityGroupType,
  EntityGroups,
} from '@minddrop/entity-groups';
import { DropEventData, Selection } from '@minddrop/selection';
import {
  Anchor,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  IconButton,
  MenuContents,
  MenuGroup,
  MenuLabel,
  MenuOpenChangeDetails,
  MenuTargetContext,
  NamePopover,
  Text,
  resolveElementAnchor,
  resolveEventAnchor,
  useActionsVisibleHold,
} from '@minddrop/ui-primitives';
import { EntityGroupItem } from '../EntityGroupItem';
import { useEntityGroupList } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { useDraggedEntityGroupItemIds } from '../useDraggedEntityGroupItemIds';
import {
  resolveEntityGroupDragSource,
  resolveEntityGroupDrop,
  resolveEntityGroupDropTypes,
  resolveEntityGroupNameError,
  resolveUngroupedEntityGroupDrop,
} from '../utils';
import './EntityGroup.css';

export interface EntityGroupProps {
  /**
   * The group to render.
   */
  group: EntityGroupType;

  /**
   * Props making the group's label the handle it is dragged by,
   * which is what reorders the list.
   */
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

/**
 * Renders a group: a collapsible labelled list of its items, with
 * the actions on the group in its label row and in its context
 * menu, and the drop target which adds an item to the end of it.
 *
 * The app's own groups are named and filled by the app rather than
 * the user, so they offer neither a drop target nor the actions
 * which would edit them. The ungrouped group is the exception.
 * Dropping items on it takes them out of their groups.
 */
export const EntityGroup: React.FC<EntityGroupProps> = ({
  group,
  dragHandleProps,
}) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const menuHoldRef = useRef<VoidFunction | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);
  const [addAnchor, setAddAnchor] = useState<Anchor | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<Anchor | null>(null);
  const {
    config,
    protectedGroupComponents,
    renderItem,
    resolveAddAction,
    resolveLabel,
    type,
  } = useEntityGroupList();

  const draggedItemIds = useDraggedEntityGroupItemIds(config);
  const collapsed = EntityGroups.useCollapsed(type, group.id);
  const { actionsVisible, menuTarget } = useActionsVisibleHold();

  // Whether this is the 'ungrouped' group
  const isUngrouped = group.id === EntityGroups.constants.UngroupedId;

  // Whether the group is the user's to edit
  const isEditable =
    !isUngrouped && !EntityGroups.isProtected(group.id, config);

  // Whether the group takes the dragged items
  const acceptsDrop = (isEditable || isUngrouped) && draggedItemIds.length > 0;

  // The component rendering the group's contents in place of the
  // items it lists, for groups whose contents are not stored items.
  const ProtectedGroup = protectedGroupComponents?.[group.id];

  // The add control shown in the group's label row, which the
  // consumer decides on group by group.
  const addAction = resolveAddAction?.(group) ?? null;

  // A group the app names is shown under the consumer's label,
  // translated, rather than under the name it is stored with.
  const label =
    resolveLabel?.(group) ??
    (isUngrouped ? 'entityGroups.labels.ungrouped' : undefined);

  // Popovers open where the menu that led to them did: at the
  // right click position for the context menu, at the options
  // button for the dropdown.
  const popoverAnchor = menuAnchor ?? optionsButtonRef;

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

  // Hold the label's actions visible while the add popover is open,
  // as the group's menu does. Without it the button the popover is
  // anchored to fades out from under it as soon as the pointer
  // leaves the group.
  useEffect(() => {
    if (!addPopoverOpen) {
      return;
    }

    return menuTarget.holdActionsVisible();
  }, [addPopoverOpen, menuTarget]);

  // Route the drop to the model calls it stands for
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      if (isUngrouped) {
        applyEntityGroupDrop(
          type,
          resolveUngroupedEntityGroupDrop(
            EntityGroups.getAll(type),
            draggedItemIds,
          ),
        );

        return;
      }

      applyEntityGroupDrop(
        type,
        resolveEntityGroupDrop({
          position: drop.position,
          targetGroupId: group.id,
          targetItems: group.items,
          sourceGroupId: resolveEntityGroupDragSource(drop.event, type),
          itemIds: draggedItemIds,
        }),
      );
    },
    [type, isUngrouped, group.id, group.items, draggedItemIds],
  );

  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: EntityGroups.constants.EntityType,
    id: group.id,
    // The list's gaps take over what is dragged over the group
    claim: false,
    accepts: resolveEntityGroupDropTypes(config),
    onDrop: handleDrop,
  });

  // Rename the group, or show an error if the name is invalid
  async function handleRename(name: string) {
    try {
      await EntityGroups.update(type, group.id, { name });
    } catch (error) {
      return resolveEntityGroupNameError(error);
    }
  }

  // Remember how the user left the group, for this workspace on
  // this device.
  function handleOpenChange(open: boolean) {
    EntityGroups.setCollapsed(type, group.id, !open);
  }

  // Record where the context menu was opened, so the popovers it
  // leads to open at the same point.
  function handleContextMenuOpenChange(
    open: boolean,
    eventDetails: MenuOpenChangeDetails,
  ) {
    if (open) {
      setMenuAnchor(resolveEventAnchor(eventDetails.event));
    }

    holdWhileMenuOpen(open);
  }

  // Anchor the dropdown's popovers at the options button it was
  // opened from, frozen in place because the button hides again as
  // soon as the group loses hover.
  function handleDropdownOpenChange(open: boolean) {
    if (open) {
      setMenuAnchor(resolveElementAnchor(optionsButtonRef.current));
    }

    holdWhileMenuOpen(open);
  }

  // Highlight the label the menu belongs to while it is open
  function holdWhileMenuOpen(open: boolean) {
    if (open) {
      menuHoldRef.current = menuTarget.holdActionsVisible();

      return;
    }

    menuHoldRef.current?.();
    menuHoldRef.current = null;
  }

  // Only a press on the label itself starts a drag. Its actions own
  // their own presses, and the menus and popovers they open render
  // in portals, whose events pass through here on their way up the
  // React tree. Dragging on either would capture the pointer on the
  // label and turn their clicks into a collapse toggle.
  function handleLabelPointerDown(event: React.PointerEvent<HTMLElement>) {
    const target = event.target as HTMLElement;

    if (!event.currentTarget.contains(target)) {
      return;
    }

    if (target.closest('.menu-label-actions')) {
      return;
    }

    dragHandleProps?.onPointerDown?.(event);
  }

  // Open the add popover and/or fire the add callback
  function handleAddClick() {
    if (addAction?.popover) {
      // Frozen in place because the button hides again as soon as
      // the group loses hover.
      setAddAnchor(resolveElementAnchor(addButtonRef.current));
      setAddPopoverOpen(true);
    }

    addAction?.onClick?.();
  }

  // Render the group's contents: what the app puts in one of its
  // own groups, otherwise the items the group lists, or the empty
  // state when it lists none.
  function renderContents() {
    if (ProtectedGroup) {
      return <ProtectedGroup group={group} />;
    }

    if (!group.items.length) {
      return (
        <Text
          block
          size="sm"
          color="muted"
          className="entity-group-empty"
          text="entityGroups.labels.empty"
        />
      );
    }

    return group.items.map((itemId, index) => (
      <EntityGroupItem
        key={itemId}
        itemId={itemId}
        groupId={group.id}
        index={index}
        isLastChild={index === group.items.length - 1}
      >
        {renderItem(itemId)}
      </EntityGroupItem>
    ));
  }

  const groupElement = (
    // Protected groups show their actions on hover anywhere in the
    // group.
    <MenuGroup showLabelActionsOnHover={!isEditable}>
      <Collapsible open={!collapsed} onOpenChange={handleOpenChange}>
        {/* Label acting as the expand/collapse trigger */}
        <CollapsibleTrigger
          nativeButton={false}
          render={
            <MenuLabel
              button
              active={actionsVisible}
              highlighted={acceptsDrop && isDraggingOver}
              label={label}
              stringLabel={label ? undefined : group.name}
              {...dragHandleProps}
              onPointerDown={handleLabelPointerDown}
              actions={
                <>
                  {/* Adds an item to the group */}
                  {addAction && (
                    <IconButton
                      ref={addButtonRef}
                      icon="plus"
                      size="xs"
                      variant="ghost"
                      color="muted"
                      label={addAction.label ?? 'actions.new'}
                      tooltip={{ title: addAction.label ?? 'actions.new' }}
                      onClick={handleAddClick}
                    />
                  )}

                  {/* Opens the group's menu */}
                  {isEditable && (
                    <DropdownMenuRoot onOpenChange={handleDropdownOpenChange}>
                      <DropdownMenuTrigger>
                        <IconButton
                          ref={optionsButtonRef}
                          icon="ellipsis"
                          size="xs"
                          variant="ghost"
                          color="muted"
                          label="actions.options"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuPositioner side="bottom" align="start">
                          <DropdownMenuContent content={menu} />
                        </DropdownMenuPositioner>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  )}
                </>
              }
            />
          }
        />
        <CollapsibleContent>
          <MenuGroup>{renderContents()}</MenuGroup>
        </CollapsibleContent>
      </Collapsible>
    </MenuGroup>
  );

  return (
    <MenuTargetContext.Provider value={menuTarget}>
      <div className="entity-group" {...(acceptsDrop ? droppableProps : {})}>
        {!isEditable ? (
          groupElement
        ) : (
          /* The menu doubles as the group's context menu */
          <ContextMenuRoot onOpenChange={handleContextMenuOpenChange}>
            <ContextMenuTrigger render={groupElement} />
            <ContextMenuPortal>
              <ContextMenuPositioner>
                <ContextMenuContent content={menu} />
              </ContextMenuPositioner>
            </ContextMenuPortal>
          </ContextMenuRoot>
        )}

        {/* The rename popover, anchored where the menu which opened
            it was */}
        {isEditable && (
          <NamePopover
            open={renaming}
            anchor={popoverAnchor}
            defaultValue={group.name}
            placeholder="entityGroups.name.placeholder"
            onOpenChange={setRenaming}
            onSubmit={handleRename}
          />
        )}

        {/* The add button's popover */}
        {addAction?.popover?.({
          anchor: addAnchor ?? addButtonRef,
          open: addPopoverOpen,
          onOpenChange: setAddPopoverOpen,
        })}
      </div>
    </MenuTargetContext.Provider>
  );
};
