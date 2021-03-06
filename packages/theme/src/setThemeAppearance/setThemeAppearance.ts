import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeAppearance } from '../types';
import { useThemeStore } from '../useThemeStore';

/**
 * Sets the current theme appearance. Dispatches
 * a `theme:appearance:set-value` event.
 *
 * @param core - A MindDrop core instance.
 * @param appearance - The theme apperance value to set.
 *
 * @throws InvalidParamterError
 * Thrown if the appearance value is invalid.
 */
export function setThemeAppearance(
  core: Core,
  appearance: ThemeAppearance,
): void {
  if (!['light', 'dark'].includes(appearance)) {
    // If the appearance value is invalid, throw a
    // `InvalidParameterError`.
    throw new InvalidParameterError(
      `theme appearance must be one of 'light', 'dark', received: ${appearance}`,
    );
  }

  // Set the value in the theme store
  useThemeStore.getState().setAppearance(appearance);

  // Dispatch a 'theme:appearance:set-value' event
  core.dispatch('theme:appearance:set-value', appearance);
}
