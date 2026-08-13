import { useCallback, useState } from 'react';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  Button,
  ContentIcon,
  Group,
  Heading,
  IconButton,
  IconPicker,
  Stack,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import { useForm } from '@minddrop/utils';
import { DefaultWorkspaceIcon, Workspaces } from '@minddrop/workspaces';
import './CreateWorkspaceForm.css';

export interface CreateWorkspaceFormProps {
  /**
   * Callback fired when the back button is clicked.
   */
  onBack: () => void;

  /**
   * Callback fired once the workspace has been created.
   */
  onCreated: () => void;
}

/**
 * Renders the workspace creation form: a location picker along with
 * name and icon fields.
 */
export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onBack,
  onCreated,
}) => {
  const [icon, setIcon] = useState(DefaultWorkspaceIcon);
  const [parentDirPath, setParentDirPath] = useState('');
  const [error, setError] = useState<TranslationKey | null>(null);
  const { t } = useTranslation();
  const { fieldProps, validateAllAsync, values } = useForm([
    {
      name: 'name',
      required: true,
      defaultValue: t('onboarding.form.name.default'),
      validateAsync: (value) => validateWorkspaceName(parentDirPath, value),
    },
  ]);

  // The path the workspace directory is created at
  const workspacePath = Fs.concatPath(parentDirPath, values.name);

  const selectParentDir = useCallback(async () => {
    // Ask the user to select the folder to create the workspace in
    const path = await Fs.openFilePicker({ directory: true });

    // Do nothing if the picker was cancelled
    if (typeof path !== 'string') {
      return;
    }

    setParentDirPath(path);
    setError(null);
  }, []);

  const createWorkspace = useCallback(async () => {
    setError(null);

    // A location is required
    if (!parentDirPath) {
      setError('onboarding.form.errors.locationMissing');

      return;
    }

    // Validate the form fields
    if (!(await validateAllAsync())) {
      return;
    }

    try {
      // Create the workspace
      await Workspaces.create(parentDirPath, { name: values.name, icon });
    } catch (thrownError) {
      setError(resolveCreateWorkspaceError(thrownError));

      return;
    }

    onCreated();
  }, [parentDirPath, validateAllAsync, values.name, icon, onCreated]);

  function handleSelectIcon(selectedIcon: string) {
    setIcon(selectedIcon);
  }

  function handleClearIcon() {
    setIcon(DefaultWorkspaceIcon);
  }

  return (
    <Stack className="onboarding-create-workspace-form" gap={5}>
      <Heading as="h1" size="xl" text="onboarding.form.title" />
      <Group gap={2} align="end">
        <IconPicker
          closeOnSelect
          currentIcon={icon}
          onSelect={handleSelectIcon}
          onClear={handleClearIcon}
        >
          <IconButton
            label="onboarding.form.icon.label"
            size="lg"
            variant="filled"
            color="neutral"
          >
            <ContentIcon icon={icon} />
          </IconButton>
        </IconPicker>
        <TextField
          autoFocus
          variant="filled"
          label="onboarding.form.name.label"
          placeholder="onboarding.form.name.placeholder"
          {...fieldProps.name}
        />
      </Group>
      <Stack gap={2} align="start">
        <Stack gap={1}>
          <Text
            size="sm"
            weight="medium"
            text="onboarding.form.location.label"
          />
          <Text
            size="sm"
            color="muted"
            text="onboarding.form.location.description"
          />
        </Stack>
        {/* Only rendered once a location has been selected */}
        {parentDirPath && (
          <Text
            className="onboarding-selected-location"
            color="muted"
            stringText={workspacePath}
          />
        )}
        <Button
          variant="filled"
          startIcon="folder"
          label="onboarding.form.location.action"
          onClick={selectParentDir}
        />
      </Stack>
      {/* Only rendered when creating the workspace failed */}
      {error && <Text color="danger" text={error} />}
      <Group gap={3} justify="between">
        <Button label="onboarding.form.actions.back" onClick={onBack} />
        <Button
          variant="solid"
          color="primary"
          label="onboarding.form.actions.create"
          onClick={createWorkspace}
        />
      </Group>
    </Stack>
  );
};

/**
 * Ensures that the workspace directory does not already exist.
 */
async function validateWorkspaceName(
  parentDirPath: string,
  value: string,
): Promise<TranslationKey | undefined> {
  // Nothing to check against until a location has been selected
  if (!parentDirPath) {
    return;
  }

  const workspacePath = Fs.concatPath(parentDirPath, value);

  if (await Fs.exists(workspacePath)) {
    return 'onboarding.form.errors.pathConflict';
  }
}

/**
 * Maps an error thrown while creating the workspace to the translation
 * key of the message shown to the user.
 */
function resolveCreateWorkspaceError(error: unknown): TranslationKey {
  // A directory with the same name already exists in the location
  if (error instanceof PathConflictError) {
    return 'onboarding.form.errors.pathConflict';
  }

  return 'onboarding.errors.unknown';
}
