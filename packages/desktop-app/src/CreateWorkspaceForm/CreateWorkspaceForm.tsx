import { useCallback, useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import {
  Button,
  ButtonProps,
  FieldLabel,
  HelperText,
  TextInput,
} from '@minddrop/ui';
import './CreateWorkspaceForm.css';
import { useTranslation } from '@minddrop/i18n';
import { PathConflictError } from '@minddrop/core';

interface CreateWorkspaceFormProps {
  /**
   * Callback fired when the workspace is created.
   */
  onSuccess?: (workspace: Workspace) => void;

  /**
   * Callback fired when the cancel button is clicked.
   */
  onClickCancel: ButtonProps['onClick'];

  /**
   * Label of the cancel action button.
   */
  cancelButtonLabel?: string;
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onSuccess,
  onClickCancel,
  cancelButtonLabel = 'cancel',
}) => {
  const { t } = useTranslation();
  const [selectedDir, setSelectedDir] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceNameError, setWorkspaceNameError] = useState(false);
  const [workspaceLocationError, setWorkspaceLocationError] = useState('');
  const [unkownError, setUnknownError] = useState('');

  const openDirSelection = useCallback(async () => {
    // Open a selection dialog for a directory
    const selected = await open({
      multiple: false,
      directory: true,
    });

    if (typeof selected === 'string') {
      // Use selected dir as location
      setSelectedDir(selected);

      // Clear location error message
      setWorkspaceLocationError('');
    }
  }, []);

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();

      // Reset error
      setWorkspaceNameError(false);
      setWorkspaceLocationError('');
      setUnknownError('');

      // Name is required
      if (!workspaceName) {
        setWorkspaceNameError(true);
        return;
      }

      // Location is required
      if (!selectedDir) {
        setWorkspaceLocationError('workspaceLocationMissingError');
        return;
      }

      try {
        // Create the workspace
        const workspace = await Workspaces.create(selectedDir, workspaceName);

        // Call the 'onSuccess' callback if provided
        if (onSuccess) {
          onSuccess(workspace);
        }
      } catch (error) {
        if (error instanceof PathConflictError) {
          setWorkspaceLocationError('workspaceLocationConflictError');
        } else {
          setUnknownError((error as Error).message);
        }

        return;
      }
    },
    [selectedDir, workspaceName],
  );

  return (
    <form className="create-workspace-form" onSubmit={handleSubmit}>
      {unkownError && <HelperText error>{unkownError}</HelperText>}
      <div className="field">
        <FieldLabel htmlFor="workspace-name" label="workspaceName" />
        <HelperText text="workspaceNameHelperText" />
        {workspaceNameError && (
          <HelperText error text="workspaceNameMissingError" />
        )}
        <TextInput
          autoFocus
          id="workspace-name"
          name="workspace-name"
          placeholder="workspaceNamePlaceholder"
          onChange={(event) => setWorkspaceName(event.currentTarget.value)}
        />
      </div>
      <div className="field">
        <FieldLabel label="workspaceLocation" />
        {selectedDir ? (
          <HelperText>
            {t('workspaceLocationSelectedHelperText')}{' '}
            <span className="location">{selectedDir}</span>
          </HelperText>
        ) : (
          <HelperText text="workspaceLocationHelperText" />
        )}
        {workspaceLocationError && (
          <HelperText error text={workspaceLocationError} />
        )}
        <div>
          <Button
            variant="contained"
            label="browse"
            onClick={openDirSelection}
          />
        </div>
      </div>
      <div className="actions">
        <Button
          variant="text"
          label={cancelButtonLabel}
          onClick={onClickCancel}
        />
        <Button variant="primary" label="create" type="submit" />
      </div>
    </form>
  );
};
