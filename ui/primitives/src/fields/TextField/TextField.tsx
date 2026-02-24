import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { TextColor, TextSize, TextWeight } from '../../Text';
import { propsToClass } from '../../utils';
import './TextField.css';

export type TextFieldVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps extends Omit<Field.Root.Props, 'onChange'> {
  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Visual style of the input. Matches Button/Select variants.
   * - `ghost`   — invisible until focused, for inline editing
   * - `subtle`  — subtle surface fill
   * - `outline` — bordered, no background
   * - `filled`  — surface-paper background with shadow
   * @default 'outline'
   */
  variant?: TextFieldVariant;

  /*
   * Height of the input. Matches Button/Select sizes exactly.
   * - `sm` — 1.5rem (24px)
   * - `md` — 1.75rem (28px)
   * - `lg` — 2.25rem (36px)
   * @default 'lg'
   */
  size?: TextFieldSize;

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

  /*
   * Input type.
   * @default 'text'
   */
  type?: Input.Props['type'];

  /*
   * Controlled value.
   */
  value?: Input.Props['value'];

  /*
   * Default value for uncontrolled usage.
   */
  defaultValue?: Input.Props['defaultValue'];

  /*
   * Placeholder text. Can be an i18n key.
   */
  placeholder?: Input.Props['placeholder'];

  /*
   * autoComplete attribute.
   */
  autoComplete?: Input.Props['autoComplete'];

  /*
   * Native change event handler.
   */
  onChange?: Input.Props['onChange'];

  /*
   * Callback fired with the new string value on change.
   */
  onValueChange?: Input.Props['onValueChange'];

  /*
   * Element rendered before the input.
   * Pointer events disabled — for decorative icons and prefixes.
   */
  leading?: React.ReactNode;

  /*
   * Element rendered after the input.
   * Pointer events enabled — for clear buttons, toggles, units.
   */
  trailing?: React.ReactNode;

  /* --- Ghost variant props --- */

  /*
   * Font size token. Only meaningful for the ghost variant.
   */
  textSize?: TextSize;

  /*
   * Font weight. Only meaningful for the ghost variant.
   */
  weight?: TextWeight;

  /*
   * Text color. Only meaningful for the ghost variant.
   */
  color?: TextColor;
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
    const { t } = useTranslation();

    return (
      <Field.Root
        ref={ref}
        className={propsToClass('text-field', {
          variant,
          size,
          weight,
          color: textSize ? color : undefined,
          invalid: !!error,
          className,
        })}
        disabled={disabled}
        invalid={!!error}
        {...other}
      >
        {label && (
          <Field.Label className="text-field-label">{t(label)}</Field.Label>
        )}

        <div className="text-field-input-wrapper">
          {leading && <div className="text-field-leading">{leading}</div>}
          <Input
            className="text-field-input"
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder ? t(placeholder) : undefined}
            autoComplete={autoComplete}
            onChange={onChange}
            onValueChange={onValueChange}
          />
          {trailing && (
            <div className="text-field-trailing text-field-trailing-interactive">
              {trailing}
            </div>
          )}
        </div>

        {description && !error && (
          <Field.Description className="text-field-description">
            {t(description)}
          </Field.Description>
        )}
        {error && <div className="text-field-error">{t(error)}</div>}
      </Field.Root>
    );
  },
);

TextField.displayName = 'TextField';
