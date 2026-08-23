import {
  TypographyStyle,
  createTypographyCss,
  getPropertyElementConfig,
  getPropertyElementVariant,
  isPropertyElement,
  resolvePropertyElementStyle,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { InputLabel, RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudio,
  useElement,
} from '../../DesignStudioStore';
import { PanelSection } from '../PanelSection';
import { StyleEditorProps } from '../StyleEditorProps';
import { sectionLabelKey } from '../styleI18nKeys';
import './PropertyElementVariantFields.css';

/**
 * Renders a property element's presentation variant picker: a
 * radio list with each variant's label above a sample rendered in
 * the variant's own styling. Renders nothing for other elements or
 * when there is only one presentation to choose from.
 */
export const PropertyElementVariantFields: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const studio = useDesignStudio();
  const element = useElement(elementId);
  // Samples preview the variant styling as the active layout
  // resolves it
  const layoutType = useActiveLayoutType();

  // Only property elements carry presentation variants
  if (!isPropertyElement(element)) {
    return null;
  }

  // A property type without a config offers nothing to choose
  const config = getPropertyElementConfig(element.propertyType, false);

  if (!config) {
    return null;
  }

  // A single fixed presentation offers nothing to choose
  if (config.variants.length <= 1) {
    return null;
  }

  // The presentation variant the element renders as
  const variant = getPropertyElementVariant(config, element.variant);

  const propertyElement = element;

  // Record the chosen presentation. Replaces the element outright,
  // since the variant field sits alongside the element's own.
  function handlePresentationChange(variantId: string) {
    studio.setDesignElement(elementId, {
      ...propertyElement,
      variant: variantId,
    });
  }

  return (
    <PanelSection label={sectionLabelKey('variant')}>
      <RadioToggleGroup
        className="designs-property-variant-options"
        value={variant.id}
        onValueChange={handlePresentationChange}
      >
        {config.variants.map((option) => (
          <Toggle
            key={option.id}
            value={option.id}
            label={t(option.label)}
            className="designs-property-variant-option"
          >
            <div className="designs-property-variant-option-content">
              {/** The variant's name **/}
              <InputLabel size="xs" label={option.label} />

              {/** A sample rendered in the variant's styling **/}
              {option.sample && (
                <span
                  className="designs-property-variant-option-sample"
                  style={createTypographyCss(
                    // The theme styles are typography for text
                    // variants, which are the only sampled ones
                    resolvePropertyElementStyle(
                      config,
                      option.id,
                      layoutType ?? undefined,
                    ) as TypographyStyle,
                  )}
                >
                  {t(option.sample)}
                </span>
              )}
            </div>
          </Toggle>
        ))}
      </RadioToggleGroup>
    </PanelSection>
  );
};
