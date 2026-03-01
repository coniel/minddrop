import React, { useCallback, useMemo } from 'react';
import { DatabaseEntry } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { Checkbox } from '@minddrop/ui-primitives';
import { DateCell, DateDisplay } from '../DateCell';
import { NumberCell } from '../NumberCell';
import { SelectCell, SelectDisplay } from '../SelectCell';
import { useTableEditContext } from '../TableEditContext';
import { TextCell } from '../TextCell';
import { FieldSize, TableColumn } from '../types';
import { propertyValueToString } from '../utils';
import './TableRow.css';

interface TableRowProps {
  /**
   * The database entry to render.
   */
  entry: DatabaseEntry;

  /**
   * The column definitions for the table.
   */
  columns: TableColumn[];

  /**
   * A map of column IDs to their flex CSS styles.
   */
  columnFlexStyles: Record<string, React.CSSProperties>;

  /**
   * The 1-based row number to display.
   */
  rowNumber: number;

  /**
   * Whether to show row numbers.
   */
  showRowNumbers: boolean;

  /**
   * Whether the row is currently selected.
   */
  isSelected: boolean;

  /**
   * The field size variant.
   */
  size: FieldSize;

  /**
   * Callback when the row's checkbox is toggled.
   */
  onToggleRow: (rowId: string, checked: boolean) => void;

  /**
   * The index of the row in the virtualised list.
   */
  virtualIndex?: number;
}

interface CellProps {
  /**
   * The cell's string value.
   */
  value: string;

  /**
   * The column configuration.
   */
  column: TableColumn;

  /**
   * The field size variant.
   */
  size: FieldSize;
}

const DISPLAY_COMPONENTS: Partial<
  Record<string, React.ComponentType<CellProps>>
> = {
  select: SelectDisplay,
  date: DateDisplay,
};

const EDITOR_COMPONENTS: Partial<
  Record<string, React.ComponentType<CellProps>>
> = {
  select: SelectCell,
  date: DateCell,
  number: NumberCell,
};

/**
 * Renders a single data row in the table view.
 */
export const TableRow = React.memo(
  React.forwardRef<HTMLDivElement, TableRowProps>(
    (
      {
        entry,
        columns,
        columnFlexStyles,
        rowNumber,
        showRowNumbers,
        isSelected,
        size,
        onToggleRow,
        virtualIndex,
      },
      ref,
    ) => {
      const { t } = useTranslation({ keyPrefix: 'views.table' });
      const { activeCell } = useTableEditContext();
      const isActiveRow = activeCell?.rowId === entry.id;

      const cells = useMemo(
        () =>
          Object.fromEntries(
            columns.map((col) => [
              col.id,
              col.type === 'title'
                ? entry.title
                : propertyValueToString(entry.properties[col.id]),
            ]),
          ),
        [entry, columns],
      );

      const handleToggleRow = useCallback(
        (checked: boolean) => onToggleRow(entry.id, checked),
        [onToggleRow, entry.id],
      );

      return (
        <div
          role="row"
          ref={ref}
          className="table-row"
          data-selected={isSelected || undefined}
          data-row-id={entry.id}
          data-index={virtualIndex}
        >
          <div role="cell" className="table-row-number">
            {showRowNumbers && (
              <span className="table-row-number-text">{rowNumber}</span>
            )}
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggleRow}
              className="table-row-checkbox"
            />
          </div>
          {columns.map((column) => {
            if (column.type === 'title' || column.type === 'text') {
              return (
                <div
                  role="cell"
                  key={column.id}
                  className="table-cell"
                  data-col-id={column.id}
                  style={columnFlexStyles[column.id]}
                >
                  <TextCell
                    value={cells[column.id] ?? ''}
                    size={size}
                    showOpenButton={column.type === 'title'}
                    openButtonLabel={t('openEntry')}
                  />
                </div>
              );
            }

            const isActiveCell =
              isActiveRow && activeCell?.columnId === column.id;
            const Component = isActiveCell
              ? EDITOR_COMPONENTS[column.type]
              : DISPLAY_COMPONENTS[column.type];

            return (
              <div
                role="cell"
                key={column.id}
                className="table-cell"
                data-col-id={column.id}
                style={columnFlexStyles[column.id]}
              >
                {Component ? (
                  <Component
                    value={cells[column.id] ?? ''}
                    column={column}
                    size={size}
                  />
                ) : (
                  <span className="table-cell-static">
                    {cells[column.id] ?? ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    },
  ),
);

TableRow.displayName = 'TableRow';
