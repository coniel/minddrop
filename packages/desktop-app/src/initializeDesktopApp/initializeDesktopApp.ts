import { loadConfigs } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { onRun as onRunTheme, Theme, ThemeAppearance } from '@minddrop/theme';
import { initializeExtensions } from '@minddrop/extensions';
import { initializeDocuments } from '@minddrop/documents';
import { initializeBlocks } from '@minddrop/blocks';
import { Workspaces } from '@minddrop/workspaces';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import DocumentBoardView from '@minddrop/board-view';
import NodeTypeTextExtension from '@minddrop/text-block';
import NodeTypeImageExtension from '@minddrop/image-block';
import NodeTypeLinkExtension from '@minddrop/bookmark-block';
import { Ast } from '@minddrop/ast';
import { initializeWorkspaces } from './initializeWorkspaces';
import { watchAppConfigFiles } from './watchAppConfigFiles';
import { initializeSelection } from './initializeSelection';

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
    NodeTypeImageExtension,
    NodeTypeLinkExtension,
    NodeTypeTextExtension,
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
