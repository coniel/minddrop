import { Ast } from '@minddrop/ast';
import { loadConfigs } from '@minddrop/core';
import {
  DatabaseAutomations,
  DatabaseEntries,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { initializeExtensions } from '@minddrop/extensions';
import { initializeI18n } from '@minddrop/i18n';
import { Theme, ThemeAppearance, onRun as onRunTheme } from '@minddrop/theme';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { Designs } from '../../../designs/src';
import { initializeSelection } from './initializeSelection';
import { initializeViewTypes } from './initializeViewTypes';

// import { watchAppConfigFiles } from './watchAppConfigFiles';

// In development mode, React will run useEffect hooks twice
// when the app is first loaded. This is a workaround to prevent
// the app from being initialized twice.
let cleanupFn: VoidFunction = () => {};
let initialized = false;

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<VoidFunction> {
  if (initialized) {
    return cleanupFn;
  }

  initialized = true;

  EditorElements.registerDefaults();
  EditorMarks.registerDefaults();
  Ast.registerDefaultConfigs();
  initializeViewTypes();

  // Load persisted config values
  await loadConfigs();
  Paths.workspace = '/Users/oscar/Documents/MindDrop 2';
  Paths.workspaceConfigs = '/Users/oscar/Documents/MindDrop 2/.minddrop';
  Paths.httpServerHost = 'http://localhost:14567';

  await Workspaces.initialize();
  // Initialize databases
  DatabaseTemplates.initialize();
  DatabaseAutomations.initialize();
  await Databases.initialize();
  await DatabaseEntries.initialize();
  await Designs.initialize();

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Watch for app config file changes
  // const cancelConfigsWatcher = await watchAppConfigFiles();

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

  cleanupFn = () => {
    // Remove config files watcher
    // cancelConfigsWatcher();

    // Remove theme appearance listener
    Theme.removeEventListener(
      'theme:appearance:set-value',
      'app:set-body-theme-appearance-class',
      setThemeAppearanceClassOnBody,
    );
  };

  return cleanupFn;
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
