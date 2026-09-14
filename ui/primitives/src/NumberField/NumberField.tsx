import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import type { TextSize } from '../Text';
import { FieldError } from '../fields/FieldError';
import { FieldLabel } from '../fields/FieldLabel';
import { FieldRoot } from '../fields/FieldRoot';
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
    },
    ref,
  ) => {
    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={!!error || !!stringError}
      >
        {(label || stringLabel) && (
          <FieldLabel
            size={labelSize}
            label={label}
            stringLabel={stringLabel}
          />
        )}

        <NumberInput
          variant={variant}
          size={size}
          stepper={stepper}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          min={min}
          max={max}
          step={step}
          decimals={decimals}
          placeholder={placeholder}
          disabled={disabled}
          invalid={!!error || !!stringError}
          leading={leading}
          trailing={trailing}
          clearable={clearable}
          onBlur={onBlur}
        />

        {(error || stringError) && (
          <FieldError error={error} stringError={stringError} />
        )}
      </FieldRoot>
    );
  },
);

NumberField.displayName = 'NumberField';
