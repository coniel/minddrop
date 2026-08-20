import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { OpenViewEvent, OpenViewEventData } from '@minddrop/views';
import {
  CollectionsViewName,
  EventListenerId,
  OpenCollectionsViewEvent,
} from '../events';
import { locales } from '../locales';

// View instance id of the singleton collections list view, which is
// labelled and iconed from its registration
const collectionsViewId = 'collections:collections';

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
    });
  });

  return () => {
    Events.removeListener(OpenCollectionsViewEvent, EventListenerId);
  };
}
