import { useState } from 'react';
import {
  CustomContentType,
  CustomContentTypes,
  Databases,
} from '@minddrop/databases';
import { DatabaseCombobox, Setting } from '@minddrop/ui-components';
import { Group, IconButton } from '@minddrop/ui-primitives';
import {
  CustomContentTypeForm,
  CustomContentTypeFormValues,
} from '../CustomContentTypeForm';

export interface CustomContentTypeSettingProps {
  /**
   * The custom content type the row sets the database for.
   */
  customType: CustomContentType;
}

/**
 * Renders the settings row of a custom content type.
 */
export const CustomContentTypeSetting: React.FC<
  CustomContentTypeSettingProps
> = ({ customType }) => {
  // Whether the row shows the edit form
  const [editing, setEditing] = useState(false);
  // Get the databases accepting the kind of content
  const acceptingDatabases = Databases.useByContentType(customType.kind);

  // Set the type's database
  function handleValueChange(databaseId: string | null) {
    CustomContentTypes.update(customType.id, { databaseId });
  }

  // Save the edited type
  function handleSubmit(values: CustomContentTypeFormValues) {
    CustomContentTypes.update(customType.id, values);
    setEditing(false);
  }

  // Delete the type
  function handleDelete() {
    CustomContentTypes.delete(customType.id);
  }

  // Show the edit form while editing
  if (editing) {
    return (
      <CustomContentTypeForm
        kind={customType.kind}
        customType={customType}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(false)}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <Setting
      stringTitle={customType.name}
      stringDescription={customType.matchers.join(', ')}
      control={
        <Group gap={2} align="center">
          {/* Edit the type */}
          <IconButton
            icon="pencil"
            color="muted"
            label="databases.settings.contentDefaults.custom.edit"
            onClick={() => setEditing(true)}
          />

          {/* The type's database */}
          <DatabaseCombobox
            allowNone
            size="md"
            valueVariant="text"
            databases={acceptingDatabases}
            value={customType.databaseId}
            onValueChange={handleValueChange}
          />
        </Group>
      }
    />
  );
};
