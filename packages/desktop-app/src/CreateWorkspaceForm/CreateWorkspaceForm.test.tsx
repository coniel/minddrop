import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RenderResult, render, userEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { appWindow } from '@tauri-apps/api/window';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { cleanup, setup } from '../test-utils';
import { CreateWorkspaceForm } from './CreateWorkspaceForm';
import { PathConflictError } from '@minddrop/core';

const { workspace1 } = WORKSPACES_TEST_DATA;

const WORKSPACE_NAME = 'My Workspace';
const WORKSPACE_LOCATION = '/User/Documents';

vi.mock('@tauri-apps/api/dialog', () => ({
  open: async () => WORKSPACE_LOCATION,
}));

vi.mock('@tauri-apps/api/window', () => ({
  appWindow: {
    close: vi.fn(),
  },
}));

const nameFieldLabel = i18n.t('workspaceName');
const locationButtonLabel = i18n.t('browse');
const submitButtonLabel = i18n.t('create');
const nameErrorText = i18n.t('workspaceNameMissingError');
const locationMissingErrorText = i18n.t('workspaceLocationMissingError');
const locationConflictErrorText = i18n.t('workspaceLocationConflictError');
const backButtonLabel = i18n.t('back');

const onClickBack = vi.fn();

async function renderForm() {
  return render(<CreateWorkspaceForm onClickBack={onClickBack} />);
}

async function fillAndSubmitForm(
  renderResult: RenderResult,
  fillName = true,
  selectLocation = true,
) {
  const { getByLabelText, getByText } = renderResult;

  if (fillName) {
    // Enter a name
    await userEvent.type(getByLabelText(nameFieldLabel), WORKSPACE_NAME);
  }

  if (selectLocation) {
    // Select a location
    await userEvent.click(getByText(locationButtonLabel));
  }

  // Submit the form
  await userEvent.click(getByText(submitButtonLabel));

  return renderResult;
}

async function renderAndSubmitForm(fillName = true, selectLocation = true) {
  const renderResult = await renderForm();

  return fillAndSubmitForm(renderResult, fillName, selectLocation);
}

describe('CreateWorkspaceForm', () => {
  beforeEach(() => {
    setup();

    vi.spyOn(Workspaces, 'add').mockResolvedValue(workspace1);
  });

  afterEach(cleanup);

  it('creates the workspace on submit', async () => {
    vi.spyOn(Workspaces, 'create').mockResolvedValue(workspace1);

    // Fill and submit the form with valid data
    await renderAndSubmitForm();

    // Should create the workspace
    expect(Workspaces.create).toHaveBeenCalledWith(
      WORKSPACE_LOCATION,
      WORKSPACE_NAME,
    );
  });

  it('closes the window on success', async () => {
    // Fill and submit the form with valid data
    await renderAndSubmitForm();

    // Should close the window
    expect(appWindow.close).toHaveBeenCalledWith();
  });

  it('shows error if name is missing', async () => {
    // Submit the form without a name value
    const { getByText } = await renderAndSubmitForm(false);

    // Should display error message
    getByText(nameErrorText);

    // Should not attempt to create the workspace
    expect(Workspaces.create).not.toHaveBeenCalled();
  });

  it('shows error if location is missing', async () => {
    // Submit the form without a location value
    const { getByText } = await renderAndSubmitForm(true, false);

    // Should display error message
    getByText(locationMissingErrorText);

    // Should not attempt to create the workspace
    expect(Workspaces.create).not.toHaveBeenCalled();
  });

  it('shows error if workspace path conflicts', async () => {
    // Pretend that workspace folder already exists
    vi.spyOn(Workspaces, 'create').mockImplementation(() => {
      throw new PathConflictError('');
    });

    // Submit the form with valid values
    const { getByText } = await renderAndSubmitForm(true, true);

    // Should display error message
    getByText(locationConflictErrorText);

    // Should not close the window]
    expect(appWindow.close).not.toHaveBeenCalled();
  });

  it('clears errors on submit', async () => {
    vi.spyOn(Workspaces, 'create').mockResolvedValue(workspace1);

    // Submit the form without a name or location value
    const renderResult = await renderAndSubmitForm(false, false);
    // Submit again with valid values
    await fillAndSubmitForm(renderResult);

    const { queryByText } = renderResult;

    // Should not display error messages
    expect(queryByText(nameErrorText)).toBeNull();
    expect(queryByText(locationMissingErrorText)).toBeNull();
  });

  it('clears location error on select location', async () => {
    vi.spyOn(Workspaces, 'create').mockResolvedValue(workspace1);

    // Submit the form without a location value
    const renderResult = await renderAndSubmitForm(true, false);

    const { getByText, queryByText } = renderResult;

    // Select a location
    await userEvent.click(getByText(locationButtonLabel));

    // Should not display location error message
    expect(queryByText(locationMissingErrorText)).toBeNull();
  });

  it('shows error message on unknown error', async () => {
    // Pretend that workspace creation fails
    vi.spyOn(Workspaces, 'create').mockImplementation(() => {
      throw new Error('Something happened');
    });

    // Submit the form with valid values
    const { getByText } = await renderAndSubmitForm(true, true);

    // Should display error message
    getByText('Something happened');

    // Should not close the window
    expect(appWindow.close).not.toHaveBeenCalled();
  });

  it('calls onClickBack when back button is clicked', async () => {
    const { getByText } = await renderForm();

    // Click the back button
    await userEvent.click(getByText(backButtonLabel));

    // Should call 'onClickBack' prop
    expect(onClickBack).toHaveBeenCalled();
  });
});
