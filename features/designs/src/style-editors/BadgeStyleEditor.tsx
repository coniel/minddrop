import {
  FontWeightToken,
  FontWeightTokens,
  SpaceToken,
  TextTransform,
} from '@minddrop/designs';
import { OptionToggleField } from './OptionToggleField';
import { MarginSides, MarginStyleKeys, SpaceFields } from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import { TextTransformOptions } from './TypographyFields';
import {
  fieldLabelKey,
  fontWeightOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

/**
 * Renders the style editor for badge chips: the label's weight and
 * case, and the space around the row of chips. A chip's fill and
 * label colour come from its select option, and its size, rounding
 * and padding are the chip shape its variant sets, so none of them
 * are offered here.
 */
export const BadgeStyleEditor: React.FC<StyleEditorProps> = ({ elementId }) => {
  const { isEditable, getValue, setValue, editableSides } =
    useStyleEditor(elementId);

  return (
    <>
      <StyleSection
        label={sectionLabelKey('typography')}
        keys={['fontWeight', 'textTransform']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
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
