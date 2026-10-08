import { DesignElementConfig } from '@minddrop/designs-next';
import { ImageElement } from './ImageElement.types';
import { ImageElementRenderer } from './ImageElementRenderer';
import { ImageSettingsPanel } from './ImageSettingsPanel';

// The element type the config registers under
export const ImageElementType = 'image';

/**
 * Config for the image element. Draws the picture of the image
 * property it maps to.
 */
export const ImageElementConfig: DesignElementConfig<ImageElement> = {
  type: ImageElementType,
  label: 'designsNext.elements.image.label',
  icon: 'image',
  group: 'content',
  propertyTypes: ['image'],
  component: ImageElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: 16,
  settingsPanel: ImageSettingsPanel,
  settingControls: ['corner-radius'],
};
