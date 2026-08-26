import {
  BackgroundEmphasis,
  IconContainerStyle,
  IconSizeToken,
  IconSizeTokens,
  RadiusTokens,
  SpaceToken,
} from '@minddrop/designs';
import { BackgroundField } from './BackgroundField';
import { SpaceField } from './SpaceField';
import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TextColourFields } from './TextColourFields';
import { TokenSelect } from './TokenSelect';
import {
  fieldLabelKey,
  iconSizeOptionKey,
  radiusOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for icon elements: the icon itself, and
 * the optional box drawn around it. The box is a nested style, so
 * setting any of its values creates it and clearing them all
 * removes it.
 */
export const IconStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const { isEditable, getValue, getResolvedValue, setValue, editableSides } =
    useStyleEditor(elementId);

  const container = getValue<IconContainerStyle>('container');

  // Write a single key of the nested box style, dropping the box
  // entirely once none of its values remain set
  function setContainerValue(key: string, value: unknown) {
    const nextContainer = {
      ...container,
      [key]: value,
    } as Record<string, unknown>;

    // Remove keys the user cleared so the box does not linger as
    // an empty object
    if (value === undefined) {
      delete nextContainer[key];
    }

    const hasValues = Object.keys(nextContainer).length > 0;

    setValue('container', hasValues ? nextContainer : undefined);
  }

  // Read a single key of the nested box style, so the box section
  // tracks its own keys rather than the element's
  function getContainerValue(key: string) {
    return (container as Record<string, unknown> | undefined)?.[key];
  }

  return (
    <>
      <StyleSection
        label={sectionLabelKey('icon')}
        keys={['size', 'color']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('size') && (
          <TokenSelect
            label={fieldLabelKey('iconSize')}
            tokens={IconSizeTokens}
            value={getValue<IconSizeToken>('size')}
            optionKey={iconSizeOptionKey}
            onChange={(value) => setValue('size', value)}
          />
        )}
        <TextColourFields
          editor={{ isEditable, getResolvedValue, setValue }}
          label={fieldLabelKey('iconColour')}
        />
      </StyleSection>

      {isEditable('container') && (
        <StyleSection
          label={sectionLabelKey('iconContainer')}
          keys={['background', 'radius', 'padding']}
          isEditable={isEditable}
          getValue={getContainerValue}
          setValue={setContainerValue}
        >
          <BackgroundField
            label={fieldLabelKey('background')}
            value={container?.background}
            onChange={(value: BackgroundEmphasis | undefined) =>
              setContainerValue('background', value)
            }
          />
          <TokenSelect
            label={fieldLabelKey('radius')}
            tokens={RadiusTokens}
            value={container?.radius}
            optionKey={radiusOptionKey}
            onChange={(value) => setContainerValue('radius', value)}
          />
          <SpaceField
            label={fieldLabelKey('padding')}
            hairline={false}
            value={container?.padding}
            onChange={(value) => setContainerValue('padding', value)}
          />
        </StyleSection>
      )}

      <StyleSection
        label={sectionLabelKey('margin')}
        keys={MarginStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        <SpaceFields
          sides={editableSides(MarginSides)}
          getValue={(key) => getValue<SpaceToken>(key)}
          onChange={setValue}
        />
      </StyleSection>
    </>
  );
};
