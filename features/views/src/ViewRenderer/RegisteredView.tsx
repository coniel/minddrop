import { FC, useMemo } from 'react';
import { ViewDescriptor, ViewPane, Views } from '@minddrop/views';
import { ViewBreadcrumbs } from './ViewBreadcrumbs';

interface RegisteredViewProps {
  /**
   * The view to resolve and render.
   */
  descriptor: ViewDescriptor;

  /**
   * The id of the view area the view is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane the view is rendered in.
   */
  pane: ViewPane;
}

/**
 * Resolves a registered view by its type and renders it with its
 * props, providing the views it was reached through as its breadcrumb
 * trail.
 */
export const RegisteredView: FC<RegisteredViewProps> = ({
  descriptor,
  pane,
  viewAreaId,
}) => {
  const registered = Views.use(descriptor.view);

  // Render the view's content through a stable element so that the
  // trail and subview updates below re-render only the providers.
  const content = useMemo(() => {
    // Nothing to render when no view is registered for the type
    if (!registered) {
      return null;
    }

    return <registered.component {...descriptor.props} />;
  }, [registered, descriptor.props]);

  return (
    <ViewBreadcrumbs viewAreaId={viewAreaId} pane={pane}>
      <Views.SubviewProvider subview={descriptor.subview ?? null}>
        {content}
      </Views.SubviewProvider>
    </ViewBreadcrumbs>
  );
};
