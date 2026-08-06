import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { FieldDescription } from '../fields/FieldDescription';
import { FieldError } from '../fields/FieldError';
import { FieldLabel } from '../fields/FieldLabel';
import { FieldRoot } from '../fields/FieldRoot';
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
}

/** Renders a date input with an optional label, description, and error message. */
export const DateField = React.forwardRef<HTMLDivElement, DateFieldProps>(
  (
    {
      className,
      label,
      stringLabel,
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
          <FieldLabel label={label} stringLabel={stringLabel} />
        )}

        <DateInput
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          placeholder={placeholder}
          stringPlaceholder={stringPlaceholder}
          invalid={!!error}
          disabled={disabled}
          clearable={clearable}
          formatDate={formatDate}
          side={side}
          align={align}
        />

        {(description || stringDescription) && !error && !stringError && (
          <FieldDescription
            description={description}
            stringDescription={stringDescription}
          />
        )}
        {(error || stringError) && (
          <FieldError error={error} stringError={stringError} />
        )}
      </FieldRoot>
    );
  },
);

DateField.displayName = 'DateField';
