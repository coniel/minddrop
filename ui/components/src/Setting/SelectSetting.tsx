import { TranslationKey } from '@minddrop/i18n';
import {
  Select,
  SelectOption,
  SelectSize,
  SelectVariant,
} from '@minddrop/ui-primitives';
import { Setting, SettingProps } from './Setting';

export interface SelectSettingProps<TValue extends string | number>
  extends Omit<SettingProps, 'control'> {
  /**
   * The options to render in the select.
   */
  options: SelectOption<TValue>[];

  /**
   * The currently selected value.
   */
  value?: TValue;

  /**
   * Callback fired with the new value when the selection changes.
   */
  onValueChange?: (value: TValue) => void;

  /**
   * Placeholder shown when no value is selected.
   */
  placeholder?: TranslationKey;

  /**
   * Visual style of the select trigger.
   * @default 'outline'
   */
  variant?: SelectVariant;

  /**
   * Size of the select trigger.
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;
}

/**
 * A settings row with a select control.
 */
export const SelectSetting = <TValue extends string | number = string>({
  options,
  value,
  onValueChange,
  placeholder,
  variant,
  size,
  disabled,
  ...settingProps
}: SelectSettingProps<TValue>) => {
  return (
    <Setting
      {...settingProps}
      control={
        <Select
          options={options}
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          variant={variant}
          size={size}
          disabled={disabled}
        />
      }
    />
  );
};
