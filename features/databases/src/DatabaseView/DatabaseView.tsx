import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataViewTypes, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DataViewRenderer } from '@minddrop/feature-data-views';
import { useTranslation } from '@minddrop/i18n';
import { AddDataViewMenu, PanelView } from '@minddrop/ui-components';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContentIcon,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Icon,
  IconButton,
  MenuRenameItem,
  MenuSeparator,
  Stack,
  Tabs,
  TabsList,
  TabsTab,
  Text,
  useTransientState,
} from '@minddrop/ui-primitives';
import { uuid } from '@minddrop/utils';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
import {
  setDatabaseViewState,
  useDatabaseViewState,
} from '../DatabaseViewStateStore';
import './DatabaseView.css';
import { UiIconName } from '@minddrop/ui-icons';

export interface DatabaseViewProps {
  /**
   * The ID of the database to display.
   */
  databaseId: string;

  /**
   * Whether the properties panel is open by default.
   *
   * @default false
   */
  configurationPanelOpen?: boolean;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  databaseId,
  configurationPanelOpen: configPanelOpenProp,
}) => {
  const database = Databases.use(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const unsortedViews = DataViews.useDataSourceDataViews(
    'database',
    databaseId,
  );
  const viewTypes = DataViewTypes.useAll();
  const viewState = useDatabaseViewState(databaseId);

  // Sort views according to the persisted view order
  const databaseViews = useMemo(() => {
    if (!database?.viewOrder) {
      return unsortedViews;
    }

    const orderMap = new Map(
      database.viewOrder.map((id, index) => [id, index]),
    );

    return [...unsortedViews].sort((a, b) => {
      const indexA = orderMap.get(a.id);
      const indexB = orderMap.get(b.id);

      // New views (not in order map) are sorted by creation date
      // and placed after ordered views
      if (indexA === undefined && indexB === undefined) {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      }

      // New views go after ordered views
      if (indexA === undefined) {
        return 1;
      }

      if (indexB === undefined) {
        return -1;
      }

      return indexA - indexB;
    });
  }, [unsortedViews, database?.viewOrder]);

  // Per-tab active view selection, seeded from the last-used view
  const [tabActiveViewId, setTabActiveViewId] = useTransientState<
    string | null
  >('activeViewId', viewState.activeViewId);

  // Resolve the active view ID, falling back to the first view
  const activeViewId = tabActiveViewId ?? databaseViews[0]?.id;

  // Config panel open state: prop override takes precedence,
  // otherwise use persisted state
  const configurationPanelOpen =
    configPanelOpenProp ?? viewState.configPanelOpen;

  // Persist the active view ID and apply the prop override
  // when the database view first mounts
  useEffect(() => {
    if (configPanelOpenProp !== undefined) {
      setDatabaseViewState(databaseId, {
        configPanelOpen: configPanelOpenProp,
      });
    }
  }, [databaseId, configPanelOpenProp]);

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

  // Toggle the configuration panel
  const toggleConfigurationPanel = useCallback(() => {
    setDatabaseViewState(databaseId, {
      configPanelOpen: !configurationPanelOpen,
    });
  }, [databaseId, configurationPanelOpen]);

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

  const { t } = useTranslation();

  // Determine whether the database is empty
  const isEmpty = entryIds.length === 0;

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

  // Track which view's dropdown menu is open and anchor element
  const [dropdownMenuViewId, setDropdownMenuViewId] = useState<string | null>(
    null,
  );
  const [dropdownAnchor, setDropdownAnchor] = useState<Element | null>(null);

  async function handleClickNewEntry() {
    if (!database) {
      return;
    }

    DatabaseEntries.create(database.id);
  }

  // Create a new entry from one of the database's entry templates
  function handleCreateEntryFromTemplate(templateId: string) {
    if (!database) {
      return;
    }

    DatabaseEntries.createFromTemplate(database.id, templateId);
  }

  // Render the new entry action, wrapping it in a template
  // selection menu when the database has entry templates
  function renderNewEntryAction() {
    const templates = database?.entryTemplates ?? [];

    // Without templates, a plain action creates a blank entry
    if (!database || !templates.length) {
      return {
        icon: 'plus' as const,
        label: 'databases.actions.newEntry' as const,
        onClick: handleClickNewEntry,
      };
    }

    // With templates, the action opens a menu with a blank entry
    // option followed by the templates
    return (
      <DropdownMenu
        key="new-entry"
        trigger={
          <IconButton
            icon="plus"
            label="databases.actions.newEntry"
            color="neutral"
          />
        }
      >
        <DropdownMenuItem
          label="databases.entryTemplates.menus.blankEntry"
          contentIcon={database.icon}
          onSelect={handleClickNewEntry}
        />
        {templates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            stringLabel={template.name}
            contentIcon={database.icon}
            onSelect={() => handleCreateEntryFromTemplate(template.id)}
          />
        ))}
      </DropdownMenu>
    );
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
    return <div className="database-view">Database not found.</div>;
  }

  return (
    <div className="database-view">
      <PanelView
        className="database"
        stringTitle={database.name}
        contentIcon={database.icon}
        actions={[
          renderNewEntryAction(),
          {
            icon: configurationPanelOpen
              ? 'panel-right-close'
              : 'panel-right-open',
            label: 'databases.actions.configuration',
            onClick: toggleConfigurationPanel,
          },
        ]}
      >
        {/* View switcher bar - hidden when the database has no entries or
            the views toolbar is disabled in settings */}
        {!isEmpty && !database.hideViewsToolbar && (
          <div className="view-switcher">
            {view && (
              <>
                <Tabs value={view.id} onValueChange={setActiveViewId}>
                  <SortableList
                    as={TabsList}
                    items={databaseViews.map((databaseView) => databaseView.id)}
                    direction="horizontal"
                    gap={1}
                    onSort={(newOrder) => {
                      // Persist the sort order to the database
                      Databases.update(databaseId, { viewOrder: newOrder });
                    }}
                    renderItem={(
                      id,
                      { ref, handleProps, style, className },
                    ) => {
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
                          startIcon={
                            databaseView.icon.includes(':') ? (
                              <ContentIcon icon={databaseView.icon} />
                            ) : (
                              (databaseView.icon as UiIconName)
                            )
                          }
                          className={className}
                          style={style}
                          onClick={(event) => {
                            if (isActive) {
                              setDropdownAnchor(event.currentTarget);
                              setDropdownMenuViewId(databaseView.id);
                            }
                          }}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            setDropdownAnchor(event.currentTarget);
                            setDropdownMenuViewId(databaseView.id);
                          }}
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
                  onOpenChange={(open) => {
                    if (!open) {
                      setDropdownMenuViewId(null);
                      setDropdownAnchor(null);
                    }
                  }}
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

            {/* View settings dropdown */}
            {view && (
              <DropdownMenuRoot>
                <DropdownMenuTrigger>
                  <IconButton
                    className="view-settings-button"
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
            )}
          </div>
        )}

        {/* Empty state placeholder */}
        {isEmpty && (
          <div className="empty-placeholder">
            <Stack align="center" gap={4}>
              {/* Concentric rings illustration with scattered icons */}
              <div className="empty-illustration">
                <div className="empty-ring empty-ring-1" />
                <div className="empty-ring empty-ring-2" />
                <div className="empty-ring empty-ring-3" />
                <div className="empty-ring empty-ring-4" />
                <div className="empty-ring empty-ring-5" />

                {/* Central icon */}
                <div className="empty-center-icon">
                  <Icon name="file-text" />
                </div>

                {/* Icons on the second ring */}
                <div
                  className="empty-orbit-icon"
                  style={{ top: '25%', left: '43%' }}
                >
                  <Icon name="file" />
                </div>
                <div
                  className="empty-orbit-icon"
                  style={{ top: '56%', left: '27%' }}
                >
                  <Icon name="table" />
                </div>
                <div
                  className="empty-orbit-icon"
                  style={{ top: '50%', left: '65%' }}
                >
                  <Icon name="folder" />
                </div>

                {/* Icons on the fourth ring */}
                <div
                  className="empty-orbit-icon empty-orbit-icon-outer"
                  style={{ top: '14%', left: '68%' }}
                >
                  <Icon name="layout-grid" />
                </div>
                <div
                  className="empty-orbit-icon empty-orbit-icon-outer"
                  style={{ top: '18%', left: '18%' }}
                >
                  <Icon name="image" />
                </div>
                <div
                  className="empty-orbit-icon empty-orbit-icon-outer"
                  style={{ top: '73%', left: '15%' }}
                >
                  <Icon name="text" />
                </div>
                <div
                  className="empty-orbit-icon empty-orbit-icon-outer"
                  style={{ top: '70%', left: '72%' }}
                >
                  <Icon name="link" />
                </div>
              </div>

              {/* Text content */}
              <Text size="lg" weight="semibold" color="muted">
                {t('databases.empty.title')}
              </Text>
              <Text
                size="sm"
                color="subtle"
                style={{ maxWidth: 380, textAlign: 'center' }}
              >
                {t('databases.empty.addViaButton')}
              </Text>
              <Text
                size="sm"
                color="subtle"
                style={{ maxWidth: 380, textAlign: 'center' }}
              >
                {t('databases.empty.dropOrPaste')}
              </Text>
            </Stack>
          </div>
        )}

        {/* View content */}
        {!isEmpty && view && (
          <DataViewRenderer key={view.id} view={view} entries={entryIds} />
        )}
      </PanelView>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
