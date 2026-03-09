import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Select } from '../../Select';
import type { SelectProps, SelectSize, SelectVariant } from '../../Select';
import { FieldDescription } from '../FieldDescription';
import { FieldError } from '../FieldError';
import { FieldLabel } from '../FieldLabel';
import { FieldRoot } from '../FieldRoot';

export type SelectFieldVariant = SelectVariant;
export type SelectFieldSize = SelectSize;

export interface SelectFieldProps<TValue extends string | number>
  extends Omit<Field.Root.Props, 'onChange'>,
    Pick<
      SelectProps<TValue>,
      | 'variant'
      | 'size'
      | 'placeholder'
      | 'options'
      | 'value'
      | 'onValueChange'
      | 'children'
      | 'trigger'
      | 'valueColor'
    > {
  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Label text. Can be an i18n key.
   */
  label?: TranslationKey;

  /*
   * Helper text displayed below the select.
   * Hidden when error is present.
   * Can be an i18n key.
   */
  description?: TranslationKey;

  /*
   * Error message. Also sets the field to invalid state.
   * Can be an i18n key.
   */
  error?: TranslationKey;
}

/**
 * Renders a select input with an optional label, description,
 * and error message.
 */
export const SelectField = React.forwardRef<
  HTMLDivElement,
  SelectFieldProps<string | number>
>(
  (
    {
      className,
      children,
      description,
      disabled,
      error,
      label,
      onValueChange,
      options,
      placeholder,
      size = 'lg',
      trigger,
      value,
      valueColor,
      variant = 'outline',
      ...other
    },
    ref,
  ) => {
    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={!!error}
        {...other}
      >
        {label && <FieldLabel label={label} />}

        <Select
          variant={variant}
          size={size}
          placeholder={placeholder}
          options={options}
          value={value}
          onValueChange={onValueChange}
          trigger={trigger}
          valueColor={valueColor}
        >
          {children}
        </Select>

        {description && !error && (
          <FieldDescription description={description} />
        )}
        {error && <FieldError error={error} />}
      </FieldRoot>
    );
  },
);

SelectField.displayName = 'SelectField';
