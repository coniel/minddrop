import {
  BadgeStyle,
  FieldStyle,
  LayoutType,
  PropertyElementConfig,
  PropertyElementVariantConfig,
  TypographyStyle,
  createBadgeCss,
  createFieldCss,
  createTypographyCss,
  getPropertyElementConfig,
  getPropertyElementVariant,
  isPropertyElement,
  resolvePropertyElementStyle,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { ContentColors } from '@minddrop/ui-theme';
import {
  useActiveLayoutType,
  useDesignStudio,
  useElement,
} from '../../DesignStudioStore';
import { parseBadgeLabels, resolveBadgeColorCss } from '../../utils';
import { PanelSection } from '../PanelSection';
import { StyleEditorProps } from '../StyleEditorProps';
import { VariantOptionsField } from '../VariantOptionsField';
import { sectionLabelKey } from '../styleI18nKeys';
import '../../design-elements/property/BadgesPropertyRenderer/BadgesPropertyRenderer.css';

/**
 * Renders a property element's presentation variant picker: a
 * radio list with each variant's label above a sample rendered in
 * the variant's own styling. Renders nothing for other elements or
 * when there is only one presentation to choose from.
 */
export const PropertyElementVariantFields: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
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
      <VariantOptionsField
        options={config.variants.map((option) => ({
          id: option.id,
          label: option.label,
          description: option.description,
          sample: (
            <VariantSample
              config={config}
              variant={option}
              layoutType={layoutType ?? undefined}
              truncate={config.propertyType === 'title'}
            />
          ),
        }))}
        value={variant.id}
        onValueChange={handlePresentationChange}
      />
    </PanelSection>
  );
};

export interface VariantSampleProps {
  /**
   * The property element config the variant belongs to.
   */
  config: PropertyElementConfig;

  /**
   * The variant to sample.
   */
  variant: PropertyElementVariantConfig;

  /**
   * The type of the layout being edited, which the variant's theme
   * styles resolve against.
   */
  layoutType?: LayoutType;

  /**
   * Whether the sample is capped to a single ellipsised line, for
   * outsized type a wrapping sample would let dominate the list.
   */
  truncate?: boolean;
}

/**
 * Renders a variant's sample content the way the variant itself
 * renders it: badge variants as chips, field variants as a field
 * box, the rest as a line of text. Renders nothing for variants
 * without a sample.
 */
export const VariantSample: React.FC<VariantSampleProps> = ({
  config,
  variant,
  layoutType,
  truncate = false,
}) => {
  const { t } = useTranslation();

  // Variants a sample cannot speak for are described instead
  if (!variant.sample) {
    return null;
  }

  // The styling the variant renders the sample in
  const style = resolvePropertyElementStyle(config, variant.id, layoutType);

  // The single-line cap applies through a modifier class
  const sampleClassName = truncate
    ? 'designs-variant-option-sample designs-variant-option-sample-truncate'
    : 'designs-variant-option-sample';

  // Badge variants render a chip per label, as the canvas does
  if (variant.styleCategory === 'badge') {
    return (
      <BadgesSample labels={t(variant.sample)} style={style as BadgeStyle} />
    );
  }

  // Field variants render the sample inside the field box chrome
  if (variant.styleCategory === 'field') {
    return (
      <span
        className={sampleClassName}
        style={createFieldCss(style as FieldStyle)}
      >
        {t(variant.sample)}
      </span>
    );
  }

  return (
    <span
      className={sampleClassName}
      style={createTypographyCss(style as TypographyStyle)}
    >
      {t(variant.sample)}
    </span>
  );
};

interface BadgesSampleProps {
  /**
   * The comma-separated sample labels, one chip each.
   */
  labels: string;

  /**
   * The badge styling the chips are rendered in.
   */
  style: BadgeStyle;
}

/**
 * Renders a badge variant's sample as coloured chips. Sample
 * labels carry no select options of their own, so they take the
 * content colours in order, as the canvas colours its placeholder
 * badges.
 */
const BadgesSample: React.FC<BadgesSampleProps> = ({ labels, style }) => {
  // The chip CSS, without the margins which space the row on the
  // canvas rather than the chips inside it
  const {
    marginTop: _top,
    marginRight: _right,
    marginBottom: _bottom,
    marginLeft: _left,
    ...chipCss
  } = createBadgeCss(style);

  // The colours the sample chips cycle through
  const palette = ContentColors.filter((color) => color !== 'default');

  return (
    <div className="designs-badges-element">
      {parseBadgeLabels(labels).map((label, index) => (
        <span
          key={label}
          className="designs-badge"
          style={{
            ...chipCss,
            ...resolveBadgeColorCss(palette[index % palette.length]),
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
};
