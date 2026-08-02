import { FC } from 'react';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  IconButton,
  TabsList,
  Tabs as TabsRoot,
} from '@minddrop/ui-primitives';
import { Tabs } from '../Tabs';
import { Tab } from './Tab';
import './TabsToolbar.css';

/**
 * Top toolbar of the main content area. Renders the open tabs and a
 * button to open a new tab.
 */
export const TabsToolbar: FC = () => {
  const tabs = Tabs.useTabs();
  const activeTabId = Tabs.useActiveTabId();

  function handleNewTab() {
    Tabs.newTab();
  }

  function handleValueChange(value: string) {
    Tabs.setActiveTab(value);
  }

  function handleSort(newOrder: string[]) {
    Tabs.setTabOrder(newOrder);
  }

  return (
    <div className="app-tabs-toolbar electrobun-webkit-app-region-no-drag">
      <TabsRoot
        className="app-tabs"
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
            const tab = tabs.find((currentTab) => currentTab.id === id);

            if (!tab) {
              return null;
            }

            return <Tab key={tab.id} tab={tab} sortable={sortable} />;
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
