import { Switch, SwitchSize } from '@minddrop/ui-primitives';
import { Setting, SettingProps } from './Setting';

export interface SwitchSettingProps extends Omit<SettingProps, 'control'> {
  /**
   * Whether the switch is on.
   */
  checked?: boolean;

  /**
   * Callback fired when the switch is toggled.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Size of the switch.
   */
  size?: SwitchSize;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;
}

/**
 * A settings row with a toggle switch control.
 */
export const SwitchSetting: React.FC<SwitchSettingProps> = ({
  checked,
  onCheckedChange,
  size,
  disabled,
  ...settingProps
}) => {
  return (
    // Render as a label so clicking the title or description toggles the switch
    <Setting
      as="label"
      {...settingProps}
      control={
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          size={size}
          disabled={disabled}
        />
      }
    />
  );
};
