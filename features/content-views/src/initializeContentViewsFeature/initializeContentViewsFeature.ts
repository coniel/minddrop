import { ContentViews } from '@minddrop/content-views';
import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { I18n, i18n } from '@minddrop/i18n';
import { Views } from '@minddrop/views';
import { onDatabasePropertyRenamed } from '../event-handlers';
import {
  ContentViewViewName,
  ContentViewsViewName,
  EventListenerId,
  NewContentViewViewId,
  NewContentViewViewName,
  OpenContentViewViewEvent,
  OpenContentViewsViewEvent,
  OpenNewContentViewViewEvent,
} from '../events';
import { locales } from '../locales';
import { resolveContentViewViewId } from '../utils';

// View instance id of the singleton content views list view, which is
// labelled and iconed from its registration.
const contentViewsViewId = 'content-views:content-views';

// Icon shown in the new content view view's tab
const NEW_CONTENT_VIEW_VIEW_ICON = 'lucide:plus:inherit';

/**
 * Initializes the content views feature by registering translations
 * and event listeners for opening, updating, and closing data
 * view views, and for keeping the views' sort options following
 * their sort property's renames.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeContentViewsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Listen for open content view view events, and open the data
  // view's view when one is received.
  Events.addListener(OpenContentViewViewEvent, EventListenerId, (data) => {
    const contentView = ContentViews.get(data.contentViewId, false);

    // Open the content view's view. The feature has no tab access, so
    // new-tab opens fall back to in place, as do dialog and panel.
    Events.dispatch(Views.events.Open, {
      viewAreaId: data.viewAreaId,
      sourcePane: data.sourcePane,
      view: ContentViewViewName,
      id: resolveContentViewViewId(data.contentViewId),
      props: { contentViewId: data.contentViewId },
      split: data.openMode === 'split',
      title: contentView?.name,
      icon: contentView?.icon,
    });
  });

  // Listen for open content views view events, and open the data
  // views list view when one is received.
  Events.addListener(OpenContentViewsViewEvent, EventListenerId, (data) => {
    // Open the content views list view. The feature has no tab access,
    // so new-tab opens fall back to in place, as do dialog and panel
    Events.dispatch(Views.events.Open, {
      viewAreaId: data?.viewAreaId,
      sourcePane: data?.sourcePane,
      view: ContentViewsViewName,
      id: contentViewsViewId,
      split: data?.openMode === 'split',
    });
  });

  // Listen for open new content view view events, and open the view
  // creation view when one is received.
  Events.addListener(OpenNewContentViewViewEvent, EventListenerId, (data) => {
    // Open the view creation view. The feature has no tab access, so
    // new-tab opens fall back to in place, as do dialog and panel.
    Events.dispatch(Views.events.Open, {
      viewAreaId: data.viewAreaId,
      sourcePane: data.sourcePane,
      view: NewContentViewViewName,
      id: NewContentViewViewId,
      props: { viewType: data.viewType },
      split: data.openMode === 'split',
      title: i18n.t('contentViews.labels.new'),
      icon: NEW_CONTENT_VIEW_VIEW_ICON,
    });
  });

  // Update the content view's open view when the content view changes
  // (e.g. renamed or re-iconed)
  Events.addListener(ContentViews.events.Updated, EventListenerId, (data) => {
    Events.dispatch(Views.events.Update, {
      id: resolveContentViewViewId(data.updated.id),
      title: data.updated.name,
      icon: data.updated.icon,
    });
  });

  // Close the content view's open view when the content view is deleted
  Events.addListener(ContentViews.events.Deleted, EventListenerId, (data) => {
    Events.dispatch(Views.events.Close, {
      id: resolveContentViewViewId(data.id),
    });
  });

  // Update the sort options of the views sorted by a renamed property
  Events.addListener(
    Databases.events.PropertyRenamed,
    EventListenerId,
    onDatabasePropertyRenamed,
  );

  return () => {
    Events.removeListener(OpenContentViewViewEvent, EventListenerId);
    Events.removeListener(OpenContentViewsViewEvent, EventListenerId);
    Events.removeListener(OpenNewContentViewViewEvent, EventListenerId);
    Events.removeListener(ContentViews.events.Updated, EventListenerId);
    Events.removeListener(ContentViews.events.Deleted, EventListenerId);
    Events.removeListener(Databases.events.PropertyRenamed, EventListenerId);
  };
}
