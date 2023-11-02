import { Core } from '@minddrop/core';
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
  System: string;

  /**
   * Light theme name.
   */
  Light: string;

  /**
   * Dark theme name.
   */
  Dark: string;

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
   * @param core - A MindDrop core instance.
   * @param appearance - The theme apperance value to set.
   *
   * @throws InvalidParamterError
   * Thrown if the appearance value is invalid.
   */
  setAppearance(core: Core, appearance: ThemeAppearance): void;

  /**
   * Sets the theme appearance setting. Dispatches
   * a `theme:appearance:set-setting` event.
   *
   * @param core - A MindDrop core instance.
   * @param setting - The theme apperance setting value to set.
   *
   * @throws InvalidParamterError
   * Thrown if the appearance setting value is invalid.
   */
  setAppearanceSetting(core: Core, setting: ThemeAppearanceSetting): void;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'theme:appearance:set-value' event listener
  addEventListener(
    core: Core,
    type: SetThemeAppearanceEvent,
    callback: SetThemeAppearanceEventCallback,
  ): void;

  // Add 'theme:appearance:set-setting' event listener
  addEventListener(
    core: Core,
    type: SetThemeAppearanceSettingEvent,
    callback: SetThemeAppearanceSettingEventCallback,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'theme:appearance:set-value' event listener
  removeEventListener(
    core: Core,
    type: SetThemeAppearanceEvent,
    callback: SetThemeAppearanceEventCallback,
  ): void;

  // Remove 'theme:appearance:set-setting' event listener
  removeEventListener(
    core: Core,
    type: SetThemeAppearanceSettingEvent,
    callback: SetThemeAppearanceSettingEventCallback,
  ): void;
}
