import { ViewDescriptor } from '@minddrop/events';
import { TabView } from '../TabSetsStore';

/**
 * Whether two views identify the same view instance, comparing the
 * view type, instance id and props while ignoring display metadata
 * (title, icon, breadcrumbs).
 *
 * @param a - The first view to compare, or null for an empty pane.
 * @param b - The second view to compare, or null for an empty pane.
 */
export function sameView(
  a: TabView | ViewDescriptor | null,
  b: TabView | ViewDescriptor | null,
): boolean {
  // Both empty panes show the same (blank) view
  if (!a && !b) {
    return true;
  }

  // One empty pane means the views differ
  if (!a || !b) {
    return false;
  }

  // Compare the view type and instance id strictly, and props by value
  return (
    a.view === b.view &&
    a.id === b.id &&
    JSON.stringify(a.props) === JSON.stringify(b.props)
  );
}
