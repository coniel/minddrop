import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import { ImageElement, ImageFit } from '../ImageElement.types';
import { DefaultImageFit, ImageFits } from '../constants';

// The name and description of each fit
const ImageFitOptions: Record<
  ImageFit,
  { label: TranslationKey; description: TranslationKey }
> = {
  cover: {
    label: 'designsNext.elements.image.fit.cover.label',
    description: 'designsNext.elements.image.fit.cover.description',
  },
  contain: {
    label: 'designsNext.elements.image.fit.contain.label',
    description: 'designsNext.elements.image.fit.contain.description',
  },
  fill: {
    label: 'designsNext.elements.image.fit.fill.label',
    description: 'designsNext.elements.image.fit.fill.description',
  },
};

/**
 * Renders an image element's settings.
 */
export const ImageSettingsPanel: React.FC<
  DesignElementSettingControlProps<ImageElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's fit, cover by default
  const fit = element.fit ?? DefaultImageFit;

  // Applies the chosen fit
  function handleFitChange(fit: ImageFit) {
    onChange({ fit });
  }

  return (
    <Stack gap={1}>
      <InputLabel size="xs" label="designsNext.elements.image.fit.label" />
      <RadioToggleGroup<ImageFit>
        size="sm"
        value={fit}
        onValueChange={handleFitChange}
        aria-label={t('designsNext.elements.image.fit.label')}
      >
        {ImageFits.map((option) => (
          <Toggle
            key={option}
            size="sm"
            value={option}
            label={t(ImageFitOptions[option].label)}
            tooltip={{
              title: ImageFitOptions[option].label,
              description: ImageFitOptions[option].description,
            }}
          />
        ))}
      </RadioToggleGroup>
    </Stack>
  );
};
