import { initializeCore, loadConfigs } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { onRun as onRunTheme, Theme } from '@minddrop/theme';
import { initializeWorkspaces } from './initializeWorkspaces';

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<void> {
  // Create a core instance
  const core = initializeCore({ extensionId: 'minddrop:app' });

  // Initialize internationalization
  initializeI18n();

  // Load persisted config values
  await loadConfigs();

  // Initialize workspaces
  await initializeWorkspaces();

  Theme.addEventListener(core, 'theme:appearance:set-value', ({ data }) => {
    // Toggle the theme appearance class on <body>
    // whenever the theme appearance value is changes.
    if (data === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  });

  // Run core extensions
  onRunTheme(core);
}
