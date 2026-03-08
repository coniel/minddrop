import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';
import { VerticalScrollArea } from '../ScrollArea';

/* --- ComboboxList ---
   Wraps Base UI's Combobox.List inside a vertical ScrollArea
   for styled scrollbar rendering. Accepts a render function
   child for data-driven items. */

export type ComboboxListProps = ComboboxPrimitive.List.Props;

/** Scrollable combobox item list with styled scrollbar. */
export const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, ...other }, ref) => (
    <VerticalScrollArea
      visibility="scroll"
      className="combobox-list-scroll-area"
    >
      <ComboboxPrimitive.List
        ref={ref}
        className={`combobox-list${className ? ` ${className}` : ''}`}
        {...other}
      />
    </VerticalScrollArea>
  ),
);

ComboboxList.displayName = 'ComboboxList';
