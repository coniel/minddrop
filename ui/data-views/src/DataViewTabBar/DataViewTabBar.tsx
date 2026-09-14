import React, { useState } from 'react';
import { DataView, ViewDataSourceType } from '@minddrop/data-views';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContentIcon,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  Group,
  Tabs,
  TabsList,
  TabsTab,
} from '@minddrop/ui-primitives';
import { AddDataViewMenu } from '../AddDataViewMenu';
import { DataViewFilterMenu } from '../DataViewFilterMenu';
import {
  DataViewSettingsMenu,
  DataViewSettingsMenuContent,
} from '../DataViewSettingsMenu';
import { DataViewSortMenu } from '../DataViewSortMenu';
import './DataViewTabBar.css';

export interface DataViewTabBarProps {
  /**
   * The data views shown as tabs, in display order.
   */
  views: DataView[];

  /**
   * The ID of the active view, or null when there is none.
   */
  activeViewId: string | null;

  /**
   * Callback fired with the ID of the view whose tab was selected.
   */
  onActiveViewChange: (viewId: string) => void;

  /**
   * Callback fired with the view IDs in their new order after a tab
   * is dragged to a new position.
   */
  onSort: (viewIds: string[]) => void;

  /**
   * Callback fired with the selected view type when a view is added
   * from the add menu. When omitted, the add menu is not rendered.
   */
  onAddView?: (type: string) => void;

  /**
   * The data source types the add menu offers view types for.
   */
  dataSources?: ViewDataSourceType[];
}

/**
 * Renders a strip of data view tabs with the active view's actions:
 * sortable tabs opening the view's settings menu when the active one
 * is clicked or any is right clicked, an add view menu, and the
 * active view's sort and settings menus trailing.
 */
export const DataViewTabBar: React.FC<DataViewTabBarProps> = ({
  views,
  activeViewId,
  onActiveViewChange,
  onSort,
  onAddView,
  dataSources,
}) => {
  // The view whose menu is open and the tab it is anchored to
  const [menuViewId, setMenuViewId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);

  const activeView = views.find((view) => view.id === activeViewId) ?? null;
  const menuView = views.find((view) => view.id === menuViewId) ?? null;

  // Open a tab's menu when its active tab is clicked
  function handleTabClick(
    event: React.MouseEvent<HTMLElement>,
    viewId: string,
  ) {
    // Only the active tab's click opens the menu
    if (viewId !== activeViewId) {
      return;
    }

    setMenuAnchor(event.currentTarget);
    setMenuViewId(viewId);
  }

  // Open a tab's menu on right click
  function handleTabContextMenu(
    event: React.MouseEvent<HTMLElement>,
    viewId: string,
  ) {
    // Suppress the native context menu
    event.preventDefault();

    setMenuAnchor(event.currentTarget);
    setMenuViewId(viewId);
  }

  function handleMenuOpenChange(open: boolean) {
    // Clear the menu state when the menu closes
    if (!open) {
      setMenuViewId(null);
      setMenuAnchor(null);
    }
  }

  return (
    <div className="data-view-tab-bar">
      {activeView && (
        <>
          <Tabs value={activeView.id} onValueChange={onActiveViewChange}>
            <SortableList
              as={TabsList}
              items={views.map((view) => view.id)}
              direction="horizontal"
              gap={1}
              onSort={onSort}
              renderItem={(id, { ref, handleProps, style, className }) => {
                const view = views.find((view) => view.id === id);

                if (!view) {
                  return null;
                }

                return (
                  <TabsTab
                    key={view.id}
                    ref={ref}
                    value={view.id}
                    startIcon={<ContentIcon icon={view.icon} />}
                    className={className}
                    style={style}
                    onClick={(event) => handleTabClick(event, view.id)}
                    onContextMenu={(event) =>
                      handleTabContextMenu(event, view.id)
                    }
                    {...handleProps}
                  >
                    {view.name}
                  </TabsTab>
                );
              }}
            />
          </Tabs>

          {/* View settings menu, anchored to the clicked tab */}
          <ContextMenuRoot
            open={menuView !== null}
            onOpenChange={handleMenuOpenChange}
          >
            <ContextMenuPortal>
              <ContextMenuPositioner
                anchor={menuAnchor}
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <ContextMenuContent>
                  {menuView && <DataViewSettingsMenuContent view={menuView} />}
                </ContextMenuContent>
              </ContextMenuPositioner>
            </ContextMenuPortal>
          </ContextMenuRoot>
        </>
      )}

      {onAddView && (
        <AddDataViewMenu
          size="sm"
          color="muted"
          dataSources={dataSources}
          onSelectViewType={onAddView}
        />
      )}

      {activeView && (
        <Group gap={2} className="data-view-tab-bar-actions">
          <DataViewFilterMenu view={activeView} size="sm" />
          <DataViewSortMenu view={activeView} size="sm" />
          <DataViewSettingsMenu view={activeView} size="sm" />
        </Group>
      )}
    </div>
  );
};
