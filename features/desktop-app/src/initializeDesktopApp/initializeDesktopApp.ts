import { App, SidebarGroups } from '@minddrop/app';
import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import { registerBlockSelectionSerializer } from '@minddrop/editor';
import { EntityGroups } from '@minddrop/entity-groups';
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
import { initializeWorkspacesFeature } from '@minddrop/feature-workspaces';
import { Fs } from '@minddrop/file-system';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { Queries } from '@minddrop/queries';
import { Search } from '@minddrop/search';
import { Snapshots } from '@minddrop/snapshots';
import { Spaces } from '@minddrop/spaces';
import { Tags } from '@minddrop/tags';
import { Icons } from '@minddrop/ui-icons';
import { initializeInputModalityTracking } from '@minddrop/ui-primitives';
import { ViewSessions } from '@minddrop/views';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../AppUiState';
import { locales } from '../locales';
import { registerWorkspaceSwitchListener } from '../registerWorkspaceSwitchListener';
import { initializeDataViewTypes } from './initializeDataViewTypes';
import { initializeSelection } from './initializeSelection';
import { initializeTheme } from './initializeTheme';
import { loadWorkspace } from './loadWorkspace';
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
 * Runs the one-time desktop app initialization, then loads the
 * active workspace.
 */
async function runInitialization(): Promise<void> {
  // Track whether the user is navigating by keyboard or pointer
  initializeInputModalityTracking();

  // Register the content icon sets, which load on first use
  Icons.initialize();

  // Register desktop app translations
  I18n.registerTranslations(locales);
  Properties.initialize();

  // Register search translations
  initializeSearch();

  // Register spaces translations
  initializeSpacesFeature();

  // Register the listeners that persist and hydrate stores, which
  // every later hydrate() call depends on.
  App.initializeStorePersistence();

  // Hydrate app UI state from persisted config
  await AppUiState.hydrate();

  // Hydrate the workspace the app last opened into, which
  // Workspaces.initialize resolves against.
  await Workspaces.ActiveStore.hydrate();

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
  initializeWorkspacesFeature();

  // Register the sidebar's entity group type, before the entity
  // groups' listeners are registered below.
  SidebarGroups.initialize();

  // Register the content packages' registries, translations and
  // listeners, which every workspace load relies on.
  Designs.initialize();
  DesignsNext.initialize();
  Tags.initialize();
  Databases.initialize();
  DataViews.initialize();
  Collections.initialize();
  Queries.initialize();
  Spaces.initialize();
  EntityGroups.initialize();
  Search.initialize();

  // Subscribe to content package events before any workspace loads
  // so no rename goes unrecorded.
  Snapshots.initialize();

  // Initialize workspaces, resolving the active one
  await Workspaces.initialize();

  const activeWorkspace = Workspaces.getActive(false);

  // Hydrate layout region sizes (dialogs, panels) for this workspace
  await LayoutRegionSizesStore.hydrate();

  // Hydrate the open view sessions for this workspace
  await ViewSessions.Store.hydrate();

  // Hydrate per-space view state for this workspace
  await SpaceViewStateStore.hydrate();

  // Hydrate the defaults applied to newly created databases
  await Databases.DefaultsStore.hydrate();

  // Load the active workspace's content
  if (activeWorkspace) {
    await loadWorkspace(activeWorkspace);
  }

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Load the theme settings and apply them to <body>
  await initializeTheme();

  // Cache the image brightness analyses the file server already
  // holds, so that images are treated on their first render.
  await Fs.preloadImageStats();

  // Watch the active workspace directory for changes made outside
  // the app. Started last so that it cannot race the initial loads.
  const stopWatcher = activeWorkspace
    ? await Fs.startWatcher([
        { workspaceId: activeWorkspace.id, path: activeWorkspace.path },
      ])
    : () => undefined;

  // Reload the app when the user switches to another workspace
  registerWorkspaceSwitchListener(stopWatcher);
}
