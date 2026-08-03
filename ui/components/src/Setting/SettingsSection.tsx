import { ReactNode } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Stack, Text, propsToClass } from '@minddrop/ui-primitives';
import './Setting.css';

export interface SettingsSectionProps {
  /**
   * The section heading.
   */
  title: TranslationKey;

  /**
   * The setting rows rendered within the section.
   */
  children: ReactNode;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

/**
 * Groups a set of settings rows under a section heading.
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <Stack className={propsToClass('settings-section', { className })} gap={0}>
      {/* Section heading */}
      <Text
        className="settings-section-title"
        as="h3"
        size="base"
        weight="medium"
        text={title}
      />

      {/* Setting rows */}
      <Stack className="settings-section-rows" gap={0}>
        {children}
      </Stack>
    </Stack>
  );
};
