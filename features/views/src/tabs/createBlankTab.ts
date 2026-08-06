import { entityId } from '@minddrop/utils';
import { Tab } from './TabSetsStore';
import { DEFAULT_SPLIT_RATIO } from './tabsConstants';

/**
 * Creates a new blank tab.
 */
export function createBlankTab(): Tab {
  // A blank tab has a fresh id, no views, the default split ratio,
  // empty history stacks and no transient state
  return {
    id: entityId('tab'),
    main: null,
    split: null,
    splitRatio: DEFAULT_SPLIT_RATIO,
    backHistory: [],
    forwardHistory: [],
    viewState: {},
  };
}
