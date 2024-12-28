import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useState } from 'react';
import { PathConflictError } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import {
  Button,
  ButtonProps,
  FieldLabel,
  HelperText,
  TextInput,
} from '@minddrop/ui-elements';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import './CreateWorkspaceForm.css';

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
  cancelButtonLabel,
}) => {
  const { t: tRoot } = useTranslation();
  const { t } = useTranslation({ keyPrefix: 'workspaces.actions.create.form' });
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
        setWorkspaceLocationError('location.error.missing');

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
          setWorkspaceLocationError('location.error.conflict');
        } else {
          setUnknownError((error as Error).message);
        }

        return;
      }
    },
    [selectedDir, workspaceName, onSuccess],
  );

  return (
    <form className="create-workspace-form" onSubmit={handleSubmit}>
      {unkownError && <HelperText error>{unkownError}</HelperText>}
      <div className="field">
        <FieldLabel htmlFor="workspace-name" label={t('name.label')} />
        <HelperText text={t('name.helperText')} />
        {workspaceNameError && (
          <HelperText error text={t('name.error.missing')} />
        )}
        <TextInput
          autoFocus
          id="workspace-name"
          name="workspace-name"
          placeholder={t('name.placeholder')}
          onChange={(event) => setWorkspaceName(event.currentTarget.value)}
        />
      </div>
      <div className="field">
        <FieldLabel label={t('location.label')} />
        {selectedDir ? (
          <HelperText>
            {t('location.selectedHelperText')}{' '}
            <span className="location">{selectedDir}</span>
          </HelperText>
        ) : (
          <HelperText text={t('location.helperText')} />
        )}
        {workspaceLocationError && (
          <HelperText error text={t(workspaceLocationError)} />
        )}
        <div>
          <Button
            variant="contained"
            label={t('location.browse')}
            onClick={openDirSelection}
          />
        </div>
      </div>
      <div className="actions">
        <Button
          variant="text"
          label={cancelButtonLabel || tRoot('actions.cancel')}
          onClick={onClickCancel}
        />
        <Button variant="primary" label={t('submit')} type="submit" />
      </div>
    </form>
  );
};
