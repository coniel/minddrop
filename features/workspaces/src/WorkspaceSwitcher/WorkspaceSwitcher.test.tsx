import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Workspaces } from '@minddrop/workspaces';
import {
  MockFs,
  WorkspaceFixtures,
  cleanup,
  parentDirPath,
  setup,
} from '../test-utils';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const { workspace_1, workspace_2, workspace_3, workspacesRootPath } =
  WorkspaceFixtures;

// The confirm callbacks of the requested confirmation dialogs
let confirmations: VoidFunction[] = [];

// Renders the switcher and opens its add workspace menu
async function openAddMenu() {
  const user = userEvent.setup();

  render(<WorkspaceSwitcher />);

  await user.click(screen.getByLabelText('Add a workspace'));

  return user;
}

// Renders the switcher and opens the active workspace's options menu
async function openOptionsMenu() {
  const user = userEvent.setup();

  render(<WorkspaceSwitcher />);

  await user.click(screen.getByLabelText(workspace_1.name));

  return user;
}

// Renders the switcher and opens a workspace's context menu
function openContextMenu(workspaceName: string) {
  const user = userEvent.setup();

  render(<WorkspaceSwitcher />);

  fireEvent.contextMenu(screen.getByLabelText(workspaceName));

  return user;
}

// Runs the pending confirmation dialog's confirm action
async function confirm() {
  await waitFor(() => {
    expect(confirmations.length).toBe(1);
  });

  confirmations[0]();
}

describe('<WorkspaceSwitcher />', () => {
  beforeEach(() => {
    setup();
    confirmations = [];

    // Collect the confirmations the menu asks for, standing in for
    // the confirmation dialog the app renders.
    Events.addListener(
      Events.events.OpenConfirmationDialog,
      'test',
      ({ onConfirm }) => {
        confirmations.push(onConfirm);
      },
    );
  });

  afterEach(cleanup);

  it('lists the workspaces in their stored order', () => {
    // Store the workspaces out of name order
    Workspaces.Store.clear();
    Workspaces.Store.load([workspace_3, workspace_1, workspace_2]);

    render(<WorkspaceSwitcher />);

    const buttons = screen.getAllByRole('button');

    // The workspaces are listed before the add workspace action
    expect(
      buttons.slice(0, 3).map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Workspace 3', 'Workspace 1', 'Workspace 2']);
  });

  it('marks the active workspace', () => {
    render(<WorkspaceSwitcher />);

    expect(screen.getByLabelText(workspace_1.name)).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByLabelText(workspace_2.name)).toHaveAttribute(
      'aria-current',
      'false',
    );
  });

  it('switches to the selected workspace', async () => {
    const user = userEvent.setup();

    render(<WorkspaceSwitcher />);

    await user.click(screen.getByLabelText(workspace_2.name));

    // The selected workspace was made active
    await waitFor(() => {
      expect(Workspaces.getActive()).toEqual(workspace_2);
    });
  });

  it('switches to the created workspace', async () => {
    const user = await openAddMenu();

    // Open the create workspace dialog
    await user.click(await screen.findByText('New workspace…'));

    // Fill in the form using the default name
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(await screen.findByText('Choose folder'));
    await user.click(screen.getByText('Create workspace'));

    // The created workspace was made active
    await waitFor(() => {
      expect(Workspaces.getActive()).toEqual(
        expect.objectContaining({
          name: 'MindDrop Workspace',
          path: `${parentDirPath}/MindDrop Workspace`,
        }),
      );
    });
  });

  it('switches to the opened workspace folder', async () => {
    const user = await openAddMenu();

    // Add an existing workspace folder outside the store
    const workspacePath = `${parentDirPath}/Notes`;

    MockFs.addFiles([
      {
        path: `${workspacePath}/.minddrop/workspace.json`,
        textContent: JSON.stringify({
          id: 'workspace_4',
          name: 'Notes',
          icon: 'lucide:shapes:blue',
        }),
      },
    ]);

    // Select the workspace folder
    MockFs.setFilePickerResult(workspacePath);
    await user.click(await screen.findByText('Open workspace folder…'));

    // The opened workspace was added and made active
    await waitFor(() => {
      expect(Workspaces.getActive()).toEqual(
        expect.objectContaining({ name: 'Notes', path: workspacePath }),
      );
    });
  });

  it("opens an inactive workspace's options from its context menu", async () => {
    openContextMenu(workspace_2.name);

    // The rename field is shown, holding that workspace's name
    await waitFor(() => {
      screen.getByDisplayValue(workspace_2.name);
    });
  });

  it("opens the active workspace's options from its context menu", async () => {
    openContextMenu(workspace_1.name);

    await waitFor(() => {
      screen.getByDisplayValue(workspace_1.name);
    });
  });

  it('removes a workspace from its context menu', async () => {
    const user = openContextMenu(workspace_2.name);

    await user.click(await screen.findByText('Remove from MindDrop'));
    await confirm();

    await waitFor(() => {
      expect(workspaceIds()).not.toContain(workspace_2.id);
    });
  });

  it("opens the active workspace's options", async () => {
    await openOptionsMenu();

    // The rename field is shown, holding the workspace's name
    await waitFor(() => {
      screen.getByDisplayValue(workspace_1.name);
    });
  });

  it('renames the active workspace', async () => {
    const user = await openOptionsMenu();

    const input = await screen.findByDisplayValue(workspace_1.name);

    await user.clear(input);
    await user.type(input, 'Renamed{Enter}');

    // The workspace and its directory were renamed
    await waitFor(() => {
      expect(Workspaces.get(workspace_1.id)).toEqual(
        expect.objectContaining({
          name: 'Renamed',
          path: `${workspacesRootPath}/Renamed`,
        }),
      );
    });

    expect(MockFs.exists(`${workspacesRootPath}/Renamed`)).toBe(true);
  });

  it('removes the active workspace, keeping its directory', async () => {
    const user = await openOptionsMenu();

    await user.click(await screen.findByText('Remove from MindDrop'));
    await confirm();

    // The workspace was dropped from the store, its directory left alone
    await waitFor(() => {
      expect(workspaceIds()).not.toContain(workspace_1.id);
    });

    expect(MockFs.exists(workspace_1.path)).toBe(true);
  });

  it('deletes the active workspace along with its directory', async () => {
    const user = await openOptionsMenu();

    await user.click(await screen.findByText('Delete workspace'));
    await confirm();

    // The workspace and its directory are both gone
    await waitFor(() => {
      expect(workspaceIds()).not.toContain(workspace_1.id);
    });

    expect(MockFs.exists(workspace_1.path)).toBe(false);
  });

  it('keeps the last remaining workspace', async () => {
    // Leave a single workspace in the store
    Workspaces.Store.clear();
    Workspaces.Store.load([workspace_1]);

    const user = await openOptionsMenu();

    await user.click(await screen.findByText('Remove from MindDrop'));
    await user.click(screen.getByText('Delete workspace'));

    // Neither action asked for confirmation
    expect(confirmations).toEqual([]);
    expect(workspaceIds()).toEqual([workspace_1.id]);
  });
});

/**
 * Returns the IDs of the workspaces currently in the store.
 */
function workspaceIds(): string[] {
  return Workspaces.getAll().map((workspace) => workspace.id);
}
