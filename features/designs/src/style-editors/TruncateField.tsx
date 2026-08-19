import { useTranslation } from '@minddrop/i18n';
import { ScaleField } from './ScaleField';
import { fieldLabelKey } from './styleI18nKeys';

/**
 * The line counts offered before text is cut off with an ellipsis:
 * every count up to five, then paragraph-sized jumps.
 */
const LineCounts = [1, 2, 3, 4, 5, 10, 15, 20];

// An unset count is no truncation at all, the step below the
// smallest
const NoTruncation = {
  label: 'designsStudio.style.truncate.off.label',
  description: 'designsStudio.style.truncate.off.description',
} as const;

export interface TruncateFieldProps {
  /**
   * The maximum number of lines, or undefined when the text runs
   * to its full length.
   */
  value: number | undefined;

  /**
   * Called with the chosen line count, or undefined when
   * truncation is switched off.
   */
  onChange: (value: number | undefined) => void;
}

/**
 * Renders the line limit after which text is cut off with an
 * ellipsis as a stepper, since line counts read as more or less
 * room rather than a set of named choices.
 */
export const TruncateField: React.FC<TruncateFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <ScaleField
      label={fieldLabelKey('truncate')}
      steps={LineCounts}
      value={value}
      stepStringLabel={(count) =>
        t('designsStudio.style.truncate.lines', { count })
      }
      emptyOption={NoTruncation}
      decreaseLabel="designsStudio.style.truncate.decrease"
      increaseLabel="designsStudio.style.truncate.increase"
      onChange={onChange}
    />
  );
};
