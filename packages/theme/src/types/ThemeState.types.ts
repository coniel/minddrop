import {
  ThemeAppearance,
  ThemeAppearanceSetting,
} from './ThemeAppearance.types';

export interface ThemeState {
  /**
   * The currently active theme appearance.
   */
  appearance: ThemeAppearance;

  /**
   * The theme appearance setting.
   */
  appearanceSetting: ThemeAppearanceSetting;

  /**
   * Sets the currently active appearance.
   */
  setAppearance(value: ThemeAppearance): void;

  /**
   * Sets the theme appearance setting.
   */
  setAppearanceSetting(value: ThemeAppearanceSetting): void;
}
