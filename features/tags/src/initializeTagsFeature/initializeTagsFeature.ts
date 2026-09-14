import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { Tags } from '@minddrop/tags';
import { ViewSessions, Views } from '@minddrop/views';
import { EventListenerId, TagsViewName } from '../events';
import { locales } from '../locales';

// View instance id of the singleton tags list view, which is
// labelled and iconed from its registration.
const tagsViewId = 'tags:tags';

/**
 * Initializes the tags feature by registering translations and the
 * event listener for opening the tags view.
 *
 * @returns A cleanup function which removes the event listener.
 */
export function initializeTagsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Listen for open tags view events, and open the tags list view
  // when one is received.
  Events.addListener(Tags.events.OpenView, EventListenerId, (data) => {
    // Open a blank session to receive the tags view
    if (data?.openMode === 'new-tab') {
      ViewSessions.create();
    }

    Events.dispatch(Views.events.Open, {
      view: TagsViewName,
      id: tagsViewId,
      subview: data?.tagId ? { id: data.tagId } : undefined,
    });
  });

  return () => {
    Events.removeListener(Tags.events.OpenView, EventListenerId);
  };
}
