import { loadConfigs } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { onRun as onRunTheme, Theme } from '@minddrop/theme';
import { initializeWorkspaces } from './initializeWorkspaces';
import { watchAppConfigFiles } from './watchAppConfigFiles';

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<VoidFunction> {
  // Load persisted config values
  await loadConfigs();

  // Initialize workspaces
  await initializeWorkspaces();

  // Watch for app config file changes
  const cancelConfigsWatcher = await watchAppConfigFiles();

  Theme.addEventListener(
    'theme:appearance:set-value',
    'app:set-body-theme-appearance-class',
    ({ data }) => {
      // Toggle the theme appearance class on <body>
      // whenever the theme appearance value is changes.
      if (data === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
    },
  );

  // Run core extensions
  onRunTheme();

  return () => {
    cancelConfigsWatcher();
  };
}
