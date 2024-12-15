import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark, ThemeLight } from '../constants';
import { ThemeAppearance } from '../types';

/**
 * Sets the current theme appearance. Dispatches
 * a `theme:appearance:set-value` event.
 *
 * @param appearance - The theme apperance value to set.
 *
 * @throws InvalidParamterError
 * Thrown if the appearance value is invalid.
 */
export function setThemeAppearance(appearance: ThemeAppearance): void {
  if (![ThemeLight, ThemeDark].includes(appearance)) {
    // If the appearance value is invalid, throw a
    // `InvalidParameterError`.
    throw new InvalidParameterError(
      `theme appearance must be one of ${ThemeLight}, ${ThemeDark}, received: ${appearance}`,
    );
  }

  // Set the value in the theme store
  ThemeConfig.set('appearance', appearance);

  // Dispatch a 'theme:appearance:set-value' event
  Events.dispatch('theme:appearance:set-value', appearance);
}
