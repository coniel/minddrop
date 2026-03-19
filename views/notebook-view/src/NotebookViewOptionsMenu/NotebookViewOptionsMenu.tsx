import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { Databases } from '@minddrop/databases';
import { DatabaseDesignSelectionMenu } from '@minddrop/ui-components';
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
    () => buildDesignValue(databaseIds, options, 'listDesignId'),
    [databaseIds, options],
  );

  const pageDesignValue = useMemo(
    () => buildDesignValue(databaseIds, options, 'pageDesignId'),
    [databaseIds, options],
  );

  // Update the design override for a given database and design type
  function handleDesignChange(
    designKey: 'listDesignId' | 'pageDesignId',
    designId: string,
    databaseId?: string,
  ) {
    // For single database, use the data source ID directly
    const targetDatabaseId = databaseId || (databaseIds as string);

    onUpdateOptions({
      designOverrides: {
        ...options.designOverrides,
        [targetDatabaseId]: {
          ...options.designOverrides?.[targetDatabaseId],
          [designKey]: designId,
        },
      },
    });
  }

  return (
    <>
      {/* List design picker */}
      <DatabaseDesignSelectionMenu
        databaseId={databaseIds}
        designType="list"
        value={listDesignValue}
        onValueChange={(designId, databaseId) =>
          handleDesignChange('listDesignId', designId, databaseId)
        }
      />

      <DropdownMenuSeparator />

      {/* Page design picker */}
      <DatabaseDesignSelectionMenu
        databaseId={databaseIds}
        designType="page"
        value={pageDesignValue}
        onValueChange={(designId, databaseId) =>
          handleDesignChange('pageDesignId', designId, databaseId)
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
 * Builds the value prop for a DatabaseDesignSelectionMenu from
 * the view's design overrides. Returns a string for a single
 * database or a Record for multiple databases.
 */
function buildDesignValue(
  databaseIds: string | string[],
  options: NotebookViewOptions,
  designKey: 'listDesignId' | 'pageDesignId',
): string | Record<string, string> {
  const overrides = options.designOverrides;

  // Single database: return the override value directly
  if (typeof databaseIds === 'string') {
    return overrides?.[databaseIds]?.[designKey] || '';
  }

  // Multiple databases: build a map of database ID to design ID
  const valueMap: Record<string, string> = {};

  for (const databaseId of databaseIds) {
    const override = overrides?.[databaseId]?.[designKey];

    if (override) {
      valueMap[databaseId] = override;
    }
  }

  return valueMap;
}
