import { useContext } from 'react';
import { ViewDescriptor } from '@minddrop/events';
import { ViewBreadcrumbsContext } from './ViewBreadcrumbsContext';

/**
 * Returns the breadcrumb trail of the view instance the calling
 * component is rendered in. Empty outside of a view opened with
 * breadcrumbs.
 */
export function useViewBreadcrumbs(): ViewDescriptor[] {
  return useContext(ViewBreadcrumbsContext);
}
