import { TabSetsStore, TabView } from '../TabSetsStore';

/**
 * Returns the tab views open across all tab sets, including both
 * main and split panes.
 *
 * @param view - Filters the results to the given view type.
 * @returns The open tab views.
 */
export function getOpenTabs(view?: string): TabView[] {
  // Collect the main/split views from every tab in every set,
  // guarding against hydrated sets without tabs
  const views = TabSetsStore.getAllArray().flatMap((set) =>
    (set.tabs ?? []).flatMap((tab) => [tab.main, tab.split]),
  );

  // Drop empty panes
  const openTabs = views.filter((tabView): tabView is TabView =>
    Boolean(tabView),
  );

  // Filter by view type if given
  if (view) {
    return openTabs.filter((tabView) => tabView.view === view);
  }

  return openTabs;
}
