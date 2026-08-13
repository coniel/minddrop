import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { DefaultWorkspaceIcon, Workspaces } from '@minddrop/workspaces';
import { MockFs, cleanup, parentDirPath, setup } from '../test-utils';
import { CreateWorkspaceForm } from './CreateWorkspaceForm';

function renderForm(onCreated = () => {}) {
  render(<CreateWorkspaceForm onBack={() => {}} onCreated={onCreated} />);

  return userEvent.setup();
}

describe('<CreateWorkspaceForm />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('requires a location', async () => {
    const user = renderForm();

    // Submit using the default name, but without a location
    await user.click(screen.getByText('Create workspace'));

    // The location error is shown
    await waitFor(() => {
      screen.getByText('Choose a location for the workspace');
    });

    // No workspace was created
    expect(Workspaces.getAll()).toEqual([]);
  });

  it('requires a name', async () => {
    const user = renderForm();

    // Select a location and clear the default name
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(screen.getByText('Choose folder'));
    await user.clear(screen.getByLabelText('Name'));
    await user.click(screen.getByText('Create workspace'));

    // No workspace was created
    await waitFor(() => {
      expect(Workspaces.getAll()).toEqual([]);
    });
  });

  it('creates the workspace using the default name', async () => {
    const user = renderForm();

    // Submit without changing the default name
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(screen.getByText('Choose folder'));
    await user.click(screen.getByText('Create workspace'));

    await waitFor(() => {
      // The workspace was created using the default name
      expect(Workspaces.getAll()).toEqual([
        expect.objectContaining({
          name: 'MindDrop Workspace',
          path: `${parentDirPath}/MindDrop Workspace`,
        }),
      ]);
    });
  });

  it('shows the path the workspace is created at', async () => {
    const user = renderForm();

    // Select a location
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(screen.getByText('Choose folder'));

    // The location is shown with the workspace name appended
    await waitFor(() => {
      screen.getByText(`${parentDirPath}/MindDrop Workspace`);
    });
  });

  it('does not allow an existing directory name', async () => {
    const user = renderForm();

    // Add a directory which the workspace name conflicts with
    MockFs.addFiles([`${parentDirPath}/Notes/existing.md`]);

    // Fill in the form using the conflicting name
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(screen.getByText('Choose folder'));
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Notes');
    await user.click(screen.getByText('Create workspace'));

    // The conflict error is shown
    await waitFor(() => {
      screen.getByText(
        'A folder with this name already exists in this location',
      );
    });

    // No workspace was created
    expect(Workspaces.getAll()).toEqual([]);
  });

  it('creates the workspace on submit', async () => {
    let created = false;
    const user = renderForm(() => {
      created = true;
    });

    // Fill in the form
    MockFs.setFilePickerResult(parentDirPath);
    await user.click(screen.getByText('Choose folder'));
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Notes');
    await user.click(screen.getByText('Create workspace'));

    await waitFor(() => {
      // The workspace was created in the selected location, using the
      // name and default icon
      expect(Workspaces.getAll()).toEqual([
        expect.objectContaining({
          name: 'Notes',
          icon: DefaultWorkspaceIcon,
          path: `${parentDirPath}/Notes`,
        }),
      ]);
    });

    // The workspace directory was created
    expect(MockFs.exists(`${parentDirPath}/Notes`)).toBe(true);

    // The creation was reported to the parent
    expect(created).toBe(true);
  });
});
