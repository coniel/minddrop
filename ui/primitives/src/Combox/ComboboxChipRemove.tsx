import React from 'react';
import { Icon } from '../Icon';

/* --- ComboboxChipRemove ---
   Plain button that removes a chip. Stops event propagation to
   prevent the trigger from opening the popup on click. In
   multi-select mode, passed to Base UI's Combobox.ChipRemove
   via its render prop. Used directly in single-select mode. */

export interface ComboboxChipRemoveProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/** Remove button rendered inside a combobox chip. */
export const ComboboxChipRemove = React.forwardRef<
  HTMLButtonElement,
  ComboboxChipRemoveProps
>(({ className, children, ...other }, ref) => {
  const stopBubble = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`combobox-chip-remove${className ? ` ${className}` : ''}`}
      onPointerDown={stopBubble}
      onMouseDown={stopBubble}
      onClick={stopBubble}
      {...other}
    >
      {children || <Icon name="x" size={12} />}
    </button>
  );
});

ComboboxChipRemove.displayName = 'ComboboxChipRemove';
