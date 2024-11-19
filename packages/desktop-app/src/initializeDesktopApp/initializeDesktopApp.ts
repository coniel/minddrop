import { loadConfigs } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { onRun as onRunTheme, Theme, ThemeAppearance } from '@minddrop/theme';
import { Documents } from '@minddrop/documents';
import { Nodes } from '@minddrop/nodes';
import { Workspaces } from '@minddrop/workspaces';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { NoteDocumentTypeConfig } from '@minddrop/document-type-note';
import { BoardDocumentTypeConfig } from '@minddrop/document-type-board';
import { initializeExtensions } from '@minddrop/extensions';
import NodeTypeTextExtension from '@minddrop/node-type-text';
import NodeTypeImageExtension from '@minddrop/node-type-image';
import NodeTypeLinkExtension from '@minddrop/node-type-link';
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
  Nodes.registerDefaultNodeRendererConfigs();
  Documents.register(NoteDocumentTypeConfig);
  Documents.register(BoardDocumentTypeConfig);

  // Load persisted config values
  await loadConfigs();

  // Initialize workspaces
  await initializeWorkspaces();

  // Initialize documents
  await initializeDocuments();

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
  await initializeExtensions([
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

/**
 * Initializes documents.
 */
async function initializeDocuments() {
  const workspacePaths = Workspaces.getAll().map((workspace) => workspace.path);

  // Load documents from all workspaces
  await Documents.load(workspacePaths);
}
