import React, { useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
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
  MenuGroupProps,
  MenuLabel,
  MenuOpenChangeDetails,
  MenuTargetContext,
  Text,
  resolveElementAnchor,
  resolveEventAnchor,
  useActionsVisibleHold,
} from '@minddrop/ui-primitives';
import './SidebarGroup.css';

export interface SidebarGroupPopoverContext {
  /**
   * The anchor the group's follow-up popovers position themselves
   * against, matching the menu which opened them: the right click
   * position for the context menu, the options button for the
   * dropdown.
   */
  anchor: Anchor;
}

export interface SidebarGroupAddPopoverContext {
  /**
   * The position of the add button, frozen at the point it was
   * clicked.
   */
  anchor: Anchor;

  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;
}

export interface SidebarGroupProps extends Pick<MenuGroupProps, 'marginTop'> {
  /**
   * i18n key for the group's label.
   */
  label?: TranslationKey;

  /**
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Actions displayed alongside the label, revealed when the
   * group is hovered. Rendered before the generated add and
   * options buttons.
   */
  actions?: React.ReactNode;

  /**
   * The group's menu, opened both from a label options button
   * and as the group's context menu.
   */
  menu?: MenuContents;

  /**
   * Accessible label of the options button opening `menu`.
   * @default 'actions.options'
   */
  menuLabel?: TranslationKey;

  /**
   * Popovers opened by the group's menu actions, anchored via the
   * given context.
   */
  popovers?: (context: SidebarGroupPopoverContext) => React.ReactNode;

  /**
   * Called when the group's add button is clicked, e.g. to open a
   * creation dialog. The button is only rendered when this or
   * `addPopover` is provided.
   */
  onAddClick?: () => void;

  /**
   * The popover opened by the group's add button, anchored via the
   * given context. The button is only rendered when this or
   * `onAddClick` is provided.
   */
  addPopover?: (context: SidebarGroupAddPopoverContext) => React.ReactNode;

  /**
   * Label and tooltip of the add button.
   * @default 'actions.new'
   */
  addLabel?: TranslationKey;

  /**
   * Whether the group is initially expanded.
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * Whether hovering anywhere in the group reveals the label
   * actions. When `false`, only hovering the label reveals them.
   * @default true
   */
  showLabelActionsOnHover?: boolean;

  /**
   * The group's menu items.
   */
  children?: React.ReactNode;

  /**
   * Empty state shown in place of the items when the group has
   * none.
   */
  emptyLabel?: TranslationKey;
}

/**
 * Renders a collapsible labelled group of menu items in the app sidebar.
 *
 * The group can carry a menu, rendered both behind a label options
 * button and as the group's context menu, and an add button
 * opening a popover or firing a callback.
 */
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  actions,
  addLabel = 'actions.new',
  addPopover,
  children,
  defaultOpen = true,
  emptyLabel,
  label,
  marginTop,
  menu,
  menuLabel = 'actions.options',
  onAddClick,
  popovers,
  showLabelActionsOnHover = true,
  stringLabel,
}) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const menuHoldRef = useRef<VoidFunction | null>(null);
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);
  const [addAnchor, setAddAnchor] = useState<Anchor | null>(null);
  const { actionsVisible, menuTarget } = useActionsVisibleHold();
  const [menuAnchor, setMenuAnchor] = useState<Anchor | null>(null);

  // Popovers open where the menu that led to them did: at the
  // right click position for the context menu, at the options
  // button for the dropdown
  const popoverAnchor = menuAnchor ?? optionsButtonRef;

  // Record where the context menu was opened, so the popovers it
  // leads to open at the same point
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
  // soon as the group loses hover
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

  // Open the add popover and/or fire the add callback
  function handleAddClick() {
    if (addPopover) {
      // Frozen in place because the button hides again as soon as
      // the group loses hover
      setAddAnchor(resolveElementAnchor(addButtonRef.current));
      setAddPopoverOpen(true);
    }

    onAddClick?.();
  }

  const group = (
    <MenuGroup
      marginTop={marginTop}
      showLabelActionsOnHover={showLabelActionsOnHover}
    >
      <Collapsible className="sidebar-group" defaultOpen={defaultOpen}>
        {/* Label acting as the expand/collapse trigger */}
        <CollapsibleTrigger
          nativeButton={false}
          render={
            <MenuLabel
              button
              active={actionsVisible}
              label={label}
              stringLabel={stringLabel}
              actions={
                <>
                  {actions}

                  {/* Adds an item to the group */}
                  {(onAddClick || addPopover) && (
                    <IconButton
                      ref={addButtonRef}
                      icon="plus"
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      label={addLabel}
                      tooltip={{ title: addLabel }}
                      onClick={handleAddClick}
                    />
                  )}

                  {/* Opens the group's menu */}
                  {menu && (
                    <DropdownMenuRoot onOpenChange={handleDropdownOpenChange}>
                      <DropdownMenuTrigger>
                        <IconButton
                          ref={optionsButtonRef}
                          icon="ellipsis"
                          size="sm"
                          variant="ghost"
                          color="neutral"
                          label={menuLabel}
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
          <MenuGroup>
            {React.Children.count(children) > 0
              ? children
              : emptyLabel && (
                  /* Empty state shown when the group has no items */
                  <Text
                    block
                    size="sm"
                    color="muted"
                    className="sidebar-group-empty"
                    text={emptyLabel}
                  />
                )}
          </MenuGroup>
        </CollapsibleContent>
      </Collapsible>
    </MenuGroup>
  );

  return (
    <MenuTargetContext.Provider value={menuTarget}>
      {menu ? (
        /* The menu doubles as the group's context menu */
        <ContextMenuRoot onOpenChange={handleContextMenuOpenChange}>
          <ContextMenuTrigger render={group} />
          <ContextMenuPortal>
            <ContextMenuPositioner>
              <ContextMenuContent content={menu} />
            </ContextMenuPositioner>
          </ContextMenuPortal>
        </ContextMenuRoot>
      ) : (
        group
      )}

      {/* Popovers opened by the menu's actions */}
      {popovers?.({ anchor: popoverAnchor })}

      {/* The add button's popover */}
      {addPopover?.({
        anchor: addAnchor ?? addButtonRef,
        open: addPopoverOpen,
        onOpenChange: setAddPopoverOpen,
      })}
    </MenuTargetContext.Provider>
  );
};
