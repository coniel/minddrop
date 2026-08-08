import React, { RefObject, useMemo } from 'react';
import { Element } from '@minddrop/ast';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuRootProps,
  DropdownMenuTrigger,
  MenuContents,
} from '@minddrop/ui-primitives';
import './BlockActionsMenu.css';
import { BlockMenuItem, getBlockMenuItems } from '../utils';

export interface BlockActionsMenuProps {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Callback fired when the menu is opened or closed, with the
   * event details carrying the reason for the change.
   */
  onOpenChange: NonNullable<DropdownMenuRootProps['onOpenChange']>;

  /**
   * The element the menu is positioned against, being the handle
   * it was opened from.
   */
  anchorRef: RefObject<HTMLElement | null>;

  /**
   * Callback fired when a block type is chosen, with the type and
   * the data the chosen menu item carries.
   */
  onTurnInto: (type: string, data?: Partial<Element>) => void;

  /**
   * Callback fired when the copy action is chosen.
   */
  onCopy: () => void;

  /**
   * Callback fired when the duplicate action is chosen.
   */
  onDuplicate: () => void;

  /**
   * Callback fired when the delete action is chosen.
   */
  onDelete: () => void;
}

/**
 * Renders the menu of actions acting on the selected blocks, opened
 * from the gutter's handle.
 *
 * Opened by the handle rather than by a menu trigger of its own: a
 * trigger opens on pointer down, which is the gesture which starts
 * dragging the handle.
 */
export const BlockActionsMenu: React.FC<BlockActionsMenuProps> = ({
  open,
  onOpenChange,
  anchorRef,
  onTurnInto,
  onCopy,
  onDuplicate,
  onDelete,
}) => {
  const menuContents = useMemo<MenuContents>(
    () => [
      {
        type: 'menu-item',
        label: 'editor.blockActions.turnInto',
        icon: 'replace',
        submenuContentClass: 'editor-block-actions-submenu',
        submenu: getBlockMenuItems().map((item) =>
          toTurnIntoItem(item, onTurnInto),
        ),
      },
      { type: 'menu-separator' },
      {
        type: 'menu-item',
        label: 'editor.blockActions.copy',
        icon: 'copy',
        onSelect: onCopy,
      },
      {
        type: 'menu-item',
        label: 'editor.blockActions.duplicate',
        icon: 'copy-plus',
        onSelect: onDuplicate,
      },
      {
        type: 'menu-item',
        label: 'editor.blockActions.delete',
        icon: 'trash-2',
        onSelect: onDelete,
      },
    ],
    [onTurnInto, onCopy, onDuplicate, onDelete],
  );

  return (
    <DropdownMenuRoot open={open} onOpenChange={onOpenChange}>
      {/* The menu is opened by the handle rather than by a trigger,
          a trigger opening on pointer down and so on the gesture
          which drags the handle. One is rendered all the same, and
          left unreachable: without it the menu is not a node of the
          menu tree, leaving nested submenus with nothing to
          position themselves against. */}
      <DropdownMenuTrigger
        aria-hidden
        tabIndex={-1}
        nativeButton={false}
        render={<span className="editor-block-actions-trigger" />}
      />

      <DropdownMenuPortal>
        <DropdownMenuPositioner
          anchor={anchorRef}
          side="bottom"
          align="start"
          sideOffset={4}
          onClick={stopPropagation}
          onMouseDown={stopPropagation}
        >
          {/* Closing must not return focus to the hidden trigger,
              where it would be lost. The editor takes it back
              itself when appropriate. */}
          <DropdownMenuContent content={menuContents} finalFocus={false} />
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};

/**
 * Keeps the menu's events from reaching the handlers of whatever
 * the editor is rendered in. Portalled events still travel up the
 * React tree, so the menu's clicks reach the editor's ancestors
 * despite living in the body.
 *
 * @param event The event.
 */
function stopPropagation(event: React.SyntheticEvent): void {
  event.stopPropagation();
}

/**
 * Turns a block type's menu entry into a menu item which converts
 * the selected blocks to that type.
 *
 * @param item The block type's menu entry.
 * @param onTurnInto Callback fired when the item is chosen.
 * @returns The menu item.
 */
function toTurnIntoItem(
  item: BlockMenuItem,
  onTurnInto: (type: string, data?: Partial<Element>) => void,
) {
  return {
    type: 'menu-item' as const,
    label: item.label,
    icon: item.icon,
    onSelect: () => onTurnInto(item.type, item.data),
  };
}
