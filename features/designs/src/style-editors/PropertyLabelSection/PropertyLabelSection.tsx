import {
  PropertyLabelVariant,
  createPropertyLabelCss,
  getPropertyElementConfig,
  isPropertyElement,
  supportsPropertyChrome,
} from '@minddrop/designs';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { useElement } from '../../DesignStudioStore';
import { PropertyChromeVariantPreview } from '../PropertyChromeVariantPreview';
import { StyleEditorProps } from '../StyleEditorProps';
import { StyleSection } from '../StyleSection';
import { TextColourFields } from '../TextColourFields';
import { VariantOptionsField } from '../VariantOptionsField';
import { fieldLabelKey, sectionLabelKey } from '../styleI18nKeys';
import { useNestedStyle } from '../useNestedStyle';
import { useStyleEditor } from '../useStyleEditor';

// The label's presentation variants, the default first
const LabelVariants: {
  id: PropertyLabelVariant;
  label: TranslationKey;
}[] = [
  { id: 'above', label: 'designsStudio.style.labelVariant.above.label' },
  { id: 'side', label: 'designsStudio.style.labelVariant.side.label' },
  { id: 'spread', label: 'designsStudio.style.labelVariant.spread.label' },
];

/**
 * The keys of the nested label style the section governs.
 */
export const PropertyLabelStyleKeys = ['variant', 'color'];

/**
 * Renders a property element's Label section: opening it renders
 * the bound property's name alongside the value, with a previewed
 * variant picker and the label's colour. Renders nothing for
 * variants outside the value-like categories.
 */
export const PropertyLabelSection: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const element = useElement(elementId);
  const editor = useStyleEditor(elementId);
  // The label styles through a nested object whose presence is
  // what enables the rendering
  const label = useNestedStyle(editor, 'label');

  // Only value-like variants render the chrome
  if (
    !element ||
    !isPropertyElement(element) ||
    !supportsPropertyChrome(element)
  ) {
    return null;
  }

  // The text the previews label their value line with: the bound
  // property's name, as the chrome itself renders it
  const config = getPropertyElementConfig(element.propertyType, false);
  const labelText = element.property ?? (config ? t(config.label) : '');

  // Enable the label at its default variant when the section is
  // opened, so opening alone renders it
  function handleOpen() {
    label.setValue('variant', 'above');
  }

  // The colour toggle shows the label's effective colour: its own
  // value, else the subtle base look
  function getResolvedColour<TValue>(key: string): TValue | undefined {
    return (label.getValue(key) ?? 'subtle') as TValue;
  }

  // A variant's sample: the label piece arranged around the value
  // line as the variant renders it
  function variantSample(variant: PropertyLabelVariant): React.ReactNode {
    return (
      <PropertyChromeVariantPreview
        above={variant === 'above'}
        spread={variant === 'spread'}
      >
        <span
          className="designs-property-chrome-label"
          style={createPropertyLabelCss()}
        >
          {labelText}
        </span>
      </PropertyChromeVariantPreview>
    );
  }

  return (
    <StyleSection
      label={sectionLabelKey('label')}
      keys={PropertyLabelStyleKeys}
      isEditable={label.isEditable}
      getValue={label.getValue}
      setValue={label.setValue}
      onOpen={handleOpen}
    >
      <VariantOptionsField
        label={fieldLabelKey('variant')}
        options={LabelVariants.map((variant) => ({
          id: variant.id,
          label: variant.label,
          sample: variantSample(variant.id),
        }))}
        value={label.getValue<PropertyLabelVariant>('variant') ?? 'above'}
        onValueChange={(value) => label.setValue('variant', value)}
      />
      <TextColourFields
        editor={{
          isEditable: label.isEditable,
          getResolvedValue: getResolvedColour,
          setValue: label.setValue,
        }}
      />
    </StyleSection>
  );
};
