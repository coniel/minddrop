import { useMemo } from 'react';
import { Breadcrumb } from '@minddrop/views';
import { ViewAreaPane, useActiveTab } from '../TabSetsStore';
import { resolveBreadcrumbTrail } from './resolveBreadcrumbTrail';

/**
 * Returns the breadcrumb trail of the view shown in a view area
 * pane's active tab, ordered root first.
 *
 * @param viewAreaId - The id of the view area.
 * @param pane - The pane the trail belongs to.
 */
export function useBreadcrumbTrail(
  viewAreaId: string,
  pane: ViewAreaPane,
): Breadcrumb[] {
  const activeTab = useActiveTab(viewAreaId);

  // The tab state the trail is derived from, tracked rather than the
  // tab itself, which is rewritten by unrelated updates (e.g. a
  // recorded scroll position)
  const { main, split, backHistory } = activeTab ?? {};

  return useMemo(
    () => resolveBreadcrumbTrail(activeTab, pane),
    // The trail is derived from the panes and the history alone
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [main, split, backHistory, pane],
  );
}
