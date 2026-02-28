import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useCallback } from 'react';

/* --- SelectRoot ---
   Wraps Select.Root with a null-guard on the value change callback. */

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
   * The select content.
   */
  children: React.ReactNode;
}

export const SelectRoot = <TValue extends string | number = string>({
  items,
  value,
  onValueChange,
  children,
  ...other
}: SelectRootProps<TValue>) => {
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

  return (
    <SelectPrimitive.Root
      {...(items && items.length > 0 ? { items } : {})}
      value={value}
      onValueChange={handleValueChange}
      {...other}
    >
      {children}
    </SelectPrimitive.Root>
  );
};
