import {
  FontFamilyToken,
  FontFamilyTokens,
  getPropertyElementConfig,
} from '@minddrop/designs';
import {
  useActiveLayoutType,
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import {
  ElementTitlePropertyField,
  TitleCompatiblePropertyTypes,
} from './ElementTitlePropertyField';
import { VariantSample } from './PropertyElementVariantFields';
import {
  MarginSides,
  MarginStyleKeys,
  PaddingSides,
  PaddingStyleKeys,
  SpaceFields,
} from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TextColourFields } from './TextColourFields';
import { TokenSelect } from './TokenSelect';
import { VariantOptionsField } from './VariantOptionsField';
import {
  fieldLabelKey,
  fontFamilyOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useNestedStyle } from './useNestedStyle';
import { useStyleEditor } from './useStyleEditor';

// The title element config, whose size variants the title bar
// renders at
const TitleElementConfig = getPropertyElementConfig('title');

/**
 * The keys of the nested title style the section governs.
 */
const EditorTitleStyleKeys = ['variant', 'color'];

/**
 * Renders the style editor for rich content editors: the body
 * type and frame, plus a Title section binding a property as the
 * title bar above the content, rendered at one of the title
 * element's sizes.
 */
export const EditorStyleEditor: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  const element = useElement(elementId);
  const editor = useStyleEditor(elementId);
  // The title bar styles through a nested object
  const title = useNestedStyle(editor, 'title');
  // Title samples preview the variant styling as the active
  // layout resolves it
  const layoutType = useActiveLayoutType();
  const { isEditable, getValue, setValue, editableSides } = editor;

  // Whether the element has a bound title property, which keeps
  // the Title section open alongside its style values
  const hasTitleBinding = Boolean(
    element && 'titleProperty' in element && element.titleProperty,
  );

  // Bind a default title property when the Title section is
  // opened without a binding, so opening it shows a title bar
  function handleTitleOpen() {
    // Leave existing bindings untouched
    if (!element || hasTitleBinding) {
      return;
    }

    // Prefer the design's title property, falling back to the
    // first text property
    const defaultProperty =
      properties.find((property) => property.type === 'title') ||
      properties.find((property) =>
        TitleCompatiblePropertyTypes.includes(property.type),
      );

    if (defaultProperty) {
      studio.updateDesignElement(elementId, {
        titleProperty: defaultProperty.name,
      });
    }
  }

  // Unbind the title property when the Title section is cleared,
  // by element replacement since a merge cannot unset a field
  function handleTitleClear() {
    if (!element || !('titleProperty' in element) || !element.titleProperty) {
      return;
    }

    const { titleProperty: _removed, ...unboundElement } = element;

    studio.setDesignElement(elementId, unboundElement);
  }

  return (
    <>
      {isEditable('title') && (
        <StyleSection
          label={sectionLabelKey('title')}
          keys={EditorTitleStyleKeys}
          isEditable={title.isEditable}
          getValue={title.getValue}
          setValue={title.setValue}
          hasCustomValues={hasTitleBinding}
          onOpen={handleTitleOpen}
          onClear={handleTitleClear}
        >
          <ElementTitlePropertyField elementId={elementId} />
          <VariantOptionsField
            label={fieldLabelKey('variant')}
            options={TitleElementConfig.variants.map((option) => ({
              id: option.id,
              label: option.label,
              sample: (
                <VariantSample
                  config={TitleElementConfig}
                  variant={option}
                  layoutType={layoutType ?? undefined}
                  truncate
                />
              ),
            }))}
            value={
              title.getValue<string>('variant') ??
              TitleElementConfig.defaultVariant
            }
            onValueChange={(value) => title.setValue('variant', value)}
          />
          <TextColourFields
            editor={{
              isEditable: title.isEditable,
              getResolvedValue: title.getValue,
              setValue: title.setValue,
            }}
          />
        </StyleSection>
      )}

      <StyleSection
        label={sectionLabelKey('typography')}
        keys={['fontFamily', 'color']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('fontFamily') && (
          <TokenSelect
            label={fieldLabelKey('fontFamily')}
            tokens={FontFamilyTokens}
            value={getValue<FontFamilyToken>('fontFamily')}
            optionKey={fontFamilyOptionKey}
            clearOption={{
              label: 'designsStudio.style.defaultFont.label',
              description: 'designsStudio.style.defaultFont.description',
            }}
            onChange={(value) => setValue('fontFamily', value)}
          />
        )}
        <TextColourFields editor={editor} />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('border')}
        keys={BorderStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
        onOpen={() => setValue('borderStyle', 'solid')}
      >
        <BorderFields editor={editor} />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('padding')}
        keys={PaddingStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <SpaceFields
          hairline={false}
          sides={editableSides(PaddingSides)}
          getValue={(key) => getValue(key)}
          onChange={setValue}
        />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('margin')}
        keys={MarginStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <SpaceFields
          sides={editableSides(MarginSides)}
          getValue={(key) => getValue(key)}
          onChange={setValue}
        />
      </StyleSection>
    </>
  );
};
