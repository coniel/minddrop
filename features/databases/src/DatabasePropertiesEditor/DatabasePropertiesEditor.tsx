import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import { IconButton, MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import { DatabasePropertyEditor } from '../DatabasePropertyEditor';

export interface DatabasePropertiesEditorProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The database ID.
   */
  databaseId: string;
}

type DraftProperty = PropertySchema & {
  id: number;
};

export const DatabasePropertiesEditor: React.FC<
  DatabasePropertiesEditorProps
> = ({ databaseId }) => {
  const databaseConfig = Databases.use(databaseId);
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);

  function handleAddProperty(propertySchema: PropertySchema) {
    const draftProperty: DraftProperty = {
      ...propertySchema,
      name: i18n.t(propertySchema.name),
      id: Date.now(),
    };

    setDraftProperties((prevDrafts) => [...prevDrafts, draftProperty]);
  }

  function removeDraftProperty(id: number) {
    setDraftProperties((prevDrafts) => prevDrafts.filter((p) => p.id !== id));
  }

  if (!databaseConfig) {
    return null;
  }

  return (
    <MenuGroup className="property-list">
      <MenuLabel
        actionsAlwaysVisible
        label="labels.properties"
        actions={
          <PropertyTypeSelectionMenu
            existingProperties={[
              ...databaseConfig.properties,
              ...draftProperties,
            ]}
            onSelect={handleAddProperty}
          >
            <IconButton
              size="sm"
              label="databases.actions.addProperty"
              icon="plus"
            />
          </PropertyTypeSelectionMenu>
        }
      />
      {draftProperties.map((property) => (
        <DatabasePropertyEditor
          isDraft
          key={property.name}
          databaseId={databaseId}
          property={property}
          onSaveDraft={() => removeDraftProperty(property.id)}
          onCancelDraft={() => removeDraftProperty(property.id)}
        />
      ))}
      {databaseConfig.properties.toReversed().map((property) => (
        <DatabasePropertyEditor
          key={property.name}
          databaseId={databaseId}
          property={property}
        />
      ))}
    </MenuGroup>
  );
};
