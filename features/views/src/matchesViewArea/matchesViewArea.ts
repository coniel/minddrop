import { DefaultViewAreaId } from '@minddrop/views';

/**
 * Checks whether a view event targets the given view area. Events
 * without a `viewAreaId` target the app's primary view area.
 *
 * @param eventViewAreaId - The `viewAreaId` from the event, if any.
 * @param viewAreaId - The id of the view area to match against.
 */
export function matchesViewArea(
  eventViewAreaId: string | undefined,
  viewAreaId: string,
): boolean {
  return (eventViewAreaId ?? DefaultViewAreaId) === viewAreaId;
}
