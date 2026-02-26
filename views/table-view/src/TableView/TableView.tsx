import { useVirtualizer } from '@tanstack/react-virtual';
import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps } from '@minddrop/views';
import { TableEditContext } from '../TableEditContext';
import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';
import {
  FIELD_SIZE,
  ROW_HEIGHT,
  ROW_HEIGHT_PX,
  defaultTableViewOptions,
} from '../constants';
import { TableColumn, TableViewOptions } from '../types';
import { useColumnResize } from '../useColumnResize';
import './TableView.css';

const SUPPORTED_TYPES = new Set(['text', 'title', 'number', 'select', 'date']);
const INPUT_TYPES = new Set(['text', 'title', 'number']);

const fieldSize = FIELD_SIZE[defaultTableViewOptions.padding];
const rowHeight = ROW_HEIGHT[defaultTableViewOptions.padding];
const rowHeightPx = ROW_HEIGHT_PX[defaultTableViewOptions.padding];

export const TableViewComponent: React.FC<
  ViewTypeComponentProps<TableViewOptions>
> = ({ view, entries }) => {
  const databaseId =
    view.dataSource.type === 'database' ? view.dataSource.id : '';
  const database = Databases.use(databaseId);
  const allEntries = DatabaseEntries.useAll(databaseId);

  const columns = useMemo<TableColumn[]>(() => {
    if (!database) {
      return [];
    }

    return database.properties
      .filter((p) => SUPPORTED_TYPES.has(p.type))
      .map((p) => {
        const column: TableColumn = { id: p.name, name: p.name, type: p.type };

        if (p.type === 'select') {
          const opts =
            (p as unknown as { options?: { value: string }[] }).options ?? [];
          column.options = opts.map((o) => ({
            label: o.value,
            value: o.value,
          }));
        }

        return column;
      });
  }, [database]);

  const entriesById = useMemo<Record<string, DatabaseEntry>>(() => {
    const map: Record<string, DatabaseEntry> = {};

    for (const entry of allEntries) {
      map[entry.id] = entry;
    }

    return map;
  }, [allEntries]);

  const { columnWidths, tableRef, startResize } = useColumnResize(
    columns,
    view.options?.columnWidths ?? {},
  );

  const tableColumns = useMemo(() => {
    const dataCols = columns
      .map((col) => `${columnWidths[col.id] ?? 100 / columns.length}fr`)
      .join(' ');

    return `2.5rem ${dataCols}`;
  }, [columns, columnWidths]);

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeCell, setActiveCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: () => rowHeightPx,
    measureElement: (el) => el?.getBoundingClientRect().height ?? rowHeightPx,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom =
    totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0);

  const deactivate = useCallback(() => {
    setActiveCell(null);
  }, []);

  const handleTBodyClick = useCallback(
    (e: React.MouseEvent) => {
      const td = (e.target as Element).closest('[data-col-id]');

      if (!td) {
        return;
      }

      const colId = td.getAttribute('data-col-id');
      const column = columns.find((c) => c.id === colId);

      if (!column || INPUT_TYPES.has(column.type)) {
        return;
      }

      const rowId = td.closest('[data-row-id]')?.getAttribute('data-row-id');

      if (rowId && colId) {
        setActiveCell({ rowId, columnId: colId });
      }
    },
    [columns],
  );

  const handleCellChange = useCallback(
    (rowId: string, columnId: string, value: string) => {
      const column = columns.find((c) => c.id === columnId);

      if (!column) {
        return;
      }

      if (column.type === 'title') {
        DatabaseEntries.rename(rowId, value);
      } else if (column.type === 'number') {
        if (!value) {
          DatabaseEntries.clearProperty(rowId, columnId);

          return;
        }

        const number = Number(value);

        if (isNaN(number)) {
          return;
        }

        DatabaseEntries.updateProperty(rowId, columnId, number);
      } else if (column.type === 'date') {
        const d = new Date(value);
        DatabaseEntries.updateProperty(
          rowId,
          columnId,
          isNaN(d.getTime()) ? null : d,
        );
      } else {
        DatabaseEntries.updateProperty(rowId, columnId, value);
      }
    },
    [columns],
  );

  const handleTBodyBlur = useCallback(
    (e: React.FocusEvent) => {
      const input = e.target as HTMLElement;

      if (input.tagName !== 'INPUT') {
        return;
      }

      const td = input.closest('[data-col-id]');
      const rowId = input
        .closest('[data-row-id]')
        ?.getAttribute('data-row-id');
      const colId = td?.getAttribute('data-col-id');

      if (!rowId || !colId) {
        return;
      }

      const column = columns.find((c) => c.id === colId);

      if (!column || !INPUT_TYPES.has(column.type)) {
        return;
      }

      const newValue = (input as HTMLInputElement).value;
      const entry = entriesById[rowId];

      if (entry) {
        const originalRaw =
          column.type === 'title' ? entry.title : entry.properties[colId];
        const originalValue = originalRaw == null ? '' : String(originalRaw);

        if (newValue === originalValue) {
          return;
        }
      }

      handleCellChange(rowId, colId, newValue);
    },
    [columns, entriesById, handleCellChange],
  );

  const handleTBodyKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return;
    }

    const input = e.target as HTMLElement;

    if (input.tagName !== 'INPUT') {
      return;
    }

    e.preventDefault();
    (input as HTMLInputElement).blur();
  }, []);

  const handleToggleRow = useCallback((rowId: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }

      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      setSelectedRows(checked ? new Set(entries) : new Set());
    },
    [entries],
  );

  const editContextValue = useMemo(
    () => ({ activeCell, onCellChange: handleCellChange, deactivate }),
    [activeCell, handleCellChange, deactivate],
  );

  if (!database) {
    return null;
  }

  return (
    <TableEditContext.Provider value={editContextValue}>
      <div className="table-view">
        <ScrollArea className="table-view-scroll" ref={scrollAreaRef}>
          <div
            role="table"
            className="table-view-table"
            ref={tableRef}
            style={
              {
                '--table-row-height': rowHeight,
                '--table-columns': tableColumns,
              } as CSSProperties
            }
            data-row-separators={
              defaultTableViewOptions.rowSeparator || undefined
            }
            data-col-separators={
              defaultTableViewOptions.columnSeparator || undefined
            }
            data-hover-highlight={
              defaultTableViewOptions.highlightOnHover || undefined
            }
          >
            <TableHeader
              columns={columns}
              selectedCount={selectedRows.size}
              totalCount={entries.length}
              onStartResize={startResize}
              onToggleAll={handleToggleAll}
            />
            <div
              role="rowgroup"
              onClick={handleTBodyClick}
              onBlur={handleTBodyBlur}
              onKeyDown={handleTBodyKeyDown}
            >
              <div style={{ height: `${paddingTop}px` }} aria-hidden="true" />
              {virtualItems.map((virtualItem) => {
                const entryId = entries[virtualItem.index];
                const entry = entriesById[entryId];

                if (!entry) {
                  return null;
                }

                return (
                  <TableRow
                    key={entryId}
                    ref={virtualizer.measureElement}
                    virtualIndex={virtualItem.index}
                    entry={entry}
                    columns={columns}
                    rowNumber={virtualItem.index + 1}
                    showRowNumbers={defaultTableViewOptions.showRowNumbers}
                    isSelected={selectedRows.has(entryId)}
                    size={fieldSize}
                    onToggleRow={handleToggleRow}
                  />
                );
              })}
              <div style={{ height: `${paddingBottom}px` }} aria-hidden="true" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </TableEditContext.Provider>
  );
};
