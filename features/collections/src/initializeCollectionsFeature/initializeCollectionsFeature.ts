import { Events, OpenViewEvent, OpenViewEventData } from '@minddrop/events';
import { I18n, i18n } from '@minddrop/i18n';
import {
  CollectionsViewName,
  EventListenerId,
  OpenCollectionsViewEvent,
} from '../events';
import { locales } from '../locales';

// View instance id of the singleton collections list view
const collectionsViewId = 'collections:collections';

// Icon shown in the collections list view's tab
const COLLECTIONS_VIEW_ICON = 'content-icon:library:inherit';

/**
 * Initializes the collections feature by registering translations
 * and the event listener for opening the collections view.
 *
 * @returns A cleanup function which removes the event listener.
 */
export function initializeCollectionsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Listen for open collections view events, and open the
  // collections list view when one is received
  Events.addListener(OpenCollectionsViewEvent, EventListenerId, () => {
    Events.dispatch<OpenViewEventData>(OpenViewEvent, {
      view: CollectionsViewName,
      id: collectionsViewId,
      title: i18n.t('collections.labels.collections'),
      icon: COLLECTIONS_VIEW_ICON,
    });
  });

  return () => {
    Events.removeListener(OpenCollectionsViewEvent, EventListenerId);
  };
}
