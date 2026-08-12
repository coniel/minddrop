import { ImageDimming, ResolvedThemeVariant, ThemeVariant } from './types';

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

export const ImageDimmingChangedEvent = 'theme:image-dimming:changed';

export interface ImageDimmingChangedEventData {
  /**
   * The current image dimming setting.
   */
  imageDimming: ImageDimming;
}

export const InvertLightImagesChangedEvent =
  'theme:invert-light-images:changed';

export interface InvertLightImagesChangedEventData {
  /**
   * Whether images with a light background are inverted.
   */
  invertLightImages: boolean;
}
