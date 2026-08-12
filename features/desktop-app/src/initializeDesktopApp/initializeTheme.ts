import { Events } from '@minddrop/events';
import {
  ImageDimmingChangedEventData,
  InvertLightImagesChangedEventData,
  Theme,
  VariantChangedEventData,
} from '@minddrop/ui-theme';

/**
 * Loads the theme settings and keeps the classes they are applied
 * through in sync on <body>.
 */
export async function initializeTheme(): Promise<void> {
  // Watch for theme variant changes
  Events.addListener(
    Theme.events.VariantChanged,
    'app:set-body-theme-appearance-class',
    setThemeAppearanceClassOnBody,
  );

  // Watch for image dimming setting changes
  Events.addListener(
    Theme.events.ImageDimmingChanged,
    'app:set-body-image-dimming-class',
    setImageDimmingClassOnBody,
  );

  // Watch for light image inversion setting changes
  Events.addListener(
    Theme.events.InvertLightImagesChanged,
    'app:set-body-invert-light-images-class',
    setInvertLightImagesClassOnBody,
  );

  // Hydrate the theme settings, which dispatches the initial events
  // the listeners above set the classes from
  await Theme.initialize();
}

/**
 * Toggles the theme appearance class on <body>
 * whenever the theme variant changes.
 */
function setThemeAppearanceClassOnBody({
  data,
}: {
  data: VariantChangedEventData;
}) {
  if (data.resolvedAppearance === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }
}

/**
 * Sets the image dimming class on <body> whenever the image
 * dimming setting changes.
 */
function setImageDimmingClassOnBody({
  data,
}: {
  data: ImageDimmingChangedEventData;
}) {
  document.body.classList.remove(
    'image-dimming-1',
    'image-dimming-2',
    'image-dimming-3',
  );

  // The 'off' setting is the absence of a class
  if (data.imageDimming !== Theme.constants.ImageDimmingOff) {
    document.body.classList.add(`image-dimming-${data.imageDimming}`);
  }
}

/**
 * Toggles the light image inversion class on <body> whenever the
 * setting changes.
 */
function setInvertLightImagesClassOnBody({
  data,
}: {
  data: InvertLightImagesChangedEventData;
}) {
  document.body.classList.toggle('image-invert-light', data.invertLightImages);
}
