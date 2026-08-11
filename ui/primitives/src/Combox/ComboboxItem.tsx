import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';
import {
  ActionMenuCheckItem,
  ActionMenuCheckItemProps,
} from '../ActionMenuItem';
import { isKeyboardInputMode } from '../utils/isKeyboardInputMode';

/* --- ComboboxItem ---
   ActionMenuCheckItem pre-configured with Combobox.Item as the
   base component. Use inside a ComboboxList to render selectable
   items with a check indicator. */

export type ComboboxItemProps = Omit<ActionMenuCheckItemProps, 'component'>;

type ComboboxItemMouseMoveHandler = NonNullable<
  ComboboxPrimitive.Item.Props['onMouseMove']
>;

/** Combobox item with a check indicator for selected state. */
export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  (props, ref) => {
    // Mouse move events fired while the keyboard owns the
    // navigation come from items shifting under a stationary
    // cursor, not from the user pointing at them, so leave the
    // highlight where the keyboard put it
    const handleMouseMove: ComboboxItemMouseMoveHandler = (event) => {
      if (isKeyboardInputMode()) {
        event.preventBaseUIHandler();
      }
    };

    return (
      <ActionMenuCheckItem
        ref={ref}
        component={ComboboxPrimitive.Item}
        {...props}
        onMouseMove={handleMouseMove}
      />
    );
  },
);

ComboboxItem.displayName = 'ComboboxItem';
