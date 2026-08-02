import { SetMainContentEventData } from '@minddrop/events';
import { Tab } from './TabSetsStore';
import { DEFAULT_SPLIT_RATIO } from './tabsConstants';
import { toDescriptor } from './toDescriptor';

/**
 * Converts a tab into a main content state.
 *
 * @param tab - The tab to convert, or null.
 */
export function toSetMainContentEventData(
  tab: Tab | null,
): SetMainContentEventData {
  // A missing tab maps to an empty main content state
  if (!tab) {
    return { main: null, split: null, splitRatio: DEFAULT_SPLIT_RATIO };
  }

  // Map the tab's views and split ratio onto a main content state
  return {
    main: toDescriptor(tab.main),
    split: toDescriptor(tab.split),
    splitRatio: tab.splitRatio,
  };
}
