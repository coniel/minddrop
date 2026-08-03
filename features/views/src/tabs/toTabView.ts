import { ViewDescriptor } from '@minddrop/events';
import { TabView } from './TabSetsStore';
import { DEFAULT_ICON } from './tabsConstants';

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

  // Map the descriptor onto a tab view, defaulting the icon
  return {
    view: descriptor.view,
    id: descriptor.id,
    props: descriptor.props,
    title: descriptor.title,
    icon: descriptor.icon ?? DEFAULT_ICON,
  };
}
