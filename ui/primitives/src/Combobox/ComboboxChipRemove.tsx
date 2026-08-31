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
>(
  (
    { className, children, onPointerDown, onMouseDown, onClick, ...other },
    ref,
  ) => {
    // Base UI merges its own handlers into the incoming props, so
    // the passed handlers must run before the event is contained.
    // Containment must cover mousedown: the trigger toggles the
    // popup on mousedown, not click.
    const handlePointerDown = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      onPointerDown?.(event);
      event.stopPropagation();
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(event);
      event.stopPropagation();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      event.stopPropagation();
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`combobox-chip-remove${className ? ` ${className}` : ''}`}
        {...other}
        onPointerDown={handlePointerDown}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {children || <Icon name="x" size={12} />}
      </button>
    );
  },
);

ComboboxChipRemove.displayName = 'ComboboxChipRemove';
