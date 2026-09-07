import { Events } from '@minddrop/events';
import { ViewSessions, Views } from '@minddrop/views';
import { matchesViewArea } from '../matchesViewArea';

/**
 * Keeps the view area's active session in sync with its rendered
 * views and restores its content once the view area is ready. Returns
 * a cleanup which removes the listeners.
 *
 * @param viewAreaId - The id of the view area to sync.
 */
export function initializeViewSessionSyncListeners(
  viewAreaId: string,
): VoidFunction {
  const listenerId = `feature-views:sessions:${viewAreaId}`;

  // Record view area changes onto the active session
  Events.addListener(Views.events.AreaChanged, listenerId, (data) => {
    // Ignore changes from other view areas
    if (data.viewAreaId !== viewAreaId) {
      return;
    }

    ViewSessions.recordViewArea(viewAreaId, data);
  });

  // Update sessions when a view's metadata changes (e.g. a rename)
  Events.addListener(Views.events.Update, listenerId, (data) => {
    // Ignore updates targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    ViewSessions.updateForView(viewAreaId, data.id, {
      id: data.newId,
      props: data.props,
      title: data.title,
      icon: data.icon,
    });
  });

  // Close sessions when their view is closed (e.g. a delete)
  Events.addListener(Views.events.Close, listenerId, (data) => {
    // Ignore closes targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    ViewSessions.closeForView(viewAreaId, data.id);
  });

  // Navigate the active session back when a view's breadcrumb is
  // clicked.
  Events.addListener(Views.events.NavigateBack, listenerId, (data) => {
    // Ignore navigations targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    ViewSessions.goBack(viewAreaId, data.steps);
  });

  // Restore the active session's content once the view area is ready
  // to receive it (covers the view area mounting after this)
  Events.addListener(Views.events.AreaReady, listenerId, (data) => {
    // Ignore ready events from other view areas
    if (data.viewAreaId !== viewAreaId) {
      return;
    }

    ViewSessions.restoreActive(viewAreaId);
  });

  // Fallback for the reverse order, where the view area is already
  // mounted and listening before this runs.
  queueMicrotask(() => {
    ViewSessions.restoreActive(viewAreaId);
  });

  return () => {
    Events.removeListener(Views.events.AreaChanged, listenerId);
    Events.removeListener(Views.events.Update, listenerId);
    Events.removeListener(Views.events.Close, listenerId);
    Events.removeListener(Views.events.AreaReady, listenerId);
    Events.removeListener(Views.events.NavigateBack, listenerId);
  };
}
