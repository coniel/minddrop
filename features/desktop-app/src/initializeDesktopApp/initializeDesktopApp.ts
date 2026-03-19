import { Ast } from '@minddrop/ast';
import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { initializeExtensions } from '@minddrop/extensions';
import {
  DatabaseViewStateStore,
  EntryDialogSizesStore,
} from '@minddrop/feature-databases';
import { initializeSearch } from '@minddrop/feature-search';
import { initializeI18n } from '@minddrop/i18n';
import { Search } from '@minddrop/search';
import { Sql } from '@minddrop/sql';
import { Theme, VariantChangedEventData } from '@minddrop/ui-theme';
import { Paths } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../AppUiState';
import { registerAppDataStoreListeners } from '../registerAppDataStoreListeners';
import { registerWorkspaceStoreListeners } from '../registerWorkspaceStoreListeners';
import { initializeSelection } from './initializeSelection';
import { initializeViewTypes } from './initializeViewTypes';

// In development mode, React will run useEffect hooks twice
// when the app is first loaded. This guard prevents the app
// from being initialized twice.
let initialized = false;

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<void> {
  if (initialized) {
    return;
  }

  initialized = true;

  // Register search translations
  initializeSearch();

  // Register listeners that persist and hydrate app-config
  // stores to JSON files in the AppData directory
  registerAppDataStoreListeners();

  // Hydrate app UI state from persisted config
  await AppUiState.hydrate();

  // Hydrate per-database view state
  await DatabaseViewStateStore.hydrate();

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

  Paths.workspace = '/Users/oscar/Documents/MindDrop 2';
  Paths.workspaceConfigs = '/Users/oscar/Documents/MindDrop 2/.minddrop';

  // Register listeners that persist and hydrate workspace-config
  // stores to JSON files in the workspace config directory
  registerWorkspaceStoreListeners();

  // Hydrate entry dialog sizes from workspace config
  await EntryDialogSizesStore.hydrate();

  // Initialize core packages
  await Workspaces.initialize();
  await Designs.initialize();
  await Views.initialize();
  Sql.initialize();
  const { schemaChanged } = await Databases.initialize();

  // Initialize the MiniSearch index and register event
  // listeners for incremental sync
  await Search.initialize({ schemaChanged });

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Initialize theme
  await Theme.initialize();

  // Initialize extensions
  await initializeExtensions([]);
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
