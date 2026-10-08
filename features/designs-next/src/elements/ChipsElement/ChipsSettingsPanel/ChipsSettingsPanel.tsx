import {
  DesignElementSettingControlProps,
  ElementCornerRadius,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { CornerRadiusToggleGroup } from '@minddrop/ui-designs-next';
import {
  ChipSize,
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import { ChipsElement } from '../ChipsElement.types';
import {
  ChipSizes,
  DefaultChipCornerRadius,
  DefaultChipSize,
} from '../constants';

// The name of each size
const ChipSizeLabels: Record<ChipSize, TranslationKey> = {
  sm: 'designsNext.elements.chips.size.sm',
  md: 'designsNext.elements.chips.size.md',
  lg: 'designsNext.elements.chips.size.lg',
};

/**
 * Renders a chips element's settings.
 */
export const ChipsSettingsPanel: React.FC<
  DesignElementSettingControlProps<ChipsElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's size and corner radius, medium chips with
  // small corners by default.
  const size = element.size ?? DefaultChipSize;
  const cornerRadius = element.cornerRadius ?? DefaultChipCornerRadius;

  // Applies the chosen size
  function handleSizeChange(size: ChipSize) {
    onChange({ size });
  }

  // Applies the chosen corner radius
  function handleCornerRadiusChange(cornerRadius: ElementCornerRadius) {
    onChange({ cornerRadius });
  }

  return (
    <Stack gap={3}>
      {/** Size **/}
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.elements.chips.size.label" />
        <RadioToggleGroup<ChipSize>
          size="sm"
          value={size}
          onValueChange={handleSizeChange}
          aria-label={t('designsNext.elements.chips.size.label')}
        >
          {ChipSizes.map((option) => (
            <Toggle
              key={option}
              size="sm"
              value={option}
              label={t(ChipSizeLabels[option])}
            />
          ))}
        </RadioToggleGroup>
      </Stack>
      {/** Corner radius **/}
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.settings.cornerRadius.label" />
        <CornerRadiusToggleGroup
          value={cornerRadius}
          onValueChange={handleCornerRadiusChange}
        />
      </Stack>
    </Stack>
  );
};
