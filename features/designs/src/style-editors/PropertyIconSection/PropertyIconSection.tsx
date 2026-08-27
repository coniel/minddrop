import {
  PropertyIconVariant,
  createPropertyIconCss,
  getPropertyElementConfig,
  isPropertyElement,
  supportsPropertyChrome,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useDesignStudioStore, useElement } from '../../DesignStudioStore';
import { PropertyChromeVariantPreview } from '../PropertyChromeVariantPreview';
import { StyleEditorProps } from '../StyleEditorProps';
import { StyleSection } from '../StyleSection';
import { TextColourFields } from '../TextColourFields';
import { VariantOptionsField } from '../VariantOptionsField';
import { fieldLabelKey, sectionLabelKey } from '../styleI18nKeys';
import { useNestedStyle } from '../useNestedStyle';
import { useStyleEditor } from '../useStyleEditor';

// The icon's presentation variants, the default first
const IconVariants: {
  id: PropertyIconVariant;
  label: TranslationKey;
}[] = [
  { id: 'side', label: 'designsStudio.style.iconVariant.side.label' },
  { id: 'above', label: 'designsStudio.style.iconVariant.above.label' },
];

/**
 * The keys of the nested icon style the section governs.
 */
export const PropertyIconStyleKeys = ['variant', 'color'];

/**
 * Renders a property element's Icon section: opening it renders
 * the bound property's icon alongside the value, with a previewed
 * variant picker and the icon's colour. Renders nothing for
 * variants outside the value-like categories.
 */
export const PropertyIconSection: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const element = useElement(elementId);
  const editor = useStyleEditor(elementId);
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  // The icon styles through a nested object whose presence is
  // what enables the rendering
  const icon = useNestedStyle(editor, 'icon');

  // Only value-like variants render the chrome
  if (
    !element ||
    !isPropertyElement(element) ||
    !supportsPropertyChrome(element)
  ) {
    return null;
  }

  // The glyph the previews render: the bound property's own icon,
  // falling back to the type icon, as the chrome itself does
  const config = getPropertyElementConfig(element.propertyType, false);
  const propertyIcon = properties.find(
    (property) => property.name === element.property,
  )?.icon;

  // Enable the icon at its default variant when the section is
  // opened, so opening alone renders it
  function handleOpen() {
    icon.setValue('variant', 'side');
  }

  // The colour toggle shows the icon's effective colour: its own
  // value, else the subtle base look
  function getResolvedColour<TValue>(key: string): TValue | undefined {
    return (icon.getValue(key) ?? 'subtle') as TValue;
  }

  // The previewed icon glyph
  function iconGlyph(): React.ReactNode {
    if (propertyIcon) {
      return <ContentIcon icon={propertyIcon} />;
    }

    return config ? <Icon name={config.icon} /> : null;
  }

  // A variant's sample: the icon piece arranged around the value
  // line as the variant renders it
  function variantSample(variant: PropertyIconVariant): React.ReactNode {
    return (
      <PropertyChromeVariantPreview above={variant === 'above'}>
        <span
          className="designs-property-chrome-icon"
          style={createPropertyIconCss()}
        >
          {iconGlyph()}
        </span>
      </PropertyChromeVariantPreview>
    );
  }

  return (
    <StyleSection
      label={sectionLabelKey('icon')}
      keys={PropertyIconStyleKeys}
      isEditable={icon.isEditable}
      getValue={icon.getValue}
      setValue={icon.setValue}
      onOpen={handleOpen}
    >
      <VariantOptionsField
        label={fieldLabelKey('variant')}
        options={IconVariants.map((variant) => ({
          id: variant.id,
          label: variant.label,
          sample: variantSample(variant.id),
        }))}
        value={icon.getValue<PropertyIconVariant>('variant') ?? 'side'}
        onValueChange={(value) => icon.setValue('variant', value)}
      />
      <TextColourFields
        editor={{
          isEditable: icon.isEditable,
          getResolvedValue: getResolvedColour,
          setValue: icon.setValue,
        }}
        label={fieldLabelKey('iconColour')}
      />
    </StyleSection>
  );
};
