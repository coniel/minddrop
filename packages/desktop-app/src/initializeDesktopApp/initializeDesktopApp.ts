import { Ast } from '@minddrop/ast';
import { BaseItemTypes } from '@minddrop/base-item-types';
import { loadConfigs } from '@minddrop/core';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { initializeExtensions } from '@minddrop/extensions';
import { initializeI18n } from '@minddrop/i18n';
import { ItemTypes } from '@minddrop/item-types';
import { Theme, ThemeAppearance, onRun as onRunTheme } from '@minddrop/theme';
import { Paths } from '@minddrop/utils';
import { initializeSelection } from './initializeSelection';
import { watchAppConfigFiles } from './watchAppConfigFiles';

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<VoidFunction> {
  EditorElements.registerDefaults();
  EditorMarks.registerDefaults();
  Ast.registerDefaultConfigs();

  // Load persisted config values
  await loadConfigs();
  Paths.workspace = '/Users/oscar/Documents/MindDrop 2';
  Paths.workspaceConfigs = '/Users/oscar/Documents/MindDrop 2/.minddrop';

  // Initialize core base item types
  BaseItemTypes.initialize();

  // Load item types
  ItemTypes.load();

  // Initialize global selection keyboard shortcuts
  initializeSelection();

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

  // Initialize extensions
  await initializeExtensions([]);

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
