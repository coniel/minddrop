import { useCallback } from 'react';
import {
  FontFamilyToken,
  FontFamilyTokens,
  TextColorToken,
  TextColorTokens,
  TypographyStyle,
} from '@minddrop/designs';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import {
  MarginSides,
  MarginStyleKeys,
  PaddingSides,
  PaddingStyleKeys,
  SpaceFields,
} from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import { TypographyFields, TypographyStyleKeys } from './TypographyFields';
import {
  fieldLabelKey,
  fontFamilyOptionKey,
  sectionLabelKey,
  textColourOptionKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for rich content editors: the body
 * type and frame, plus a nested type editor for the title bar
 * above the content.
 */
export const EditorStyleEditor: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const editor = useStyleEditor(elementId);
  const { isEditable, getValue, setValue, editableSides } = editor;

  const title = getValue<TypographyStyle>('title');

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
        {isEditable('color') && (
          <TokenSelect
            label={fieldLabelKey('colour')}
            tokens={TextColorTokens}
            value={getValue<TextColorToken>('color')}
            optionKey={textColourOptionKey}
            defaultToken="regular"
            onChange={(value) => setValue('color', value)}
          />
        )}
      </StyleSection>

      {isEditable('title') && (
        <StyleSection
          label={sectionLabelKey('title')}
          keys={TypographyStyleKeys}
          isEditable={isEditable}
          getValue={getTitleValue}
          setValue={setTitleValue}
        >
          <TypographyFields
            isEditable={isTitleEditable}
            getValue={getTitleValue}
            setValue={setTitleValue}
            showTruncate={false}
          />
        </StyleSection>
      )}

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
