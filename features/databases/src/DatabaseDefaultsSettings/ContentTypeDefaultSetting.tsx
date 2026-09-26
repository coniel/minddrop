import { ContentType, Databases } from '@minddrop/databases';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { DatabaseCombobox, Setting } from '@minddrop/ui-components';

const contentDefaultKey = createI18nKeyBuilder(
  'databases.settings.contentDefaults.',
);

export interface ContentTypeDefaultSettingProps {
  /**
   * The content type the row sets the database for.
   */
  contentType: ContentType;
}

/**
 * Renders the settings row for picking the database that content of
 * a given type is added to.
 */
export const ContentTypeDefaultSetting: React.FC<
  ContentTypeDefaultSettingProps
> = ({ contentType }) => {
  // Get the content defaults
  const contentDefaults = Databases.useContentDefaults();
  // Get the databases accepting the content type
  const acceptingDatabases = Databases.useByContentType(contentType);

  // Get the content type's extensions, if it is file-based
  const extensions = Properties.isFileBasedType(contentType)
    ? Properties.constants.SupportedFileExtensions[contentType]
    : [];

  // Set the content type's database
  function handleValueChange(databaseId: string | null) {
    Databases.setContentDefault(contentType, databaseId);
  }

  return (
    <Setting
      title={contentDefaultKey(contentType, 'label')}
      stringDescription={extensions.join(', ') || undefined}
      control={
        <DatabaseCombobox
          allowNone
          size="md"
          valueVariant="text"
          databases={acceptingDatabases}
          value={contentDefaults[contentType]}
          onValueChange={handleValueChange}
        />
      }
    />
  );
};
