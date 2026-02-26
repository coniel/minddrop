import React, { useCallback } from 'react';
import { CalendarPopover, Icon } from '@minddrop/ui-primitives';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './DateCell.css';

interface DateCellProps {
  value: string;
  column: TableColumn;
  size: 'sm' | 'md' | 'lg';
}

function parseDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const d = new Date(value);

  return isNaN(d.getTime()) ? undefined : d;
}

function formatDate(date: Date): string {
  // TODO: Use the user's locale
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const DateCell: React.FC<DateCellProps> = ({ value }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();
  const selected = parseDate(value);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        deactivate();
      }
    },
    [deactivate],
  );

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onCellChange(activeCell!.rowId, activeCell!.columnId, formatDate(date));
        deactivate();
      }
    },
    [activeCell, onCellChange, deactivate],
  );

  return (
    <CalendarPopover
      open={true}
      onOpenChange={handleOpenChange}
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      closeOnSelect
    >
      <div className="date-cell" data-open>
        <span className="date-cell-value">{value}</span>
        <Icon name="chevron-down" className="date-cell-chevron" />
      </div>
    </CalendarPopover>
  );
};

DateCell.displayName = 'DateCell';
