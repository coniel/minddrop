import React from 'react';
import { ContentColor } from '@minddrop/ui-theme';

/* --- ComboboxChip ---
   Plain div chip element. In multi-select mode, passed to
   Base UI's Combobox.Chip via its render prop. Used directly
   in single-select mode. */

export interface ComboboxChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  children?: React.ReactNode;

  /**
   * Content color variant. Defaults to the neutral chip style.
   */
  color?: ContentColor;
}

/** Chip displaying a selected combobox value. */
export const ComboboxChip = React.forwardRef<HTMLDivElement, ComboboxChipProps>(
  ({ className, color, ...other }, ref) => {
    // Colored chips get a color modifier class and a colored
    // marker class used to restyle the chip's content
    const colorClass =
      color && color !== 'default'
        ? ` combobox-chip-colored combobox-chip-color-${color}`
        : '';

    return (
      <div
        ref={ref}
        className={`combobox-chip${colorClass}${className ? ` ${className}` : ''}`}
        {...other}
      />
    );
  },
);

ComboboxChip.displayName = 'ComboboxChip';
