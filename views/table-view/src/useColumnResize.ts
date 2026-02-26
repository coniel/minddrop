import { useCallback, useRef, useState } from 'react';
import { TableColumn } from './types';

export interface UseColumnResizeReturn {
  columnWidths: Record<string, number>;
  tableRef: React.RefObject<HTMLDivElement | null>;
  startResize: (columnId: string, event: React.MouseEvent) => void;
}

export function useColumnResize(
  columns: TableColumn[],
  initialWidths: Record<string, number>,
): UseColumnResizeReturn {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  // Keep a ref in sync so resize handlers never close over stale state.
  const columnWidthsRef = useRef(initialWidths);
  const tableRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback(
    (columnId: string, event: React.MouseEvent) => {
      event.preventDefault();

      const startX = event.clientX;
      const tableWidth = tableRef.current?.offsetWidth ?? 0;

      if (tableWidth === 0) {
        return;
      }

      const colIndex = columns.findIndex((c) => c.id === columnId);
      const nextColumn = columns[colIndex + 1];
      const startWidth = columnWidthsRef.current[columnId] ?? 0;
      const startNextWidth = nextColumn
        ? (columnWidthsRef.current[nextColumn.id] ?? 0)
        : null;

      // Prevent text selection while dragging.
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      const handleMouseMove = (e: MouseEvent) => {
        const deltaPercent = ((e.clientX - startX) / tableWidth) * 100;
        const newWidth = Math.max(5, startWidth + deltaPercent);
        const clampedDelta = newWidth - startWidth;

        const newWidths: Record<string, number> = {
          ...columnWidthsRef.current,
          [columnId]: newWidth,
        };

        if (nextColumn && startNextWidth !== null) {
          newWidths[nextColumn.id] = Math.max(5, startNextWidth - clampedDelta);
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
    },
    [columns],
  );

  return { columnWidths, tableRef, startResize };
}
