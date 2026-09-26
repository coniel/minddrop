import {
  CustomContentTypes,
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
} from '../settingOptions';
import { ContentTypeDefaultSetting } from './ContentTypeDefaultSetting';
import { CustomContentTypeSetting } from './CustomContentTypeSetting';
import { NewCustomContentTypeSetting } from './NewCustomContentTypeSetting';

/**
 * Renders the global database settings.
 */
export const DatabaseDefaultsSettings: React.FC = () => {
  // Get the defaults for new databases
  const defaults = Databases.useDefaults();
  // Get the custom content types
  const customContentTypes = CustomContentTypes.useAll();
  // Get the registered entry serializers
  const entrySerializers = DatabaseEntrySerializers.useAll();

  // Map the entry serializers to select options
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
        {/* Entry file format */}
        <SelectSetting
          title="databases.settings.entrySerializer.label"
          description="databases.settings.entrySerializer.description"
          options={entrySerializerOptions}
          value={defaults.entrySerializer}
          onValueChange={handleChangeEntrySerializer}
        />

        {/* Property file storage */}
        <SelectSetting
          title="databases.settings.propertyFileStorage.label"
          description="databases.settings.propertyFileStorage.description"
          options={propertyFileStorageOptions}
          value={defaults.propertyFileStorage}
          onValueChange={handleChangePropertyFileStorage}
        />
      </SettingsSection>

      {/* Databases for content added from outside the app */}
      <SettingsSection
        title="databases.settings.sections.content"
        description="databases.settings.contentDefaults.description"
      >
        {/* A row per content type */}
        {Databases.constants.ContentTypes.map((contentType) => (
          <ContentTypeDefaultSetting
            key={contentType}
            contentType={contentType}
          />
        ))}

        {/* A row per custom content type */}
        {customContentTypes.map((customType) => (
          <CustomContentTypeSetting
            key={customType.id}
            customType={customType}
          />
        ))}

        {/* Add a custom content type */}
        <NewCustomContentTypeSetting />
      </SettingsSection>
    </Stack>
  );
};
