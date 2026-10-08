import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  Group,
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import {
  ToggleElement,
  ToggleElementSize,
  ToggleStyle,
} from '../ToggleElement.types';
import {
  DefaultCheckedIcon,
  DefaultToggleElementSize,
  DefaultToggleStyle,
  DefaultUncheckedIcon,
  ToggleElementSizes,
  ToggleStyles,
} from '../constants';
import { ToggleIconPicker } from './ToggleIconPicker';

// The name of each style
const ToggleStyleLabels: Record<ToggleStyle, TranslationKey> = {
  checkbox: 'designsNext.elements.toggle.style.checkbox',
  switch: 'designsNext.elements.toggle.style.switch',
  icon: 'designsNext.elements.toggle.style.icon',
};

// The name of each size
const ToggleSizeLabels: Record<ToggleElementSize, TranslationKey> = {
  sm: 'designsNext.elements.toggle.size.sm',
  md: 'designsNext.elements.toggle.size.md',
  lg: 'designsNext.elements.toggle.size.lg',
};

/**
 * Renders a toggle element's settings.
 */
export const ToggleSettingsPanel: React.FC<
  DesignElementSettingControlProps<ToggleElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's style and size, a medium checkbox by
  // default.
  const style = element.style ?? DefaultToggleStyle;
  const size = element.size ?? DefaultToggleElementSize;

  // Applies the chosen style
  function handleStyleChange(style: ToggleStyle) {
    onChange({ style });
  }

  // Applies the chosen size
  function handleSizeChange(size: ToggleElementSize) {
    onChange({ size });
  }

  // Applies the icon picked for a true value, or clears it
  function handleCheckedIconChange(checkedIcon: string | undefined) {
    onChange({ checkedIcon });
  }

  // Applies the icon picked for any other value, or clears it
  function handleUncheckedIconChange(uncheckedIcon: string | undefined) {
    onChange({ uncheckedIcon });
  }

  return (
    <Stack gap={3}>
      {/** Style **/}
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.elements.toggle.style.label" />
        <RadioToggleGroup<ToggleStyle>
          size="sm"
          value={style}
          onValueChange={handleStyleChange}
        >
          {ToggleStyles.map((option) => (
            <Toggle
              key={option}
              size="sm"
              value={option}
              label={t(ToggleStyleLabels[option])}
            />
          ))}
        </RadioToggleGroup>
      </Stack>
      {/** Size **/}
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.elements.toggle.size.label" />
        <RadioToggleGroup<ToggleElementSize>
          size="sm"
          value={size}
          onValueChange={handleSizeChange}
        >
          {ToggleElementSizes.map((option) => (
            <Toggle
              key={option}
              size="sm"
              value={option}
              label={t(ToggleSizeLabels[option])}
            />
          ))}
        </RadioToggleGroup>
      </Stack>
      {/** Icons of the icon style **/}
      {style === 'icon' && (
        <Stack gap={1}>
          <InputLabel
            size="xs"
            label="designsNext.elements.toggle.icons.label"
          />
          <Group gap={1}>
            <ToggleIconPicker
              label="designsNext.elements.toggle.icons.unchecked"
              icon={element.uncheckedIcon}
              defaultIcon={DefaultUncheckedIcon}
              onChange={handleUncheckedIconChange}
            />
            <ToggleIconPicker
              label="designsNext.elements.toggle.icons.checked"
              icon={element.checkedIcon}
              defaultIcon={DefaultCheckedIcon}
              onChange={handleCheckedIconChange}
            />
          </Group>
        </Stack>
      )}
    </Stack>
  );
};
