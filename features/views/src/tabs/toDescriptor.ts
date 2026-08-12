import { ViewDescriptor } from '@minddrop/views';
import { TabView } from './TabSetsStore';

/**
 * Converts a tab view into a view descriptor.
 *
 * @param tabView - The tab view to convert, or null.
 */
export function toDescriptor(tabView: TabView | null): ViewDescriptor | null {
  // Nothing to convert when there is no tab view
  if (!tabView) {
    return null;
  }

  // Map the tab view onto a view descriptor
  return {
    view: tabView.view,
    id: tabView.id,
    props: tabView.props,
    title: tabView.title,
    icon: tabView.icon,
    breadcrumbs: tabView.breadcrumbs,
  };
}
