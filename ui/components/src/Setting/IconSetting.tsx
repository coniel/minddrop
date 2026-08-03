import {
  ContentIcon,
  IconButton,
  IconButtonSize,
  IconPicker,
} from '@minddrop/ui-primitives';
import { Setting, SettingProps } from './Setting';

export interface IconSettingProps extends Omit<SettingProps, 'control'> {
  /**
   * The current icon string (e.g. 'content-icon:box:default').
   */
  icon: string;

  /**
   * Callback fired when an icon is selected.
   */
  onSelect: (icon: string) => void;

  /**
   * Callback fired when the icon is cleared.
   */
  onClear?: () => void;

  /**
   * Size of the icon button.
   * @default 'md'
   */
  size?: IconButtonSize;
}

/**
 * A settings row with an icon picker control.
 */
export const IconSetting: React.FC<IconSettingProps> = ({
  icon,
  onSelect,
  onClear,
  size = 'md',
  ...settingProps
}) => {
  return (
    <Setting
      {...settingProps}
      control={
        <IconPicker
          closeOnSelect
          currentIcon={icon}
          onSelect={onSelect}
          onClear={onClear}
        >
          <IconButton
            label={settingProps.title}
            size={size}
            variant="filled"
            color="neutral"
          >
            <ContentIcon icon={icon} />
          </IconButton>
        </IconPicker>
      }
    />
  );
};
