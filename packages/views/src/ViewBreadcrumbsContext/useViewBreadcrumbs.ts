import { useContext } from 'react';
import { Breadcrumb } from '../types';
import { ViewBreadcrumbsContext } from './ViewBreadcrumbsContext';

/**
 * Returns the breadcrumb trail of the view instance the calling
 * component is rendered in. Empty for views reached without passing
 * through others.
 */
export function useViewBreadcrumbs(): Breadcrumb[] {
  return useContext(ViewBreadcrumbsContext);
}
