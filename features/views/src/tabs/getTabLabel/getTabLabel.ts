import { Tab } from '../TabSetsStore';

// Separates the two pane titles of a split tab's label
const SPLIT_SEPARATOR = ' | ';

/**
 * Returns the label of a tab: its view's title, or both pane titles
 * when the tab is split.
 *
 * @param tab - The tab to label.
 * @param blankLabel - The label used for panes without a title.
 */
export function getTabLabel(tab: Tab, blankLabel: string): string {
  // Label the main pane by its title, falling back to the blank label
  const mainLabel = tab.main?.title ?? blankLabel;

  // Unsplit tabs are labelled by their main pane alone
  if (!tab.split) {
    return mainLabel;
  }

  // Label the split pane by its title, falling back to the blank label
  const splitLabel = tab.split.title ?? blankLabel;

  // Combine both pane labels
  return `${mainLabel}${SPLIT_SEPARATOR}${splitLabel}`;
}
