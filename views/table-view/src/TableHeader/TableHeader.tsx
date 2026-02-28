import React, { useCallback, useState } from 'react';
import { UiIconName } from '@minddrop/icons';
import { Checkbox, Icon, Tooltip } from '@minddrop/ui-primitives';
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
  columns: TableColumn[];
  columnFlexStyles: Record<string, React.CSSProperties>;
  overflow: boolean;
  selectedCount: number;
  totalCount: number;
  onStartResize: (columnId: string, event: React.MouseEvent) => void;
  onToggleAll: (checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnFlexStyles,
  overflow,
  selectedCount,
  totalCount,
  onStartResize,
  onToggleAll,
}) => {
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  // Track which handle's tooltip is open (null = none).
  // Set to null while dragging so the tooltip hides immediately.
  const [tooltipHandleId, setTooltipHandleId] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);

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

          return (
            <div
              role="columnheader"
              key={column.id}
              className="table-header-cell"
              style={columnFlexStyles[column.id]}
            >
              <span className="table-header-cell-label">
                <Icon
                  name={COLUMN_TYPE_ICONS[column.type] ?? 'baseline'}
                  color="subtle"
                  className="table-header-cell-icon"
                />
                <span className="table-header-cell-name">{column.name}</span>
              </span>

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
