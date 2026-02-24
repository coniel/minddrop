import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import React, { useCallback } from 'react';
import { ToggleSize } from '../Toggle';
import { propsToClass } from '../utils';
import './RadioToggleGroup.css';

export interface RadioToggleGroupProps {
  /*
   * Currently selected value (controlled).
   */
  value?: string;

  /*
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /*
   * Callback fired when the selection changes.
   * Never called with an empty value — clicking the active
   * toggle has no effect.
   */
  onValueChange?: (value: string) => void;

  /*
   * Size of the group container. Child Toggles are sized down
   * slightly to leave breathing room within the container.
   * @default 'md'
   */
  size?: ToggleSize;

  /*
   * Prevents interaction on all child Toggles.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Toggle children.
   */
  children: React.ReactNode;
}

export const RadioToggleGroup = React.forwardRef<
  HTMLDivElement,
  RadioToggleGroupProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      size = 'md',
      disabled,
      className,
      children,
    },
    ref,
  ) => {
    // Base UI ToggleGroup uses string[]. We unwrap to/from single
    // value and prevent deselection by ignoring empty arrays.
    const handleValueChange = useCallback(
      (next: string[]) => {
        if (!next.length) return;
        onValueChange?.(next[0]);
      },
      [onValueChange],
    );

    return (
      <ToggleGroupPrimitive
        ref={ref}
        value={value ? [value] : undefined}
        defaultValue={defaultValue ? [defaultValue] : undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={propsToClass('radio-toggle-group', { size, className })}
      >
        {children}
      </ToggleGroupPrimitive>
    );
  },
);

RadioToggleGroup.displayName = 'RadioToggleGroup';
