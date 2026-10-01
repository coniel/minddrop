import { toJsonValue } from '@minddrop/utils';
import { DatabasePropertyUpdatedEventData } from '../../events';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';

/**
 * Called when a database property is updated in place. Records the
 * property's definition before and after against the database's
 * history.
 *
 * @param data - The updated property's event data.
 */
export async function onUpdateProperty(
  data: DatabasePropertyUpdatedEventData,
): Promise<void> {
  const { updated: database, originalProperty, updatedProperty, action } = data;

  // Record the change to the property's definition
  await recordDatabaseHistory(database, {
    kind: 'definition',
    changes: [
      {
        part: updatedProperty.name,
        from: toJsonValue(originalProperty),
        to: toJsonValue(updatedProperty),
      },
    ],
    action,
  });
}
