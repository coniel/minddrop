import { ThemeDark, ThemeLight, ThemeSystem } from './constants';
import { SetAppearanceEvent, SetAppearanceSettingEvent } from './events';

export const events = {
  SetAppearance: SetAppearanceEvent,
  SetAppearanceSetting: SetAppearanceSettingEvent,
};

export const constants = {
  System: ThemeSystem,
  Light: ThemeLight,
  Dark: ThemeDark,
};

export { getThemeAppearance as getAppearance } from './getThemeAppearance';
export { getThemeAppearanceSetting as getAppearanceSetting } from './getThemeAppearanceSetting';
export { initializeTheme as initialize } from './initializeTheme';
export { setThemeAppearance as setAppearance } from './setThemeAppearance';
export { setThemeAppearanceSetting as setAppearanceSetting } from './setThemeAppearanceSetting';
export { useThemeAppearance as useAppearance } from './useThemeAppearance';
export { useThemeAppearanceSetting as useAppearanceSetting } from './useThemeAppearanceSetting';
