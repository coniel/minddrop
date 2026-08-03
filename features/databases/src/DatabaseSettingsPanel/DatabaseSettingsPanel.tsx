import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import {
  ButtonSetting,
  IconSetting,
  SettingsSection,
  SwitchSetting,
  TextSetting,
} from '@minddrop/ui-components';
import { Stack } from '@minddrop/ui-primitives';
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
 * Renders the database's settings grouped into General, Interface,
 * and Danger zone sections, each row laid out as a title and
 * description with a control on the right.
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

  // Toggle whether the views toolbar is hidden in the database view
  function handleToggleHideViewsToolbar(checked: boolean) {
    Databases.update(databaseId, { hideViewsToolbar: checked });
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

  // Prompt for confirmation before clearing all entries
  function handleClear() {
    const i18nRoot = 'databases.settings.clear.confirmation';

    // Open a confirmation dialog for the destructive clear action
    Events.dispatch<OpenConfirmationDialogEventData>(
      OpenConfirmationDialogEvent,
      {
        title: `${i18nRoot}.title`,
        message: `${i18nRoot}.message`,
        confirmLabel: `${i18nRoot}.confirm`,
        danger: true,
        onConfirm: () => {
          // Move all of the database's entries to the system trash
          Databases.clearEntries(databaseId);
        },
      },
    );
  }

  if (!database) {
    return null;
  }

  return (
    <Stack className="database-settings-panel" gap={4}>
      {/* General settings: icon, name, and entry name */}
      <SettingsSection title="databases.settings.sections.general">
        <IconSetting
          title="databases.form.icon.label"
          description="databases.settings.icon.description"
          icon={database.icon}
          onSelect={handleSelectIcon}
          onClear={handleClearIcon}
        />
        <TextSetting
          title="databases.form.name.label"
          description="databases.settings.name.description"
          placeholder="databases.form.name.placeholder"
          value={name}
          onValueChange={setName}
          onBlur={handleNameBlur}
        />
        <TextSetting
          title="databases.form.entryName.label"
          description="databases.settings.entryName.description"
          placeholder="databases.form.entryName.placeholder"
          value={entryName}
          onValueChange={setEntryName}
          onBlur={handleEntryNameBlur}
        />
      </SettingsSection>

      {/* Interface settings */}
      <SettingsSection title="databases.settings.sections.interface">
        <SwitchSetting
          title="databases.settings.hideViewsToolbar.label"
          description="databases.settings.hideViewsToolbar.description"
          checked={database.hideViewsToolbar ?? false}
          onCheckedChange={handleToggleHideViewsToolbar}
        />
      </SettingsSection>

      {/* Destructive actions */}
      <SettingsSection title="databases.settings.sections.danger">
        <ButtonSetting
          title="databases.settings.actions.delete"
          description="databases.settings.delete.description"
          buttonLabel="databases.settings.delete.button"
          danger="on-hover"
          startIcon="trash-2"
          onClick={handleDelete}
        />
        <ButtonSetting
          title="databases.settings.clear.title"
          description="databases.settings.clear.description"
          buttonLabel="databases.settings.clear.button"
          danger="on-hover"
          startIcon="eraser"
          onClick={handleClear}
        />
      </SettingsSection>
    </Stack>
  );
};
