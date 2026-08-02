import {
  Events,
  MainContentViewDescriptor,
  SetMainContentEvent,
  SetMainContentEventData,
} from '@minddrop/events';
import { uuid } from '@minddrop/utils';
import { Tab, TabView, TabsStore } from '../TabsStore';

const DEFAULT_SPLIT_RATIO = 50;
const DEFAULT_ICON = 'content-icon:file:default';

/**
 * Opens a new blank tab and makes it active.
 */
export function newTab(): void {
  const tab = createBlankTab();

  TabsStore.set('tabs', [...getTabs(), tab]);
  TabsStore.set('activeTabId', tab.id);

  dispatchMainContent(tab);
}

/**
 * Closes the tab with the given id, activating a neighbouring tab
 * when the closed tab was active.
 *
 * @param id - The id of the tab to close.
 */
export function closeTab(id: string): void {
  const tabs = getTabs();
  const index = tabs.findIndex((tab) => tab.id === id);

  if (index === -1) {
    return;
  }

  const nextTabs = tabs.filter((tab) => tab.id !== id);

  TabsStore.set('tabs', nextTabs);

  // Nothing more to do when a background tab was closed
  if (TabsStore.get('activeTabId') !== id) {
    return;
  }

  const neighbour = nextTabs[index] ?? nextTabs[index - 1] ?? null;

  TabsStore.set('activeTabId', neighbour?.id ?? null);
  dispatchMainContent(neighbour);
}

/**
 * Activates the tab with the given id and restores its content.
 *
 * @param id - The id of the tab to activate.
 */
export function setActiveTab(id: string): void {
  const tab = getTabs().find((tab) => tab.id === id);

  if (!tab) {
    return;
  }

  TabsStore.set('activeTabId', id);
  dispatchMainContent(tab);
}

/**
 * Reorders the tabs to match the given ordered list of tab ids.
 *
 * @param orderedIds - The tab ids in their new order.
 */
export function setTabOrder(orderedIds: string[]): void {
  const tabsById = new Map(getTabs().map((tab) => [tab.id, tab]));

  const nextTabs = orderedIds
    .map((id) => tabsById.get(id))
    .filter((tab): tab is Tab => tab !== undefined);

  TabsStore.set('tabs', nextTabs);
}

/**
 * Updates the view with the given instance id (e.g. after a rename),
 * setting its new id, props, title and icon.
 *
 * @param viewId - The instance id of the view to update.
 * @param changes - The new id, props (merged), title and icon.
 */
export function updateTabsForView(
  viewId: string,
  changes: {
    id?: string;
    props?: Record<string, unknown>;
    title?: string;
    icon?: string;
  },
): void {
  const activeTabId = TabsStore.get('activeTabId');
  let changed = false;
  let activeChanged = false;

  const nextTabs = getTabs().map((tab) => {
    const main = applyViewUpdate(tab.main, viewId, changes);
    const split = applyViewUpdate(tab.split, viewId, changes);

    if (main === tab.main && split === tab.split) {
      return tab;
    }

    changed = true;

    if (tab.id === activeTabId) {
      activeChanged = true;
    }

    return { ...tab, main, split };
  });

  if (!changed) {
    return;
  }

  TabsStore.set('tabs', nextTabs);

  // Re-render the active view when its props changed (e.g. a new id)
  if (activeChanged) {
    dispatchMainContent(getActiveTab());
  }
}

/**
 * Closes the view with the given instance id. When it matches a split
 * view, only the split is cleared.
 *
 * @param viewId - The instance id of the view to close.
 */
export function closeTabsForView(viewId: string): void {
  const tabs = getTabs();
  const activeTabId = TabsStore.get('activeTabId');
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
  let changed = false;

  const nextTabs: Tab[] = [];

  tabs.forEach((tab) => {
    if (viewMatches(tab.main, viewId)) {
      // The main view matches, drop the whole tab
      changed = true;

      return;
    }

    if (viewMatches(tab.split, viewId)) {
      // Only the split matches, clear it
      changed = true;
      nextTabs.push({ ...tab, split: null, splitRatio: DEFAULT_SPLIT_RATIO });

      return;
    }

    nextTabs.push(tab);
  });

  if (!changed) {
    return;
  }

  TabsStore.set('tabs', nextTabs);

  // Reassign the active tab when it was removed, otherwise re-sync in
  // case its split was cleared
  if (!nextTabs.some((tab) => tab.id === activeTabId)) {
    const neighbour =
      nextTabs[Math.min(activeIndex, nextTabs.length - 1)] ?? null;

    TabsStore.set('activeTabId', neighbour?.id ?? null);
    dispatchMainContent(neighbour);
  } else {
    dispatchMainContent(getActiveTab());
  }
}

/**
 * Records the current main content state onto the active tab. Creates
 * an active tab first when none exists.
 *
 * @param state - The current main content state.
 */
export function recordMainContent(state: SetMainContentEventData): void {
  let tabs = getTabs();
  let activeTabId = TabsStore.get('activeTabId');

  // Ensure there is an active tab to record onto
  if (!activeTabId || !tabs.some((tab) => tab.id === activeTabId)) {
    const tab = createBlankTab();

    tabs = [...tabs, tab];
    activeTabId = tab.id;

    TabsStore.set('activeTabId', activeTabId);
  }

  const nextTabs = tabs.map((tab) => {
    if (tab.id !== activeTabId) {
      return tab;
    }

    return {
      ...tab,
      main: toTabView(state.main),
      split: toTabView(state.split),
      splitRatio: state.splitRatio,
    };
  });

  TabsStore.set('tabs', nextTabs);
}

/**
 * Closes the active tab, if there is one.
 */
export function closeActiveTab(): void {
  const activeTabId = TabsStore.get('activeTabId');

  if (activeTabId) {
    closeTab(activeTabId);
  }
}

/**
 * Activates the tab at the given index, if one exists.
 *
 * @param index - The zero-based index of the tab to activate.
 */
export function activateTabByIndex(index: number): void {
  const tab = getTabs()[index];

  if (tab) {
    setActiveTab(tab.id);
  }
}

/**
 * Creates a blank tab when there are no tabs.
 */
export function ensureTab(): void {
  if (getTabs().length === 0) {
    newTab();
  }
}

/**
 * Restores the active tab's content into the main content area.
 */
export function restoreActiveTab(): void {
  dispatchMainContent(getActiveTab());
}

/**
 * Returns all open tabs.
 */
export function useTabs(): Tab[] {
  return TabsStore.useValue('tabs');
}

/**
 * Returns the id of the active tab.
 */
export function useActiveTabId(): string | null {
  return TabsStore.useValue('activeTabId');
}

// -- Local helpers --

/**
 * Returns all open tabs from the store.
 */
function getTabs(): Tab[] {
  return TabsStore.get('tabs');
}

/**
 * Returns the active tab, or null when there is none.
 */
function getActiveTab(): Tab | null {
  const activeTabId = TabsStore.get('activeTabId');

  return getTabs().find((tab) => tab.id === activeTabId) ?? null;
}

/**
 * Creates a new blank tab.
 */
function createBlankTab(): Tab {
  return {
    id: uuid(),
    main: null,
    split: null,
    splitRatio: DEFAULT_SPLIT_RATIO,
  };
}

/**
 * Whether a tab view has the given instance id.
 */
function viewMatches(tabView: TabView | null, viewId: string): boolean {
  return tabView?.id === viewId;
}

/**
 * Returns the tab view with the changes applied when it matches,
 * otherwise the original tab view unchanged.
 */
function applyViewUpdate(
  tabView: TabView | null,
  viewId: string,
  changes: {
    id?: string;
    props?: Record<string, unknown>;
    title?: string;
    icon?: string;
  },
): TabView | null {
  if (!viewMatches(tabView, viewId)) {
    return tabView;
  }

  return {
    ...tabView!,
    id: changes.id ?? tabView!.id,
    props: changes.props
      ? { ...(tabView!.props as Record<string, unknown>), ...changes.props }
      : tabView!.props,
    title: changes.title ?? tabView!.title,
    icon: changes.icon ?? tabView!.icon,
  };
}

/**
 * Converts a main content view descriptor into a tab view.
 */
function toTabView(
  descriptor: MainContentViewDescriptor | null,
): TabView | null {
  if (!descriptor) {
    return null;
  }

  return {
    view: descriptor.view,
    id: descriptor.id,
    props: descriptor.props,
    title: descriptor.title,
    icon: descriptor.icon ?? DEFAULT_ICON,
  };
}

/**
 * Dispatches a tab's content as the main content state.
 */
function dispatchMainContent(tab: Tab | null): void {
  Events.dispatch<SetMainContentEventData>(
    SetMainContentEvent,
    toSetMainContentEventData(tab),
  );
}

/**
 * Converts a tab into a main content state.
 */
function toSetMainContentEventData(tab: Tab | null): SetMainContentEventData {
  if (!tab) {
    return { main: null, split: null, splitRatio: DEFAULT_SPLIT_RATIO };
  }

  return {
    main: toDescriptor(tab.main),
    split: toDescriptor(tab.split),
    splitRatio: tab.splitRatio,
  };
}

/**
 * Converts a tab view into a main content view descriptor.
 */
function toDescriptor(
  tabView: TabView | null,
): MainContentViewDescriptor | null {
  if (!tabView) {
    return null;
  }

  return {
    view: tabView.view,
    id: tabView.id,
    props: tabView.props,
    title: tabView.title,
    icon: tabView.icon,
  };
}
