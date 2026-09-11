import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/ui-theme';
import { ContentColorSwatch } from '../ContentColorSwatch';
import { Stack } from '../Layout/Stack';
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
import { ContentColorValues } from '../constants';
import { InputLabel } from '../fields/InputLabel';
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

  /*
   * Color of the displayed value text. Uses Text color tokens.
   */
  valueColor?: TextColor;

  /**
   * Optional i18n label key displayed above the select.
   */
  label?: TranslationKey;
}

export const ColorSelect = ({
  className,
  variant = 'outline',
  size = 'md',
  value,
  valueColor,
  onValueChange,
  label,
}: ColorSelectProps) => {
  const { t } = useTranslation();

  // The colour shown on the trigger, named beside its swatch
  const selectedColor = ContentColorValues.find(
    (color) => color.value === value,
  );

  // The colours as items, which Base UI scrolls virtually
  const items = ContentColorValues.map((color) => ({
    value: color.value,
    label: t(color.labelKey),
  }));

  const select = (
    <SelectRoot<ContentColor>
      items={items}
      value={value}
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
          <ContentColorSwatch
            color={value ?? 'default'}
            size="xs"
            unset={(value ?? 'default') === 'default'}
          />
          {selectedColor ? t(selectedColor.labelKey) : ''}
        </SelectValue>
        <SelectIcon />
      </SelectTrigger>
      <SelectPopup className="color-select-popup">
        {ContentColorValues.map((color) => (
          <SelectItem key={color.value} value={color.value} hideIndicator>
            <ContentColorSwatch
              color={color.value}
              size="xs"
              unset={color.value === 'default'}
            />
            {t(color.labelKey)}
          </SelectItem>
        ))}
      </SelectPopup>
    </SelectRoot>
  );

  if (!label) {
    return select;
  }

  return (
    <Stack gap={1}>
      <InputLabel size="xs" label={label} />
      {select}
    </Stack>
  );
};
