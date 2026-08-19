import { TranslationKey } from '@minddrop/i18n';
import { Stack, Text } from '@minddrop/ui-primitives';
import './PanelSection.css';

export interface PanelSectionProps {
  /**
   * The i18n key of the section label.
   */
  label: TranslationKey;

  /**
   * The fields inside the section.
   */
  children: React.ReactNode;
}

/**
 * Renders an always-visible group of panel fields. Used for what
 * an element shows and which role variants it takes, neither of
 * which is styling: collapsing them would hide an element's
 * content behind a closed section, and clearing them on collapse
 * would drop a property binding.
 */
export const PanelSection: React.FC<PanelSectionProps> = ({
  label,
  children,
}) => {
  return (
    <Stack gap={3} className="designs-panel-section">
      <Text
        className="designs-panel-section-label"
        text={label}
        size="base"
        weight="semibold"
        color="regular"
      />
      {children}
    </Stack>
  );
};
