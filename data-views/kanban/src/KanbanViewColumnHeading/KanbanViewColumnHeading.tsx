import React, { useEffect, useState } from 'react';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { SortableItemRenderProps } from '@minddrop/ui-drag-and-drop';
import {
  Chip,
  ColorSwatch,
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
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
  Stack,
  Text,
  TextInput,
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
  // Whether the option's rename popover is open
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  // The rename popover's name field value
  const [renameValue, setRenameValue] = useState('');

  // Whether the entered name already names another column
  const [nameTaken, setNameTaken] = useState(false);

  // Whether the column is the no-value column, whose option-less
  // heading cannot be renamed, recoloured, or deleted.
  const isNoValueColumn = column.value === NO_VALUE_COLUMN;

  // Whether clicking the chip opens the rename popover
  const canRename = Boolean(canManage && !isNoValueColumn);

  // Open the rename popover on its own for a just added column
  useEffect(() => {
    if (autoOpenRename) {
      setRenameValue(column.value);
      setNameTaken(false);
      setRenamePopoverOpen(true);
      onRenameAutoOpened?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open only when the flag turns on
  }, [autoOpenRename]);

  // Open the rename popover primed with the option's value
  function openRenamePopover() {
    setRenameValue(column.value);
    setNameTaken(false);
    setRenamePopoverOpen(true);
  }

  // Track the popover's open state, priming the name field when
  // it opens via the chip. Closing without a commit cancels.
  function handleRenamePopoverOpenChange(open: boolean) {
    if (open) {
      setRenameValue(column.value);
      setNameTaken(false);
    }

    setRenamePopoverOpen(open);
  }

  // Clear the duplicate error while editing
  function handleRenameValueChange(value: string) {
    setRenameValue(value);
    setNameTaken(false);
  }

  // Commit the rename, ignoring empty and unchanged names.
  // Duplicates show an error and keep the popover open.
  function commitRename() {
    const newValue = renameValue.trim();

    // Check that the name changed
    if (!newValue || newValue === column.value) {
      setRenamePopoverOpen(false);

      return;
    }

    // Another column already has the name
    if (existingValues?.includes(newValue)) {
      setNameTaken(true);

      return;
    }

    setRenamePopoverOpen(false);
    onRename?.(column.value, newValue);
  }

  // Commit the rename on Enter. Escape closes the popover, which
  // cancels.
  function handleRenameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      commitRename();
    }
  }

  // Keep clicks on the chip and inside the rename popover from
  // starting a column drag. The popover portal's events bubble
  // through the React tree to the drag handle both sit in, which
  // would capture the pointer and swallow the click.
  function handleRenamePointerDown(event: React.PointerEvent) {
    event.stopPropagation();
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
    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'dataViews.kanban.columns.deleteConfirmation.title',
      message: 'dataViews.kanban.columns.deleteConfirmation.message',
      confirmLabel: 'dataViews.kanban.columns.deleteConfirmation.confirm',
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
          <Popover
            open={renamePopoverOpen}
            onOpenChange={handleRenamePopoverOpenChange}
          >
            <PopoverTrigger>
              <button
                type="button"
                className="kanban-view-heading-chip-button"
                onPointerDown={handleRenamePointerDown}
              >
                <Chip color={column.color}>{column.label}</Chip>
              </button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start" sideOffset={4}>
                <PopoverContent
                  className="kanban-view-heading-rename-popover"
                  onPointerDown={handleRenamePointerDown}
                >
                  <Stack gap={1}>
                    <Group gap={1}>
                      {/** Option colour picker **/}
                      <DropdownMenu
                        trigger={
                          <IconButton
                            size="sm"
                            variant="ghost"
                            color="neutral"
                            label="dataViews.kanban.columns.color"
                          >
                            <ColorSwatch color={column.color} />
                          </IconButton>
                        }
                      >
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
                      </DropdownMenu>

                      {/** Option name field **/}
                      <TextInput
                        autoFocus
                        variant="ghost"
                        size="sm"
                        value={renameValue}
                        placeholder="dataViews.kanban.columns.namePlaceholder"
                        onValueChange={handleRenameValueChange}
                        onKeyDown={handleRenameKeyDown}
                      />

                      {/** Rename submit button **/}
                      <IconButton
                        icon="check"
                        size="sm"
                        variant="ghost"
                        color="neutral"
                        label="actions.save"
                        onClick={commitRename}
                      />
                    </Group>

                    {/** Duplicate name error **/}
                    {nameTaken && (
                      <Text
                        block
                        size="sm"
                        color="danger"
                        className="kanban-view-heading-rename-error"
                        text="dataViews.kanban.columns.nameTaken"
                      />
                    )}
                  </Stack>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
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
            label="dataViews.kanban.columns.newEntry"
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
                label="dataViews.kanban.columns.hide"
                onSelect={handleHide}
              />
            ) : (
              <>
                <DropdownMenuItem
                  icon="pencil"
                  label="dataViews.kanban.columns.rename"
                  onSelect={openRenamePopover}
                />

                {/** Option colour picker **/}
                <DropdownSubmenu>
                  <DropdownSubmenuTriggerItem
                    icon="palette"
                    label="dataViews.kanban.columns.color"
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
                  label="dataViews.kanban.columns.hide"
                  onSelect={handleHide}
                />

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  danger
                  icon="trash"
                  label="dataViews.kanban.columns.delete"
                  onSelect={handleDelete}
                />
              </>
            )}
          </DropdownMenu>
        )}
      </Group>
    </div>
  );
};
