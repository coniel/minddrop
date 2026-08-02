import { MainContentViewDescriptor } from '@minddrop/events';
import { TabView } from './TabSetsStore';

/**
 * Converts a tab view into a main content view descriptor.
 *
 * @param tabView - The tab view to convert, or null.
 */
export function toDescriptor(
  tabView: TabView | null,
): MainContentViewDescriptor | null {
  // Nothing to convert when there is no tab view
  if (!tabView) {
    return null;
  }

  // Map the tab view onto a main content view descriptor
  return {
    view: tabView.view,
    id: tabView.id,
    props: tabView.props,
    title: tabView.title,
    icon: tabView.icon,
  };
}
