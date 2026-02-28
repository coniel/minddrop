import { useTranslation } from '@minddrop/i18n';

export interface SectionLabelProps {
  label: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label }) => {
  const { t } = useTranslation();

  return (
    <span className="element-style-editor-section-label">{t(label)}</span>
  );
};
