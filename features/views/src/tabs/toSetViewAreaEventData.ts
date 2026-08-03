import { SetViewAreaEventData } from '@minddrop/events';
import { Tab } from './TabSetsStore';
import { DEFAULT_SPLIT_RATIO } from './tabsConstants';
import { toDescriptor } from './toDescriptor';

/**
 * Converts a tab into a view area state.
 *
 * @param viewAreaId - The id of the view area.
 * @param tab - The tab to convert, or null.
 */
export function toSetViewAreaEventData(
  viewAreaId: string,
  tab: Tab | null,
): SetViewAreaEventData {
  // A missing tab maps to an empty view area state
  if (!tab) {
    return {
      viewAreaId,
      main: null,
      split: null,
      splitRatio: DEFAULT_SPLIT_RATIO,
    };
  }

  // Map the tab's views and split ratio onto a view area state
  return {
    viewAreaId,
    main: toDescriptor(tab.main),
    split: toDescriptor(tab.split),
    splitRatio: tab.splitRatio,
  };
}
