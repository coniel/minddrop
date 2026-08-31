import React from 'react';

/* --- ComboboxChip ---
   Plain div chip element. In multi-select mode, passed to
   Base UI's Combobox.Chip via its render prop. Used directly
   in single-select mode. */

export interface ComboboxChipProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Chip displaying a selected combobox value. */
export const ComboboxChip = React.forwardRef<HTMLDivElement, ComboboxChipProps>(
  ({ className, ...other }, ref) => (
    <div
      ref={ref}
      className={`combobox-chip${className ? ` ${className}` : ''}`}
      {...other}
    />
  ),
);

ComboboxChip.displayName = 'ComboboxChip';
