import { Ast } from '@minddrop/ast';
import { loadConfigs } from '@minddrop/core';
import {
  DatabaseAutomations,
  DatabaseEntries,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { initializeExtensions } from '@minddrop/extensions';
import { initializeI18n } from '@minddrop/i18n';
import { Theme, VariantChangedEventData } from '@minddrop/ui-theme';
import { Paths } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { Workspaces } from '@minddrop/workspaces';
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
  console.log('init');

  initialized = true;

  // Watch for theme variant changes
  Events.addListener(
    Theme.events.VariantChanged,
    'app:set-body-theme-appearance-class',
    setThemeAppearanceClassOnBody,
  );

  EditorElements.registerDefaults();
  EditorMarks.registerDefaults();
  Ast.registerDefaultConfigs();
  initializeViewTypes();

  // Load persisted config values
  await loadConfigs();
  Paths.workspace = '/Users/oscar/Documents/MindDrop 2';
  Paths.workspaceConfigs = '/Users/oscar/Documents/MindDrop 2/.minddrop';
  Paths.httpServerHost = 'http://localhost:14567';

  // Initialize databases
  await Workspaces.initialize();
  DatabaseTemplates.initialize();
  DatabaseAutomations.initialize();
  await Designs.initialize();
  await Views.initialize();
  await Databases.initialize();
  await DatabaseEntries.initialize();

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Watch for app config file changes
  // const cancelConfigsWatcher = await watchAppConfigFiles();

  // Initialize theme
  await Theme.initialize();

  // Initialize extensions
  await initializeExtensions([]);

  cleanupFn = () => {
    // Remove config files watcher
    // cancelConfigsWatcher();

    console.log('cleanupFn');
    // Remove theme variant listener
    Events.removeListener(
      Theme.events.VariantChanged,
      'app:set-body-theme-appearance-class',
    );
  };

  return cleanupFn;
}

/**
 * Toggles the theme appearance class on <body>
 * whenever the theme variant changes.
 */
function setThemeAppearanceClassOnBody({
  data,
}: {
  data: VariantChangedEventData;
}) {
  if (data.resolvedAppearance === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }
}
