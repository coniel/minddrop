import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import React, { useCallback } from 'react';
import { ToggleSize } from '../Toggle';
import { propsToClass } from '../utils';
import './RadioToggleGroup.css';

export interface RadioToggleGroupProps<Value extends string = string> {
  /*
   * Currently selected value (controlled).
   */
  value?: Value;

  /*
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: Value;

  /*
   * Callback fired when the selection changes.
   * Never called with an empty value — clicking the active
   * toggle has no effect.
   */
  onValueChange?: (value: Value) => void;

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

  /*
   * Ref forwarded to the root element.
   */
  ref?: React.Ref<HTMLDivElement>;
}

export function RadioToggleGroup<Value extends string>({
  ref,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  disabled,
  className,
  children,
}: RadioToggleGroupProps<Value>) {
  // Base UI ToggleGroup uses Value[]. We unwrap to/from single
  // value and prevent deselection by ignoring empty arrays.
  const handleValueChange = useCallback(
    (next: Value[]) => {
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
}

RadioToggleGroup.displayName = 'RadioToggleGroup';
