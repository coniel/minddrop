import React, { useCallback, useMemo, useState } from 'react';
import { useSortableDrag } from '@minddrop/feature-drag-and-drop';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
import {
  Checkbox,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  Icon,
  Tooltip,
} from '@minddrop/ui-primitives';
import { TableColumn } from '../types';
import './TableHeader.css';

const COLUMN_TYPE_ICONS: Record<string, UiIconName> = {
  title: 'type',
  text: 'type',
  number: 'hash',
  select: 'circle-dot',
  date: 'calendar',
};

interface TableHeaderProps {
  /**
   * The column definitions for the table.
   */
  columns: TableColumn[];

  /**
   * A map of column IDs to their flex CSS styles.
   */
  columnFlexStyles: Record<string, React.CSSProperties>;

  /**
   * Whether the table content overflows horizontally.
   */
  overflow: boolean;

  /**
   * The number of currently selected rows.
   */
  selectedCount: number;

  /**
   * The total number of rows in the table.
   */
  totalCount: number;

  /**
   * Callback when a column resize handle is dragged.
   */
  onStartResize: (columnId: string, event: React.MouseEvent) => void;

  /**
   * Callback when the select-all checkbox is toggled.
   */
  onToggleAll: (checked: boolean) => void;

  /**
   * Callback when columns are reordered via drag and drop.
   */
  onReorderColumns: (columnOrder: string[]) => void;

  /**
   * Callback when a select column's chip display is toggled.
   */
  onToggleShowChips: (columnId: string, showChips: boolean) => void;

  /**
   * Callback when a column is hidden.
   */
  onHideColumn: (columnId: string) => void;
}

/**
 * Renders the table header row with column labels, resize handles, and column menus.
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnFlexStyles,
  overflow,
  selectedCount,
  totalCount,
  onStartResize,
  onToggleAll,
  onReorderColumns,
  onToggleShowChips,
  onHideColumn,
}) => {
  const { t } = useTranslation({ keyPrefix: 'views.table' });
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  // Track which column's dropdown menu is open (null = none)
  const [menuColumnId, setMenuColumnId] = useState<string | null>(null);

  // Refs for column header cells, used as menu anchor positions
  const cellRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Tracks whether a pointer drag occurred, so we can suppress
  // the click event that fires after a drag-and-release
  const didDrag = React.useRef(false);

  // Track which handle's tooltip is open (null = none).
  // Set to null while dragging so the tooltip hides immediately.
  const [tooltipHandleId, setTooltipHandleId] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);

  // Column IDs for the sortable drag hook
  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  );

  // Sortable drag hook for horizontal column reordering
  const sortableProps = useSortableDrag({
    items: columnIds,
    direction: 'horizontal',
    gap: 0,
    onSort: onReorderColumns,
  });

  const handleResizeMouseDown = useCallback(
    (columnId: string, event: React.MouseEvent) => {
      setResizing(true);
      setTooltipHandleId(null);

      const handleMouseUp = () => {
        setResizing(false);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mouseup', handleMouseUp);
      onStartResize(columnId, event);
    },
    [onStartResize],
  );

  const handleTooltipOpenChange = useCallback(
    (handleId: string, open: boolean) => {
      if (!resizing) {
        setTooltipHandleId(open ? handleId : null);
      }
    },
    [resizing],
  );

  return (
    <div role="rowgroup" className="table-header">
      <div role="row" className="table-header-row">
        <div role="columnheader" className="table-header-row-number">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={onToggleAll}
            className="table-header-checkbox"
          />
        </div>
        {columns.map((column, index) => {
          const isFirstColumn = index === 0;
          const isLastColumn = index === columns.length - 1;

          // Right handle resizes this column
          const showRightHandle = overflow || !isLastColumn;
          // Left handle resizes the previous column
          const showLeftHandle = index > 0;

          const previousColumnId = !isFirstColumn
            ? columns[index - 1].id
            : null;

          // Unique IDs for tooltip tracking
          const rightHandleId = `${column.id}-right`;
          const leftHandleId = `${column.id}-left`;

          // Get drag render props for this column
          const dragProps = sortableProps.get(column.id);

          return (
            <div
              role="columnheader"
              key={column.id}
              ref={(node) => {
                cellRefs.current[column.id] = node;
                dragProps?.ref(node);
              }}
              className={`table-header-cell ${dragProps?.className ?? ''}`}
              style={{
                ...columnFlexStyles[column.id],
                ...dragProps?.style,
              }}
            >
              {/* Drag zone fills the cell, sits behind resize handles.
                 Click (without drag) opens the column menu. */}
              <div
                className="table-header-cell-drag-zone"
                {...dragProps?.handleProps}
                onPointerDown={(event) => {
                  didDrag.current = false;
                  dragProps?.handleProps?.onPointerDown?.(event);
                }}
                onPointerMove={(event) => {
                  didDrag.current = true;
                  dragProps?.handleProps?.onPointerMove?.(event);
                }}
                onClick={() => {
                  if (didDrag.current) {
                    return;
                  }

                  setMenuColumnId((current) =>
                    current === column.id ? null : column.id,
                  );
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setMenuColumnId((current) =>
                    current === column.id ? null : column.id,
                  );
                }}
              />

              {/* Column label — pointer-events: none so drags pass through */}
              <span className="table-header-cell-label">
                <Icon
                  name={COLUMN_TYPE_ICONS[column.type] ?? 'baseline'}
                  color="subtle"
                  className="table-header-cell-icon"
                />
                <span className="table-header-cell-name">{column.name}</span>
              </span>

              {/* Column options menu — controlled, opens on click */}
              <DropdownMenuRoot
                open={menuColumnId === column.id}
                onOpenChange={(open, details) => {
                  if (!open && details.reason === 'outside-press') {
                    // Check if the press landed on a header drag zone —
                    // if so, let the cell's onClick handle the toggle
                    const target = (details.event as MouseEvent)
                      ?.target as Element | null;

                    if (target?.closest('.table-header-cell-drag-zone')) {
                      return;
                    }
                  }

                  if (!open) {
                    setMenuColumnId(null);
                  }
                }}
              >
                <DropdownMenuPortal>
                  <DropdownMenuPositioner
                    side="bottom"
                    align="start"
                    anchor={() => cellRefs.current[column.id]}
                  >
                    <DropdownMenuContent>
                      {/* Show chips toggle for select columns */}
                      {column.type === 'select' && (
                        <>
                          <DropdownMenuSwitchItem
                            label={t('showChips')}
                            checked={column.showChips !== false}
                            onCheckedChange={(checked) =>
                              onToggleShowChips(column.id, checked)
                            }
                          />
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {/* Hide column action */}
                      <DropdownMenuItem
                        label={t('hideColumn')}
                        icon="eye-off"
                        onClick={() => onHideColumn(column.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </DropdownMenuRoot>

              {/* Left handle — resizes the previous column */}
              {showLeftHandle && previousColumnId && !overflow && (
                <Tooltip
                  title="views.table.resizeHandle"
                  description="views.table.resizeHandleShiftHint"
                  delay={200}
                  open={tooltipHandleId === leftHandleId}
                  onOpenChange={(open) =>
                    handleTooltipOpenChange(leftHandleId, open)
                  }
                  side="top"
                  align="center"
                >
                  <div
                    className="table-header-resize-handle table-header-resize-handle-left"
                    onMouseDown={(event) =>
                      handleResizeMouseDown(previousColumnId, event)
                    }
                  />
                </Tooltip>
              )}
              {showLeftHandle && previousColumnId && overflow && (
                <div
                  className="table-header-resize-handle table-header-resize-handle-left"
                  onMouseDown={(event) =>
                    handleResizeMouseDown(previousColumnId, event)
                  }
                />
              )}

              {/* Right handle — resizes this column */}
              {showRightHandle && !overflow && (
                <Tooltip
                  title="views.table.resizeHandle"
                  description="views.table.resizeHandleShiftHint"
                  delay={200}
                  open={tooltipHandleId === rightHandleId}
                  onOpenChange={(open) =>
                    handleTooltipOpenChange(rightHandleId, open)
                  }
                  side="top"
                  align="center"
                >
                  <div
                    className="table-header-resize-handle table-header-resize-handle-right"
                    onMouseDown={(event) =>
                      handleResizeMouseDown(column.id, event)
                    }
                  />
                </Tooltip>
              )}
              {showRightHandle && overflow && (
                <div
                  className="table-header-resize-handle table-header-resize-handle-right"
                  onMouseDown={(event) =>
                    handleResizeMouseDown(column.id, event)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
