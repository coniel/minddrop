import {
  BorderColor,
  BorderEmphasis,
  BorderLineStyle,
  FontSizeToken,
  FontSizeTokens,
  FontWeightToken,
  FontWeightTokens,
  RadiusToken,
  RadiusTokens,
  SpaceToken,
  SurfaceColorToken,
  SurfaceColorTokens,
  TextTransform,
} from '@minddrop/designs';
import { BorderColorOptions, BorderEmphasisOptions } from './BorderFields';
import { OptionToggleField } from './OptionToggleField';
import { SpaceField } from './SpaceField';
import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TextColourFields } from './TextColourFields';
import { TokenSelect } from './TokenSelect';
import { TextTransformOptions } from './TypographyFields';
import {
  borderStyleOptionKey,
  fieldLabelKey,
  fontSizeOptionKey,
  fontWeightOptionKey,
  radiusOptionKey,
  sectionLabelKey,
  surfaceColourOptionKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

// The border line styles available on a badge
const BorderLineStyles: readonly BorderLineStyle[] = [
  'solid',
  'dashed',
  'dotted',
];

/**
 * Renders the style editor for badge chips: their text, fill and
 * outline. Badges take a uniform padding rather than per-side
 * values, since a chip should stay symmetrical.
 */
export const BadgeStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const { isEditable, getValue, getResolvedValue, setValue, editableSides } =
    useStyleEditor(elementId);

  // The neutral default is stored as an unset key
  function handleBorderColorChange(color: BorderColor) {
    setValue('borderColor', color === 'neutral' ? undefined : color);
  }

  // The regular default is stored as an unset key
  function handleBorderEmphasisChange(emphasis: BorderEmphasis) {
    setValue('borderEmphasis', emphasis === 'regular' ? undefined : emphasis);
  }

  return (
    <>
      <StyleSection
        label={sectionLabelKey('typography')}
        keys={['fontSize', 'fontWeight', 'textTransform', 'color']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('fontSize') && (
          <TokenSelect
            label={fieldLabelKey('fontSize')}
            tokens={FontSizeTokens}
            value={getValue<FontSizeToken>('fontSize')}
            optionKey={fontSizeOptionKey}
            onChange={(value) => setValue('fontSize', value)}
          />
        )}
        {isEditable('fontWeight') && (
          <TokenSelect
            label={fieldLabelKey('fontWeight')}
            tokens={FontWeightTokens}
            value={getValue<FontWeightToken>('fontWeight')}
            optionKey={fontWeightOptionKey}
            defaultToken="regular"
            onChange={(value) => setValue('fontWeight', value)}
          />
        )}
        {isEditable('textTransform') && (
          <OptionToggleField
            label={fieldLabelKey('textTransform')}
            options={TextTransformOptions}
            value={getValue<TextTransform>('textTransform') ?? 'none'}
            onChange={(value) =>
              setValue('textTransform', value === 'none' ? undefined : value)
            }
          />
        )}
        <TextColourFields editor={{ isEditable, getResolvedValue, setValue }} />
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('background')}
        keys={['background']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('background') && (
          <TokenSelect
            label={fieldLabelKey('background')}
            tokens={SurfaceColorTokens}
            value={getValue<SurfaceColorToken>('background')}
            optionKey={surfaceColourOptionKey}
            onChange={(value) => setValue('background', value)}
          />
        )}
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('border')}
        keys={['borderStyle', 'borderColor', 'borderEmphasis', 'borderRadius']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
        onOpen={() => setValue('borderStyle', 'solid')}
      >
        {isEditable('borderStyle') && (
          <TokenSelect
            label={fieldLabelKey('borderStyle')}
            tokens={BorderLineStyles}
            value={getValue<BorderLineStyle>('borderStyle')}
            optionKey={borderStyleOptionKey}
            onChange={(value) => setValue('borderStyle', value)}
          />
        )}
        {isEditable('borderColor') && (
          <OptionToggleField
            label={fieldLabelKey('borderColour')}
            options={BorderColorOptions}
            value={getValue<BorderColor>('borderColor') ?? 'neutral'}
            onChange={handleBorderColorChange}
          />
        )}
        {isEditable('borderEmphasis') && (
          <OptionToggleField
            label={fieldLabelKey('emphasis')}
            options={BorderEmphasisOptions}
            value={getValue<BorderEmphasis>('borderEmphasis') ?? 'regular'}
            onChange={handleBorderEmphasisChange}
          />
        )}
        {isEditable('borderRadius') && (
          <TokenSelect
            label={fieldLabelKey('radius')}
            tokens={RadiusTokens}
            value={getValue<RadiusToken>('borderRadius')}
            optionKey={radiusOptionKey}
            onChange={(value) => setValue('borderRadius', value)}
          />
        )}
      </StyleSection>

      <StyleSection
        label={sectionLabelKey('padding')}
        keys={['padding']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {isEditable('padding') && (
          <SpaceField
            hairline={false}
            value={getValue<SpaceToken>('padding')}
            onChange={(value) => setValue('padding', value)}
          />
        )}
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
          getValue={(key) => getValue<SpaceToken>(key)}
          onChange={setValue}
        />
      </StyleSection>
    </>
  );
};
