import { SessionView, ViewDescriptor } from '../types';

/**
 * Converts a view descriptor into a session view.
 *
 * @param descriptor - The descriptor to convert, or null.
 */
export function toSessionView(
  descriptor: ViewDescriptor | null,
): SessionView | null {
  // Nothing to convert when there is no descriptor
  if (!descriptor) {
    return null;
  }

  // Map the descriptor onto a session view, leaving the icon unset
  // when the view provides none so it resolves from its registration.
  return {
    view: descriptor.view,
    id: descriptor.id,
    props: descriptor.props,
    title: descriptor.title,
    contentIcon: descriptor.icon,
    subview: descriptor.subview,
    startsTrail: descriptor.startsTrail,
  };
}
