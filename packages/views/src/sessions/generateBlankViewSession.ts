import { entityId } from '@minddrop/utils';
import { DefaultSplitRatio, DefaultViewName } from '../constants';
import { ViewSession } from '../types';

/**
 * Generates a new blank session: a fresh id, the default view in its
 * main pane, the default split ratio, empty history stacks and no
 * transient state. The view is labelled and iconed from its
 * registration.
 *
 * @returns The blank session, not yet stored.
 */
export function generateBlankViewSession(): ViewSession {
  return {
    id: entityId('session'),
    main: { view: DefaultViewName },
    split: null,
    splitRatio: DefaultSplitRatio,
    backHistory: [],
    forwardHistory: [],
    viewState: {},
  };
}
