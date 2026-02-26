import React, { useCallback, useMemo } from 'react';
import { DatabaseEntry } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { Button, Checkbox, Icon } from '@minddrop/ui-primitives';
import { DateCell } from '../DateCell';
import { SelectCell } from '../SelectCell';
import { useTableEditContext } from '../TableEditContext';
import { FieldSize, TableColumn } from '../types';
import './TableRow.css';

interface TableRowProps {
  entry: DatabaseEntry;
  columns: TableColumn[];
  columnFlexStyles: Record<string, React.CSSProperties>;
  rowNumber: number;
  showRowNumbers: boolean;
  isSelected: boolean;
  size: FieldSize;
  onToggleRow: (rowId: string, checked: boolean) => void;
  virtualIndex?: number;
}

interface CellProps {
  value: string;
  column: TableColumn;
  size: FieldSize;
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}

const SelectDisplay: React.FC<CellProps> = React.memo(({ value }) => (
  <div className="select-cell">
    <span className="select-cell-value">{value}</span>
    <Icon name="chevron-down" className="select-cell-chevron" />
  </div>
));

SelectDisplay.displayName = 'SelectDisplay';

const DateDisplay: React.FC<CellProps> = React.memo(({ value }) => (
  <div className="date-cell">
    <span className="date-cell-value">{value}</span>
    <Icon name="chevron-down" className="date-cell-chevron" />
  </div>
));

DateDisplay.displayName = 'DateDisplay';

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
};

function propertyValueToString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
}

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
            if (column.type === 'title') {
              return (
                <div
                  role="cell"
                  key={column.id}
                  className="table-cell"
                  data-col-id={column.id}
                  style={columnFlexStyles[column.id]}
                >
                  <div className="table-cell-title">
                    <input
                      type="text"
                      className={`table-cell-input table-cell-input--${size}`}
                      defaultValue={cells[column.id] ?? ''}
                    />
                    <Button
                      variant="subtle"
                      size="sm"
                      startIcon="arrow-up-right"
                      className="text-cell-open-button"
                      onClick={stopPropagation}
                    >
                      {t('openEntry')}
                    </Button>
                  </div>
                </div>
              );
            }

            if (column.type === 'text' || column.type === 'number') {
              return (
                <div
                  role="cell"
                  key={column.id}
                  className="table-cell"
                  data-col-id={column.id}
                  style={columnFlexStyles[column.id]}
                >
                  <input
                    type="text"
                    className={`table-cell-input table-cell-input--${size}`}
                    defaultValue={cells[column.id] ?? ''}
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
