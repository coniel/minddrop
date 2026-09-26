import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import type { TextSize } from '../../Text';
import { FieldDescription } from '../FieldDescription';
import { FieldError } from '../FieldError';
import { FieldLabel } from '../FieldLabel';
import { FieldRoot } from '../FieldRoot';
import { TextInput } from '../TextInput';
import type {
  TextInputProps,
  TextInputSize,
  TextInputVariant,
} from '../TextInput';
import { FieldValidate, useFieldValidation } from '../useFieldValidation';

export type TextFieldVariant = TextInputVariant;
export type TextFieldSize = TextInputSize;

export interface TextFieldProps
  extends Omit<Field.Root.Props, 'onChange' | 'onKeyDown' | 'validate'>,
    Pick<
      TextInputProps,
      | 'variant'
      | 'size'
      | 'weight'
      | 'textSize'
      | 'color'
      | 'leading'
      | 'trailing'
      | 'type'
      | 'value'
      | 'defaultValue'
      | 'placeholder'
      | 'autoComplete'
      | 'autoFocus'
      | 'unassisted'
      | 'onChange'
      | 'onValueChange'
      | 'onKeyDown'
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

  /*
   * Plain string placeholder used as-is without i18n translation.
   * Takes priority over `placeholder`.
   */
  stringPlaceholder?: string;

  /**
   * Checks the value when Enter is pressed or the input loses focus.
   * Returns the error to reject it with, or false to accept it. The
   * error is shown until the value changes, and takes priority over
   * `error` and `stringError` while shown.
   */
  validate?: FieldValidate<string>;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      autoComplete,
      autoFocus,
      className,
      color,
      defaultValue,
      description,
      stringDescription,
      disabled,
      error,
      stringError,
      label,
      stringLabel,
      labelSize,
      leading,
      onChange,
      onKeyDown,
      onValueChange,
      placeholder,
      stringPlaceholder,
      size = 'lg',
      textSize,
      trailing,
      type = 'text',
      unassisted,
      validate,
      value,
      variant = 'outline',
      weight,
      ...other
    },
    ref,
  ) => {
    // Keep the error the value is rejected with
    const validation = useFieldValidation(validate);

    // Check whether an error is shown
    const hasError = !!validation.errorText || !!error || !!stringError;

    // Clear the validation error once the value changes
    function handleValueChange(newValue: string) {
      validation.clearError();
      onValueChange?.(newValue);
    }

    // Validate the value when Enter is pressed
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        validation.validate(event.currentTarget.value);
      }
    }

    // Validate the value when the input loses focus
    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
      validation.validate(event.currentTarget.value);
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
          <FieldLabel
            size={labelSize}
            label={label}
            stringLabel={stringLabel}
          />
        )}

        <TextInput
          variant={variant}
          size={size}
          weight={weight}
          color={color}
          textSize={textSize}
          leading={leading}
          trailing={trailing}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          stringPlaceholder={stringPlaceholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          unassisted={unassisted}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onValueChange={handleValueChange}
          invalid={hasError}
          disabled={disabled}
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

TextField.displayName = 'TextField';
