import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { ViewRenderer } from '@minddrop/feature-views';
import { useTranslation } from '@minddrop/i18n';
import {
  ContentIcon,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
  IconButton,
  MenuGroup,
  Panel,
  Tabs,
  TabsList,
  TabsTab,
  Toolbar,
  useToggle,
} from '@minddrop/ui-primitives';
import { ViewTypes, Views } from '@minddrop/views';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
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
  configurationPanelOpen: configPanelOpen = false,
}) => {
  const database = Databases.use(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const databaseViews = Views.useDataSourceViews('database', databaseId);
  const viewTypes = ViewTypes.useAll();
  const [activeViewId, setActiveViewId] = useState<string | undefined>(
    databaseViews[0]?.id,
  );
  const [configurationPanelOpen, toggleConfigurationPanel] =
    useToggle(configPanelOpen);

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
  }, [databaseViews, activeViewId]);

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

  const { t } = useTranslation({ keyPrefix: 'databases.actions' });

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
   * Creates a new view of the specified type and sets it as active.
   */
  async function handleAddView(type: string) {
    const newView = await Views.create(type, {
      type: 'database',
      id: databaseId,
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
              label="New"
              color="neutral"
              onClick={handleClickNewEntry}
            />
            <IconButton
              icon={
                configurationPanelOpen
                  ? 'panel-right-close'
                  : 'panel-right-open'
              }
              label="Properties"
              color="neutral"
              onClick={toggleConfigurationPanel}
            />
          </Toolbar>
        </div>

        {/* View switcher bar */}
        <div className="view-switcher">
          <Tabs value={view?.id} onValueChange={setActiveViewId}>
            <TabsList>
              {databaseViews.map((databaseView) => (
                <TabsTab
                  key={databaseView.id}
                  value={databaseView.id}
                  startIcon={databaseView.icon}
                >
                  {databaseView.name}
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>

          {/* Add view dropdown */}
          <DropdownMenu
            trigger={
              <IconButton
                size="sm"
                label="databases.actions.addView"
                icon="plus"
              />
            }
            minWidth={200}
          >
            <MenuGroup padded>
              {viewTypes.map((viewType) => (
                <DropdownMenuItem
                  key={viewType.type}
                  muted
                  icon={viewType.icon}
                  label={viewType.name}
                  tooltipDescription={viewType.description}
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
                  label={t('viewSettings')}
                  tooltipTitle={t('viewSettings')}
                  icon="settings-2"
                />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuPositioner side="bottom" align="end">
                  {React.createElement(activeViewType.settingsMenu, {
                    options: viewOptions,
                    onUpdateOptions: handleUpdateViewOptions,
                  })}
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          )}
        </div>

        {view && <ViewRenderer key={view.id} view={view} entries={entryIds} />}
      </Panel>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
