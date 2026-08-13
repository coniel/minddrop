import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { Workspaces } from '@minddrop/workspaces';
import { MockFs, cleanup, parentDirPath, setup } from '../test-utils';
import { OnboardingApp } from './OnboardingApp';

const workspacePath = `${parentDirPath}/Notes`;

async function renderApp(onComplete = () => {}) {
  render(<OnboardingApp onComplete={onComplete} />);

  // Wait for initialization to complete
  await waitFor(() => {
    screen.getByText('Welcome to MindDrop');
  });

  return userEvent.setup();
}

describe('<OnboardingApp />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens the create workspace form', async () => {
    const user = await renderApp();

    await user.click(screen.getByText('Create a workspace'));

    // The form is shown in place of the welcome actions
    await waitFor(() => {
      screen.getByLabelText('Name');
    });
  });

  it('adds the selected workspace folder', async () => {
    let completed = false;
    const user = await renderApp(() => {
      completed = true;
    });

    // Add an existing workspace folder
    MockFs.addFiles([
      {
        path: `${workspacePath}/.minddrop/workspace.json`,
        textContent: JSON.stringify({
          id: 'workspace_1',
          name: 'Notes',
          icon: 'content-icon:shapes:blue',
        }),
      },
    ]);

    // Select the workspace folder
    MockFs.setFilePickerResult(workspacePath);
    await user.click(screen.getByText('Open an existing workspace'));

    await waitFor(() => {
      // The workspace was added, using its existing name and icon
      expect(Workspaces.getAll()).toEqual([
        expect.objectContaining({
          name: 'Notes',
          icon: 'content-icon:shapes:blue',
          path: workspacePath,
        }),
      ]);
    });

    // The setup was reported as complete
    expect(completed).toBe(true);
  });

  it('rejects a folder which is not a workspace', async () => {
    const user = await renderApp();

    // Add a folder containing unrelated files
    MockFs.addFiles([`${workspacePath}/note.md`]);

    // Select the folder
    MockFs.setFilePickerResult(workspacePath);
    await user.click(screen.getByText('Open an existing workspace'));

    // The error is shown
    await waitFor(() => {
      screen.getByText('This folder is not a MindDrop workspace');
    });

    // No workspace was added
    expect(Workspaces.getAll()).toEqual([]);
  });

  it('does nothing when the folder picker is cancelled', async () => {
    const user = await renderApp();

    // Cancel the folder picker
    MockFs.setFilePickerResult(null);
    await user.click(screen.getByText('Open an existing workspace'));

    // No workspace was added
    expect(Workspaces.getAll()).toEqual([]);
  });
});
