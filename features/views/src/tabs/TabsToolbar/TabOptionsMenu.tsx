import { FC } from 'react';
import { DefaultViewName } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import {
  ContentIcon,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuSeparator,
  ContextSubmenu,
  ContextSubmenuContent,
  ContextSubmenuTriggerItem,
} from '@minddrop/ui-primitives';
import { Tab } from '../TabSetsStore';
import { closeOtherTabs } from '../closeOtherTabs';
import { closeTab } from '../closeTab';
import { closeTabsToTheLeft } from '../closeTabsToTheLeft';
import { closeTabsToTheRight } from '../closeTabsToTheRight';
import { duplicateTab } from '../duplicateTab';
import { getTabLabel } from '../getTabLabel';
import { newTab } from '../newTab';
import { splitTab } from '../splitTab';
import { splitTabWithTab } from '../splitTabWithTab';
import { DEFAULT_ICON } from '../tabsConstants';
import { unsplitTab } from '../unsplitTab';

// Icon of the search split, shown until a search view exists
const SEARCH_ICON = 'content-icon:search:default';

interface TabOptionsMenuProps {
  /**
   * The id of the view area the tab belongs to.
   */
  viewAreaId: string;

  /**
   * The id of the tab the menu was opened on.
   */
  tabId: string;

  /**
   * The view area's open tabs.
   */
  tabs: Tab[];
}

/**
 * Renders the menu items for a view tab's options menu. Designed to
 * be used as children of a ContextMenu.
 */
export const TabOptionsMenu: FC<TabOptionsMenuProps> = ({
  viewAreaId,
  tabId,
  tabs,
}) => {
  const { t } = useTranslation();

  // The position of the tab the menu was opened on
  const tabIndex = tabs.findIndex((tab) => tab.id === tabId);

  // Whether the tab already has a split pane
  const isSplit = Boolean(tabs[tabIndex]?.split);

  // The tabs which can be moved into the split pane: the other tabs
  // which have a view to move
  const splitCandidates = tabs.filter((tab) => tab.id !== tabId && tab.main);

  // Open a new blank tab before the tab
  function handleNewTabToTheLeft() {
    newTab(viewAreaId, { index: tabIndex });
  }

  // Open a new blank tab after the tab
  function handleNewTabToTheRight() {
    newTab(viewAreaId, { index: tabIndex + 1 });
  }

  // Duplicate the tab
  function handleDuplicate() {
    duplicateTab(viewAreaId, tabId);
  }

  // Open a search view in the tab's split pane
  function handleSplitWithSearch() {
    splitTab(viewAreaId, tabId, {
      view: DefaultViewName,
      title: t('tabs.split.search'),
      icon: SEARCH_ICON,
    });
  }

  // Close the tab's split pane
  function handleUnsplit() {
    unsplitTab(viewAreaId, tabId);
  }

  // Close the tab
  function handleClose() {
    closeTab(viewAreaId, tabId);
  }

  // Close every other tab
  function handleCloseOthers() {
    closeOtherTabs(viewAreaId, tabId);
  }

  // Close the tabs positioned before this one
  function handleCloseToTheLeft() {
    closeTabsToTheLeft(viewAreaId, tabId);
  }

  // Close the tabs positioned after this one
  function handleCloseToTheRight() {
    closeTabsToTheRight(viewAreaId, tabId);
  }

  return (
    <>
      {/* Open a new blank tab before the tab */}
      <ContextMenuItem
        icon="arrow-left"
        label="tabs.newToTheLeft"
        onSelect={handleNewTabToTheLeft}
      />

      {/* Open a new blank tab after the tab */}
      <ContextMenuItem
        icon="arrow-right"
        label="tabs.newToTheRight"
        onSelect={handleNewTabToTheRight}
      />

      {/* Duplicate the tab */}
      <ContextMenuItem
        icon="copy"
        label="tabs.duplicate"
        onSelect={handleDuplicate}
      />

      {/* Close the tab's split pane */}
      {isSplit && (
        <ContextMenuItem
          icon="panel-right-close"
          label="tabs.unsplit"
          onSelect={handleUnsplit}
        />
      )}

      {/* Open a view in the tab's split pane */}
      {!isSplit && (
        <ContextSubmenu>
          <ContextSubmenuTriggerItem
            icon="columns-2"
            label="tabs.split.label"
          />
          <ContextMenuPortal>
            <ContextMenuPositioner side="right" align="start" sideOffset={4}>
              <ContextSubmenuContent>
                {/* Split with a search view */}
                <ContextMenuItem
                  icon="search"
                  label="tabs.split.search"
                  onSelect={handleSplitWithSearch}
                />

                {/* Split with one of the other open tabs */}
                {splitCandidates.length > 0 && (
                  <ContextMenuGroup label="tabs.split.tabs">
                    {splitCandidates.map((tab) => (
                      <SplitWithTabItem
                        key={tab.id}
                        viewAreaId={viewAreaId}
                        tabId={tabId}
                        sourceTab={tab}
                      />
                    ))}
                  </ContextMenuGroup>
                )}
              </ContextSubmenuContent>
            </ContextMenuPositioner>
          </ContextMenuPortal>
        </ContextSubmenu>
      )}

      <ContextMenuSeparator />

      {/* Close the tab */}
      <ContextMenuItem icon="x" label="tabs.close" onSelect={handleClose} />

      {/* Close every other tab */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeOthers"
        disabled={tabs.length < 2}
        onSelect={handleCloseOthers}
      />

      {/* Close the tabs positioned before this one */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeToTheLeft"
        disabled={tabIndex < 1}
        onSelect={handleCloseToTheLeft}
      />

      {/* Close the tabs positioned after this one */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeToTheRight"
        disabled={tabIndex >= tabs.length - 1}
        onSelect={handleCloseToTheRight}
      />
    </>
  );
};

interface SplitWithTabItemProps {
  /**
   * The id of the view area the tabs belong to.
   */
  viewAreaId: string;

  /**
   * The id of the tab being split.
   */
  tabId: string;

  /**
   * The tab moved into the split pane when selected.
   */
  sourceTab: Tab;
}

/**
 * Renders a menu item which moves an open tab into the split pane of
 * the tab the menu was opened on.
 */
const SplitWithTabItem: FC<SplitWithTabItemProps> = ({
  viewAreaId,
  tabId,
  sourceTab,
}) => {
  const { t } = useTranslation();

  // Move the tab into the split pane
  function handleSelect() {
    splitTabWithTab(viewAreaId, tabId, sourceTab.id);
  }

  return (
    <ContextMenuItem
      icon={<ContentIcon icon={sourceTab.main?.icon ?? DEFAULT_ICON} />}
      stringLabel={getTabLabel(sourceTab, t('tabs.new'))}
      onSelect={handleSelect}
    />
  );
};
