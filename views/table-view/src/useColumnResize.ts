import { useCallback, useRef, useState } from 'react';
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
): UseColumnResizeReturn {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  // Keep a ref in sync so resize handlers never close over stale state.
  const columnWidthsRef = useRef(initialWidths);
  const tableRef = useRef<HTMLDivElement>(null);

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
          const newWidths = { ...columnWidthsRef.current, [columnId]: newWidth };

          columnWidthsRef.current = newWidths;
          setColumnWidths(newWidths);
        };

        const handleMouseUp = () => {
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
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
        const nextColumn = columns[colIndex + 1];
        const startNextWidth = nextColumn
          ? (columnWidthsRef.current[nextColumn.id] ??
            getDefaultWidth(nextColumn.id))
          : null;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const deltaPercent =
            ((moveEvent.clientX - startX) / tableWidth) * 100;
          const newWidth = Math.max(
            MIN_COLUMN_WIDTH_PCT,
            startWidth + deltaPercent,
          );
          const clampedDelta = newWidth - startWidth;

          const newWidths: Record<string, number> = {
            ...columnWidthsRef.current,
            [columnId]: newWidth,
          };

          if (nextColumn && startNextWidth !== null) {
            newWidths[nextColumn.id] = Math.max(
              MIN_COLUMN_WIDTH_PCT,
              startNextWidth - clampedDelta,
            );
          }

          columnWidthsRef.current = newWidths;
          setColumnWidths(newWidths);
        };

        const handleMouseUp = () => {
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },
    [columns, overflow],
  );

  return { columnWidths, tableRef, startResize };
}
