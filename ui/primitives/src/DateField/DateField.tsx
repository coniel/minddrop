import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import type { TextSize } from '../Text';
import { FieldDescription } from '../fields/FieldDescription';
import { FieldError } from '../fields/FieldError';
import { FieldLabel } from '../fields/FieldLabel';
import { FieldRoot } from '../fields/FieldRoot';
import {
  FieldValidate,
  useFieldValidation,
} from '../fields/useFieldValidation';
import { DateInput } from './DateInput';
import type {
  DateInputProps,
  DateInputSize,
  DateInputVariant,
} from './DateInput';

export type DateFieldVariant = DateInputVariant;
export type DateFieldSize = DateInputSize;

export interface DateFieldProps
  extends Pick<
    DateInputProps,
    | 'variant'
    | 'size'
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'placeholder'
    | 'clearable'
    | 'formatDate'
    | 'side'
    | 'align'
  > {
  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
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
   * Plain string placeholder used as-is without i18n translation.
   * Takes priority over `placeholder`.
   */
  stringPlaceholder?: string;

  /**
   * Helper text displayed below the input.
   * Hidden when error is present.
   * Can be an i18n key.
   */
  description?: TranslationKey;

  /*
   * Plain string description rendered as-is without i18n translation.
   * Takes priority over `description`.
   */
  stringDescription?: string;

  /**
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
   * Disables the field.
   */
  disabled?: boolean;

  /**
   * Checks each date as it is picked or cleared. Returns the error to
   * reject it with, or false to accept it. The error is shown until an
   * accepted date is picked, and takes priority over `error` and
   * `stringError` while shown.
   */
  validate?: FieldValidate<Date | null>;
}

/** Renders a date input with an optional label, description, and error message. */
export const DateField = React.forwardRef<HTMLDivElement, DateFieldProps>(
  (
    {
      className,
      label,
      stringLabel,
      labelSize,
      description,
      stringDescription,
      error,
      stringError,
      disabled,
      variant = 'outline',
      size = 'lg',
      value,
      defaultValue,
      onValueChange,
      placeholder,
      stringPlaceholder,
      clearable,
      formatDate,
      side,
      align,
      validate,
    },
    ref,
  ) => {
    // Keep the error the date is rejected with
    const validation = useFieldValidation(validate);

    // Check whether an error is shown
    const hasError = !!validation.errorText || !!error || !!stringError;

    // Validate each picked or cleared date
    function handleValueChange(date: Date | null) {
      validation.validate(date);
      onValueChange?.(date);
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
          />
        )}

        <DateInput
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          placeholder={placeholder}
          stringPlaceholder={stringPlaceholder}
          invalid={hasError}
          disabled={disabled}
          clearable={clearable}
          formatDate={formatDate}
          side={side}
          align={align}
        />

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
  },
);

DateField.displayName = 'DateField';
