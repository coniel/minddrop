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
  selectedCount: number;
  totalCount: number;
  onStartResize: (columnId: string, event: React.MouseEvent) => void;
  onToggleAll: (checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
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
        {columns.map((column, index) => (
          <div role="columnheader" key={column.id} className="table-header-cell">
            <span className="table-header-cell-label">
              <Icon
                name={COLUMN_TYPE_ICONS[column.type] ?? 'baseline'}
                color="subtle"
                className="table-header-cell-icon"
              />
              <span className="table-header-cell-name">{column.name}</span>
            </span>
            {index < columns.length - 1 && (
              <div
                className="table-header-resize-handle"
                onMouseDown={(e) => onStartResize(column.id, e)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
