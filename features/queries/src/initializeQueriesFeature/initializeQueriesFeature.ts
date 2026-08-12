import { Events, OpenViewEvent, OpenViewEventData } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import {
  EventListenerId,
  OpenQueriesViewEvent,
  QueriesViewName,
} from '../events';
import { locales } from '../locales';

// View instance id of the singleton queries view
const queriesViewId = 'queries:queries';

/**
 * Initializes the queries feature by registering translations
 * and the event listener for opening the queries view.
 *
 * @returns A cleanup function which removes the event listener.
 */
export function initializeQueriesFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Listen for open queries view events, and open the queries
  // view when one is received
  Events.addListener(OpenQueriesViewEvent, EventListenerId, () => {
    Events.dispatch<OpenViewEventData>(OpenViewEvent, {
      view: QueriesViewName,
      id: queriesViewId,
    });
  });

  return () => {
    Events.removeListener(OpenQueriesViewEvent, EventListenerId);
  };
}
