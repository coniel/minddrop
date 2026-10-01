import { Events } from '@minddrop/events';
import { ViewPaneLocation } from '@minddrop/views';

/**
 * Announces that a reference is to be opened.
 *
 * @param reference - What was written between the link's brackets.
 * @param fragment - The part of the target the link points into.
 * @param source - The view pane the link was opened from.
 *
 * @dispatches app:reference:open
 */
export function openReference(
  reference: string,
  fragment?: string,
  source?: ViewPaneLocation | null,
): void {
  // Dispatch the open reference event
  Events.dispatch(Events.events.OpenReference, {
    reference,
    fragment,
    viewAreaId: source?.viewAreaId,
    sourcePane: source?.pane,
  });
}
