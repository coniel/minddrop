import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { SelectItem } from './SelectItem';
import './Select.css';

export interface SelectOption<TValue extends string | number> {
  label: string;
  value: TValue;
}

export interface SelectProps<TValue extends string | number> {
  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
   * Placeholder text. Can be an i18n key.
   */
  placeholder?: string;

  /**
   * The options to display in the select.
   */
  options?: SelectOption<TValue>[];

  /**
   * The value of the select.
   */
  value?: TValue;

  /**
   * Callback fired when the value of the select changes.
   */
  onValueChange?: (value: TValue) => void;

  /**
   * Allows rendering custom select items. If provided, the `options` prop is
   * ignored.
   */
  children?: React.ReactNode;
}

export const Select = <TValue extends string | number = string>({
  className,
  options = [],
  placeholder,
  onValueChange,
  value,
  children,
  ...other
}: SelectProps<TValue>) => {
  const { t } = useTranslation();

  const handleValueChange = useCallback(
    (newValue: TValue | null) => {
      if (!newValue) {
        return;
      }

      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  return (
    <SelectPrimitive.Root
      items={options}
      value={value}
      onValueChange={handleValueChange}
      {...other}
    >
      <SelectPrimitive.Trigger className="select">
        <SelectPrimitive.Value
          className="value"
          placeholder={placeholder ? t(placeholder) : undefined}
        />
        <SelectPrimitive.Icon className="select-icon">
          <Icon name="chevron-down" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="positioner" sideOffset={8}>
          <SelectPrimitive.Popup className="popup">
            <SelectPrimitive.ScrollUpArrow className="scroll-arrow" />
            <SelectPrimitive.List className="list">
              {children
                ? children
                : options.map(({ label, value }) => (
                    <SelectItem key={label} label={label} value={value} />
                  ))}
            </SelectPrimitive.List>
            <SelectPrimitive.ScrollDownArrow className="scroll-arrow" />
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};
