import { ViewDescriptor } from '@minddrop/views';
import { TabView } from './TabSetsStore';

/**
 * Converts a view descriptor into a tab view.
 *
 * @param descriptor - The descriptor to convert, or null.
 */
export function toTabView(descriptor: ViewDescriptor | null): TabView | null {
  // Nothing to convert when there is no descriptor
  if (!descriptor) {
    return null;
  }

  // Map the descriptor onto a tab view, leaving the icon unset when
  // the view provides none so it resolves from its registration
  return {
    view: descriptor.view,
    id: descriptor.id,
    props: descriptor.props,
    title: descriptor.title,
    icon: descriptor.icon,
    subview: descriptor.subview,
    startsTrail: descriptor.startsTrail,
  };
}
