import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import type { TextSize } from '../../Text';
import {
  ChipsInput,
  ChipsInputProps,
  ChipsInputSize,
  ChipsInputVariant,
} from '../ChipsInput';
import { FieldDescription } from '../FieldDescription';
import { FieldError } from '../FieldError';
import { FieldLabel } from '../FieldLabel';
import { FieldRoot } from '../FieldRoot';
import { FieldValidate, useFieldValidation } from '../useFieldValidation';

export type ChipsFieldVariant = ChipsInputVariant;
export type ChipsFieldSize = ChipsInputSize;

export interface ChipsFieldProps
  extends Omit<Field.Root.Props, 'onChange' | 'validate'>,
    Pick<
      ChipsInputProps,
      | 'variant'
      | 'size'
      | 'value'
      | 'onValueChange'
      | 'normalize'
      | 'splitOnSpace'
      | 'onInputValueChange'
      | 'placeholder'
      | 'stringPlaceholder'
      | 'autoFocus'
    > {
  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
   * Label text.
   */
  label?: TranslationKey;

  /**
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Size of the label text.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /**
   * Helper text displayed below the input. Hidden when an error is
   * present.
   */
  description?: TranslationKey;

  /**
   * Plain string description rendered as-is without i18n
   * translation. Takes priority over `description`.
   */
  stringDescription?: string;

  /**
   * Error message. Also sets the field to invalid state. A validation
   * error takes priority over it.
   */
  error?: TranslationKey;

  /**
   * Plain string error rendered as-is without i18n translation.
   * Takes priority over `error`. A validation error takes priority
   * over it.
   */
  stringError?: string;

  /**
   * Checks a typed value, after `normalize`, before it is added.
   * Returns the error to reject it with, or false to accept it. A
   * rejected value stays in the input, and its error is shown until
   * the typed text changes.
   */
  validate?: FieldValidate<string>;
}

/**
 * Renders a labelled chips input with a description or error.
 */
export const ChipsField = React.forwardRef<HTMLDivElement, ChipsFieldProps>(
  (
    {
      autoFocus,
      className,
      description,
      stringDescription,
      disabled,
      error,
      stringError,
      label,
      stringLabel,
      labelSize,
      normalize,
      onInputValueChange,
      onValueChange,
      placeholder,
      stringPlaceholder,
      size = 'lg',
      splitOnSpace,
      validate,
      value,
      variant = 'outline',
      ...other
    },
    ref,
  ) => {
    // Keep the error a typed value is rejected with
    const validation = useFieldValidation(validate);

    // Check whether an error is shown
    const hasError = !!validation.errorText || !!error || !!stringError;

    // Clear the validation error once the typed text changes
    function handleInputValueChange(inputValue: string) {
      validation.clearError();
      onInputValueChange?.(inputValue);
    }

    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={hasError}
        {...other}
      >
        {/* Label */}
        {(label || stringLabel) && (
          <FieldLabel
            size={labelSize}
            label={label}
            stringLabel={stringLabel}
          />
        )}

        {/* Chips input */}
        <ChipsInput
          variant={variant}
          size={size}
          value={value}
          onValueChange={onValueChange}
          normalize={normalize}
          validate={validation.validate}
          splitOnSpace={splitOnSpace}
          onInputValueChange={handleInputValueChange}
          placeholder={placeholder}
          stringPlaceholder={stringPlaceholder}
          autoFocus={autoFocus}
          invalid={hasError}
          disabled={disabled}
        />

        {/* Description, hidden while an error is shown */}
        {(description || stringDescription) && !hasError && (
          <FieldDescription
            description={description}
            stringDescription={stringDescription}
          />
        )}

        {/* Error, the validation error before the given one */}
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

ChipsField.displayName = 'ChipsField';
