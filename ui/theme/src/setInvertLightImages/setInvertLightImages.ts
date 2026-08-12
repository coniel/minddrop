import { Events } from '@minddrop/events';
import { ThemeStore } from '../ThemeStore';
import {
  InvertLightImagesChangedEvent,
  InvertLightImagesChangedEventData,
} from '../events';

/**
 * Sets whether images with a light background are inverted and
 * dispatches a `theme:invert-light-images:changed` event.
 *
 * @param invertLightImages - Whether to invert light background images.
 */
export function setInvertLightImages(invertLightImages: boolean): void {
  // Set the value in the theme store
  ThemeStore.set('invertLightImages', invertLightImages);

  // Dispatch a 'theme:invert-light-images:changed' event
  Events.dispatch<InvertLightImagesChangedEventData>(
    InvertLightImagesChangedEvent,
    { invertLightImages },
  );
}
