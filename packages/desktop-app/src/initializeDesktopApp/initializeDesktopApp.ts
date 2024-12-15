import { Ast } from '@minddrop/ast';
import { initializeBlocks } from '@minddrop/blocks';
import DocumentBoardView from '@minddrop/board-view';
import BookmarkBlockExtension from '@minddrop/bookmark-block';
import { loadConfigs } from '@minddrop/core';
import { initializeDocuments } from '@minddrop/documents';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { initializeExtensions } from '@minddrop/extensions';
import { initializeI18n } from '@minddrop/i18n';
import ImageBlockExtension from '@minddrop/image-block';
import TextBlockExtension from '@minddrop/text-block';
import { Theme, ThemeAppearance, onRun as onRunTheme } from '@minddrop/theme';
import { Workspaces } from '@minddrop/workspaces';
import { initializeSelection } from './initializeSelection';
import { initializeWorkspaces } from './initializeWorkspaces';
import { watchAppConfigFiles } from './watchAppConfigFiles';

// Initialize internationalization
initializeI18n();

/**
 * Initializes the desktop app.
 */
export async function initializeDesktopApp(): Promise<VoidFunction> {
  console.log('Initializing desktop app...');
  EditorElements.registerDefaults();
  EditorMarks.registerDefaults();
  Ast.registerDefaultConfigs();

  // Load persisted config values
  await loadConfigs();

  // Initialize workspaces
  await initializeWorkspaces();

  // Initialize global selection keyboard shortcuts
  initializeSelection();

  // Initialize blocks package
  initializeBlocks();

  // Initialize documents package with workspace paths
  // as source paths.
  const workspacePaths = Workspaces.getAll().map((workspace) => workspace.path);
  await initializeDocuments(workspacePaths);

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
  await initializeExtensions([
    DocumentBoardView,
    TextBlockExtension,
    BookmarkBlockExtension,
    ImageBlockExtension,
  ]);

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
