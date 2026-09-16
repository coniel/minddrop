import { ContentViews } from '@minddrop/content-views';
import { DatabasePropertyRenamedEventData } from '@minddrop/databases';

/**
 * Called when a database property is renamed. Writes the new name
 * to the sort options of the database's views sorted by the old one.
 */
export async function onDatabasePropertyRenamed(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  // Filter for the database's views sorted by the renamed property
  const sortedViews = ContentViews.getByDataSource(
    'database',
    data.updated.id,
  ).filter(
    (view) =>
      view.options?.sortBy === 'property' &&
      view.options.sortProperty === data.oldName,
  );

  // Write the new name into each of them
  await Promise.all(
    sortedViews.map((view) =>
      ContentViews.updateOptions(view.id, { sortProperty: data.newName }),
    ),
  );
}
