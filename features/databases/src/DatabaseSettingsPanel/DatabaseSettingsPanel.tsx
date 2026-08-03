import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import {
  Button,
  ContentIcon,
  Group,
  IconButton,
  IconPicker,
  Stack,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import './DatabaseSettingsPanel.css';

// Icon the picker falls back to when the current icon is cleared
const defaultIcon = 'content-icon:box:default';

export interface DatabaseSettingsPanelProps {
  /**
   * The ID of the database to configure.
   */
  databaseId: string;
}

/**
 * Renders the database's general settings: an icon picker and name
 * field on one row, an entry name field below, and a delete database
 * action.
 */
export const DatabaseSettingsPanel: React.FC<DatabaseSettingsPanelProps> = ({
  databaseId,
}) => {
  const database = Databases.use(databaseId);
  // Local field values, committed to the database on blur
  const [name, setName] = useState(database?.name ?? '');
  const [entryName, setEntryName] = useState(database?.entryName ?? '');

  // Persist the selected icon immediately
  function handleSelectIcon(icon: string) {
    Databases.update(databaseId, { icon });
  }

  // Reset the icon to the default when cleared
  function handleClearIcon() {
    Databases.update(databaseId, { icon: defaultIcon });
  }

  // Commit a name change by renaming the database
  async function handleNameBlur() {
    // Skip when the database is missing, the name is blank, or unchanged
    if (!database || name.trim() === '' || name === database.name) {
      return;
    }

    try {
      // Rename the database, which changes its id, name, and path
      await Databases.rename(databaseId, name);
    } catch {
      // Revert to the current name on failure (e.g. a name conflict)
      setName(database.name);
    }
  }

  // Commit an entry name change
  function handleEntryNameBlur() {
    // Skip when the database is missing, the value is blank, or unchanged
    if (
      !database ||
      entryName.trim() === '' ||
      entryName === database.entryName
    ) {
      return;
    }

    // Persist the new entry name
    Databases.update(databaseId, { entryName });
  }

  // Prompt for confirmation before deleting the database
  function handleDelete() {
    const i18nRoot = 'databases.settings.delete.confirmation';

    // Open a confirmation dialog for the destructive delete action
    Events.dispatch<OpenConfirmationDialogEventData>(
      OpenConfirmationDialogEvent,
      {
        title: `${i18nRoot}.title`,
        message: `${i18nRoot}.message`,
        confirmLabel: `${i18nRoot}.confirm`,
        danger: true,
        onConfirm: () => {
          // Move the database to the system trash
          Databases.delete(databaseId);
        },
      },
    );
  }

  if (!database) {
    return null;
  }

  return (
    <Stack gap={4} className="database-settings-panel">
      {/* Icon picker, name field, and entry name field */}
      <Group gap={2} align="end">
        <IconPicker
          closeOnSelect
          onSelect={handleSelectIcon}
          onClear={handleClearIcon}
          currentIcon={database.icon}
        >
          <IconButton
            label="databases.form.icon.label"
            size="md"
            variant="filled"
            color="neutral"
          >
            <ContentIcon icon={database.icon} />
          </IconButton>
        </IconPicker>
        <TextField
          size="md"
          className="database-settings-panel-field"
          variant="filled"
          label="databases.form.name.label"
          placeholder="databases.form.name.placeholder"
          value={name}
          onValueChange={setName}
          onBlur={handleNameBlur}
        />
        <TextField
          size="md"
          className="database-settings-panel-field"
          variant="filled"
          label="databases.form.entryName.label"
          placeholder="databases.form.entryName.placeholder"
          value={entryName}
          onValueChange={setEntryName}
          onBlur={handleEntryNameBlur}
        />
      </Group>

      {/* Delete database action with an explanatory note */}
      <Stack gap={2} className="database-settings-panel-delete">
        <Text
          block
          size="sm"
          color="muted"
          text="databases.settings.delete.description"
        />
        <Button
          size="md"
          label="databases.settings.actions.delete"
          variant="filled"
          danger="on-hover"
          startIcon="trash-2"
          onClick={handleDelete}
        />
      </Stack>
    </Stack>
  );
};
