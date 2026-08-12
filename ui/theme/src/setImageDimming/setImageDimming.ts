import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeStore } from '../ThemeStore';
import { ImageDimmingValues } from '../constants';
import {
  ImageDimmingChangedEvent,
  ImageDimmingChangedEventData,
} from '../events';
import { ImageDimming } from '../types';

/**
 * Sets the image dimming setting and dispatches a
 * `theme:image-dimming:changed` event.
 *
 * @param imageDimming - The image dimming setting to set.
 *
 * @throws InvalidParameterError
 * Thrown if the image dimming value is invalid.
 */
export function setImageDimming(imageDimming: ImageDimming): void {
  if (!ImageDimmingValues.includes(imageDimming)) {
    // If the image dimming value is invalid, throw an
    // `InvalidParameterError`.
    throw new InvalidParameterError(
      `image dimming must be one of ${ImageDimmingValues.join(', ')}, received: ${imageDimming}`,
    );
  }

  // Set the value in the theme store
  ThemeStore.set('imageDimming', imageDimming);

  // Dispatch a 'theme:image-dimming:changed' event
  Events.dispatch<ImageDimmingChangedEventData>(ImageDimmingChangedEvent, {
    imageDimming,
  });
}
