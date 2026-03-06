import { TranslationKey } from '@minddrop/i18n';
import { Text } from '@minddrop/ui-primitives';

export interface SectionLabelProps {
  /**
   * The i18n key for the label.
   */
  label: TranslationKey;
}

/**
 * Renders a styled section label for the element style editor.
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({ label }) => {
  return (
    <Text
      className="element-style-editor-section-label"
      text={label}
      size="base"
      weight="semibold"
      color="regular"
    />
  );
};
