import React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { propsToClass } from '../utils';
import { ToggleSize } from '../Toggle';
import './ToggleGroup.css';

export interface ToggleGroupProps<Value extends string = string> {
  /*
   * Currently pressed values (controlled).
   */
  value?: Value[];

  /*
   * Default pressed values for uncontrolled usage.
   */
  defaultValue?: Value[];

  /*
   * Callback fired when the selection changes.
   */
  onValueChange?: (value: Value[]) => void;

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

export function ToggleGroup<Value extends string>({
  ref,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  disabled,
  className,
  children,
}: ToggleGroupProps<Value>) {
  return (
    <ToggleGroupPrimitive
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={propsToClass('toggle-group', { size, className })}
    >
      {children}
    </ToggleGroupPrimitive>
  );
}

ToggleGroup.displayName = 'ToggleGroup';
