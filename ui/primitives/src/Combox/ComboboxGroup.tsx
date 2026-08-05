import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';

/* --- ComboboxGroup ---
   Wraps Base UI's Combobox.Group with the combobox group class.
   Groups related items under an optional ComboboxGroupLabel
   inside a ComboboxList. */

export type ComboboxGroupProps = ComboboxPrimitive.Group.Props;

/** Container grouping related combobox items. */
export const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  ComboboxGroupProps
>(({ className, ...other }, ref) => (
  <ComboboxPrimitive.Group
    ref={ref}
    className={`combobox-group${className ? ` ${className}` : ''}`}
    {...other}
  />
));

ComboboxGroup.displayName = 'ComboboxGroup';
