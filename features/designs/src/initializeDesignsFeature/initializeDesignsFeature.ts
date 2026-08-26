import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { OpenViewEvent } from '@minddrop/views';
import { DesignStudioViewId, DesignStudioViewName } from '../constants';
import {
  DesignsFeatureEventListenerId,
  OpenDesignStudioEvent,
} from '../events';
import { locales } from '../locales';

/**
 * Initializes the designs feature: registers its translations and
 * event listeners.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeDesignsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Open the design studio view on open design studio events
  Events.addListener(
    OpenDesignStudioEvent,
    DesignsFeatureEventListenerId,
    ({ data }) => {
      Events.dispatch(OpenViewEvent, {
        view: DesignStudioViewName,
        id: DesignStudioViewId,
        props: data,
      });
    },
  );

  return () => {
    // Remove the feature's event listeners
    Events.removeListener(OpenDesignStudioEvent, DesignsFeatureEventListenerId);
  };
}
