import { useCallback } from 'react';
import {
  FontFamilyToken,
  FontFamilyTokens,
  TypographyStyle,
} from '@minddrop/designs';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import {
  ElementTitlePropertyField,
  TitleCompatiblePropertyTypes,
} from './ElementTitlePropertyField';
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
import { TypographyFields, TypographyStyleKeys } from './TypographyFields';
import {
  fieldLabelKey,
  fontFamilyOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for rich content editors: the body
 * type and frame, plus a Title section binding a property as the
 * title bar above the content and styling its typography.
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
  const { isEditable, getValue, setValue, editableSides } = editor;

  const title = getValue<TypographyStyle>('title');

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

  // Write a single key of the nested title style, dropping the
  // title style entirely once none of its values remain set
  const setTitleValue = useCallback(
    (key: string, value: unknown) => {
      const nextTitle: Record<string, unknown> = { ...title };

      // Remove keys the user cleared so the title style does not
      // linger as an empty object
      if (value === undefined) {
        delete nextTitle[key];
      } else {
        nextTitle[key] = value;
      }

      const hasValues = Object.keys(nextTitle).length > 0;

      setValue('title', hasValues ? nextTitle : undefined);
    },
    [title, setValue],
  );

  // Read a single key of the nested title style
  const getTitleValue = useCallback(
    <TValue,>(key: string) =>
      (title as Record<string, unknown> | undefined)?.[key] as
        | TValue
        | undefined,
    [title],
  );

  // The title style is nested, so a role either controls the whole
  // title or none of it
  const isTitleEditable = useCallback(() => isEditable('title'), [isEditable]);

  return (
    <>
      {isEditable('title') && (
        <StyleSection
          label={sectionLabelKey('title')}
          keys={TypographyStyleKeys}
          isEditable={isTitleEditable}
          getValue={getTitleValue}
          setValue={setTitleValue}
          hasCustomValues={hasTitleBinding}
          onOpen={handleTitleOpen}
          onClear={handleTitleClear}
        >
          <ElementTitlePropertyField elementId={elementId} />
          <TypographyFields
            isEditable={isTitleEditable}
            getValue={getTitleValue}
            setValue={setTitleValue}
            showTruncate={false}
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
