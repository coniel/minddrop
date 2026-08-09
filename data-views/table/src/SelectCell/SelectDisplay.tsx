import React from 'react';
import { Chip, Icon } from '@minddrop/ui-primitives';
import { TableColumn } from '../types';
import './SelectCell.css';

interface SelectDisplayProps {
  /**
   * The currently selected value.
   */
  value: string;

  /**
   * The column configuration including options and display settings.
   */
  column: TableColumn;
}

/**
 * Renders the inactive display state of a select cell.
 */
export const SelectDisplay: React.FC<SelectDisplayProps> = React.memo(
  ({ value, column }) => {
    // Find the matching option to get its color
    const option = column.options?.find((o) => o.value === value);

    // Render as plain text when showChips is disabled
    const showChips = column.showChips !== false;

    return (
      <div className="select-cell">
        {value ? (
          showChips ? (
            <Chip size="sm" color={option?.color || 'default'}>
              {value}
            </Chip>
          ) : (
            <span className="select-cell-text">{value}</span>
          )
        ) : null}
        <Icon name="chevron-down" className="select-cell-chevron" />
      </div>
    );
  },
);

SelectDisplay.displayName = 'SelectDisplay';
