import { Select } from '@base-ui/react/select';
import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { SelectSize, SelectVariant } from '../Select';
import { ContentColors } from '../constants';
import { ContentColor } from '../types';
import { propsToClass } from '../utils';
import '../Select/Select.css';
import './ColorSelect.css';

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
  value?: ContentColor;

  /*
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: ContentColor) => void;
}

export const ColorSelect = ({
  className,
  variant = 'outline',
  size = 'md',
  value,
  onValueChange,
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

  const selectedColor = ContentColors.find((color) => color.value === value);
  const items = ContentColors.map((color) => ({
    value: color.value,
    label: color.labelKey,
  }));

  return (
    <Select.Root items={items} value={value} onValueChange={handleValueChange}>
      <Select.Trigger
        className={`${propsToClass('select', { variant, size, className })} color-select`}
      >
        <Select.Value className="color-select-trigger-content">
          <span
            className={`color-select-swatch color-select-swatch-${value || 'default'}`}
          />
          {selectedColor ? t(selectedColor.labelKey) : ''}
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
              {ContentColors.map((color) => (
                <Select.Item
                  key={color.value}
                  value={color.value}
                  className="color-select-item"
                >
                  <Select.ItemText className="color-select-item-text">
                    <span
                      className={`color-select-swatch color-select-swatch-${color.value}`}
                    />
                    {t(color.labelKey)}
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
