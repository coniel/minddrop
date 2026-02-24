import React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { propsToClass } from '../utils';
import { ToggleSize } from '../Toggle';
import './ToggleGroup.css';

export interface ToggleGroupProps {
  /*
   * Currently pressed values (controlled).
   */
  value?: string[];

  /*
   * Default pressed values for uncontrolled usage.
   */
  defaultValue?: string[];

  /*
   * Callback fired when the selection changes.
   */
  onValueChange?: (value: string[]) => void;

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

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
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
  ) => (
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
  ),
);

ToggleGroup.displayName = 'ToggleGroup';
