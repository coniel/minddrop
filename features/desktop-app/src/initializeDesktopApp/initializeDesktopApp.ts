import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import { registerBlockSelectionSerializer } from '@minddrop/editor';
import { initializeCollectionsFeature } from '@minddrop/feature-collections';
import { initializeDataViewsFeature } from '@minddrop/feature-data-views';
import {
  LayoutRegionSizesStore,
  initializeDesignsFeature,
} from '@minddrop/feature-designs';
import { initializeDesignsNextFeature } from '@minddrop/feature-designs-next';
import { initializeDevToolsFeature } from '@minddrop/feature-dev-tools';
import { initializeQueriesFeature } from '@minddrop/feature-queries';
import { initializeSearch } from '@minddrop/feature-search';
import { initializeSettingsFeature } from '@minddrop/feature-settings';
import {
  SpaceViewStateStore,
  initializeSpacesFeature,
} from '@minddrop/feature-spaces';
import { initializeTagsFeature } from '@minddrop/feature-tags';
import { initializeViewsFeature } from '@minddrop/feature-views';
import { Fs } from '@minddrop/file-system';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import { Search } from '@minddrop/search';
import { Snapshots } from '@minddrop/snapshots';
import { Spaces } from '@minddrop/spaces';
import { Sql } from '@minddrop/sql';
import { Tags } from '@minddrop/tags';
import { Icons } from '@minddrop/ui-icons';
import { initializeInputModalityTracking } from '@minddrop/ui-primitives';
import { ViewSessions } from '@minddrop/views';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../AppUiState';
import { locales } from '../locales';
import { registerAppDataStoreListeners } from '../registerAppDataStoreListeners';
import { registerAppWorkspaceStoreListeners } from '../registerAppWorkspaceStoreListeners';
import { registerWorkspaceStoreListeners } from '../registerWorkspaceStoreListeners';
import { registerWorkspaceSwitchListener } from '../registerWorkspaceSwitchListener';
import { initializeDataViewTypes } from './initializeDataViewTypes';
import { initializeSelection } from './initializeSelection';
import { initializeTheme } from './initializeTheme';
import { registerSidebars } from './registerSidebars';
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

  // Register the content icon sets, which load on first use
  Icons.initialize();

  // Register desktop app translations
  I18n.registerTranslations(locales);

  // Register search translations
  initializeSearch();

  // Register spaces translations
  initializeSpacesFeature();

  // Register listeners that persist and hydrate app-config
  // stores to JSON files in the AppData directory.
  registerAppDataStoreListeners();

  // Hydrate app UI state from persisted config
  await AppUiState.hydrate();

  // Register dev tools translations and panels, and hydrate
  // their UI state.
  await initializeDevToolsFeature();

  registerBlockSelectionSerializer();
  initializeDataViewTypes();
  registerViews();
  registerSidebars();
  initializeViewsFeature();
  initializeCollectionsFeature();
  initializeDataViewsFeature();
  initializeDesignsFeature();
  initializeDesignsNextFeature();
  initializeQueriesFeature();
  initializeSettingsFeature();
  initializeTagsFeature();

  // Initialize workspaces (sets Paths.workspace and
  // Paths.workspaceConfigs from the active workspace)
  await Workspaces.initialize();

  // Register listeners that persist and hydrate workspace-config
  // stores to JSON files in the workspace config directory.
  registerWorkspaceStoreListeners();

  // Register listeners that persist and hydrate app-workspace-config
  // stores to JSON files in the active workspace's AppData directory.
  registerAppWorkspaceStoreListeners();

  // Hydrate layout region sizes (dialogs, panels) for this workspace
  await LayoutRegionSizesStore.hydrate();

  // Hydrate the open view sessions for this workspace
  await ViewSessions.Store.hydrate();

  // Hydrate per-space view state for this workspace
  await SpaceViewStateStore.hydrate();

  // Hydrate the defaults applied to newly created databases
  await Databases.DefaultsStore.hydrate();

  await Designs.initialize();
  await DesignsNext.initialize();

  Sql.initialize();

  // Subscribe to content package events before content
  // initialization so no rename goes unrecorded.
  Snapshots.initialize();

  // Load global tags and tag groups before entries referencing
  // them are loaded.
  await Tags.initialize();

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
  // listeners for incremental sync.
  await Search.initialize({ schemaChanged });

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Load the theme settings and apply them to <body>
  await initializeTheme();

  // Cache the image brightness analyses the file server already
  // holds, so that images are treated on their first render.
  await Fs.preloadImageStats();

  // Watch the active workspace directory for changes made outside
  // the app. Started last so that it cannot race the initial loads.
  const activeWorkspace = Workspaces.getActive(false);
  const stopWatcher = activeWorkspace
    ? await Fs.startWatcher([activeWorkspace.path])
    : () => undefined;

  // Reload the app when the user switches to another workspace
  registerWorkspaceSwitchListener(stopWatcher);
}
