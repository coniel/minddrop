import { MouseEventHandler } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  Button,
  ButtonColor,
  ButtonDanger,
  ButtonVariant,
  IconProp,
} from '@minddrop/ui-primitives';
import { Setting, SettingProps } from './Setting';

export interface ButtonSettingProps extends Omit<SettingProps, 'control'> {
  /**
   * The button label.
   */
  buttonLabel: TranslationKey;

  /**
   * Callback fired when the button is clicked.
   */
  onClick: MouseEventHandler<HTMLButtonElement>;

  /**
   * Visual style of the button.
   * @default 'filled'
   */
  variant?: ButtonVariant;

  /**
   * Color role of the button.
   */
  color?: ButtonColor;

  /**
   * Applies danger styling, shown on hover or always.
   */
  danger?: ButtonDanger;

  /**
   * Icon placed before the button label.
   */
  startIcon?: IconProp;

  /**
   * Disables the button.
   */
  disabled?: boolean;
}

/**
 * A settings row with a button control.
 */
export const ButtonSetting: React.FC<ButtonSettingProps> = ({
  buttonLabel,
  onClick,
  variant = 'filled',
  color,
  danger,
  startIcon,
  disabled,
  ...settingProps
}) => {
  return (
    <Setting
      {...settingProps}
      control={
        <Button
          label={buttonLabel}
          onClick={onClick}
          variant={variant}
          color={color}
          danger={danger}
          startIcon={startIcon}
          disabled={disabled}
        />
      }
    />
  );
};
