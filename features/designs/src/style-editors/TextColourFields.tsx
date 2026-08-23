import { TextColorToken, TextColorTokens } from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { fieldLabelKey } from './styleI18nKeys';
import { StyleEditor } from './useStyleEditor';

const textColourKey = createI18nKeyBuilder('designsStudio.style.textColour.');

/**
 * The text colour steps, from full contrast down to quiet
 * supporting text. Colour always follows the entry's colour, so
 * the steps only decide how strongly it shows.
 */
const TextColorOptions: OptionToggleFieldOption<TextColorToken>[] =
  TextColorTokens.map((token) => ({
    value: token,
    label: textColourKey(token, 'label'),
    description: textColourKey(token, 'description'),
  }));

/**
 * The style keys the text colour block writes to.
 */
export const TextColourStyleKeys: string[] = ['color'];

export interface TextColourFieldsProps {
  /**
   * The style editing helpers of the element being edited.
   */
  editor: Pick<StyleEditor, 'isEditable' | 'getResolvedValue' | 'setValue'>;

  /**
   * The i18n key of the colour field's label.
   */
  label?: TranslationKey;
}

/**
 * Renders the text colour step toggle. Shows the effective value,
 * so a variant's default colour reads as the starting selection
 * rather than an unset field.
 */
export const TextColourFields: React.FC<TextColourFieldsProps> = ({
  editor,
  label = fieldLabelKey('colour'),
}) => {
  const { isEditable, getResolvedValue, setValue } = editor;

  if (!isEditable('color')) {
    return null;
  }

  return (
    <OptionToggleField
      label={label}
      options={TextColorOptions}
      value={getResolvedValue<TextColorToken>('color') ?? 'regular'}
      onChange={(value) => setValue('color', value)}
    />
  );
};
