import {
  ToggleGroup as ToggleGroupPrimitive,
  ToggleGroupProps as ToggleGroupPrimitiveProps,
} from '@base-ui/react/toggle-group';
import { useCallback } from 'react';
import { mapPropsToClasses } from '../utils';
import './ToggleGroup.css';

export interface ToggleGroupProps<TValue extends string>
  extends Omit<
    ToggleGroupPrimitiveProps<TValue>,
    'onValueChange' | 'value' | 'defaultValue'
  > {
  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
   * The value of the toggle group.
   */
  value?: TValue;

  /**
   * Callback fired when the value of the toggle group changes.
   */
  onValueChange?: (value: TValue) => void;
}

export const ToggleGroup = <TValue extends string>({
  children,
  className,
  onValueChange,
  value,
  ...other
}: ToggleGroupProps<TValue>) => {
  // The primitive uses an array for the value, but we only want to
  // support a single value. This callback ensures that the value
  // is always a single value.
  const handleValueChange = useCallback(
    (newValue: TValue[]) => {
      // Prevent empty value when clicking on the already selected value
      if (!newValue.length) {
        return;
      }

      onValueChange?.(newValue[0]);
    },
    [onValueChange],
  );

  return (
    <ToggleGroupPrimitive
      className={mapPropsToClasses({ className }, 'toggle-group')}
      onValueChange={handleValueChange}
      value={value ? [value] : []}
      {...other}
    >
      {children}
    </ToggleGroupPrimitive>
  );
};
