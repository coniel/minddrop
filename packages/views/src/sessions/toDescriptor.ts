import { SessionView, ViewDescriptor } from '../types';

/**
 * Converts a session view into a view descriptor.
 *
 * @param sessionView - The session view to convert, or null.
 */
export function toDescriptor(
  sessionView: SessionView | null,
): ViewDescriptor | null {
  // Nothing to convert when there is no session view
  if (!sessionView) {
    return null;
  }

  // Map the session view onto a view descriptor
  return {
    view: sessionView.view,
    id: sessionView.id,
    props: sessionView.props,
    title: sessionView.title,
    icon: sessionView.contentIcon,
    subview: sessionView.subview,
    startsTrail: sessionView.startsTrail,
  };
}
