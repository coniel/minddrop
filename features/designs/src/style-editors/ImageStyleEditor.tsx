import { ObjectFit } from '@minddrop/designs';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import {
  ContainerHeightFields,
  HeightStyleKeys,
} from './ContainerHeightFields';
import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import {
  fieldLabelKey,
  objectFitOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

// How the image sits inside its box
const ObjectFits: readonly ObjectFit[] = ['cover', 'contain', 'fill'];

/**
 * Renders the style editor for image elements: the fit, plus the
 * shared border, size and spacing blocks. The size block matches
 * the container one, so an image sizes like a card does; its
 * proportions live in the ratio sizing mode.
 */
export const ImageStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const editor = useStyleEditor(elementId);
  const { isEditable, getValue, setValue, editableSides } = editor;

  return (
    <>
      <StyleSection
        label={sectionLabelKey('image')}
        keys={['objectFit']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('objectFit') && (
          <TokenSelect
            label={fieldLabelKey('objectFit')}
            tokens={ObjectFits}
            value={getValue<ObjectFit>('objectFit')}
            optionKey={objectFitOptionKey}
            onChange={(value) => setValue('objectFit', value)}
          />
        )}
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('size')}
        keys={HeightStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <ContainerHeightFields editor={editor} bounds={false} />
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
