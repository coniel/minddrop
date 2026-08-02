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
   * The id of the tab set to render.
   */
  setId: string;

  /**
   * Whether to bind global tab keyboard shortcuts. Only the top-level
   * app tab set should enable these.
   */
  shortcuts?: boolean;
}

/**
 * Toolbar for a tab set. Renders its open tabs and a button to open a
 * new tab.
 */
export const TabsToolbar: FC<TabsToolbarProps> = ({
  setId,
  shortcuts = false,
}) => {
  const tabs = useTabs(setId);
  const activeTabId = useActiveTabId(setId);

  // Bind keyboard shortcuts when enabled for this set
  useTabShortcuts(setId, shortcuts);

  // Ensure the set always has at least one tab to render
  useEffect(() => {
    ensureTab(setId);
  }, [setId]);

  // Keep this tab set in sync with the main content area while rendered
  useEffect(() => {
    return initializeTabsSyncListeners(setId);
  }, [setId]);

  // Open a new tab
  function handleNewTab() {
    newTab(setId);
  }

  // Activate the selected tab
  function handleValueChange(value: string) {
    setActiveTab(setId, value);
  }

  // Persist the new tab order after a drag
  function handleSort(newOrder: string[]) {
    setTabOrder(setId, newOrder);
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
              <Tab key={tab.id} setId={setId} tab={tab} sortable={sortable} />
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
