import React from 'react';
import { Icon } from '@minddrop/ui-primitives';
import './DateCell.css';

interface DateDisplayProps {
  /**
   * The formatted date string to display.
   */
  value: string;
}

/**
 * Renders the inactive display state of a date cell.
 */
export const DateDisplay: React.FC<DateDisplayProps> = React.memo(
  ({ value }) => (
    <div className="date-cell">
      <span className="date-cell-value">{value}</span>
      <Icon name="chevron-down" className="date-cell-chevron" />
    </div>
  ),
);

DateDisplay.displayName = 'DateDisplay';
