import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
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

export type TextFieldVariant = TextInputVariant;
export type TextFieldSize = TextInputSize;

export interface TextFieldProps
  extends Omit<Field.Root.Props, 'onChange'>,
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
      | 'onChange'
      | 'onValueChange'
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
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      autoComplete,
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
      leading,
      onChange,
      onValueChange,
      placeholder,
      stringPlaceholder,
      size = 'lg',
      textSize,
      trailing,
      type = 'text',
      value,
      variant = 'outline',
      weight,
      ...other
    },
    ref,
  ) => {
    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={!!error || !!stringError}
        {...other}
      >
        {(label || stringLabel) && (
          <FieldLabel label={label} stringLabel={stringLabel} />
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
          onChange={onChange}
          onValueChange={onValueChange}
          invalid={!!error || !!stringError}
          disabled={disabled}
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

TextField.displayName = 'TextField';
