import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_TITLE_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH_PCT,
  MIN_COLUMN_WIDTH_PX,
} from './constants';
import { TableColumn } from './types';

export interface UseColumnResizeReturn {
  columnWidths: Record<string, number>;
  tableRef: React.RefObject<HTMLDivElement | null>;
  startResize: (columnId: string, event: React.MouseEvent) => void;
}

export function useColumnResize(
  columns: TableColumn[],
  initialWidths: Record<string, number>,
  overflow: boolean,
  onResizeEnd: (widths: Record<string, number>) => void,
): UseColumnResizeReturn {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  // Keep a ref in sync so resize handlers never close over stale state.
  const columnWidthsRef = useRef(initialWidths);
  const tableRef = useRef<HTMLDivElement>(null);

  // Reset local state when overflow mode changes, loading the correct set
  // of persisted widths for the new mode.
  useEffect(() => {
    columnWidthsRef.current = initialWidths;
    setColumnWidths(initialWidths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overflow]);

  const startResize = useCallback(
    (columnId: string, event: React.MouseEvent) => {
      event.preventDefault();

      const startX = event.clientX;

      function getDefaultWidth(id: string): number {
        if (!overflow) {
          return 100 / columns.length;
        }

        const column = columns.find((c) => c.id === id);

        return column?.type === 'title'
          ? DEFAULT_TITLE_COLUMN_WIDTH
          : DEFAULT_COLUMN_WIDTH;
      }

      const startWidth =
        columnWidthsRef.current[columnId] ?? getDefaultWidth(columnId);

      // Prevent text selection while dragging.
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      if (overflow) {
        // Pixel mode: only resize the dragged column, table expands.
        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientX - startX;
          const newWidth = Math.max(MIN_COLUMN_WIDTH_PX, startWidth + delta);
          const newWidths = {
            ...columnWidthsRef.current,
            [columnId]: newWidth,
          };

          columnWidthsRef.current = newWidths;
          setColumnWidths(newWidths);
        };

        const handleMouseUp = () => {
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);

          // Persist the final widths
          onResizeEnd(columnWidthsRef.current);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      } else {
        // Percentage mode: resize dragged column and the next column together
        // so the total width stays constant.
        const tableWidth = tableRef.current?.offsetWidth ?? 0;

        if (tableWidth === 0) {
          return;
        }

        const colIndex = columns.findIndex((c) => c.id === columnId);

        // Capture the starting widths of columns to the right
        const rightColumns = columns.slice(colIndex + 1);
        const startRightWidths = rightColumns.map((column) => ({
          id: column.id,
          width:
            columnWidthsRef.current[column.id] ?? getDefaultWidth(column.id),
        }));

        // Capture the starting widths of columns to the left (nearest first)
        const leftColumns = columns.slice(0, colIndex).reverse();
        const startLeftWidths = leftColumns.map((column) => ({
          id: column.id,
          width:
            columnWidthsRef.current[column.id] ?? getDefaultWidth(column.id),
        }));

        // Maximum the dragged column can grow (right columns shrink)
        const maxGrowth = startRightWidths.reduce(
          (sum, { width }) => sum + (width - MIN_COLUMN_WIDTH_PCT),
          0,
        );

        // Maximum the dragged column can shrink (left columns shrink)
        const maxShrink = startLeftWidths.reduce(
          (sum, { width }) => sum + (width - MIN_COLUMN_WIDTH_PCT),
          0,
        );

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const deltaPercent =
            ((moveEvent.clientX - startX) / tableWidth) * 100;

          // Cap delta by the dragged column's own min and by how much
          // the opposite side can absorb.
          const clampedDelta = Math.min(
            Math.max(
              -(startWidth - MIN_COLUMN_WIDTH_PCT) - maxShrink,
              deltaPercent,
            ),
            maxGrowth,
          );
          const newWidth = startWidth + clampedDelta;

          const newWidths: Record<string, number> = {
            ...columnWidthsRef.current,
            [columnId]: newWidth,
          };

          if (clampedDelta > 0) {
            // Expanding right: shrink right columns
            if (moveEvent.shiftKey) {
              // Shift held: spread evenly across all right columns
              const perColumnDelta = clampedDelta / rightColumns.length;

              for (const { id, width } of startRightWidths) {
                newWidths[id] = Math.max(
                  MIN_COLUMN_WIDTH_PCT,
                  width - perColumnDelta,
                );
              }
            } else {
              // Cascade through right columns
              let remaining = clampedDelta;

              for (const { id, width } of startRightWidths) {
                const shrunk = Math.max(
                  MIN_COLUMN_WIDTH_PCT,
                  width - remaining,
                );

                newWidths[id] = shrunk;
                remaining -= width - shrunk;

                if (remaining <= 0) {
                  break;
                }
              }
            }
          } else if (clampedDelta < 0) {
            // Shrinking left: the freed space first goes to the immediate
            // right column. But if the dragged column hit its own minimum,
            // cascade the remaining shrink into left columns.
            const absDelta = Math.abs(clampedDelta);
            const draggedShrink = startWidth - newWidth;
            const leftOverflow = absDelta - draggedShrink;

            // The right neighbor grows by the full abs delta
            if (startRightWidths.length > 0) {
              const rightNeighbor = startRightWidths[0];

              newWidths[rightNeighbor.id] = rightNeighbor.width + absDelta;
            }

            // If the dragged column bottomed out, cascade the excess
            // into left columns (shrink them too).
            if (leftOverflow > 0) {
              let remaining = leftOverflow;

              for (const { id, width } of startLeftWidths) {
                const shrunk = Math.max(
                  MIN_COLUMN_WIDTH_PCT,
                  width - remaining,
                );

                newWidths[id] = shrunk;
                remaining -= width - shrunk;

                if (remaining <= 0) {
                  break;
                }
              }
            }
          }

          columnWidthsRef.current = newWidths;
          setColumnWidths(newWidths);
        };

        const handleMouseUp = () => {
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);

          // Persist the final widths
          onResizeEnd(columnWidthsRef.current);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },
    [columns, overflow, onResizeEnd],
  );

  return { columnWidths, tableRef, startResize };
}
