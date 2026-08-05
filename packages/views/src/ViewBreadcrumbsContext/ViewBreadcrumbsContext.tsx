import { createContext } from 'react';
import { ViewDescriptor } from '@minddrop/events';

export const ViewBreadcrumbsContext = createContext<ViewDescriptor[]>([]);

export interface ViewBreadcrumbsProviderProps {
  /**
   * Descriptors of the current view's ancestor views, ordered root
   * first.
   */
  breadcrumbs: ViewDescriptor[];

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
