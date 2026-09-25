import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { ContentViewTypeSettingsMenuProps } from '@minddrop/content-views';
import { Databases } from '@minddrop/databases';
import { DatabaseDesignSelectionMenu } from '@minddrop/ui-databases';
import { DropdownMenuSeparator } from '@minddrop/ui-primitives';
import { NotebookViewOptions } from './types';

// Stable empty list used while the collection is unavailable
const NO_ITEMS: string[] = [];

/**
 * Renders the notebook view settings menu.
 */
export const NotebookViewOptionsMenu: React.FC<
  ContentViewTypeSettingsMenuProps<NotebookViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  // Resolve the database ID(s) based on the data source type
  const databaseIds = useDatabaseIds(view);

  // Set the list design override for the database the selection
  // belongs to. Defaults to the source database.
  function handleListDesignChange(designId: string, databaseId?: string) {
    onUpdateOptions({
      listDesignOverrides: {
        ...options.listDesignOverrides,
        [databaseId ?? view.dataSource.id]: designId,
      },
    });
  }

  // Set the page design override for the database the selection
  // belongs to. Defaults to the source database.
  function handlePageDesignChange(designId: string, databaseId?: string) {
    onUpdateOptions({
      pageDesignOverrides: {
        ...options.pageDesignOverrides,
        [databaseId ?? view.dataSource.id]: designId,
      },
    });
  }

  return (
    <>
      {/* List design picker */}
      <DatabaseDesignSelectionMenu
        databaseId={databaseIds}
        designType="list"
        value={options.listDesignOverrides || {}}
        onValueChange={handleListDesignChange}
      />

      <DropdownMenuSeparator />

      {/* Page design picker */}
      <DatabaseDesignSelectionMenu
        databaseId={databaseIds}
        designType="page"
        value={options.pageDesignOverrides || {}}
        onValueChange={handlePageDesignChange}
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
  view: ContentViewTypeSettingsMenuProps<NotebookViewOptions>['view'],
): string | string[] {
  // Load the collection when the data source is a collection
  const collection = Collections.use(
    view.dataSource.type === 'collection' ? view.dataSource.id : '',
  );

  // The databases a collection source's entries belong to
  const databases = Databases.useFromEntries(collection?.items ?? NO_ITEMS);

  return useMemo(() => {
    if (view.dataSource.type === 'database') {
      return view.dataSource.id;
    }

    return databases.map((database) => database.id);
  }, [view.dataSource, databases]);
}
