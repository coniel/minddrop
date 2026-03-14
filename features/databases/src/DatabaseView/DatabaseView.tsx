import React, { useCallback, useEffect, useMemo } from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { ViewRenderer } from '@minddrop/feature-views';
import { useTranslation } from '@minddrop/i18n';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContentIcon,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
  Icon,
  IconButton,
  MenuGroup,
  Panel,
  Stack,
  Tabs,
  TabsList,
  TabsTab,
  Text,
  Toolbar,
} from '@minddrop/ui-primitives';
import { uuid } from '@minddrop/utils';
import { ViewTypes, Views } from '@minddrop/views';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
import {
  setDatabaseViewState,
  useDatabaseViewState,
} from '../DatabaseViewStateStore';
import './DatabaseView.css';

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
  const unsortedViews = Views.useDataSourceViews('database', databaseId);
  const viewTypes = ViewTypes.useAll();
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

  // Resolve the active view ID from persisted state,
  // falling back to the first view
  const activeViewId = viewState.activeViewId ?? databaseViews[0]?.id;

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
      setDatabaseViewState(databaseId, { activeViewId: viewId ?? null });
    },
    [databaseId],
  );

  // Toggle the configuration panel
  const toggleConfigurationPanel = useCallback(() => {
    setDatabaseViewState(databaseId, {
      configPanelOpen: !configurationPanelOpen,
    });
  }, [databaseId, configurationPanelOpen]);

  // Sync activeViewId when views change (e.g. active view deleted)
  useEffect(() => {
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
  const activeViewType = ViewTypes.use(view?.type ?? '');

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
    (options: Record<string, unknown>) => {
      if (view) {
        Views.update(view.id, { options });
      }
    },
    [view],
  );

  async function handleClickNewEntry() {
    if (!database) {
      return;
    }

    DatabaseEntries.create(database.id);
  }

  /**
   * Creates a new virtual view of the specified type and sets it as active.
   */
  function handleAddView(type: string) {
    const newView = Views.createVirtual({
      id: uuid(),
      type,
      dataSource: { type: 'database', id: databaseId },
    });

    setActiveViewId(newView.id);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    Databases.handleDrop(databaseId, event);
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (!database) {
    return <div className="database-view">Database not found.</div>;
  }

  return (
    <div className="database-view">
      <Panel
        className="database"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="header">
          <div className="title">
            <ContentIcon icon={database.icon} />
            <Heading noMargin>{database.name}</Heading>
          </div>
          <Toolbar>
            <IconButton
              icon="plus"
              label="databases.actions.newEntry"
              color="neutral"
              onClick={handleClickNewEntry}
            />
            <IconButton
              icon={
                configurationPanelOpen
                  ? 'panel-right-close'
                  : 'panel-right-open'
              }
              label="databases.actions.configuration"
              color="neutral"
              onClick={toggleConfigurationPanel}
            />
          </Toolbar>
        </div>

        {/* View switcher bar — hidden when the database has no entries */}
        {!isEmpty && (
          <div className="view-switcher">
            <Tabs value={view?.id} onValueChange={setActiveViewId}>
              <SortableList
                as={TabsList}
                items={databaseViews.map((databaseView) => databaseView.id)}
                direction="horizontal"
                gap={1}
                onSort={(newOrder) => {
                  // Reorder views in the views store
                  Views.reorderDataSourceViews(newOrder);
                  // Persist the sort order to the database
                  Databases.update(databaseId, { viewOrder: newOrder });
                }}
                renderItem={(
                  id,
                  { ref, handleProps, isDragging, style, className },
                ) => {
                  const databaseView = databaseViews.find(
                    (view) => view.id === id,
                  );

                  if (!databaseView) {
                    return null;
                  }

                  return (
                    <TabsTab
                      ref={ref}
                      value={databaseView.id}
                      startIcon={databaseView.icon}
                      className={className}
                      style={style}
                      {...handleProps}
                    >
                      {databaseView.name}
                    </TabsTab>
                  );
                }}
              />
            </Tabs>

            {/* Add view dropdown */}
            <DropdownMenu
              trigger={
                <IconButton
                  size="sm"
                  label="databases.actions.addView"
                  icon="plus"
                  color="muted"
                />
              }
              minWidth={200}
            >
              <MenuGroup>
                {viewTypes
                  .filter((viewType) =>
                    viewType.supportedDataSources.includes('database'),
                  )
                  .map((viewType) => (
                    <DropdownMenuItem
                      key={viewType.type}
                      icon={viewType.icon}
                      label={viewType.name}
                      tooltip={{ title: viewType.description }}
                      onClick={() => handleAddView(viewType.type)}
                    />
                  ))}
              </MenuGroup>
            </DropdownMenu>

            {/* View settings dropdown, shown only when the view type has a settings menu */}
            {activeViewType?.settingsMenu && (
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
                    {React.createElement(activeViewType.settingsMenu, {
                      view,
                      options: viewOptions,
                      onUpdateOptions: handleUpdateViewOptions,
                    })}
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
          <ViewRenderer key={view.id} view={view} entries={entryIds} />
        )}
      </Panel>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
