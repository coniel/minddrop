import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup } from '../../test-utils';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { render, userEvent, waitFor } from '@minddrop/test-utils';
import { Popover } from '@minddrop/ui';
import { RenameWorkspacePopover } from './RenameWorkspacePopover';
import { i18n } from '@minddrop/i18n';
import { PathConflictError } from '@minddrop/core';

const { workspace1 } = WORKSPACES_TEST_DATA;

const WORKSPACE_PATH = workspace1.path;
const NEW_WORKSPACE_NAME = 'New name';

const inputPlaceholder = i18n.t(
  'workspaces.actions.rename.form.name.placeholder',
);
const conflictError = i18n.t(
  'workspaces.actions.rename.form.name.error.conflict',
);

const onClose = vi.fn();

function renderPopover() {
  const renderResult = render(
    <div data-testid="click-away">
      <Popover open>
        <RenameWorkspacePopover workspace={workspace1} onClose={onClose} />
      </Popover>
    </div>,
  );

  const { getByPlaceholderText } = renderResult;

  const nameInput = getByPlaceholderText(inputPlaceholder);

  return { ...renderResult, nameInput };
}

describe('<RenameWorkspacePopover>', () => {
  beforeEach(() => {
    vi.spyOn(Workspaces, 'rename').mockResolvedValue(workspace1);
  });

  afterEach(cleanup);

  it('renames the workspace on submit', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_WORKSPACE_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should rename the workspace
    expect(Workspaces.rename).toHaveBeenCalledWith(
      WORKSPACE_PATH,
      NEW_WORKSPACE_NAME,
    );

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('submits on click away', async () => {
    const { nameInput, getByTestId } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Append some text to the end of the workspace name
    await userEvent.type(nameInput, NEW_WORKSPACE_NAME);

    // Press Enter key to sumbit form
    await userEvent.click(getByTestId('click-away'));

    // Should rename the workspace
    expect(Workspaces.rename).toHaveBeenCalledWith(
      WORKSPACE_PATH,
      NEW_WORKSPACE_NAME,
    );

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('cancels on Escape key', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_WORKSPACE_NAME);

    // Press Escape key to cancel
    await userEvent.type(nameInput, '{escape}');

    // Should not rename workspace
    expect(Workspaces.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('does nothing if name is unchanged', async () => {
    const { nameInput } = renderPopover();

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should not rename the workspace
    expect(Workspaces.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('does nothing if name is empty', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should not rename the workspace
    expect(Workspaces.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('shows error on conflict', async () => {
    // Pretend there is a name conflict
    vi.spyOn(Workspaces, 'rename').mockImplementation(() => {
      throw new PathConflictError('');
    });

    const { nameInput, getByText } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_WORKSPACE_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should display error
    waitFor(() => getByText(conflictError));

    // Should not close the popover
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when submitting same invalid value twice', async () => {
    // Pretend there is a name conflict
    vi.spyOn(Workspaces, 'rename').mockImplementation(() => {
      throw new PathConflictError('');
    });

    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_WORKSPACE_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');
    // Press Enter key to sumbit form again
    await userEvent.type(nameInput, '{enter}');

    // Should not call rename again
    expect(Workspaces.rename).toHaveBeenCalledTimes(1);

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });
});
