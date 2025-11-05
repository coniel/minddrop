import { useState } from 'react';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { ItemTypes } from '@minddrop/item-types';
import { PropertySchema } from '@minddrop/properties';
import { IconButton, MenuLabel, Panel } from '@minddrop/ui-primitives';
import { ItemTypePropertyEditor } from '../ItemTypePropertyEditor';
import './ItemTypePropertiesEditor.css';

export interface ItemTypePropertiesEditorProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The item type.
   */
  itemType: string;
}

type DraftProperty = PropertySchema & {
  id: number;
};

export const ItemTypePropertiesEditor: React.FC<
  ItemTypePropertiesEditorProps
> = ({ itemType }) => {
  const itemTypeConfig = ItemTypes.use(itemType);
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);

  function handleAddProperty(propertySchema: PropertySchema) {
    const draftProperty: DraftProperty = {
      ...propertySchema,
      id: Date.now(),
    };

    setDraftProperties((prevDrafts) => [...prevDrafts, draftProperty]);
  }

  function removeDraftProperty(id: number) {
    setDraftProperties((prevDrafts) => prevDrafts.filter((p) => p.id !== id));
  }

  if (!itemTypeConfig) {
    return null;
  }

  return (
    <Panel className="item-type-properties-editor">
      <div className="property-list">
        <MenuLabel
          actionsAlwaysVisible
          label="labels.properties"
          actions={
            <PropertyTypeSelectionMenu
              existingProperties={[
                ...itemTypeConfig.properties,
                ...draftProperties,
              ]}
              onSelect={handleAddProperty}
            >
              <IconButton
                size="small"
                label="itemTypes.actions.addProperty"
                icon="plus"
              />
            </PropertyTypeSelectionMenu>
          }
        />
        {draftProperties.map((property) => (
          <ItemTypePropertyEditor
            isDraft
            key={property.name}
            itemType={itemType}
            property={property}
            onSaveDraft={() => removeDraftProperty(property.id)}
            onCancelDraft={() => removeDraftProperty(property.id)}
          />
        ))}
        {itemTypeConfig.properties.toReversed().map((property) => (
          <ItemTypePropertyEditor
            key={property.name}
            itemType={itemType}
            property={property}
          />
        ))}
      </div>
    </Panel>
  );
};
