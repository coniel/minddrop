import { ResolvedThemeVariant, ThemeVariant } from './types';

export const VariantChangedEvent = 'theme:variant:changed';

export interface VariantChangedEventData {
  /**
   * The current theme variant setting.
   */
  variant: ThemeVariant;

  /**
   * The resolved appearance value ('light' or 'dark').
   */
  resolvedAppearance: ResolvedThemeVariant;
}
