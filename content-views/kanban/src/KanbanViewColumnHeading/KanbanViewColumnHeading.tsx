import React, { useEffect, useRef, useState } from 'react';
import { Events } from '@minddrop/events';
import { TranslationKey } from '@minddrop/i18n';
import { SortableItemRenderProps } from '@minddrop/ui-drag-and-drop';
import {
  Chip,
  ContentColorValues,
  DropdownMenu,
  DropdownMenuColorSelectionItem,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  Group,
  IconButton,
  NamePopover,
  Text,
} from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { NO_VALUE_COLUMN } from '../constants';
import { KanbanColumn } from '../types';
import { resolveLaneStyle } from '../utils';
import './KanbanViewColumnHeading.css';

export interface KanbanViewColumnHeadingProps {
  /**
   * The column the heading names.
   */
  column: KanbanColumn;

  /**
   * The heading's render props within the sortable heading row.
   */
  sortable?: SortableItemRenderProps;

  /**
   * Whether the heading can be dragged to reorder its column. The
   * no-value column is pinned first.
   */
  draggable?: boolean;

  /**
   * Whether the column's option can be managed (renamed,
   * recoloured, hidden, deleted) from the heading's menu.
   */
  canManage?: boolean;

  /**
   * Whether entries can be created in the column via the
   * heading's new entry button.
   */
  canCreateEntry?: boolean;

  /**
   * Whether the heading's actions are shown regardless of hover,
   * used while the pointer is over the column below it.
   */
  actionsVisible?: boolean;

  /**
   * The values of the board's other columns, which the rename
   * popover rejects as duplicates.
   */
  existingValues?: string[];

  /**
   * Whether the rename popover opens on its own, used to name a
   * just added column.
   */
  autoOpenRename?: boolean;

  /**
   * Callback fired once the auto opened rename popover is up.
   */
  onRenameAutoOpened?: () => void;

  /**
   * Callback fired when the user renames the column's option.
   */
  onRename?: (value: string, newValue: string) => void;

  /**
   * Callback fired when the user recolours the column's option.
   */
  onSetColor?: (value: string, color: ContentColor) => void;

  /**
   * Callback fired when the user hides the column from the board.
   */
  onHide?: (value: string) => void;

  /**
   * Callback fired when the user confirms the column's deletion.
   */
  onDelete?: (value: string) => void;

  /**
   * Callback fired when the user creates an entry in the column.
   */
  onCreateEntry?: (value: string) => void;
}

/**
 * Renders a kanban column's heading: the select option it groups
 * entries by, how many of them it holds, and the actions managing
 * the option. Sits in the board's heading row, above the column
 * it names.
 */
export const KanbanViewColumnHeading: React.FC<
  KanbanViewColumnHeadingProps
> = ({
  column,
  sortable,
  draggable,
  canManage,
  canCreateEntry,
  actionsVisible,
  existingValues,
  autoOpenRename,
  onRenameAutoOpened,
  onRename,
  onSetColor,
  onHide,
  onDelete,
  onCreateEntry,
}) => {
  const chipButtonRef = useRef<HTMLButtonElement>(null);

  // Whether the rename was open when the chip's click began
  const renamingOnChipClickRef = useRef(false);

  // Whether the option's rename popover is open
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  // Whether the column is the no-value column, whose option-less
  // heading cannot be renamed, recoloured, or deleted.
  const isNoValueColumn = column.value === NO_VALUE_COLUMN;

  // Whether clicking the chip opens the rename popover
  const canRename = Boolean(canManage && !isNoValueColumn);

  // Open the rename popover on its own for a just added column
  useEffect(() => {
    if (autoOpenRename) {
      setRenamePopoverOpen(true);
      onRenameAutoOpened?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open only when the flag turns on
  }, [autoOpenRename]);

  // Open the rename popover
  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  // Rename the column's option, returning the error to show when
  // the rename is rejected.
  function handleRename(newValue: string): TranslationKey | void {
    // Check whether the name changed
    if (newValue === column.value) {
      return;
    }

    // Check whether another column has the name. If so, it is taken.
    if (existingValues?.includes(newValue)) {
      return 'contentViews.kanban.columns.nameTaken';
    }

    // Hand the rename over
    onRename?.(column.value, newValue);
  }

  // Handle the start of the chip's click, before the popover sees it
  function handleChipPointerDown(event: React.PointerEvent) {
    // Keep the click from starting a column drag, which would
    // capture the pointer and swallow it.
    event.stopPropagation();

    // Record whether the rename was open, as the popover closes
    // itself on a click outside it before the click lands here.
    renamingOnChipClickRef.current = renamePopoverOpen;
  }

  // Open the rename from the chip, unless the click closed it
  function handleChipClick() {
    if (renamingOnChipClickRef.current) {
      return;
    }

    setRenamePopoverOpen(true);
  }

  // Recolour the column's option
  function handleColorSelect(color: ContentColor) {
    onSetColor?.(column.value, color);
  }

  // Hide the column from the board
  function handleHide() {
    onHide?.(column.value);
  }

  // Confirm the column's deletion before removing its option
  function handleDelete() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'contentViews.kanban.columns.deleteConfirmation.title',
      message: 'contentViews.kanban.columns.deleteConfirmation.message',
      confirmLabel: 'contentViews.kanban.columns.deleteConfirmation.confirm',
      danger: true,
      onConfirm: () => onDelete?.(column.value),
    });
  }

  // Create an entry in the column
  function handleCreateEntry() {
    onCreateEntry?.(column.value);
  }

  return (
    <div
      ref={sortable?.ref}
      data-kanban-column={column.value}
      className={`kanban-view-heading${actionsVisible ? ' kanban-view-heading-active' : ''} ${sortable?.className ?? ''}`.trim()}
      style={{ ...resolveLaneStyle(column.color), ...sortable?.style }}
    >
      {/** Option label and entry count, doubling as the drag
       handle reordering the column **/}
      <Group
        gap={2}
        className={`kanban-view-heading-label${draggable ? ' kanban-view-heading-label-draggable' : ''}`}
        {...(draggable ? sortable?.handleProps : {})}
      >
        {canRename ? (
          <button
            ref={chipButtonRef}
            type="button"
            className={`kanban-view-heading-chip-button${renamePopoverOpen ? ' kanban-view-heading-chip-button-renaming' : ''}`}
            onClick={handleChipClick}
            onPointerDown={handleChipPointerDown}
          >
            <Chip color={column.color}>{column.label}</Chip>
          </button>
        ) : (
          <Chip color={column.color}>{column.label}</Chip>
        )}
        <Text size="xs" color="subtle">
          {column.entryIds.length}
        </Text>
      </Group>

      {/** Column actions **/}
      <Group gap={1} className="kanban-view-heading-actions">
        {canCreateEntry && (
          <IconButton
            icon="plus"
            size="sm"
            variant="ghost"
            color="neutral"
            label="contentViews.kanban.columns.newEntry"
            onClick={handleCreateEntry}
          />
        )}

        {canManage && (
          <DropdownMenu
            trigger={
              <IconButton
                icon="ellipsis"
                size="sm"
                variant="ghost"
                color="neutral"
                label="actions.options"
              />
            }
          >
            {isNoValueColumn ? (
              <DropdownMenuItem
                icon="eye-off"
                label="contentViews.kanban.columns.hide"
                onSelect={handleHide}
              />
            ) : (
              <>
                <DropdownMenuItem
                  icon="pencil"
                  label="contentViews.kanban.columns.rename"
                  onSelect={openRenamePopover}
                />

                {/** Option colour picker **/}
                <DropdownSubmenu>
                  <DropdownSubmenuTriggerItem
                    icon="palette"
                    label="contentViews.kanban.columns.color"
                  />
                  <DropdownMenuPortal>
                    <DropdownMenuPositioner
                      side="right"
                      align="start"
                      sideOffset={4}
                    >
                      <DropdownSubmenuContent>
                        {ContentColorValues.map((colorOption) => (
                          <DropdownMenuColorSelectionItem
                            key={colorOption.value}
                            color={colorOption.value}
                            checked={
                              colorOption.value === (column.color ?? 'default')
                            }
                            onClick={() => handleColorSelect(colorOption.value)}
                          />
                        ))}
                      </DropdownSubmenuContent>
                    </DropdownMenuPositioner>
                  </DropdownMenuPortal>
                </DropdownSubmenu>

                <DropdownMenuItem
                  icon="eye-off"
                  label="contentViews.kanban.columns.hide"
                  onSelect={handleHide}
                />

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  danger
                  icon="trash"
                  label="contentViews.kanban.columns.delete"
                  onSelect={handleDelete}
                />
              </>
            )}
          </DropdownMenu>
        )}
      </Group>

      {/** The option's rename popover, kept out of the drag handle
       so that the pointer events its portal bubbles through the
       React tree do not start a column drag **/}
      {canRename && (
        <NamePopover
          open={renamePopoverOpen}
          onOpenChange={setRenamePopoverOpen}
          anchor={chipButtonRef}
          defaultValue={column.value}
          placeholder="contentViews.kanban.columns.namePlaceholder"
          onSubmit={handleRename}
          color={column.color}
          onColorChange={handleColorSelect}
          colorLabel="contentViews.kanban.columns.color"
        />
      )}
    </div>
  );
};
