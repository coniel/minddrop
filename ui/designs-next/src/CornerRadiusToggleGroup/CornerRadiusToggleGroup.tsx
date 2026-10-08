import { ElementCornerRadius } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import { CornerRadiusGlyph } from '../CornerRadiusGlyph';
import { CornerRadiusOptions } from '../constants';

export interface CornerRadiusToggleGroupProps {
  /**
   * The selected corner radius.
   */
  value: ElementCornerRadius;

  /**
   * Called with the chosen corner radius.
   */
  onValueChange: (radius: ElementCornerRadius) => void;
}

/**
 * Renders the corner radius choices as a toggle group, each drawing
 * the corner it sets.
 */
export const CornerRadiusToggleGroup: React.FC<
  CornerRadiusToggleGroupProps
> = ({ value, onValueChange }) => {
  const { t } = useTranslation();

  return (
    <RadioToggleGroup<ElementCornerRadius>
      size="sm"
      value={value}
      onValueChange={onValueChange}
      aria-label={t('designsNext.settings.cornerRadius.label')}
    >
      {CornerRadiusOptions.map((option) => (
        <Toggle
          key={option.radius}
          size="sm"
          value={option.radius}
          label={t(option.label)}
          tooltip={{ title: option.label }}
          square
        >
          <CornerRadiusGlyph radius={option.radius} />
        </Toggle>
      ))}
    </RadioToggleGroup>
  );
};
