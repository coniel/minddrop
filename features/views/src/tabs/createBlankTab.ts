import { entityId } from '@minddrop/utils';
import { DefaultViewName } from '@minddrop/views';
import { Tab } from './TabSetsStore';
import { DEFAULT_SPLIT_RATIO } from './tabsConstants';

/**
 * Creates a new blank tab.
 */
export function createBlankTab(): Tab {
  // A blank tab has a fresh id, the default view in its main pane, the
  // default split ratio, empty history stacks and no transient state.
  // The view is labelled and iconed from its registration.
  return {
    id: entityId('tab'),
    main: { view: DefaultViewName },
    split: null,
    splitRatio: DEFAULT_SPLIT_RATIO,
    backHistory: [],
    forwardHistory: [],
    viewState: {},
  };
}
