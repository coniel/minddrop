import React from 'react';
import { UiIconName } from '@minddrop/icons';
import { Checkbox, Icon } from '@minddrop/ui-primitives';
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
          const isLastColumn = index === columns.length - 1;
          const showResizeHandle = overflow || !isLastColumn;

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
              {showResizeHandle && (
                <div
                  className="table-header-resize-handle"
                  onMouseDown={(event) => onStartResize(column.id, event)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
