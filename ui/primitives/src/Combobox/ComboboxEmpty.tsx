import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';

/* --- ComboboxEmpty ---
   Wraps Base UI's Combobox.Empty with default styling.
   Shown when no items match the search. */

export type ComboboxEmptyProps = ComboboxPrimitive.Empty.Props;

export const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  ComboboxEmptyProps
>(({ className, ...other }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    className={`combobox-empty${className ? ` ${className}` : ''}`}
    {...other}
  />
));

ComboboxEmpty.displayName = 'ComboboxEmpty';
