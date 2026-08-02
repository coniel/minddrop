import { Ast } from '@minddrop/ast';
import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { initializeExtensions } from '@minddrop/extensions';
import { DatabaseViewStateStore } from '@minddrop/feature-databases';
import { LayoutRegionSizesStore } from '@minddrop/feature-designs';
import { initializeSearch } from '@minddrop/feature-search';
import { TabSetsStore, initializeViewsFeature } from '@minddrop/feature-views';
import { initializeI18n } from '@minddrop/i18n';
import { Search } from '@minddrop/search';
import { Sql } from '@minddrop/sql';
import { Theme, VariantChangedEventData } from '@minddrop/ui-theme';
import { Views } from '@minddrop/views';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../AppUiState';
import { registerAppDataStoreListeners } from '../registerAppDataStoreListeners';
import { registerWorkspaceStoreListeners } from '../registerWorkspaceStoreListeners';
import { initializeDataViewTypes } from './initializeDataViewTypes';
import { initializeMainContentViews } from './initializeMainContentViews';
import { initializeSelection } from './initializeSelection';

// In development mode, React runs effects twice on first load, so
// initializeDesktopApp may be called more than once. Memoizing the
// in-flight promise ensures initialization runs once and every caller
// awaits the same completion, so the app only renders once the stores
// have finished hydrating.
let initPromise: Promise<void> | null = null;

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export function initializeDesktopApp(): Promise<void> {
  if (!initPromise) {
    initPromise = runInitialization();
  }

  return initPromise;
}

/**
 * Runs the one-time desktop app initialization.
 */
async function runInitialization(): Promise<void> {
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
  initializeDataViewTypes();
  initializeMainContentViews();
  initializeViewsFeature();

  // Initialize workspaces (sets Paths.workspace and
  // Paths.workspaceConfigs from the first loaded workspace)
  await Workspaces.initialize();

  // Register listeners that persist and hydrate workspace-config
  // stores to JSON files in the workspace config directory
  registerWorkspaceStoreListeners();

  // Hydrate layout region sizes (dialogs, panels) from workspace config
  await LayoutRegionSizesStore.hydrate();

  // Hydrate open tabs from workspace config
  await TabSetsStore.hydrate();

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
