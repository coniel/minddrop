import { useVirtualizer } from '@tanstack/react-virtual';
import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps, Views } from '@minddrop/views';
import { TableEditContext } from '../TableEditContext';
import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';
import { TableViewOptionsMenu } from '../TableViewOptionsMenu';
import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_TITLE_COLUMN_WIDTH,
  FIELD_SIZE,
  ROW_HEIGHT,
  ROW_HEIGHT_PX,
  defaultTableViewOptions,
} from '../constants';
import { TableColumn, TablePadding, TableViewOptions } from '../types';
import { useColumnResize } from '../useColumnResize';
import './TableView.css';

const SUPPORTED_TYPES = new Set(['text', 'title', 'number', 'select', 'date']);
const INPUT_TYPES = new Set(['text', 'title', 'number']);

export const TableViewComponent: React.FC<
  ViewTypeComponentProps<TableViewOptions>
> = ({ view, entries }) => {
  const databaseId =
    view.dataSource.type === 'database' ? view.dataSource.id : '';
  const database = Databases.use(databaseId);
  const allEntries = DatabaseEntries.useAll(databaseId);

  const options: TableViewOptions = useMemo(
    () => ({ ...defaultTableViewOptions, ...(view.options ?? {}) }),
    [view.options],
  );

  const fieldSize = FIELD_SIZE[options.padding];
  const rowHeight = ROW_HEIGHT[options.padding];
  const rowHeightPx = ROW_HEIGHT_PX[options.padding];

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
    options.columnWidths,
    options.overflow,
  );

  const columnFlexStyles = useMemo<Record<string, CSSProperties>>(() => {
    const styles: Record<string, CSSProperties> = {};

    for (const column of columns) {
      if (options.overflow) {
        const defaultWidth =
          column.type === 'title'
            ? DEFAULT_TITLE_COLUMN_WIDTH
            : DEFAULT_COLUMN_WIDTH;
        const width = columnWidths[column.id] ?? defaultWidth;

        styles[column.id] = { flex: `0 0 ${width}px` };
      } else {
        const percentage = columnWidths[column.id] ?? 100 / columns.length;

        styles[column.id] = { flex: `${percentage} 0 0%` };
      }
    }

    return styles;
  }, [columns, columnWidths, options.overflow]);

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
    measureElement: (element) =>
      element?.getBoundingClientRect().height ?? rowHeightPx,
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
    (event: React.MouseEvent) => {
      const td = (event.target as Element).closest('[data-col-id]');

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
    (event: React.FocusEvent) => {
      const input = event.target as HTMLElement;

      if (input.tagName !== 'INPUT') {
        return;
      }

      const td = input.closest('[data-col-id]');
      const rowId = input.closest('[data-row-id]')?.getAttribute('data-row-id');
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

  const handleTBodyKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') {
      return;
    }

    const input = event.target as HTMLElement;

    if (input.tagName !== 'INPUT') {
      return;
    }

    event.preventDefault();
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

  function handleOptionChange(update: Partial<TableViewOptions>) {
    Views.update(view.id, { options: update });
  }

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
              } as CSSProperties
            }
            data-overflow={options.overflow || undefined}
            data-row-separators={options.rowSeparator || undefined}
            data-col-separators={options.columnSeparator || undefined}
            data-hover-highlight={options.highlightOnHover || undefined}
          >
            <TableHeader
              columns={columns}
              columnFlexStyles={columnFlexStyles}
              overflow={options.overflow}
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
                    columnFlexStyles={columnFlexStyles}
                    rowNumber={virtualItem.index + 1}
                    showRowNumbers={options.showRowNumbers}
                    isSelected={selectedRows.has(entryId)}
                    size={fieldSize}
                    onToggleRow={handleToggleRow}
                  />
                );
              })}
              <div
                style={{ height: `${paddingBottom}px` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </ScrollArea>
        <TableViewOptionsMenu
          overflow={options.overflow}
          padding={options.padding}
          showRowNumbers={options.showRowNumbers}
          rowSeparator={options.rowSeparator}
          columnSeparator={options.columnSeparator}
          highlightOnHover={options.highlightOnHover}
          onOverflowChange={(overflow) => handleOptionChange({ overflow })}
          onPaddingChange={(padding: TablePadding) =>
            handleOptionChange({ padding })
          }
          onShowRowNumbersChange={(showRowNumbers) =>
            handleOptionChange({ showRowNumbers })
          }
          onRowSeparatorChange={(rowSeparator) =>
            handleOptionChange({ rowSeparator })
          }
          onColumnSeparatorChange={(columnSeparator) =>
            handleOptionChange({ columnSeparator })
          }
          onHighlightOnHoverChange={(highlightOnHover) =>
            handleOptionChange({ highlightOnHover })
          }
        />
      </div>
    </TableEditContext.Provider>
  );
};
