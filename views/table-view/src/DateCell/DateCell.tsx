import React, { useCallback } from 'react';
import { CalendarPopover, Icon } from '@minddrop/ui-primitives';
import { formatDate, parseDate } from '@minddrop/utils';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './DateCell.css';

interface DateCellProps {
  /**
   * The formatted date string value.
   */
  value: string;

  /**
   * The column configuration.
   */
  column: TableColumn;

  /**
   * The field size variant.
   */
  size: 'sm' | 'md' | 'lg';
}

/**
 * Renders the active editor state of a date cell as a calendar popover.
 */
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
        const formatted = formatDate(date);

        if (formatted !== value) {
          onCellChange(activeCell!.rowId, activeCell!.columnId, formatted);
        }

        deactivate();
      }
    },
    [value, activeCell, onCellChange, deactivate],
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
