import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TextColourFields, TextColourStyleKeys } from './TextColourFields';
import { TypographyFields, TypographyStyleKeys } from './TypographyFields';
import { sectionLabelKey } from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for text-rendering elements: the type
 * controls, plus the shared size and spacing blocks.
 */
export const TypographyStyleEditor: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const { isEditable, getValue, getResolvedValue, setValue, editableSides } =
    useStyleEditor(elementId);

  return (
    <>
      <StyleSection
        label={sectionLabelKey('typography')}
        keys={TypographyStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <TypographyFields
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('colour')}
        keys={TextColourStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <TextColourFields editor={{ isEditable, getResolvedValue, setValue }} />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('margin')}
        keys={MarginStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <SpaceFields
          hairline={false}
          sides={editableSides(MarginSides)}
          getValue={(key) => getValue(key)}
          onChange={setValue}
        />
      </StyleSection>
    </>
  );
};
