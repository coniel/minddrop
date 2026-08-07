import React from 'react';
import { useDevToolsPanels } from '@minddrop/dev-tools';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Group, KeyboardShortcut, Stack, Text } from '@minddrop/ui-primitives';
import { ToggleDevToolsShortcutKey } from '../constants';
import './DevToolsShortcutsHelp.css';

const GeneralShortcuts: [key: string, label: TranslationKey][] = [
  [ToggleDevToolsShortcutKey, 'devTools.shortcuts.toggle'],
  ['?', 'devTools.shortcuts.help'],
  ['Esc', 'devTools.shortcuts.close'],
];

const WindowShortcuts: [key: string, label: TranslationKey][] = [
  ['f', 'devTools.shortcuts.windowed'],
  ['a', 'devTools.shortcuts.sidebar'],
  ['[', 'devTools.shortcuts.snapLeft'],
  [']', 'devTools.shortcuts.snapRight'],
];

export interface DevToolsShortcutsHelpProps {
  /**
   * Callback fired when the help is dismissed.
   */
  onClose: () => void;
}

/**
 * Renders an overlay listing the dev tools keyboard shortcuts.
 */
export const DevToolsShortcutsHelp: React.FC<DevToolsShortcutsHelpProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const panels = useDevToolsPanels();

  // Only panels which registered a shortcut key are listed
  const panelShortcuts = panels.filter((panel) => panel.shortcut);

  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="dev-tools-shortcuts-help" onClick={onClose}>
      <Stack
        gap={4}
        className="dev-tools-shortcuts-help-card"
        onClick={handleCardClick}
      >
        <DevToolsShortcutsHelpGroup
          title="devTools.shortcuts.general"
          shortcuts={GeneralShortcuts}
        />

        <DevToolsShortcutsHelpGroup
          title="devTools.shortcuts.window"
          shortcuts={WindowShortcuts}
        />

        {panelShortcuts.length > 0 && (
          <Stack gap={1}>
            <Text size="xs" color="subtle" weight="semibold">
              {t('devTools.shortcuts.panels')}
            </Text>

            {panelShortcuts.map((panel) => (
              <Group key={panel.id} gap={2} align="center">
                <KeyboardShortcut keys={[panel.shortcut ?? '']} />
                <Text size="sm">{t(panel.label)}</Text>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

interface DevToolsShortcutsHelpGroupProps {
  /**
   * Translation key of the group's title.
   */
  title: TranslationKey;

  /**
   * The group's shortcut keys paired with their label's
   * translation key.
   */
  shortcuts: [key: string, label: TranslationKey][];
}

/**
 * Renders a titled group of shortcut keys and their labels.
 */
const DevToolsShortcutsHelpGroup: React.FC<DevToolsShortcutsHelpGroupProps> = ({
  title,
  shortcuts,
}) => {
  const { t } = useTranslation();

  return (
    <Stack gap={1}>
      <Text size="xs" color="subtle" weight="semibold">
        {t(title)}
      </Text>

      {shortcuts.map(([key, label]) => (
        <Group key={key} gap={2} align="center">
          <KeyboardShortcut keys={[key]} />
          <Text size="sm">{t(label)}</Text>
        </Group>
      ))}
    </Stack>
  );
};
