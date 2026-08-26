import { BackgroundEmphases, BackgroundEmphasis } from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';

const backgroundEmphasisKey = createI18nKeyBuilder(
  'designsStudio.style.backgroundEmphasis.',
);

// The unset background reads as the explicit none option
type BackgroundOption = 'none' | BackgroundEmphasis;

/**
 * How strongly a background applies its surface, opening with the
 * option leaving the element unfilled. The colour itself always
 * follows the entry's, so emphasis is the only choice on offer.
 */
const EmphasisOptions: OptionToggleFieldOption<BackgroundOption>[] =
  BackgroundEmphases.map((emphasis) => ({
    value: emphasis,
    label: backgroundEmphasisKey(emphasis, 'label'),
    description: backgroundEmphasisKey(emphasis, 'description'),
  }));

const BackgroundOptions: OptionToggleFieldOption<BackgroundOption>[] = [
  {
    value: 'none',
    label: backgroundEmphasisKey('none', 'label'),
    description: backgroundEmphasisKey('none', 'description'),
  },
  ...EmphasisOptions,
];

/**
 * The style keys the background block writes to.
 */
export const BackgroundStyleKeys: string[] = ['background'];

export interface BackgroundFieldProps {
  /**
   * The background emphasis the element is filled at, unset while
   * it renders unfilled.
   */
  value?: BackgroundEmphasis;

  /**
   * The i18n key of the field's label. Omitted, the field is
   * rendered without one.
   */
  label?: TranslationKey;

  /**
   * Whether the option leaving the element unfilled is offered.
   * Defaults to true; elements which always fill (the layout root)
   * have no none step.
   */
  none?: boolean;

  /**
   * Called with the chosen emphasis, or undefined when the element
   * is left unfilled.
   */
  onChange: (value: BackgroundEmphasis | undefined) => void;
}

/**
 * Renders the background emphasis toggle shared by every filled
 * element: containers, badges, icon boxes and embedded frames.
 */
export const BackgroundField: React.FC<BackgroundFieldProps> = ({
  value,
  label,
  none = true,
  onChange,
}) => {
  // The none option clears the key, so an unfilled element emits no
  // background
  function handleChange(option: BackgroundOption) {
    onChange(option === 'none' ? undefined : option);
  }

  return (
    <OptionToggleField
      label={label}
      options={none ? BackgroundOptions : EmphasisOptions}
      value={value ?? 'none'}
      onChange={handleChange}
    />
  );
};
