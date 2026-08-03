import { FC, useEffect } from 'react';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  IconButton,
  TabsList,
  Tabs as TabsRoot,
} from '@minddrop/ui-primitives';
import { useActiveTabId, useTabs } from '../TabSetsStore';
import { ensureTab } from '../ensureTab';
import { initializeTabsSyncListeners } from '../initializeTabsSyncListeners';
import { newTab } from '../newTab';
import { setActiveTab } from '../setActiveTab';
import { setTabOrder } from '../setTabOrder';
import { useTabShortcuts } from '../useTabShortcuts';
import { Tab } from './Tab';
import './TabsToolbar.css';

interface TabsToolbarProps {
  /**
   * The id of the view area to render.
   */
  viewAreaId: string;

  /**
   * Whether to bind global tab keyboard shortcuts. Only the top-level
   * app view area should enable these.
   */
  shortcuts?: boolean;
}

/**
 * Toolbar for a view area. Renders its open tabs and a button to open
 * a new tab.
 */
export const TabsToolbar: FC<TabsToolbarProps> = ({
  viewAreaId,
  shortcuts = false,
}) => {
  const tabs = useTabs(viewAreaId);
  const activeTabId = useActiveTabId(viewAreaId);

  // Bind keyboard shortcuts when enabled for this set
  useTabShortcuts(viewAreaId, shortcuts);

  // Ensure the set always has at least one tab to render
  useEffect(() => {
    ensureTab(viewAreaId);
  }, [viewAreaId]);

  // Keep this view area's tabs in sync with its rendered views while
  // mounted
  useEffect(() => {
    return initializeTabsSyncListeners(viewAreaId);
  }, [viewAreaId]);

  // Open a new tab
  function handleNewTab() {
    newTab(viewAreaId);
  }

  // Activate the selected tab
  function handleValueChange(value: string) {
    setActiveTab(viewAreaId, value);
  }

  // Persist the new tab order after a drag
  function handleSort(newOrder: string[]) {
    setTabOrder(viewAreaId, newOrder);
  }

  return (
    <div className="view-tabs-toolbar electrobun-webkit-app-region-no-drag">
      <TabsRoot
        className="view-tabs"
        value={activeTabId ?? undefined}
        onValueChange={handleValueChange}
      >
        <SortableList
          as={TabsList}
          items={tabs.map((tab) => tab.id)}
          direction="horizontal"
          gap={1}
          onSort={handleSort}
          renderItem={(id, sortable) => {
            // Resolve the tab for the sortable item
            const tab = tabs.find((currentTab) => currentTab.id === id);

            // Skip items whose tab no longer exists
            if (!tab) {
              return null;
            }

            return (
              <Tab
                key={tab.id}
                viewAreaId={viewAreaId}
                tab={tab}
                sortable={sortable}
              />
            );
          }}
        >
          <IconButton
            icon="plus"
            color="muted"
            label="tabs.new"
            tooltip={{ title: 'tabs.new' }}
            onClick={handleNewTab}
            size="sm"
          />
        </SortableList>
      </TabsRoot>
    </div>
  );
};
