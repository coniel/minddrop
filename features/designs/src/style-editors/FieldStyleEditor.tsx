import { BackgroundEmphasis } from '@minddrop/designs';
import { BackgroundField, BackgroundStyleKeys } from './BackgroundField';
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
import { TextColourFields, TextColourStyleKeys } from './TextColourFields';
import { fieldLabelKey, sectionLabelKey } from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for input field elements: the value's
 * colour plus the field box chrome (background, border, spacing).
 */
export const FieldStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const editor = useStyleEditor(elementId);
  const { isEditable, getValue, getResolvedValue, setValue, editableSides } =
    editor;

  return (
    <>
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
        label={sectionLabelKey('background')}
        keys={BackgroundStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('background') && (
          <BackgroundField
            label={fieldLabelKey('background')}
            value={getValue<BackgroundEmphasis>('background')}
            onChange={(value) => setValue('background', value)}
          />
        )}
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
