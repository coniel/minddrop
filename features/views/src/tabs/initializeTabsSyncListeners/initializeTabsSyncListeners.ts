import { Events } from '@minddrop/events';
import {
  CloseViewEvent,
  NavigateBackEvent,
  UpdateViewEvent,
  ViewAreaChangedEvent,
  ViewAreaReadyEvent,
} from '@minddrop/views';
import { matchesViewArea } from '../../matchesViewArea';
import { closeTabsForView } from '../closeTabsForView';
import { goBack } from '../goBack';
import { recordViewArea } from '../recordViewArea';
import { restoreActiveTab } from '../restoreActiveTab';
import { updateTabsForView } from '../updateTabsForView';

/**
 * Keeps the view area's active tab in sync with its rendered views and
 * restores its content once the view area is ready. Returns a cleanup
 * which removes the listeners.
 *
 * @param viewAreaId - The id of the view area to sync.
 */
export function initializeTabsSyncListeners(viewAreaId: string): VoidFunction {
  const listenerId = `feature-views:tabs:${viewAreaId}`;

  // Record view area changes onto the active tab
  Events.addListener(ViewAreaChangedEvent, listenerId, (data) => {
    // Ignore changes from other view areas
    if (data.viewAreaId !== viewAreaId) {
      return;
    }

    recordViewArea(viewAreaId, data);
  });

  // Update tabs when a view's metadata changes (e.g. a rename)
  Events.addListener(UpdateViewEvent, listenerId, (data) => {
    // Ignore updates targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    updateTabsForView(viewAreaId, data.id, {
      id: data.newId,
      props: data.props,
      title: data.title,
      icon: data.icon,
    });
  });

  // Close tabs when their view is closed (e.g. a delete)
  Events.addListener(CloseViewEvent, listenerId, (data) => {
    // Ignore closes targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    closeTabsForView(viewAreaId, data.id);
  });

  // Navigate the active tab back when a view's breadcrumb is clicked
  Events.addListener(NavigateBackEvent, listenerId, (data) => {
    // Ignore navigations targeting other view areas
    if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
      return;
    }

    goBack(viewAreaId, data.steps);
  });

  // Restore the active tab's content once the view area is ready to
  // receive it (covers the view area mounting after this)
  Events.addListener(ViewAreaReadyEvent, listenerId, (data) => {
    // Ignore ready events from other view areas
    if (data.viewAreaId !== viewAreaId) {
      return;
    }

    restoreActiveTab(viewAreaId);
  });

  // Fallback for the reverse order, where the view area is already
  // mounted and listening before this runs
  queueMicrotask(() => {
    restoreActiveTab(viewAreaId);
  });

  return () => {
    Events.removeListener(ViewAreaChangedEvent, listenerId);
    Events.removeListener(UpdateViewEvent, listenerId);
    Events.removeListener(CloseViewEvent, listenerId);
    Events.removeListener(ViewAreaReadyEvent, listenerId);
    Events.removeListener(NavigateBackEvent, listenerId);
  };
}
