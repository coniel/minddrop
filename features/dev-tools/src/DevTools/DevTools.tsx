import React, { useCallback, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { IconButton, Spacer, Text } from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { DevToolsShortcutsHelp } from '../DevToolsShortcutsHelp';
import { DevToolsTabs } from '../DevToolsTabs';
import { DevToolsUiState } from '../DevToolsUiState';
import { DevToolsWindow } from '../DevToolsWindow';
import { toggleDevToolsSidebar } from '../toggleDevToolsSidebar';
import { toggleDevToolsWindowed } from '../toggleDevToolsWindowed';
import { useActiveDevToolsPanel } from '../useActiveDevToolsPanel';
import { useDevToolsShortcuts } from '../useDevToolsShortcuts';
import './DevTools.css';

/**
 * Renders the dev tools shell: the panel tabs, the active panel,
 * and the keyboard shortcuts which drive them.
 */
export const DevTools: React.FC = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const open = DevToolsUiState.useValue('open');
  const windowed = DevToolsUiState.useValue('windowed');
  const sidebarOpen = DevToolsUiState.useValue('sidebarOpen');
  const activePanel = useActiveDevToolsPanel();
  const ActivePanel = activePanel?.component;

  const handleToggleHelp = useCallback(() => {
    setHelpOpen((previous) => !previous);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  useDevToolsShortcuts({
    helpOpen,
    onToggleHelp: handleToggleHelp,
    onCloseHelp: handleCloseHelp,
  });

  // Closed dev tools render nothing, but the shortcuts above
  // remain active so they can be reopened
  if (!open) {
    return null;
  }

  const header = (
    <>
      <IconButton
        icon="panel-left"
        label="devTools.actions.toggleSidebar"
        size="sm"
        active={sidebarOpen}
        onClick={toggleDevToolsSidebar}
      />

      <DevToolsTabs />

      <Spacer />

      <IconButton
        icon={windowed ? 'maximize-2' : 'minimize-2'}
        label="devTools.actions.toggleWindowed"
        size="sm"
        onClick={toggleDevToolsWindowed}
      />
    </>
  );

  const body = (
    <div className="dev-tools-body">
      {ActivePanel && <ActivePanel />}
      {!ActivePanel && <DevToolsEmptyState />}
    </div>
  );

  const help = helpOpen && <DevToolsShortcutsHelp onClose={handleCloseHelp} />;

  // Floating window mode
  if (windowed) {
    return (
      <DevToolsWindow header={header}>
        {help}
        {body}
      </DevToolsWindow>
    );
  }

  // Fullscreen overlay mode
  return (
    <div className="dev-tools-overlay">
      <div className="dev-tools">
        <div className="dev-tools-header">{header}</div>
        {help}
        {body}
      </div>
    </div>
  );
};

/**
 * Renders a message shown in place of a panel when no dev tools
 * panels are registered.
 */
const DevToolsEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DevToolsPanelLayout>
      <div className="dev-tools-empty-state">
        <Text size="sm" color="subtle">
          {t('devTools.noPanels')}
        </Text>
      </div>
    </DevToolsPanelLayout>
  );
};
