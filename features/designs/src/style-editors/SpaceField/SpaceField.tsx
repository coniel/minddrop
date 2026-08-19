import { SpaceToken } from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { ScaleField } from '../ScaleField';
import { spaceHintKey, spaceOptionKey } from '../styleI18nKeys';

/**
 * The spacing steps the studio offers, in scale order, leaving out
 * the sub-unit steps which nudge control chrome rather than space
 * content.
 */
export const SpaceScaleTokens: readonly SpaceToken[] = [
  'px',
  '1',
  // the 1.5 step, kebab-cased for its CSS variable name
  '1-5',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
];

/**
 * The spacing steps without the hairline, for padding fields: a
 * one-pixel inset never reads as breathing room.
 */
export const InsetScaleTokens: readonly SpaceToken[] = SpaceScaleTokens.filter(
  (token) => token !== 'px',
);

// No spacing property inherits, so an unset one is simply no
// space at all, the step below the smallest
const NoSpacing = {
  label: 'designsStudio.style.space.none',
} as const;

export interface SpaceFieldProps {
  /**
   * The field label. Omitted on fields whose section already
   * names them.
   */
  label?: TranslationKey;

  /**
   * Whether the hairline step is offered. Padding fields omit it.
   */
  hairline?: boolean;

  /**
   * The currently selected step, or undefined when the style key
   * is not set.
   */
  value: SpaceToken | undefined;

  /**
   * Called with the chosen step, or undefined when the spacing is
   * cleared.
   */
  onChange: (value: SpaceToken | undefined) => void;
}

/**
 * Renders a spacing step as a stepper, since spacing is an ordered
 * scale the user reads as more or less room rather than a set of
 * named choices.
 */
export const SpaceField: React.FC<SpaceFieldProps> = ({
  label,
  hairline = true,
  value,
  onChange,
}) => {
  return (
    <ScaleField
      label={label}
      steps={hairline ? SpaceScaleTokens : InsetScaleTokens}
      value={value}
      stepLabelKey={spaceLabelKey}
      stepHintKey={spaceHintKey}
      emptyOption={NoSpacing}
      decreaseLabel="designsStudio.style.space.decrease"
      increaseLabel="designsStudio.style.space.increase"
      onChange={onChange}
    />
  );
};

/**
 * Resolves the label key of a spacing step.
 */
function spaceLabelKey(token: SpaceToken): TranslationKey {
  return spaceOptionKey(token, 'label');
}
