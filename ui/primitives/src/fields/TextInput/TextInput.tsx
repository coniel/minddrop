import { Input } from '@base-ui/react/input';
import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { TextColor, TextSize, TextWeight } from '../../Text';
import { propsToClass } from '../../utils';
import './TextInput.css';

export type TextInputVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps {
  /*
   * Class name applied to the wrapper element.
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
  variant?: TextInputVariant;

  /*
   * Height of the input. Matches Button/Select sizes exactly.
   * - `sm` — 1.5rem (24px)
   * - `md` — 1.75rem (28px)
   * - `lg` — 2.25rem (36px)
   * @default 'lg'
   */
  size?: TextInputSize;

  /*
   * Font weight. Only meaningful for the ghost variant.
   */
  weight?: TextWeight;

  /*
   * Font size token. Only meaningful for the ghost variant.
   */
  textSize?: TextSize;

  /*
   * Text color. Only meaningful for the ghost variant.
   */
  color?: TextColor;

  /*
   * Element rendered before the input.
   * For decorative icons and prefixes.
   */
  leading?: React.ReactNode;

  /*
   * Element rendered after the input.
   * For clear buttons, toggles, units.
   */
  trailing?: React.ReactNode;

  /*
   * Marks the input as invalid (applies error styling).
   */
  invalid?: boolean;

  /*
   * Disables the input.
   */
  disabled?: boolean;

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
   * HTML name attribute.
   */
  name?: string;

  /*
   * Native change event handler.
   */
  onChange?: Input.Props['onChange'];

  /*
   * Callback fired with the new string value on change.
   */
  onValueChange?: Input.Props['onValueChange'];

  /*
   * Focus event handler.
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;

  /*
   * Blur event handler.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  /*
   * Key down event handler.
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      autoComplete,
      className,
      color,
      defaultValue,
      disabled,
      invalid,
      leading,
      name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onValueChange,
      placeholder,
      size = 'lg',
      textSize,
      trailing,
      type = 'text',
      value,
      variant = 'outline',
      weight,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    return (
      <label
        className={propsToClass('text-input', {
          variant,
          size,
          weight,
          color: textSize ? color : undefined,
          invalid,
          className,
        })}
      >
        {leading && <div className="text-input-leading">{leading}</div>}
        <Input
          ref={ref}
          className="text-input-input"
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder ? t(placeholder) : undefined}
          autoComplete={autoComplete}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onValueChange={onValueChange}
          disabled={disabled}
        />
        {trailing && (
          <div className="text-input-trailing text-input-trailing-interactive">
            {trailing}
          </div>
        )}
      </label>
    );
  },
);

TextInput.displayName = 'TextInput';
