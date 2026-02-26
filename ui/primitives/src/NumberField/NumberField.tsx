import React from 'react';
import { FieldRoot } from '../fields/FieldRoot';
import { FieldLabel } from '../fields/FieldLabel';
import { FieldError } from '../fields/FieldError';
import { NumberInput } from './NumberInput';
import type { NumberInputVariant, NumberInputSize, NumberInputProps } from './NumberInput';

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
  > {
  className?: string;
  label?: string;
  error?: string;
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
        />

        {error && <FieldError error={error} />}
      </FieldRoot>
    );
  },
);

NumberField.displayName = 'NumberField';
