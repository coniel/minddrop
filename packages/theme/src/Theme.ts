import { Events } from '@minddrop/events';
import { ThemeDark, ThemeLight, ThemeSystem } from './constants';
import { getThemeAppearance } from './getThemeAppearance';
import { getThemeAppearanceSetting } from './getThemeAppearanceSetting';
import { setThemeAppearance } from './setThemeAppearance';
import { setThemeAppearanceSetting } from './setThemeAppearanceSetting';
import { ThemeApi } from './types';

export const Theme: ThemeApi = {
  // Constants
  System: ThemeSystem,
  Light: ThemeLight,
  Dark: ThemeDark,

  // Functions
  getAppearance: getThemeAppearance,
  getAppearanceSetting: getThemeAppearanceSetting,
  setAppearance: setThemeAppearance,
  setAppearanceSetting: setThemeAppearanceSetting,
  addEventListener: Events.addListener,
  removeEventListener: Events.removeListener,
};
