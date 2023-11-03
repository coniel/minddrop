import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, userEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { appWindow } from '@tauri-apps/api/window';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { cleanup, setup } from '../../test-utils';
import { OpenWorkspaceCard } from './OpenWorkSpaceCard';

const { workspace1 } = WORKSPACES_TEST_DATA;

// Response returned by the file selection dialog
let dirSelectionDialogResponse: string | null = null;

vi.mock('@tauri-apps/api/dialog', () => ({
  open: async () => dirSelectionDialogResponse,
}));

vi.mock('@tauri-apps/api/window', () => ({
  appWindow: {
    close: vi.fn(),
  },
}));

describe('OpenWorkspaceCard', () => {
  const openButtonLabel = i18n.t('open');
  vi.spyOn(Workspaces, 'add').mockImplementation(async () => workspace1);
  vi.spyOn(appWindow, 'close');

  beforeEach(setup);

  afterEach(cleanup);

  describe('canceled folder selection', () => {
    it('does nothing', async () => {
      // Pretend user canceled folder selection
      dirSelectionDialogResponse = null;

      const { getByText } = render(<OpenWorkspaceCard />);

      // Open folder selection dialog
      await userEvent.click(getByText(openButtonLabel));

      // Does not add a workspace
      expect(Workspaces.add).not.toHaveBeenCalled();
      // Does not close the window
      expect(appWindow.close).not.toHaveBeenCalled();
    });
  });

  describe('folder selected', () => {
    it('adds the folder as a workspace and closes the window', async () => {
      // Pretend user canceled folder selection
      dirSelectionDialogResponse = '/path/to/workspace';

      const { getByText } = render(<OpenWorkspaceCard />);

      // Open folder selection dialog
      await userEvent.click(getByText(openButtonLabel));

      // Adds the folder as a workspace
      expect(Workspaces.add).toHaveBeenCalledWith(dirSelectionDialogResponse);
      // Closes the window
      expect(appWindow.close).toHaveBeenCalled();
    });
  });
});
