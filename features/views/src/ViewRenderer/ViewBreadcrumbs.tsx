import React, { FC } from 'react';
import { ViewPane, ViewSessions, Views } from '@minddrop/views';

interface ViewBreadcrumbsProps {
  /**
   * The id of the view area the view is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane the view is rendered in.
   */
  pane: ViewPane;

  /**
   * The view content the trail applies to.
   */
  children: React.ReactNode;
}

/**
 * Provides the views a pane's view was reached through as its
 * breadcrumb trail.
 */
export const ViewBreadcrumbs: FC<ViewBreadcrumbsProps> = ({
  viewAreaId,
  pane,
  children,
}) => {
  const breadcrumbs = ViewSessions.useBreadcrumbTrail(viewAreaId, pane);

  return (
    <Views.BreadcrumbsProvider breadcrumbs={breadcrumbs}>
      {children}
    </Views.BreadcrumbsProvider>
  );
};
