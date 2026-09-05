import { DataView, DataViews } from '@minddrop/data-views';
import {
  DatabasePropertyOptionRenamedEventData,
  DatabasePropertyRemovedEventData,
  DatabasePropertyRenamedEventData,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { KanbanViewData, KanbanViewOptions } from '../types';

// ID registering the package's event listeners
const EventListenerId = 'data-view-kanban';

/**
 * Initializes the kanban view type's event handlers, which keep
 * kanban views following renames and removals of the property
 * they group by, and renames of its options.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeKanbanView(): VoidFunction {
  Events.addListeners(EventListenerId, {
    // Follow group property renames, keeping the views grouped by
    // the renamed property.
    [Databases.events.propertyRenamed]: handlePropertyRenamed,
    // Clear the group property from views grouped by a removed
    // property, making the fallback to another property explicit.
    [Databases.events.propertyRemoved]: handlePropertyRemoved,
    // Follow option renames, carrying over the saved column order
    // and hidden columns keyed by the old value.
    [Databases.events.propertyOptionRenamed]: handlePropertyOptionRenamed,
  });

  return () => {
    Events.removeListener(Databases.events.propertyRenamed, EventListenerId);
    Events.removeListener(Databases.events.propertyRemoved, EventListenerId);
    Events.removeListener(
      Databases.events.propertyOptionRenamed,
      EventListenerId,
    );
  };
}

/**
 * Retrieves the kanban views grouped by a database's property.
 * Only views sourced directly from the database are matched, as
 * collection and query sources cannot be resolved to a database
 * without loading their entries.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param propertyName - The name of the group property.
 * @returns The matching kanban views.
 */
function getGroupedViews(
  databaseId: string,
  propertyName: string,
): DataView<KanbanViewOptions, KanbanViewData>[] {
  return DataViews.getOfType<KanbanViewOptions, KanbanViewData>(
    'kanban',
  ).filter(
    (view) =>
      view.dataSource.type === 'database' &&
      view.dataSource.id === databaseId &&
      view.options?.groupBy === propertyName,
  );
}

/**
 * Writes a renamed property's new name to the views grouped by
 * its old name.
 *
 * @param data - The property renamed event data.
 */
async function handlePropertyRenamed(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  // Update each view grouped by the old property name
  await Promise.all(
    getGroupedViews(data.updated.id, data.oldName).map((view) =>
      DataViews.updateOptions(view.id, { groupBy: data.newName }),
    ),
  );
}

/**
 * Clears the group property from the views grouped by a removed
 * property, along with the saved column order whose option value
 * keys no longer name anything.
 *
 * @param data - The property removed event data.
 */
async function handlePropertyRemoved(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  // Update each view grouped by the removed property
  await Promise.all(
    getGroupedViews(data.updated.id, data.property.name).map((view) => {
      // Drop the group property from the view's options
      const { groupBy, ...options } = view.options ?? {};

      return DataViews.update(
        view.id,
        { options, data: { ...view.data, order: {} } },
        false,
      );
    }),
  );
}

/**
 * Carries a renamed option's saved column order and hidden state
 * over to its new value in the views grouped by its property.
 *
 * @param data - The property option renamed event data.
 */
async function handlePropertyOptionRenamed(
  data: DatabasePropertyOptionRenamedEventData,
): Promise<void> {
  // Update each view grouped by the option's property
  await Promise.all(
    getGroupedViews(data.updated.id, data.property.name).map((view) => {
      // Re-key the renamed option's saved column order
      const order = Object.fromEntries(
        Object.entries(view.data?.order ?? {}).map(([value, entryIds]) => [
          value === data.oldValue ? data.newValue : value,
          entryIds,
        ]),
      );

      // Re-key the renamed option's hidden state
      const options = { ...view.options };

      if (options.hiddenOptions) {
        options.hiddenOptions = options.hiddenOptions.map((value) =>
          value === data.oldValue ? data.newValue : value,
        );
      }

      return DataViews.update(
        view.id,
        { options, data: { ...view.data, order } },
        false,
      );
    }),
  );
}
