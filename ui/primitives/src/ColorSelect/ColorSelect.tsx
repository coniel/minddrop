import { useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/theme';
import {
  SelectIcon,
  SelectItem,
  SelectPopup,
  SelectRoot,
  SelectSize,
  SelectTrigger,
  SelectValue,
  SelectVariant,
} from '../Select';
import { TextColor } from '../Text';
import { ContentColors } from '../constants';
import './ColorSelect.css';

export interface ColorSelectOption {
  /*
   * The option value.
   */
  value: string;

  /*
   * The display label. Can be an i18n key.
   */
  label: string;

  /*
   * CSS class applied to the swatch element.
   */
  swatchClass?: string;
}

export interface ColorSelectProps {
  /*
   * Class name applied to the trigger element.
   */
  className?: string;

  /*
   * Visual style of the trigger.
   * @default 'outline'
   */
  variant?: SelectVariant;

  /*
   * Size of the trigger.
   * @default 'md'
   */
  size?: SelectSize;

  /*
   * The controlled value of the select.
   */
  value?: ContentColor | string;

  /*
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: ContentColor) => void;

  /*
   * Color of the displayed value text. Uses Text color tokens.
   */
  valueColor?: TextColor;

  /*
   * Extra options rendered before the standard content colors.
   */
  extraOptions?: ColorSelectOption[];
}

export const ColorSelect = ({
  className,
  variant = 'outline',
  size = 'md',
  value,
  valueColor,
  onValueChange,
  extraOptions = [],
}: ColorSelectProps) => {
  const { t } = useTranslation();

  // Build the combined list of extra options + content color options
  const allOptions = useMemo(() => {
    const extras = extraOptions.map((option) => ({
      value: option.value,
      labelKey: option.label,
      swatchClass: option.swatchClass,
    }));

    const colors = ContentColors.map((color) => ({
      value: color.value,
      labelKey: color.labelKey,
      swatchClass: `color-select-swatch-${color.value}`,
    }));

    return [...extras, ...colors];
  }, [extraOptions]);

  // Find the currently selected option for rendering the trigger value
  const selectedOption = allOptions.find((option) => option.value === value);

  // Build items array for Base UI virtual scrolling
  const items = allOptions.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));

  return (
    <SelectRoot<ContentColor>
      items={items as { value: ContentColor; label: string }[]}
      value={value as ContentColor}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        className={`${className || ''} color-select`.trim()}
        variant={variant}
        size={size}
      >
        <SelectValue
          className="color-select-trigger-content"
          color={valueColor}
        >
          <span
            className={`color-select-swatch ${selectedOption?.swatchClass || `color-select-swatch-${value || 'default'}`}`}
          />
          {selectedOption ? t(selectedOption.labelKey) : ''}
        </SelectValue>
        <SelectIcon />
      </SelectTrigger>
      <SelectPopup className="color-select-popup">
        {allOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} hideIndicator>
            <span
              className={`color-select-swatch ${option.swatchClass || ''}`}
            />
            {t(option.labelKey)}
          </SelectItem>
        ))}
      </SelectPopup>
    </SelectRoot>
  );
};
