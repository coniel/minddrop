import { createContext } from 'react';
import { Breadcrumb } from '../types';

export const ViewBreadcrumbsContext = createContext<Breadcrumb[]>([]);

export interface ViewBreadcrumbsProviderProps {
  /**
   * The views the current view was reached through, ordered root
   * first, followed by the current view itself when it shows a
   * subview.
   */
  breadcrumbs: Breadcrumb[];

  /**
   * The view content the breadcrumbs apply to.
   */
  children: React.ReactNode;
}

/**
 * Provides a view instance's breadcrumb trail to the components
 * rendered inside it.
 */
export const ViewBreadcrumbsProvider: React.FC<
  ViewBreadcrumbsProviderProps
> = ({ breadcrumbs, children }) => (
  <ViewBreadcrumbsContext.Provider value={breadcrumbs}>
    {children}
  </ViewBreadcrumbsContext.Provider>
);
