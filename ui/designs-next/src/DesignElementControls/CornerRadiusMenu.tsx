import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  ElementCornerRadius,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';
import { CornerRadiusGlyph } from './CornerRadiusGlyph';

interface CornerRadiusOption {
  /**
   * The corner radius the option selects.
   */
  radius: ElementCornerRadius;

  /**
   * i18n key of the radius's label.
   */
  label: TranslationKey;
}

// The corner radius options in display order
const CornerRadiusOptions: CornerRadiusOption[] = [
  { radius: 'none', label: 'designsNext.settings.cornerRadius.none' },
  { radius: 'sm', label: 'designsNext.settings.cornerRadius.sm' },
  { radius: 'md', label: 'designsNext.settings.cornerRadius.md' },
  { radius: 'lg', label: 'designsNext.settings.cornerRadius.lg' },
  { radius: 'full', label: 'designsNext.settings.cornerRadius.full' },
];

/**
 * Renders the corner radius choices as a hover menu, each drawing
 * the corner it sets rather than naming its size.
 */
export const CornerRadiusMenu: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // The element's corner radius, the small one by default
  const radius = element.cornerRadius ?? 'sm';

  // Applies the chosen radius
  function handleRadiusChange(cornerRadius: ElementCornerRadius) {
    onChange({ cornerRadius });
  }

  // The radii as menu options, drawing their own corners
  const options: RadioToggleHoverMenuOption<ElementCornerRadius>[] =
    CornerRadiusOptions.map((option) => ({
      value: option.radius,
      label: t(option.label),
      content: <CornerRadiusGlyph radius={option.radius} />,
      tooltip: { title: option.label },
    }));

  return (
    <RadioToggleHoverMenu<ElementCornerRadius>
      options={options}
      value={radius}
      label={t('designsNext.settings.cornerRadius.label')}
      onValueChange={handleRadiusChange}
    />
  );
};
