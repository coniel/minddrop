import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { render, userEvent } from '@minddrop/test-utils';
import { WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import * as SELECT_AS_WORKSPACE from '../../../api/selectFolderAsWorkspace';
import { cleanup, setup } from '../../../test-utils';
import { OpenWorkspaceCard } from './OpenWorkSpaceCard';

const { workspace1 } = WORKSPACES_TEST_DATA;
const appWindow = {
  close: vi.fn(),
};

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => appWindow,
}));

describe('OpenWorkspaceCard', () => {
  const openButtonLabel = i18n.t('workspaces.actions.open.action');
  vi.spyOn(appWindow, 'close');

  beforeEach(setup);

  afterEach(cleanup);

  it('closes the window when a workspace is added', async () => {
    // Pretend a workspace was added
    vi.spyOn(SELECT_AS_WORKSPACE, 'selectFolderAsWorkspace').mockResolvedValue(
      workspace1,
    );

    const { getByText } = render(<OpenWorkspaceCard />);

    // Open folder selection dialog
    await userEvent.click(getByText(openButtonLabel));

    // Closes the window
    expect(appWindow.close).toHaveBeenCalled();
  });
});
