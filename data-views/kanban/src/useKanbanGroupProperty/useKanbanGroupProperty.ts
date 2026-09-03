import { useMemo } from 'react';
import { DataView } from '@minddrop/data-views';
import { DatabaseId, Databases } from '@minddrop/databases';
import { SelectPropertySchema } from '@minddrop/properties';
import { useDataViewEntries } from '@minddrop/ui-data-views';
import { KanbanViewOptions } from '../types';
import { resolveGroupProperties } from '../utils';

export interface KanbanGroupProperty {
  /**
   * The select properties the view's entries can be grouped by.
   */
  available: SelectPropertySchema[];

  /**
   * The select property the columns are generated from, null when
   * the entries have none.
   */
  property: SelectPropertySchema | null;

  /**
   * The ID of the database the group property belongs to, absent
   * while no database has resolved.
   */
  databaseId?: DatabaseId;
}

/**
 * Resolves the select property a kanban view groups its entries
 * into columns by, along with the properties available to group
 * by.
 *
 * @param view - The kanban view to resolve the group property of.
 * @returns The group property and the ones available to choose from.
 */
export function useKanbanGroupProperty(
  view: DataView<KanbanViewOptions>,
): KanbanGroupProperty {
  // The databases the view's entries belong to
  const entryIds = useDataViewEntries(view);
  const entryDatabases = Databases.useFromEntries(entryIds);

  // The source database, which lists its properties even when it
  // has no entries.
  const sourceDatabase = Databases.use(
    view.dataSource.type === 'database' ? view.dataSource.id : '',
  );

  // Resolve the databases the properties come from. Collection
  // and query sources take them from the databases their entries
  // belong to.
  const databases = useMemo(
    () => (sourceDatabase ? [sourceDatabase] : entryDatabases),
    [sourceDatabase, entryDatabases],
  );

  // The select properties available to group by
  const available = useMemo(
    () => resolveGroupProperties(databases),
    [databases],
  );

  // The configured property, falling back to the first available
  // one when unset or no longer present.
  const property = useMemo(() => {
    const configured = available.find(
      (candidate) => candidate.name === view.options?.groupBy,
    );

    return configured ?? available[0] ?? null;
  }, [available, view.options?.groupBy]);

  return {
    available,
    property,
    databaseId: databases[0]?.id,
  };
}
