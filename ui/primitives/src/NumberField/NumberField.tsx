import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
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
  className?: string;
  label?: TranslationKey;
  error?: TranslationKey;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      variant,
      size,
      label,
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
        invalid={!!error}
      >
        {label && <FieldLabel label={label} />}

        <NumberInput
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          min={min}
          max={max}
          step={step}
          decimals={decimals}
          placeholder={placeholder}
          disabled={disabled}
          invalid={!!error}
          leading={leading}
          trailing={trailing}
          clearable={clearable}
          onBlur={onBlur}
        />

        {error && <FieldError error={error} />}
      </FieldRoot>
    );
  },
);

NumberField.displayName = 'NumberField';
