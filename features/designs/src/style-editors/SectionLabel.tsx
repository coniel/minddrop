import { TranslationKey, useTranslation } from '@minddrop/i18n';

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
  const { t } = useTranslation();

  return <span className="element-style-editor-section-label">{t(label)}</span>;
};
