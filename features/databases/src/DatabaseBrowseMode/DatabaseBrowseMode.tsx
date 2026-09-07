import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataViewTypes, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DataViewRenderer } from '@minddrop/feature-data-views';
import { AddDataViewMenu } from '@minddrop/ui-components';
import { DataViewSortMenu } from '@minddrop/ui-data-views';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContentIcon,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Group,
  IconButton,
  MenuRenameItem,
  MenuSeparator,
  Tabs,
  TabsList,
  TabsTab,
  useTransientState,
} from '@minddrop/ui-primitives';
import { orderByCreated, reconcileIdOrder, uuid } from '@minddrop/utils';
import {
  setDatabaseViewState,
  useDatabaseViewState,
} from '../DatabaseViewStateStore';

export interface DatabaseBrowseModeProps {
  /**
   * The ID of the database being browsed.
   */
  databaseId: string;
}

/**
 * Renders the database's entries through its data views: the view
 * switcher with the views' menus, and the active view's renderer.
 * The active view is remembered per tab, seeded from the last one
 * used.
 */
export const DatabaseBrowseMode: React.FC<DatabaseBrowseModeProps> = ({
  databaseId,
}) => {
  const [dropdownMenuViewId, setDropdownMenuViewId] = useState<string | null>(
    null,
  );
  const [dropdownAnchor, setDropdownAnchor] = useState<Element | null>(null);
  const database = Databases.use(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const unsortedViews = DataViews.useDataSourceDataViews(
    'database',
    databaseId,
  );
  const viewTypes = DataViewTypes.useAll();
  const viewState = useDatabaseViewState(databaseId);

  // Sort views according to the config's view ID list, placing
  // views missing from it after the ordered ones by creation date.
  const databaseViews = useMemo(() => {
    if (!database?.views) {
      return unsortedViews;
    }

    return reconcileIdOrder(database.views, unsortedViews, orderByCreated);
  }, [unsortedViews, database?.views]);

  // Per-tab active view selection, seeded from the last-used view
  const [tabActiveViewId, setTabActiveViewId] = useTransientState<
    string | null
  >('activeViewId', viewState.activeViewId);

  // Resolve the active view ID, falling back to the first view
  const activeViewId = tabActiveViewId ?? databaseViews[0]?.id;

  // Derive the active view from the tracked ID
  const view =
    databaseViews.find((view) => view.id === activeViewId) ??
    databaseViews[0] ??
    null;

  // Get the active view's type to check for a settings menu
  const activeViewType = DataViewTypes.use(view?.type ?? '');

  // Merge view options with the view type's defaults
  const viewOptions = useMemo(
    () => ({ ...activeViewType?.defaultOptions, ...(view?.options ?? {}) }),
    [activeViewType, view?.options],
  );

  // Update the active view ID
  const setActiveViewId = useCallback(
    (viewId: string | undefined) => {
      // Update this tab's selection
      setTabActiveViewId(viewId ?? null);

      // Track the last-used view as the seed for future tabs
      setDatabaseViewState(databaseId, { activeViewId: viewId ?? null });
    },
    [databaseId, setTabActiveViewId],
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

  // Callback to update the active view's options
  const handleUpdateViewOptions = useCallback(
    (options: object) => {
      if (view) {
        DataViews.update(view.id, { options });
      }
    },
    [view],
  );

  // Rename the active view
  const handleRenameActiveView = useCallback(
    (name: string) => {
      if (view) {
        DataViews.update(view.id, { name });
      }
    },
    [view],
  );

  // Change the active view's icon
  const handleSelectActiveViewIcon = useCallback(
    (icon: string) => {
      if (view) {
        DataViews.update(view.id, { icon });
      }
    },
    [view],
  );

  // Rename a view by ID
  const handleRenameView = useCallback((viewId: string, name: string) => {
    DataViews.update(viewId, { name });
  }, []);

  // Change a view's icon by ID
  const handleSelectViewIcon = useCallback((viewId: string, icon: string) => {
    DataViews.update(viewId, { icon });
  }, []);

  // Open a tab's view options menu when its active tab is clicked
  function handleTabClick(
    event: React.MouseEvent<HTMLElement>,
    viewId: string,
    isActive: boolean,
  ) {
    // Only the active tab's click opens the menu
    if (!isActive) {
      return;
    }

    // Anchor the menu to the clicked tab
    setDropdownAnchor(event.currentTarget);
    setDropdownMenuViewId(viewId);
  }

  // Open a tab's view options menu on right click
  function handleTabContextMenu(
    event: React.MouseEvent<HTMLElement>,
    viewId: string,
  ) {
    // Suppress the native context menu
    event.preventDefault();

    // Anchor the menu to the tab
    setDropdownAnchor(event.currentTarget);
    setDropdownMenuViewId(viewId);
  }

  function handleViewMenuOpenChange(open: boolean) {
    // Clear the menu state when the menu closes
    if (!open) {
      setDropdownMenuViewId(null);
      setDropdownAnchor(null);
    }
  }

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

    const newView = DataViews.createVirtual({
      id: uuid(),
      type,
      dataSource: { type: 'database', id: database.id },
      owner: database.id,
    });

    setActiveViewId(newView.id);
  }

  // Render the view options menu content for a given view
  function renderViewMenuContent(targetViewId: string) {
    const targetView = databaseViews.find(
      (databaseView) => databaseView.id === targetViewId,
    );

    if (!targetView) {
      return null;
    }

    const targetViewType = viewTypes.find(
      (viewType) => viewType.type === targetView.type,
    );
    const targetViewOptions = {
      ...targetViewType?.defaultOptions,
      ...(targetView.options ?? {}),
    };

    return (
      <>
        <MenuRenameItem
          value={targetView.name}
          contentIcon={targetView.icon}
          onValueChange={() => {}}
          onRename={(name) => handleRenameView(targetViewId, name)}
          onSelectIcon={(icon) => handleSelectViewIcon(targetViewId, icon)}
        />
        {targetViewType?.settingsMenu && (
          <>
            <MenuSeparator />
            {React.createElement(targetViewType.settingsMenu, {
              view: targetView,
              options: targetViewOptions,
              onUpdateOptions: (options: object) =>
                DataViews.update(targetViewId, { options }),
            })}
          </>
        )}
      </>
    );
  }

  if (!database) {
    return null;
  }

  return (
    <>
      {/* View switcher bar - hidden when the views toolbar is
          disabled in settings */}
      {!database.hideViewsToolbar && (
        <div className="database-view-switcher">
          {view && (
            <>
              <Tabs value={view.id} onValueChange={setActiveViewId}>
                <SortableList
                  as={TabsList}
                  items={databaseViews.map((databaseView) => databaseView.id)}
                  direction="horizontal"
                  gap={1}
                  onSort={handleSortViews}
                  renderItem={(id, { ref, handleProps, style, className }) => {
                    const databaseView = databaseViews.find(
                      (view) => view.id === id,
                    );

                    if (!databaseView) {
                      return null;
                    }

                    const isActive = databaseView.id === activeViewId;

                    return (
                      <TabsTab
                        key={databaseView.id}
                        ref={ref}
                        value={databaseView.id}
                        startIcon={<ContentIcon icon={databaseView.icon} />}
                        className={className}
                        style={style}
                        onClick={(event) =>
                          handleTabClick(event, databaseView.id, isActive)
                        }
                        onContextMenu={(event) =>
                          handleTabContextMenu(event, databaseView.id)
                        }
                        {...handleProps}
                      >
                        {databaseView.name}
                      </TabsTab>
                    );
                  }}
                />
              </Tabs>

              {/* View options menu - opens when clicking the active tab */}
              <ContextMenuRoot
                open={dropdownMenuViewId !== null}
                onOpenChange={handleViewMenuOpenChange}
              >
                <ContextMenuPortal>
                  <ContextMenuPositioner
                    anchor={dropdownAnchor}
                    side="bottom"
                    align="start"
                    sideOffset={4}
                  >
                    <ContextMenuContent>
                      {dropdownMenuViewId &&
                        renderViewMenuContent(dropdownMenuViewId)}
                    </ContextMenuContent>
                  </ContextMenuPositioner>
                </ContextMenuPortal>
              </ContextMenuRoot>
            </>
          )}

          {/* Add view dropdown */}
          <AddDataViewMenu
            size="sm"
            color="muted"
            dataSources={['database']}
            onSelectViewType={handleAddView}
          />

          {/* Active view actions */}
          {view && (
            <Group gap={2} className="database-view-switcher-actions">
              {/* Entry sort dropdown */}
              <DataViewSortMenu view={view} size="sm" />

              {/* View settings dropdown */}
              <DropdownMenuRoot>
                <DropdownMenuTrigger>
                  <IconButton
                    size="sm"
                    label="databases.actions.viewSettings"
                    tooltip={{ title: 'databases.actions.viewSettings' }}
                    icon="settings-2"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuPositioner side="bottom" align="end">
                    <DropdownMenuContent>
                      <MenuRenameItem
                        value={view.name}
                        contentIcon={view.icon}
                        onValueChange={() => {}}
                        onRename={handleRenameActiveView}
                        onSelectIcon={handleSelectActiveViewIcon}
                      />
                      {activeViewType?.settingsMenu && (
                        <>
                          <MenuSeparator />
                          {React.createElement(activeViewType.settingsMenu, {
                            view,
                            options: viewOptions,
                            onUpdateOptions: handleUpdateViewOptions,
                          })}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </DropdownMenuRoot>
            </Group>
          )}
        </div>
      )}

      {/* View content */}
      {view && (
        <DataViewRenderer key={view.id} view={view} entries={entryIds} />
      )}
    </>
  );
};
