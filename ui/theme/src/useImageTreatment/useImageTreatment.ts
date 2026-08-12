import { Fs } from '@minddrop/file-system';
import { joinClassNames } from '@minddrop/utils';
import {
  BrightImageClassName,
  ImageDimmingOff,
  LightBackgroundImageClassName,
} from '../constants';
import { useImageDimming } from '../useImageDimming';
import { useInvertLightImages } from '../useInvertLightImages';
import { classifyImageBrightness } from '../utils';

export interface ImageTreatment {
  /**
   * The class names describing the image's brightness, from which
   * the theme applies its dark mode treatment. Undefined when the
   * image needs no treatment.
   */
  className?: string;

  /**
   * Whether the image is still being classified. Rendering it while
   * true shows it untreated for a frame, which reads as a flash of
   * brightness once the treatment lands.
   */
  pending: boolean;
}

/**
 * Returns the dark mode treatment for an image, as the class names
 * describing its brightness and whether its classification is still
 * in flight.
 *
 * The image is not analysed at all while both treatments are off.
 *
 * @param path - The path to the image file.
 * @returns The image's treatment.
 */
export function useImageTreatment(path: string | null): ImageTreatment {
  const imageDimming = useImageDimming();
  const invertLightImages = useInvertLightImages();

  // Skip the analysis entirely while neither treatment is enabled
  const treatmentEnabled =
    imageDimming !== ImageDimmingOff || invertLightImages;
  const stats = Fs.useImageStats(treatmentEnabled ? path : null);
  const { bright, lightBackground } = classifyImageBrightness(stats ?? null);

  return {
    // Undefined on unclassified images, leaving the class attribute
    // untouched
    className: joinClassNames(
      bright && BrightImageClassName,
      lightBackground && LightBackgroundImageClassName,
    ),
    pending: stats === undefined,
  };
}
