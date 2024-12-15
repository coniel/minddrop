import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';
import { ThemeAppearanceSetting } from '../types';

/**
 * Sets the theme appearance setting. Dispatches
 * a `theme:appearance:set-setting` event.
 *
 * @param setting - The theme apperance setting to set.
 *
 * @throws InvalidParamterError
 * Thrown if the appearance setting value is invalid.
 */
export function setThemeAppearanceSetting(
  setting: ThemeAppearanceSetting,
): void {
  if (![ThemeLight, ThemeDark, ThemeSystem].includes(setting)) {
    // If the setting value is invalid, throw a
    // `InvalidParameterError`.
    throw new InvalidParameterError(
      `theme appearance setting must be one of ${ThemeLight}, ${ThemeDark}, or ${ThemeSystem}, received: ${setting}`,
    );
  }

  // Set the value in the theme store
  ThemeConfig.set('appearanceSetting', setting);

  // Dispatch a 'theme:appearance:set-setting' event
  Events.dispatch('theme:appearance:set-setting', setting);
}
