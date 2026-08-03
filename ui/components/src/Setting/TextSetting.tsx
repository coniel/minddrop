import { FocusEventHandler } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  TextInput,
  TextInputSize,
  TextInputVariant,
} from '@minddrop/ui-primitives';
import { Setting, SettingProps } from './Setting';

export interface TextSettingProps extends Omit<SettingProps, 'control'> {
  /**
   * The current input value.
   */
  value: string;

  /**
   * Callback fired with the new value on change.
   */
  onValueChange: (value: string) => void;

  /**
   * Blur event handler, typically used to commit the value.
   */
  onBlur?: FocusEventHandler<HTMLInputElement>;

  /**
   * Placeholder text shown when the input is empty.
   */
  placeholder?: TranslationKey;

  /**
   * Visual style of the input.
   * @default 'filled'
   */
  variant?: TextInputVariant;

  /**
   * Height of the input.
   * @default 'md'
   */
  size?: TextInputSize;

  /**
   * Applies error styling to the input.
   */
  invalid?: boolean;

  /**
   * Disables the input.
   */
  disabled?: boolean;
}

/**
 * A settings row with a text input control.
 */
export const TextSetting: React.FC<TextSettingProps> = ({
  value,
  onValueChange,
  onBlur,
  placeholder,
  variant = 'filled',
  size = 'md',
  invalid,
  disabled,
  ...settingProps
}) => {
  return (
    <Setting
      {...settingProps}
      control={
        <TextInput
          className="setting-control-text"
          value={value}
          onValueChange={onValueChange}
          onBlur={onBlur}
          placeholder={placeholder}
          variant={variant}
          size={size}
          invalid={invalid}
          disabled={disabled}
        />
      }
    />
  );
};
