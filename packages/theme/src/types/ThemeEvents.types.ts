import { EventListenerCallback } from '@minddrop/core';
import {
  ThemeAppearance,
  ThemeAppearanceSetting,
} from './ThemeAppearance.types';

export type SetThemeAppearanceEvent = 'theme:appearance:set-value';
export type SetThemeAppearanceSettingEvent = 'theme:appearance:set-setting';

export type SetThemeAppearanceEventData = ThemeAppearance;
export type SetThemeAppearanceSettingEventData = ThemeAppearanceSetting;

export type SetThemeAppearanceEventCallback = EventListenerCallback<
  SetThemeAppearanceEvent,
  SetThemeAppearanceEventData
>;
export type SetThemeAppearanceSettingEventCallback = EventListenerCallback<
  SetThemeAppearanceSettingEvent,
  SetThemeAppearanceSettingEventData
>;
