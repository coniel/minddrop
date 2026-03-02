import { ThemeDark, ThemeLight, ThemeSystem } from './constants';
import { VariantChangedEvent } from './events';

export const events = {
  VariantChanged: VariantChangedEvent,
};

export const constants = {
  System: ThemeSystem,
  Light: ThemeLight,
  Dark: ThemeDark,
};

export { getThemeVariant as getVariant } from './getThemeVariant';
export { initializeTheme as initialize } from './initializeTheme';
export { resolveThemeVariant as resolveVariant } from './resolveThemeVariant';
export { setThemeVariant as setVariant } from './setThemeVariant';
export { useThemeVariant as useVariant } from './useThemeVariant';
export { ThemeVariantPicker as VariantPicker } from './ThemeVariantPicker';
