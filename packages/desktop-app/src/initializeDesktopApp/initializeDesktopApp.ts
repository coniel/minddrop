import { loadConfigs } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { onRun as onRunTheme, Theme, ThemeAppearance } from '@minddrop/theme';
import { initializeWorkspaces } from './initializeWorkspaces';
import { watchAppConfigFiles } from './watchAppConfigFiles';
import { Documents } from '@minddrop/documents';
import { Workspaces } from '@minddrop/workspaces';

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

  // Initialize documents
  await initializeDocuments();

  // Watch for app config file changes
  const cancelConfigsWatcher = await watchAppConfigFiles();

  // Watch for theme appearance changes
  Theme.addEventListener(
    'theme:appearance:set-value',
    'app:set-body-theme-appearance-class',
    setThemeAppearanceClassOnBody,
  );

  // Run core extensions
  onRunTheme();

  return () => {
    // Remove config files watcher
    cancelConfigsWatcher();

    // Remove theme appearance listener
    Theme.removeEventListener(
      'theme:appearance:set-value',
      'app:set-body-theme-appearance-class',
      setThemeAppearanceClassOnBody,
    );
  };
}

/**
 * Toggles the theme appearance class on <body>
 * whenever the theme appearance value is changes.
 */
function setThemeAppearanceClassOnBody({ data }: { data: ThemeAppearance }) {
  if (data === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }
}

/**
 * Initializes documents.
 */
async function initializeDocuments() {
  const workspacePaths = Workspaces.getAll().map((workspace) => workspace.path);

  // Load documents from all workspaces
  await Documents.load(workspacePaths);
}
