import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { OpenViewEvent } from '@minddrop/views';
import { SettingsViewId, SettingsViewName } from '../constants';
import { OpenSettingsEvent, SettingsFeatureEventListenerId } from '../events';
import { locales } from '../locales';

/**
 * Initializes the settings feature: registers its translations and
 * event listeners.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeSettingsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Open the settings view on open settings events
  Events.addListener(
    OpenSettingsEvent,
    SettingsFeatureEventListenerId,
    (data) => {
      Events.dispatch(OpenViewEvent, {
        view: SettingsViewName,
        id: SettingsViewId,
        props: data,
      });
    },
  );

  return () => {
    // Remove the feature's event listeners
    Events.removeListener(OpenSettingsEvent, SettingsFeatureEventListenerId);
  };
}
