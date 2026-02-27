import { Select } from '@base-ui/react/select';
import { useCallback, useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { SelectSize, SelectVariant } from '../Select';
import { ContentColors } from '../constants';
import { ContentColor } from '@minddrop/theme';
import { propsToClass } from '../utils';
import '../Select/Select.css';
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
   * Extra options rendered before the standard content colors.
   */
  extraOptions?: ColorSelectOption[];
}

export const ColorSelect = ({
  className,
  variant = 'outline',
  size = 'md',
  value,
  onValueChange,
  extraOptions = [],
}: ColorSelectProps) => {
  const { t } = useTranslation();

  const handleValueChange = useCallback(
    (newValue: ContentColor | null) => {
      if (newValue == null) {
        return;
      }

      onValueChange?.(newValue);
    },
    [onValueChange],
  );

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

  const selectedOption = allOptions.find((option) => option.value === value);
  const items = allOptions.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));

  return (
    <Select.Root items={items} value={value} onValueChange={handleValueChange}>
      <Select.Trigger
        className={`${propsToClass('select', { variant, size, className })} color-select`}
      >
        <Select.Value className="color-select-trigger-content">
          <span
            className={`color-select-swatch ${selectedOption?.swatchClass || `color-select-swatch-${value || 'default'}`}`}
          />
          {selectedOption ? t(selectedOption.labelKey) : ''}
        </Select.Value>
        <Select.Icon className="select-icon">
          <Icon name="chevron-down" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="select-positioner" sideOffset={8}>
          <Select.Popup className="select-popup color-select-popup">
            <Select.ScrollUpArrow className="select-scroll-arrow" />
            <Select.List className="select-list">
              {allOptions.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="color-select-item"
                >
                  <Select.ItemText className="color-select-item-text">
                    <span
                      className={`color-select-swatch ${option.swatchClass || ''}`}
                    />
                    {t(option.labelKey)}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="select-scroll-arrow" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
