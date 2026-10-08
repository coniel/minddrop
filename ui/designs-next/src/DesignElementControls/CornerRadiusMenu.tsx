import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  Designs,
  ElementCornerRadius,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';
import { CornerRadiusGlyph } from '../CornerRadiusGlyph';
import { CornerRadiusOptions } from '../constants';

/**
 * Renders the corner radius choices as a hover menu, each drawing
 * the corner it sets rather than naming its size.
 */
export const CornerRadiusMenu: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's corner radius, small by default
  const radius = element.cornerRadius ?? Designs.constants.DefaultCornerRadius;

  // Applies the chosen radius
  function handleRadiusChange(cornerRadius: ElementCornerRadius) {
    onChange({ cornerRadius });
  }

  // Map the radii to menu options drawing their own corners
  const options: RadioToggleHoverMenuOption<ElementCornerRadius>[] =
    CornerRadiusOptions.map((option) => ({
      value: option.radius,
      label: t(option.label),
      content: <CornerRadiusGlyph radius={option.radius} />,
      square: true,
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
