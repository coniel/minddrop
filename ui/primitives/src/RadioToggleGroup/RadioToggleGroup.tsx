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
   * Callback fired when the selection changes. Never called with
   * an empty value.
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
  // value; pressing the active toggle reports an empty selection,
  // which a radio group ignores so a choice is always active.
  const handleValueChange = useCallback(
    (next: Value[]) => {
      // Ignore the empty selection from re-pressing the active toggle
      if (!next.length) {
        return;
      }

      onValueChange?.(next[0]);
    },
    [onValueChange],
  );

  // A group given a value stays controlled while nothing is
  // selected, so an empty selection cannot leave the toggles
  // running on their own state
  const selection = resolveSelection(value);

  return (
    <ToggleGroupPrimitive
      ref={ref}
      value={selection}
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

/**
 * Wraps the selected value in the array Base UI expects, leaving
 * groups without a `value` prop uncontrolled.
 */
function resolveSelection<Value extends string>(
  value: Value | undefined,
): Value[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  // An empty value selects nothing while staying controlled
  return value ? [value] : [];
}
