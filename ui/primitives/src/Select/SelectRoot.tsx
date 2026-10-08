import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useCallback } from 'react';
import { useHoverMenuContext } from '../HoverMenuContext';

/* --- SelectRoot ---
   Wraps Select.Root with a null-guard on the value change callback.
   Opened from inside a hover menu, it locks that menu open. */

export interface SelectRootProps<TValue extends string | number> {
  /*
   * The items for the select. Required for virtual scrolling.
   */
  items?: { value: TValue; label: string }[];

  /*
   * The controlled value of the select.
   */
  value?: TValue;

  /*
   * Callback fired when the selected value changes.
   * Null values are filtered out before calling this.
   */
  onValueChange?: (value: TValue) => void;

  /*
   * Whether the select is disabled.
   */
  disabled?: boolean;

  /*
   * The select content.
   */
  children: React.ReactNode;
}

export const SelectRoot = <TValue extends string | number = string>({
  items,
  value,
  onValueChange,
  disabled,
  children,
  ...other
}: SelectRootProps<TValue>) => {
  const hoverMenu = useHoverMenuContext();

  // Guard against null values from Base UI
  const handleValueChange = useCallback(
    (newValue: TValue | null) => {
      if (newValue == null) {
        return;
      }

      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  // Lock the enclosing hover menu open once the select opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        hoverMenu?.lock();
      }
    },
    [hoverMenu],
  );

  return (
    <SelectPrimitive.Root
      {...(items && items.length > 0 ? { items } : {})}
      value={value}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      {...other}
    >
      {children}
    </SelectPrimitive.Root>
  );
};
