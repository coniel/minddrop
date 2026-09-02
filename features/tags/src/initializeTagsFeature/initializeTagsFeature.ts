import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { I18n } from '@minddrop/i18n';
import { OpenTagsViewEvent } from '@minddrop/tags';
import { DefaultViewAreaId, OpenViewEvent } from '@minddrop/views';
import { EventListenerId, TagsViewName } from '../events';
import { locales } from '../locales';

// View instance id of the singleton tags list view, which is
// labelled and iconed from its registration
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
  // when one is received
  Events.addListener(OpenTagsViewEvent, EventListenerId, ({ data }) => {
    // Open a blank tab to receive the tags view
    if (data?.openMode === 'new-tab') {
      Tabs.newTab(DefaultViewAreaId);
    }

    Events.dispatch(OpenViewEvent, {
      view: TagsViewName,
      id: tagsViewId,
    });
  });

  return () => {
    Events.removeListener(OpenTagsViewEvent, EventListenerId);
  };
}
