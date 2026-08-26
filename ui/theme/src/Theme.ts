import {
  ImageDimmingLevel1,
  ImageDimmingLevel2,
  ImageDimmingLevel3,
  ImageDimmingOff,
  ThemeDark,
  ThemeLight,
  ThemeSystem,
} from './constants';
import {
  ImageDimmingChangedEvent,
  InvertLightImagesChangedEvent,
  VariantChangedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  VariantChanged: VariantChangedEvent,
  ImageDimmingChanged: ImageDimmingChangedEvent,
  InvertLightImagesChanged: InvertLightImagesChangedEvent,
} as const;

export const constants = {
  System: ThemeSystem,
  Light: ThemeLight,
  Dark: ThemeDark,
  ImageDimmingOff,
  ImageDimmingLevel1,
  ImageDimmingLevel2,
  ImageDimmingLevel3,
};

export { getThemeVariant as getVariant } from './getThemeVariant';
export { initializeTheme as initialize } from './initializeTheme';
export { resolveThemeVariant as resolveVariant } from './resolveThemeVariant';
export { setThemeVariant as setVariant } from './setThemeVariant';
export { useThemeVariant as useVariant } from './useThemeVariant';
export { getImageDimming } from './getImageDimming';
export { setImageDimming } from './setImageDimming';
export { useImageDimming } from './useImageDimming';
export { getInvertLightImages } from './getInvertLightImages';
export { setInvertLightImages } from './setInvertLightImages';
export { useInvertLightImages } from './useInvertLightImages';
export { useImageTreatment } from './useImageTreatment';
