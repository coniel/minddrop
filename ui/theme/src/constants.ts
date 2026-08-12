import { ImageDimming } from './types';

export const ThemeSystem = 'system';
export const ThemeLight = 'light';
export const ThemeDark = 'dark';

export const ImageDimmingOff = 'off';
export const ImageDimmingLevel1 = '1';
export const ImageDimmingLevel2 = '2';
export const ImageDimmingLevel3 = '3';

// The image dimming settings, ordered as they are presented
export const ImageDimmingValues: ImageDimming[] = [
  ImageDimmingOff,
  ImageDimmingLevel1,
  ImageDimmingLevel2,
  ImageDimmingLevel3,
];

// Class name applied to images which are bright overall
export const BrightImageClassName = 'minddrop-image-bright';

// Class name applied to images which are mostly light background,
// such as screenshots, diagrams, and logos
export const LightBackgroundImageClassName = 'minddrop-image-light-background';
