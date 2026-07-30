import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { Databases } from '@minddrop/databases';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-components';
import { DropdownMenuSeparator } from '@minddrop/ui-primitives';
import { ViewTypeSettingsMenuProps } from '@minddrop/views';
import { NotebookViewOptions } from '../types';

/**
 * Renders the notebook view settings menu content with
 * list and page design pickers.
 */
export const NotebookViewOptionsMenu: React.FC<
  ViewTypeSettingsMenuProps<NotebookViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  // Resolve the database ID(s) based on the data source type
  const databaseIds = useDatabaseIds(view);

  // Build the value for each design type from the overrides
  const listDesignValue = useMemo(
    () => buildLayoutValue(databaseIds, options, 'listLayoutId'),
    [databaseIds, options],
  );

  const pageDesignValue = useMemo(
    () => buildLayoutValue(databaseIds, options, 'pageLayoutId'),
    [databaseIds, options],
  );

  // Update the layout override for a given database and layout type
  function handleLayoutChange(
    layoutKey: 'listLayoutId' | 'pageLayoutId',
    layoutId: string,
    databaseId?: string,
  ) {
    // For single database, use the data source ID directly
    const targetDatabaseId = databaseId || (databaseIds as string);

    onUpdateOptions({
      layoutOverrides: {
        ...options.layoutOverrides,
        [targetDatabaseId]: {
          ...options.layoutOverrides?.[targetDatabaseId],
          [layoutKey]: layoutId,
        },
      },
    });
  }

  return (
    <>
      {/* List design picker */}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="list"
        value={listDesignValue}
        onValueChange={(layoutId, databaseId) =>
          handleLayoutChange('listLayoutId', layoutId, databaseId)
        }
      />

      <DropdownMenuSeparator />

      {/* Page design picker */}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="page"
        value={pageDesignValue}
        onValueChange={(layoutId, databaseId) =>
          handleLayoutChange('pageLayoutId', layoutId, databaseId)
        }
      />
    </>
  );
};

/**
 * Resolves the database ID(s) for the view based on its data
 * source type. Returns a single ID for database sources or an
 * array for collections.
 */
function useDatabaseIds(
  view: ViewTypeSettingsMenuProps<NotebookViewOptions>['view'],
): string | string[] {
  // Load the collection when the data source is a collection
  const collection = Collections.use(
    view.dataSource.type === 'collection' ? view.dataSource.id : '',
  );

  return useMemo(() => {
    if (view.dataSource.type === 'database') {
      return view.dataSource.id;
    }

    // For collection data sources, derive databases from entries
    if (collection) {
      return Databases.getFromEntries(collection.entries).map(
        (database) => database.id,
      );
    }

    return [];
  }, [view.dataSource, collection]);
}

/**
 * Builds the value prop for a DatabaseLayoutSelectionMenu from
 * the view's layout overrides. Returns a string for a single
 * database or a Record for multiple databases.
 */
function buildLayoutValue(
  databaseIds: string | string[],
  options: NotebookViewOptions,
  layoutKey: 'listLayoutId' | 'pageLayoutId',
): string | Record<string, string> {
  const overrides = options.layoutOverrides;

  // Single database: return the override value directly
  if (typeof databaseIds === 'string') {
    return overrides?.[databaseIds]?.[layoutKey] || '';
  }

  // Multiple databases: build a map of database ID to design ID
  const valueMap: Record<string, string> = {};

  for (const databaseId of databaseIds) {
    const override = overrides?.[databaseId]?.[layoutKey];

    if (override) {
      valueMap[databaseId] = override;
    }
  }

  return valueMap;
}
