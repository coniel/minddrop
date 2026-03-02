import { Events } from '@minddrop/events';
import { ThemeStore } from '../ThemeStore';
import { ThemeSystem } from '../constants';
import { VariantChangedEvent, VariantChangedEventData } from '../events';
import { getThemeVariant } from '../getThemeVariant';
import { resolveThemeVariant } from '../resolveThemeVariant';

export async function initializeTheme() {
  // Hydrate the theme store with persisted data from the platform layer
  await ThemeStore.hydrate();

  // Media matcher that matches if OS is in dark mode
  const matchMediaDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  // Listen for 'theme:variant:changed' events to manage
  // the OS dark mode listener.
  Events.addListener<VariantChangedEventData>(
    VariantChangedEvent,
    'theme:initialize:manage-os-listener',
    (payload) => {
      const { variant } = payload.data;

      if (variant === ThemeSystem) {
        // If the variant is 'system', listen for OS dark
        // mode changes.
        matchMediaDarkMode.addEventListener('change', onOsDarkModeChange);
      } else {
        // If the variant is a fixed value, remove the
        // OS dark mode change listener.
        matchMediaDarkMode.removeEventListener('change', onOsDarkModeChange);
      }
    },
  );

  // Get the current variant setting
  const variant = getThemeVariant();

  // Resolve the initial appearance value
  const resolvedAppearance = resolveThemeVariant(variant);

  // Dispatch the initial 'theme:variant:changed' event so the
  // app can set the initial CSS class and the OS listener is
  // set up if needed.
  Events.dispatch<VariantChangedEventData>(VariantChangedEvent, {
    variant,
    resolvedAppearance,
  });
}

/**
 * Dispatches a `theme:variant:changed` event with the
 * current variant and resolved appearance. Called when
 * the OS dark mode preference changes.
 */
function onOsDarkModeChange() {
  // Get the current variant setting
  const variant = getThemeVariant();

  // Resolve the appearance from the current OS preference
  const resolvedAppearance = resolveThemeVariant(variant);

  // Dispatch a 'theme:variant:changed' event
  Events.dispatch<VariantChangedEventData>(VariantChangedEvent, {
    variant,
    resolvedAppearance,
  });
}
