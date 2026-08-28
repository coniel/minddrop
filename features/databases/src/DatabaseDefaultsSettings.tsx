import {
  DatabaseEntrySerializers,
  Databases,
  PropertyFileStorage,
} from '@minddrop/databases';
import { SelectSetting, SettingsSection } from '@minddrop/ui-components';
import { SelectOption, Stack } from '@minddrop/ui-primitives';
import { ViewOpenMode } from '@minddrop/views';
import {
  entryOpenModeOptions,
  propertyFileStorageOptions,
} from './settingOptions';

/**
 * Renders the global database preferences: defaults applied to
 * newly created databases.
 */
export const DatabaseDefaultsSettings: React.FC = () => {
  // The configured defaults for new databases
  const defaults = Databases.useDefaults();
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

  // Change how entries of new databases open when clicked
  function handleChangeEntryOpenMode(entryOpenMode: ViewOpenMode) {
    Databases.setDefault('entryOpenMode', entryOpenMode);
  }

  // Change the entry file format used by new databases
  function handleChangeEntrySerializer(entrySerializer: string) {
    Databases.setDefault('entrySerializer', entrySerializer);
  }

  // Change how new databases store property files on disk
  function handleChangePropertyFileStorage(
    propertyFileStorage: PropertyFileStorage,
  ) {
    Databases.setDefault('propertyFileStorage', propertyFileStorage);
  }

  return (
    <Stack gap={6}>
      {/* Interface defaults */}
      <SettingsSection title="databases.settings.sections.interface">
        <SelectSetting
          title="databases.settings.entryOpenMode.label"
          description="databases.settings.entryOpenMode.description"
          options={entryOpenModeOptions}
          value={defaults.entryOpenMode}
          onValueChange={handleChangeEntryOpenMode}
        />
      </SettingsSection>

      {/* Data storage defaults */}
      <SettingsSection title="databases.settings.sections.data">
        <SelectSetting
          title="databases.settings.entrySerializer.label"
          description="databases.settings.entrySerializer.description"
          options={entrySerializerOptions}
          value={defaults.entrySerializer}
          onValueChange={handleChangeEntrySerializer}
        />
        <SelectSetting
          title="databases.settings.propertyFileStorage.label"
          description="databases.settings.propertyFileStorage.description"
          options={propertyFileStorageOptions}
          value={defaults.propertyFileStorage}
          onValueChange={handleChangePropertyFileStorage}
        />
      </SettingsSection>
    </Stack>
  );
};
