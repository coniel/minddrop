import { ApplicationMenu } from 'electrobun/bun';
import { initializeImageStats, pruneImageCache } from './images';
import { initializeSearch } from './search';
import { initializeSql } from './sql';
import { setOnboardingCompleteHandler } from './windowRpc';
import {
  createMainWindow,
  createOnboardingWindow,
  hasWorkspace,
} from './windows';
import './server';

// --- Application menu ---

// Set up a standard macOS application menu so that keyboard shortcuts
// like Cmd+C/V/X/Z/A/Q/W are handled by the native responder chain
ApplicationMenu.setApplicationMenu([
  {
    label: 'MindDrop',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'showAll' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
      { role: 'redo', accelerator: 'CmdOrCtrl+Shift+Z' },
      { type: 'separator' },
      { role: 'cut', accelerator: 'CmdOrCtrl+X' },
      { role: 'copy', accelerator: 'CmdOrCtrl+C' },
      { role: 'paste', accelerator: 'CmdOrCtrl+V' },
      { role: 'selectAll', accelerator: 'CmdOrCtrl+A' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize', accelerator: 'CmdOrCtrl+M' },
      { role: 'close', accelerator: 'CmdOrCtrl+W' },
      { type: 'separator' },
      { role: 'toggleFullScreen', accelerator: 'Ctrl+CmdOrCtrl+F' },
    ],
  },
]);

// --- Create window ---

if (await hasWorkspace()) {
  await createMainWindow();
} else {
  const onboardingWindow = await createOnboardingWindow();

  // Swap the onboarding window for the main window once a workspace
  // has been set up. The main window is created first, as the app quits
  // when its last window closes.
  setOnboardingCompleteHandler(async () => {
    await createMainWindow();

    onboardingWindow.close();
  });
}

// --- Initialize platform adapters ---

// Register the Bun SQL adapter (bun:sqlite)
initializeSql();

// Register search platform adapters (file system for index I/O)
initializeSearch();

// Trim the resized image cache back under its size limit
pruneImageCache();

// Load the image brightness analyses, dropping those whose source
// image has been deleted or modified
initializeImageStats();
