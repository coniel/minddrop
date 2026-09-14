import { EntityGroupDeletedEventData } from '@minddrop/entity-groups';
import { TagsPropertySchema } from '@minddrop/properties';
import { TagGroups } from '@minddrop/tags';
import { getAllDatabases } from '../../getAllDatabases';
import { updateDatabaseProperty } from '../../updateDatabaseProperty';

/**
 * Called when an entity group is deleted. Clears the group limit
 * from tags properties restricted to a deleted tag group, making
 * every tag selectable again.
 */
export async function onTagGroupDeleted(
  data: EntityGroupDeletedEventData,
): Promise<void> {
  // Only tag groups limit tags properties
  if (data.type !== TagGroups.constants.Type) {
    return;
  }

  // Clear matching group limits database by database
  for (const database of getAllDatabases()) {
    // The database's tags properties limited to the deleted group
    const limitedProperties = database.properties.filter(
      (property): property is TagsPropertySchema =>
        property.type === 'tags' && property.group === data.id,
    );

    for (const property of limitedProperties) {
      // Drop the group limit from the property schema
      const updatedProperty = { ...property };
      delete updatedProperty.group;

      await updateDatabaseProperty(database.id, updatedProperty);
    }
  }
}
