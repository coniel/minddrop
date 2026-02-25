import React from 'react';
import { Field } from '@base-ui/react/field';
import { FieldRoot } from '../FieldRoot';
import { FieldLabel } from '../FieldLabel';
import { FieldDescription } from '../FieldDescription';
import { FieldError } from '../FieldError';
import { TextInput } from '../TextInput';
import type { TextInputVariant, TextInputSize, TextInputProps } from '../TextInput';

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
  label?: string;

  /*
   * Helper text displayed below the input.
   * Hidden when error is present.
   * Can be an i18n key.
   */
  description?: string;

  /*
   * Error message. Also sets the field to invalid state.
   * Can be an i18n key.
   */
  error?: string;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      autoComplete,
      className,
      color,
      defaultValue,
      description,
      disabled,
      error,
      label,
      leading,
      onChange,
      onValueChange,
      placeholder,
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
        invalid={!!error}
        {...other}
      >
        {label && <FieldLabel label={label} />}

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
          autoComplete={autoComplete}
          onChange={onChange}
          onValueChange={onValueChange}
          invalid={!!error}
          disabled={disabled}
        />

        {description && !error && (
          <FieldDescription description={description} />
        )}
        {error && <FieldError error={error} />}
      </FieldRoot>
    );
  },
);

TextField.displayName = 'TextField';
