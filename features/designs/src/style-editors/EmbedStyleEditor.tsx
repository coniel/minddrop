import {
  AspectRatio,
  AspectRatios,
  BackgroundEmphasis,
  HeightValue,
} from '@minddrop/designs';
import { BackgroundField } from './BackgroundField';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import { HeightField } from './HeightField';
import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import {
  aspectRatioOptionKey,
  fieldLabelKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for embedded frames: views, web pages
 * and the image viewer. These usually fill the space left in the
 * page, so the height field leads with the fill option.
 */
export const EmbedStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const editor = useStyleEditor(elementId);
  const { isEditable, getValue, setValue, editableSides } = editor;

  return (
    <>
      <StyleSection
        label={sectionLabelKey('frame')}
        keys={['background', 'aspectRatio']}
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
        {isEditable('aspectRatio') && (
          <TokenSelect
            label={fieldLabelKey('aspectRatio')}
            tokens={AspectRatios}
            value={getValue<AspectRatio>('aspectRatio')}
            optionKey={aspectRatioOptionKey}
            onChange={(value) => setValue('aspectRatio', value)}
          />
        )}
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('size')}
        keys={['height']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('height') && (
          <HeightField
            value={getValue<HeightValue>('height')}
            onChange={(value) => setValue('height', value)}
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
