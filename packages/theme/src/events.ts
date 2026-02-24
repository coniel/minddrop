import { ThemeAppearance, ThemeAppearanceSetting } from './types';

export const SetAppearanceEvent = 'theme:appearance:set-value';
export const SetAppearanceSettingEvent = 'theme:appearance:set-setting';

export type SetAppearanceEventData = ThemeAppearance;
export type SetAppearanceSettingEventData = ThemeAppearanceSetting;
