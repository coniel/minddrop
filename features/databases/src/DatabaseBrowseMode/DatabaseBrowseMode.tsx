import React, { useCallback, useEffect, useMemo } from 'react';
import { ContentViews } from '@minddrop/content-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { ContentViewRenderer } from '@minddrop/feature-content-views';
import { ContentViewTabBar } from '@minddrop/ui-content-views';
import { useTransientState } from '@minddrop/ui-primitives';
import { orderByCreated, reconcileIdOrder, uuid } from '@minddrop/utils';

export interface DatabaseBrowseModeProps {
  /**
   * The ID of the database being browsed.
   */
  databaseId: string;
}

/**
 * Renders the database's entries through its content views: the view
 * tab bar and the active view's renderer. The active view is
 * remembered per session.
 */
export const DatabaseBrowseMode: React.FC<DatabaseBrowseModeProps> = ({
  databaseId,
}) => {
  const database = Databases.use(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const unsortedViews = ContentViews.useDataSourceContentViews(
    'database',
    databaseId,
  );

  // Sort views according to the config's view ID list, placing
  // views missing from it after the ordered ones by creation date.
  const databaseViews = useMemo(() => {
    if (!database?.views) {
      return unsortedViews;
    }

    return reconcileIdOrder(database.views, unsortedViews, orderByCreated);
  }, [unsortedViews, database?.views]);

  // Per-session active view selection
  const [tabActiveViewId, setTabActiveViewId] = useTransientState<
    string | null
  >('activeViewId', null);

  // Resolve the active view ID, falling back to the first view
  const activeViewId = tabActiveViewId ?? databaseViews[0]?.id;

  // Derive the active view from the tracked ID
  const view =
    databaseViews.find((view) => view.id === activeViewId) ??
    databaseViews[0] ??
    null;

  // Update the active view ID
  const setActiveViewId = useCallback(
    (viewId: string | undefined) => {
      setTabActiveViewId(viewId ?? null);
    },
    [setTabActiveViewId],
  );

  // Sync activeViewId when views change (e.g. active view deleted)
  useEffect(() => {
    // Nothing to sync when there are no views
    if (databaseViews.length === 0) {
      return;
    }

    if (
      activeViewId &&
      databaseViews.some((view) => view.id === activeViewId)
    ) {
      return;
    }

    // Fall back to first view if active view no longer exists
    setActiveViewId(databaseViews[0]?.id);
  }, [databaseViews, activeViewId, setActiveViewId]);

  // Persist the tab order to the database
  function handleSortViews(newOrder: string[]) {
    Databases.update(databaseId, { views: newOrder });
  }

  /**
   * Creates a new virtual view of the specified type and sets it as active.
   */
  function handleAddView(type: string) {
    if (!database) {
      return;
    }

    const newView = ContentViews.createVirtual({
      id: uuid(),
      type,
      dataSource: { type: 'database', id: database.id },
      owner: database.id,
    });

    setActiveViewId(newView.id);
  }

  if (!database) {
    return null;
  }

  return (
    <>
      {/* View tab bar - hidden when the views toolbar is disabled in
          settings */}
      {!database.hideViewsToolbar && (
        <ContentViewTabBar
          views={databaseViews}
          activeViewId={view?.id ?? null}
          dataSources={['database']}
          onActiveViewChange={setActiveViewId}
          onSort={handleSortViews}
          onAddView={handleAddView}
        />
      )}

      {/* View content */}
      {view && (
        <ContentViewRenderer key={view.id} view={view} entries={entryIds} />
      )}
    </>
  );
};
