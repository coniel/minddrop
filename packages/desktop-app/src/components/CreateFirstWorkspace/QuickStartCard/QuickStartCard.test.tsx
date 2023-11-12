import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFsAdapter, render, userEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { appWindow } from '@tauri-apps/api/window';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { cleanup, setup } from '../../../test-utils';
import { QuickStartCard } from './QuickStartCard';
import { Fs, registerFileSystemAdapter } from '@minddrop/core';

const { workspace1 } = WORKSPACES_TEST_DATA;

const DOCUMENTS_DIR = '/User/Documents/';
const WORKSPACE_NAME = 'MindDrop Workspace';

vi.mock('@tauri-apps/api/window', () => ({
  appWindow: {
    close: vi.fn(),
  },
}));

vi.mock('@tauri-apps/api/path', () => ({
  documentDir: async () => DOCUMENTS_DIR,
}));

registerFileSystemAdapter(MockFsAdapter);

describe('QuickStartCard', () => {
  const startButtonLabel = i18n.t('workspaces.actions.quickstart.action');
  vi.spyOn(appWindow, 'close');
  vi.spyOn(Fs, 'createDir');
  vi.spyOn(Fs, 'getDirPath').mockResolvedValue(DOCUMENTS_DIR);
  vi.spyOn(Workspaces, 'add').mockResolvedValue(workspace1);

  beforeEach(setup);

  afterEach(cleanup);

  it('creates default workspace and closes the window', async () => {
    vi.spyOn(Workspaces, 'create').mockResolvedValue(workspace1);

    const { getByText } = render(<QuickStartCard />);

    // Click the start button
    await userEvent.click(getByText(startButtonLabel));

    // Creates a 'MindDrop Workspace' workspace in the
    // documents folder.
    expect(Workspaces.create).toHaveBeenCalledWith(
      DOCUMENTS_DIR,
      WORKSPACE_NAME,
    );

    // Closes the window
    expect(appWindow.close).toHaveBeenCalled();
  });

  describe('workspace dir already exists', () => {
    it('does not create the directory but adds the existing dir as the workspace', async () => {
      // Pretend that workspace dir exists
      vi.spyOn(Fs, 'exists').mockResolvedValue(true);

      const { getByText } = render(<QuickStartCard />);

      // Click the start button
      await userEvent.click(getByText(startButtonLabel));

      // Does not try to create the workspace folder
      expect(Fs.createDir).not.toHaveBeenCalled();
      // Adds the folder as a workspace
      expect(Workspaces.add).toHaveBeenCalledWith(
        `${DOCUMENTS_DIR}${WORKSPACE_NAME}`,
      );
      // Closes the window
      expect(appWindow.close).toHaveBeenCalled();
    });
  });
});
