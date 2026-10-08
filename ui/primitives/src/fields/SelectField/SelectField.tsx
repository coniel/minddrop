import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Select } from '../../Select';
import type { SelectProps, SelectSize, SelectVariant } from '../../Select';
import type { TextSize } from '../../Text';
import { FieldDescription } from '../FieldDescription';
import { FieldError } from '../FieldError';
import { FieldLabel } from '../FieldLabel';
import { FieldRoot } from '../FieldRoot';
import { FieldValidate, useFieldValidation } from '../useFieldValidation';

export type SelectFieldVariant = SelectVariant;
export type SelectFieldSize = SelectSize;

export interface SelectFieldProps<TValue extends string | number>
  extends Omit<Field.Root.Props, 'onChange' | 'validate'>,
    Pick<
      SelectProps<TValue>,
      | 'variant'
      | 'size'
      | 'placeholder'
      | 'stringPlaceholder'
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

  /**
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /*
   * Size of the label text.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /*
   * Helper text displayed below the select.
   * Hidden when error is present.
   * Can be an i18n key.
   */
  description?: TranslationKey;

  /**
   * Plain string description rendered as-is without i18n
   * translation. Takes priority over `description`.
   */
  stringDescription?: string;

  /*
   * Error message. Also sets the field to invalid state.
   * Can be an i18n key.
   */
  error?: TranslationKey;

  /**
   * Plain string error rendered as-is without i18n translation.
   * Takes priority over `error`.
   */
  stringError?: string;

  /**
   * Checks each value as it is selected. Returns the error to reject
   * it with, or false to accept it. The error is shown until an
   * accepted value is selected, and takes priority over `error` and
   * `stringError` while shown.
   */
  validate?: FieldValidate<TValue>;

  /**
   * Ref to the root element.
   */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Renders a select input with an optional label, description,
 * and error message.
 */
export function SelectField<TValue extends string | number = string>({
  ref,
  className,
  children,
  description,
  stringDescription,
  disabled,
  error,
  stringError,
  label,
  stringLabel,
  labelSize,
  onValueChange,
  options,
  placeholder,
  stringPlaceholder,
  size = 'lg',
  trigger,
  value,
  validate,
  valueColor,
  variant = 'outline',
  ...other
}: SelectFieldProps<TValue>) {
  // Keep the error the value is rejected with
  const validation = useFieldValidation(validate);

  // Check whether an error is shown
  const hasError = !!validation.errorText || !!error || !!stringError;

  // Validate each selected value
  function handleValueChange(newValue: TValue) {
    validation.validate(newValue);
    onValueChange?.(newValue);
  }

  return (
    <FieldRoot
      ref={ref}
      className={className}
      disabled={disabled}
      invalid={hasError}
      {...other}
    >
      {(label || stringLabel) && (
        <FieldLabel size={labelSize} label={label} stringLabel={stringLabel} />
      )}

      <Select<TValue>
        variant={variant}
        size={size}
        placeholder={placeholder}
        stringPlaceholder={stringPlaceholder}
        options={options}
        value={value}
        onValueChange={handleValueChange}
        trigger={trigger}
        valueColor={valueColor}
      >
        {children}
      </Select>

      {(description || stringDescription) && !hasError && (
        <FieldDescription
          description={description}
          stringDescription={stringDescription}
        />
      )}
      {hasError && (
        <FieldError
          error={error}
          stringError={validation.errorText ?? stringError}
        />
      )}
    </FieldRoot>
  );
}

SelectField.displayName = 'SelectField';
