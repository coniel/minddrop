import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { Designs as DesignsNext } from '@minddrop/designs';
import { Designs } from '@minddrop/designs-legacy';
import { registerBlockSelectionSerializer } from '@minddrop/editor';
import { initializeCollectionsFeature } from '@minddrop/feature-collections';
import { initializeDataViewsFeature } from '@minddrop/feature-data-views';
import { DatabaseViewStateStore } from '@minddrop/feature-databases';
import { initializeDesignsFeature } from '@minddrop/feature-designs';
import { LayoutRegionSizesStore } from '@minddrop/feature-designs-legacy';
import { initializeDevToolsFeature } from '@minddrop/feature-dev-tools';
import { initializeQueriesFeature } from '@minddrop/feature-queries';
import { initializeSearch } from '@minddrop/feature-search';
import {
  SpaceViewStateStore,
  initializeSpacesFeature,
} from '@minddrop/feature-spaces';
import { TabSetsStore, initializeViewsFeature } from '@minddrop/feature-views';
import { Fs, startFileSystemWatcher } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import { Search } from '@minddrop/search';
import { Spaces } from '@minddrop/spaces';
import { Sql } from '@minddrop/sql';
import { initializeInputModalityTracking } from '@minddrop/ui-primitives';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../AppUiState';
import { registerAppDataStoreListeners } from '../registerAppDataStoreListeners';
import { registerWorkspaceStoreListeners } from '../registerWorkspaceStoreListeners';
import { initializeDataViewTypes } from './initializeDataViewTypes';
import { initializeSelection } from './initializeSelection';
import { initializeTheme } from './initializeTheme';
import { registerViews } from './registerViews';

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
  // Track whether the user is navigating by keyboard or pointer
  initializeInputModalityTracking();

  // Register search translations
  initializeSearch();

  // Register spaces translations
  initializeSpacesFeature();

  // Register listeners that persist and hydrate app-config
  // stores to JSON files in the AppData directory
  registerAppDataStoreListeners();

  // Hydrate app UI state from persisted config
  await AppUiState.hydrate();

  // Hydrate per-database view state
  await DatabaseViewStateStore.hydrate();

  // Hydrate per-space view state
  await SpaceViewStateStore.hydrate();

  // Register dev tools translations and panels, and hydrate
  // their UI state
  await initializeDevToolsFeature();

  registerBlockSelectionSerializer();
  initializeDataViewTypes();
  registerViews();
  initializeViewsFeature();
  initializeCollectionsFeature();
  initializeDataViewsFeature();
  initializeDesignsFeature();
  initializeQueriesFeature();

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

  // Initialize the rebuilt designs system, which runs alongside the
  // legacy one until the migration completes
  await DesignsNext.initialize();

  Sql.initialize();

  const { schemaChanged } = await Databases.initialize();

  // Load persisted data views. Requires entries and the item
  // reference adapters, both initialized by Databases.initialize.
  await DataViews.initialize();

  // Load persisted collections. Requires entries and the item
  // reference adapters, both initialized by Databases.initialize.
  await Collections.initialize();

  // Load persisted queries
  await Queries.initialize();

  // Load persisted spaces
  await Spaces.initialize();

  // Initialize the MiniSearch index and register event
  // listeners for incremental sync
  await Search.initialize({ schemaChanged });

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Load the theme settings and apply them to <body>
  await initializeTheme();

  // Cache the image brightness analyses the file server already
  // holds, so that images are treated on their first render
  await Fs.preloadImageStats();

  // Watch the workspace directories for changes made outside the
  // app. Started last so that it cannot race the initial loads.
  await startFileSystemWatcher(
    Workspaces.getAll().map((workspace) => workspace.path),
  );
}
