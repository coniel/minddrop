import { TagsPropertySchema } from '@minddrop/properties';
import { TagGroupDeletedEventData } from '@minddrop/tags';
import { getAllDatabases } from '../../getAllDatabases';
import { updateDatabaseProperty } from '../../updateDatabaseProperty';

/**
 * Called when a tag group is deleted. Clears the group limit from
 * tags properties restricted to the deleted group, making every
 * tag selectable again.
 */
export async function onTagGroupDeleted(
  data: TagGroupDeletedEventData,
): Promise<void> {
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
