import { useState } from 'react';
import {
  DatabaseEntrySerializers,
  Databases,
  PropertyFileStorage,
} from '@minddrop/databases';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  ButtonSetting,
  IconSetting,
  SelectSetting,
  SettingsSection,
  SwitchSetting,
  TextSetting,
} from '@minddrop/ui-components';
import { SelectOption, Stack } from '@minddrop/ui-primitives';
import { validateDirName } from '@minddrop/utils';
import './DatabaseSettingsPanel.css';

// Icon the picker falls back to when the current icon is cleared
const defaultIcon = 'content-icon:box:default';

// The ways property files can be stored on disk, offered in the Data section
const propertyFileStorageOptions: SelectOption<PropertyFileStorage>[] = [
  {
    label: 'databases.settings.propertyFileStorage.options.root.label',
    description:
      'databases.settings.propertyFileStorage.options.root.description',
    value: 'root',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.common.label',
    description:
      'databases.settings.propertyFileStorage.options.common.description',
    value: 'common',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.property.label',
    description:
      'databases.settings.propertyFileStorage.options.property.description',
    value: 'property',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.entry.label',
    description:
      'databases.settings.propertyFileStorage.options.entry.description',
    value: 'entry',
  },
];

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
  const { t } = useTranslation();
  // Folder name used when no custom property files directory is set
  const defaultPropertyFilesDir = t('databases.propertyFilesDirName');
  // Local field values, committed to the database on blur
  const [name, setName] = useState(database?.name ?? '');
  const [entryName, setEntryName] = useState(database?.entryName ?? '');
  const [propertyFilesDir, setPropertyFilesDir] = useState(
    database?.propertyFilesDir || defaultPropertyFilesDir,
  );
  const [propertyFilesDirError, setPropertyFilesDirError] = useState<
    TranslationKey | undefined
  >(undefined);
  // The registered entry serializers, offered as file format options
  const entrySerializers = DatabaseEntrySerializers.useAll();

  // Select options for the registered entry serializers
  const entrySerializerOptions: SelectOption<string>[] = entrySerializers.map(
    (serializer) => ({
      label: serializer.name,
      description: serializer.description,
      value: serializer.id,
    }),
  );

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

  // Change the entry file format, converting existing entry files
  function handleChangeEntrySerializer(serializerId: string) {
    Databases.setEntrySerializer(databaseId, serializerId);
  }

  // Change how the database's property files are stored on disk, relocating
  // existing files to match the new layout
  function handleChangePropertyFileStorage(
    propertyFileStorage: PropertyFileStorage,
  ) {
    Databases.setPropertyFileStorage(
      databaseId,
      propertyFileStorage,
      database?.propertyFilesDir,
    );
  }

  // Validate the common property files directory name as the user types
  function handlePropertyFilesDirChange(value: string) {
    // Update the field value
    setPropertyFilesDir(value);

    // Surface any validation error, allowing hidden folder names
    setPropertyFilesDirError(validateDirName(value, true));
  }

  // Commit a change to the common property files directory name
  function handlePropertyFilesDirBlur() {
    // Keep the invalid value in place so the user can correct it
    if (validateDirName(propertyFilesDir, true)) {
      return;
    }

    // Fall back to the default folder name when the field is cleared
    const nextValue = propertyFilesDir.trim() || defaultPropertyFilesDir;

    // Reflect the resolved value in the input
    setPropertyFilesDir(nextValue);

    // Skip when the database is missing or the value is unchanged
    if (
      !database ||
      nextValue === (database.propertyFilesDir || defaultPropertyFilesDir)
    ) {
      return;
    }

    // Persist the directory name, relocating the common folder's contents
    Databases.setPropertyFileStorage(databaseId, 'common', nextValue);
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
    <Stack className="database-settings-panel" gap={6}>
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

      {/* Data storage settings */}
      <SettingsSection title="databases.settings.sections.data">
        <SelectSetting
          title="databases.settings.entrySerializer.label"
          description="databases.settings.entrySerializer.description"
          options={entrySerializerOptions}
          value={database.entrySerializer}
          onValueChange={handleChangeEntrySerializer}
        />
        <SelectSetting
          title="databases.settings.propertyFileStorage.label"
          description="databases.settings.propertyFileStorage.description"
          options={propertyFileStorageOptions}
          value={database.propertyFileStorage}
          onValueChange={handleChangePropertyFileStorage}
        />
        {/* Folder name input, only relevant to the common storage option */}
        {database.propertyFileStorage === 'common' && (
          <TextSetting
            title="databases.settings.propertyFilesDir.label"
            description={
              propertyFilesDirError ??
              'databases.settings.propertyFilesDir.description'
            }
            value={propertyFilesDir}
            invalid={Boolean(propertyFilesDirError)}
            onValueChange={handlePropertyFilesDirChange}
            onBlur={handlePropertyFilesDirBlur}
          />
        )}
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
