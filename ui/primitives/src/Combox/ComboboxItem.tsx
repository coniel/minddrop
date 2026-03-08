import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';
import {
  ActionMenuCheckItem,
  ActionMenuCheckItemProps,
} from '../ActionMenuItem';

/* --- ComboboxItem ---
   ActionMenuCheckItem pre-configured with Combobox.Item as the
   base component. Use inside a ComboboxList to render selectable
   items with a check indicator. */

export type ComboboxItemProps = Omit<ActionMenuCheckItemProps, 'component'>;

/** Combobox item with a check indicator for selected state. */
export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  (props, ref) => (
    <ActionMenuCheckItem
      ref={ref}
      component={ComboboxPrimitive.Item}
      {...props}
    />
  ),
);

ComboboxItem.displayName = 'ComboboxItem';
