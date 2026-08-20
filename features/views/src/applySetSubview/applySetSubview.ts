import { SetSubviewEventData } from '@minddrop/views';
import { ViewAreaState } from '../applyOpenView';

/**
 * Returns the view area state with the entity a pane's view shows
 * within itself set, leaving the state untouched when the pane is
 * empty.
 *
 * @param current - The view area's current state.
 * @param data - The set subview event's data.
 * @returns The next view area state.
 */
export function applySetSubview(
  current: ViewAreaState,
  data: SetSubviewEventData,
): ViewAreaState {
  // The pane the subview belongs to, defaulting to the main pane
  const pane = data.sourcePane === 'split' ? 'split' : 'main';
  const view = current[pane];

  // Nothing to set on an empty pane
  if (!view) {
    return current;
  }

  return {
    ...current,
    [pane]: { ...view, subview: data.subview ?? undefined },
  };
}
