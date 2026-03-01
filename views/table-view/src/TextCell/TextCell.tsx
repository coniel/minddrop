import React from 'react';
import { Button } from '@minddrop/ui-primitives';
import { FieldSize } from '../types';
import './TextCell.css';

interface TextCellProps {
  /**
   * The cell's text value.
   */
  value: string;

  /**
   * The field size variant.
   */
  size: FieldSize;

  /**
   * Whether to show the open entry button on hover.
   */
  showOpenButton: boolean;

  /**
   * The label for the open entry button.
   */
  openButtonLabel: string;
}

/**
 * Renders a text input cell with an optional open button for title columns.
 */
export const TextCell: React.FC<TextCellProps> = React.memo(
  ({ value, size, showOpenButton, openButtonLabel }) => {
    if (showOpenButton) {
      return (
        <div className="text-cell">
          <input
            type="text"
            className={`table-cell-input table-cell-input--${size}`}
            defaultValue={value}
          />
          <Button
            variant="subtle"
            size="sm"
            startIcon="arrow-up-right"
            className="text-cell-open-button"
            onClick={stopPropagation}
          >
            {openButtonLabel}
          </Button>
        </div>
      );
    }

    return (
      <input
        type="text"
        className={`table-cell-input table-cell-input--${size}`}
        defaultValue={value}
      />
    );
  },
);

TextCell.displayName = 'TextCell';

function stopPropagation(event: React.MouseEvent) {
  event.stopPropagation();
}
