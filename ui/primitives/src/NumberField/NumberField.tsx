import React, { useRef } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import type { TextSize } from '../Text';
import { FieldError } from '../fields/FieldError';
import { FieldLabel } from '../fields/FieldLabel';
import { FieldRoot } from '../fields/FieldRoot';
import {
  FieldValidate,
  useFieldValidation,
} from '../fields/useFieldValidation';
import { NumberInput } from './NumberInput';
import type {
  NumberInputProps,
  NumberInputSize,
  NumberInputVariant,
} from './NumberInput';

export type NumberFieldVariant = NumberInputVariant;
export type NumberFieldSize = NumberInputSize;

export interface NumberFieldProps
  extends Pick<
    NumberInputProps,
    | 'variant'
    | 'size'
    | 'stepper'
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'min'
    | 'max'
    | 'step'
    | 'decimals'
    | 'placeholder'
    | 'disabled'
    | 'leading'
    | 'trailing'
    | 'clearable'
    | 'onBlur'
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
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /*
   * Size of the label text.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /**
   * Hides the label. Assistive technology still reads it.
   */
  hideLabel?: boolean;

  /*
   * Error message. Also sets the field to invalid state.
   * Can be an i18n key.
   */
  error?: TranslationKey;

  /*
   * Plain string error rendered as-is without i18n translation.
   * Takes priority over `error`.
   */
  stringError?: string;

  /**
   * Checks the value when the input loses focus. Returns the error to
   * reject it with, or false to accept it. The error is shown until
   * the value changes, and takes priority over `error` and
   * `stringError` while shown.
   */
  validate?: FieldValidate<number | null>;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      variant,
      size,
      stepper,
      label,
      stringLabel,
      labelSize,
      hideLabel,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step,
      decimals,
      placeholder,
      disabled,
      error,
      stringError,
      leading,
      trailing,
      clearable,
      onBlur,
      validate,
    },
    ref,
  ) => {
    // The value last reported by the input, validated on blur
    const latestValueRef = useRef(value ?? defaultValue ?? null);
    // Keep the error the value is rejected with
    const validation = useFieldValidation(validate);

    // Check whether an error is shown
    const hasError = !!validation.errorText || !!error || !!stringError;

    // Clear the validation error once the value changes
    function handleValueChange(newValue: number | null) {
      latestValueRef.current = newValue;
      validation.clearError();
      onValueChange?.(newValue);
    }

    // Validate the value when the input loses focus. A controlled
    // value is the current one.
    function handleBlur() {
      validation.validate(value !== undefined ? value : latestValueRef.current);
      onBlur?.();
    }

    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={hasError}
      >
        {(label || stringLabel) && (
          <FieldLabel
            size={labelSize}
            label={label}
            stringLabel={stringLabel}
            hidden={hideLabel}
          />
        )}

        <NumberInput
          variant={variant}
          size={size}
          stepper={stepper}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          decimals={decimals}
          placeholder={placeholder}
          disabled={disabled}
          invalid={hasError}
          leading={leading}
          trailing={trailing}
          clearable={clearable}
          onBlur={handleBlur}
        />

        {hasError && (
          <FieldError
            error={error}
            stringError={validation.errorText ?? stringError}
          />
        )}
      </FieldRoot>
    );
  },
);

NumberField.displayName = 'NumberField';
