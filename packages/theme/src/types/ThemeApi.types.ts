import {
  SetThemeAppearanceEvent,
  SetThemeAppearanceEventCallback,
  SetThemeAppearanceSettingEvent,
  SetThemeAppearanceSettingEventCallback,
} from './ThemeEvents.types';
import {
  ThemeAppearance,
  ThemeAppearanceSetting,
} from './ThemeAppearance.types';

export interface ThemeApi {
  /**
   * System theme name.
   */
  System: 'system';

  /**
   * Light theme name.
   */
  Light: 'light';

  /**
   * Dark theme name.
   */
  Dark: 'dark';

  /**
   * Returns the current theme appearance.
   *
   * @returns The current theme appearance.
   */
  getAppearance(): ThemeAppearance;

  /**
   * Returns the theme appearance setting.
   *
   * @returns The theme appearance setting.
   */
  getAppearanceSetting(): ThemeAppearanceSetting;

  /**
   * Sets the current theme appearance. Dispatches
   * a `theme:appearance:set-value` event.
   *
   * @param appearance - The theme apperance value to set.
   *
   * @throws InvalidParamterError
   * Thrown if the appearance value is invalid.
   */
  setAppearance(appearance: ThemeAppearance): void;

  /**
   * Sets the theme appearance setting. Dispatches
   * a `theme:appearance:set-setting` event.
   *
   * @param setting - The theme apperance setting value to set.
   *
   * @throws InvalidParamterError
   * Thrown if the appearance setting value is invalid.
   */
  setAppearanceSetting(setting: ThemeAppearanceSetting): void;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'theme:appearance:set-value' event listener
  addEventListener(
    type: SetThemeAppearanceEvent,
    listenerId: string,
    callback: SetThemeAppearanceEventCallback,
    once?: boolean,
  ): void;

  // Add 'theme:appearance:set-setting' event listener
  addEventListener(
    type: SetThemeAppearanceSettingEvent,
    listenerId: string,
    callback: SetThemeAppearanceSettingEventCallback,
    once?: boolean,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'theme:appearance:set-value' event listener
  removeEventListener(
    type: SetThemeAppearanceEvent,
    listenerId: string,
    callback: SetThemeAppearanceEventCallback,
  ): void;

  // Remove 'theme:appearance:set-setting' event listener
  removeEventListener(
    type: SetThemeAppearanceSettingEvent,
    listenerId: string,
    callback: SetThemeAppearanceSettingEventCallback,
  ): void;
}
