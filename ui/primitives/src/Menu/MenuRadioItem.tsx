import React from 'react';
import { MenuItem, MenuItemProps } from './MenuItem';
import { useMenuRadioGroupContext } from './MenuRadioGroup';

/* ============================================================
   MENU RADIO ITEM
   Convenience wrapper around MenuItem that renders a radio
   circle indicator on the right (via trailingIcon). The dot
   inside the circle can be:
   - Automatic: reads checked state from MenuRadioGroupContext
   - Custom: pass an `indicator` (e.g. Base UI RadioItemIndicator)
   ============================================================ */

export interface MenuRadioItemProps
  extends Omit<MenuItemProps, 'active' | 'trailingIcon'> {
  /*
   * The value this item represents within a radio group.
   */
  value: string;

  /*
   * Custom indicator rendered inside the radio circle.
   * When provided, context-based checked state is not used
   * for the dot — the caller controls indicator visibility.
   */
  indicator?: React.ReactNode;
}

export const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  MenuRadioItemProps
>(({ value, indicator, disabled, ...other }, ref) => {
  /* Read standalone context if available */
  const context = useMenuRadioGroupContext();

  /* Determine checked state from context (standalone mode) */
  const checked = context ? context.value === value : false;

  /* Click handler for standalone mode — selects this value */
  const handleClick = () => {
    if (disabled || !context) {
      return;
    }

    context.onValueChange(value);
  };

  /* Dot content: use custom indicator if provided,
     otherwise render dot based on context checked state */
  const dotContent =
    indicator ?? (checked ? <span className="menu-item-radio-dot" /> : null);

  return (
    <MenuItem
      {...other}
      ref={ref}
      role={context ? 'menuitemradio' : undefined}
      aria-checked={context ? checked : undefined}
      disabled={disabled}
      trailingIcon={
        <span className="menu-item-radio-indicator">
          <span className="menu-item-radio-circle">{dotContent}</span>
        </span>
      }
      onClick={context ? handleClick : undefined}
    />
  );
});

MenuRadioItem.displayName = 'MenuRadioItem';
