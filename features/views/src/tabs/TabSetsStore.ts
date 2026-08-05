import { ViewDescriptor } from '@minddrop/events';
import { createObjectStore } from '@minddrop/stores';
import { EntityId } from '@minddrop/utils';

export interface TabView {
  /**
   * Identifier for the view type, following the convention
   * `[package]:view:[name]`.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * updates or closing.
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: unknown;

  /**
   * The tab's display title, when it is a literal string
   * (e.g. a database or entry name). Views with a static label
   * (e.g. the design studio) leave this unset and are labelled by
   * the tab component.
   */
  title?: string;

  /**
   * The tab's icon as a serializable icon string.
   */
  icon: string;

  /**
   * Descriptors of the view's ancestor views, ordered root first,
   * rendered as the view's breadcrumb trail.
   */
  breadcrumbs?: ViewDescriptor[];
}

export type TabId = EntityId<'tab'>;

export interface TabHistoryEntry {
  /**
   * The main pane view at the time of the snapshot, or null when
   * the tab was blank.
   */
  main: TabView | null;

  /**
   * The split pane view at the time of the snapshot, or null when
   * the tab had no split.
   */
  split: TabView | null;

  /**
   * The main pane width as a percentage at the time of the snapshot.
   */
  splitRatio: number;
}

export interface Tab {
  /**
   * Unique identifier for the tab.
   */
  id: TabId;

  /**
   * The view shown in the main (left) pane, or null when the tab
   * is blank.
   */
  main: TabView | null;

  /**
   * The view shown in the split (right) pane, or null when the
   * tab has no split.
   */
  split: TabView | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;

  /**
   * Previously shown view area states, nearest last, restored by
   * navigating back.
   */
  backHistory?: TabHistoryEntry[];

  /**
   * View area states navigated back from, nearest last, restored by
   * navigating forward.
   */
  forwardHistory?: TabHistoryEntry[];
}

export interface TabSet {
  /**
   * The tab set's unique identifier.
   */
  id: string;

  /**
   * The ordered list of open tabs.
   */
  tabs: Tab[];

  /**
   * The id of the currently active tab, or null when there are
   * no tabs.
   */
  activeTabId: string | null;
}

/**
 * Persistent store of tab sets, keyed by set id. Each set is an
 * independent group of tabs (e.g. the main app tabs).
 */
export const TabSetsStore = createObjectStore<TabSet>('Views:Tabs', 'id', {
  persistTo: 'workspace-config',
  namespace: 'tabs',
});

/**
 * Returns all open tabs in the given set.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useTabs(viewAreaId: string): Tab[] {
  return TabSetsStore.useItem(viewAreaId)?.tabs ?? [];
}

/**
 * Returns the id of the active tab in the given set.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useActiveTabId(viewAreaId: string): string | null {
  return TabSetsStore.useItem(viewAreaId)?.activeTabId ?? null;
}

/**
 * Returns whether the active tab in the given set has back history
 * to navigate to.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useCanGoBack(viewAreaId: string): boolean {
  const set = TabSetsStore.useItem(viewAreaId);

  // Find the active tab in the set
  const activeTab = set?.tabs.find((tab) => tab.id === set.activeTabId);

  return Boolean(activeTab?.backHistory?.length);
}

/**
 * Returns whether the active tab in the given set has forward history
 * to navigate to.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useCanGoForward(viewAreaId: string): boolean {
  const set = TabSetsStore.useItem(viewAreaId);

  // Find the active tab in the set
  const activeTab = set?.tabs.find((tab) => tab.id === set.activeTabId);

  return Boolean(activeTab?.forwardHistory?.length);
}
