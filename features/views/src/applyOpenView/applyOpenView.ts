import { OpenViewEventData, ViewDescriptor } from '@minddrop/views';
import { DEFAULT_SPLIT_RATIO } from '../tabs/tabsConstants';

export interface ViewAreaState {
  /**
   * The view shown in the main (left) pane, or null when empty.
   */
  main: ViewDescriptor | null;

  /**
   * The view shown in the split (right) pane, or null when there
   * is no split.
   */
  split: ViewDescriptor | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;
}

/**
 * Returns the view area state produced by opening a view, placing it
 * according to the open's target pane and source pane.
 *
 * @param current - The view area's current state.
 * @param data - The open view event's data.
 * @returns The next view area state.
 */
export function applyOpenView(
  current: ViewAreaState,
  data: OpenViewEventData,
): ViewAreaState {
  const descriptor: ViewDescriptor = {
    view: data.view,
    id: data.id,
    props: data.props,
    title: data.title,
    icon: data.icon,
    // Opens from outside a view area are navigations to a new
    // destination rather than steps down the current hierarchy
    startsTrail: !data.sourcePane,
  };

  // Open in the split pane, keeping the current main view
  if (data.split) {
    return {
      ...current,
      split: descriptor,
      splitRatio: data.splitRatio ?? current.splitRatio,
    };
  }

  // Replace the split pane the open came from, leaving the main pane
  if (data.sourcePane === 'split') {
    return { ...current, split: descriptor };
  }

  // Replace the main pane the open came from, leaving any split
  if (data.sourcePane === 'main') {
    return { ...current, main: descriptor };
  }

  // Opens from outside a pane replace the view area as a whole
  return {
    main: descriptor,
    split: null,
    splitRatio: DEFAULT_SPLIT_RATIO,
  };
}
