import React, { useCallback, useRef, useState } from 'react';
import { Fs } from '@minddrop/file-system';
import { Theme } from '@minddrop/ui-theme';
import { joinClassNames, useMeasuredImageWidth } from '@minddrop/utils';
import { createImagePlaceholderStyle } from './createImagePlaceholderStyle';

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * The path of the image file on the file system. Renders nothing
   * when absent, leaving the caller to render its own fallback.
   */
  path: string | null;

  /**
   * Whether to request a variant downscaled to the width the image
   * renders at. Turn off where the full resolution image is needed
   * regardless of display size.
   */
  downscale?: boolean;

  /**
   * Whether to hold the image's space and fill it with its own
   * average colour until it has loaded.
   */
  placeholder?: boolean;

  /**
   * Ref to the underlying image element.
   */
  ref?: React.Ref<HTMLImageElement>;
}

/**
 * Renders an image from the file system, requesting it at the size
 * it is displayed, holding its space while it loads, and applying
 * the theme's dark mode treatment to it.
 */
export const Image: React.FC<ImageProps> = ({
  path,
  downscale = true,
  placeholder = true,
  className,
  style,
  onLoad,
  ref,
  ...other
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { width, isMeasured } = useMeasuredImageWidth(imageRef);
  const src = Fs.useImageSrc(path, downscale ? width : undefined);
  const stats = Fs.useImageStats(path);

  // Dark mode treatment applied by the theme to the image
  const { className: treatmentClassName, pending: treatmentPending } =
    Theme.useImageTreatment(path);
  const placeholderStyle = placeholder
    ? createImagePlaceholderStyle(stats, isLoaded)
    : {};

  // Held back until the element has been measured, so that a full
  // resolution image is not fetched before the display width is
  // known, and until classified, so that it does not appear
  // untreated for a frame
  const isReady = (isMeasured || !downscale) && !treatmentPending;

  // Assign both the caller's ref and the one measurement reads
  const setRef = useCallback(
    (element: HTMLImageElement | null) => {
      imageRef.current = element;

      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [ref],
  );

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  // Nothing to render, the caller shows its own fallback
  if (!src) {
    return null;
  }

  return (
    <img
      {...other}
      ref={setRef}
      className={joinClassNames(className, treatmentClassName)}
      src={isReady ? src : undefined}
      onLoad={handleLoad}
      style={{ ...placeholderStyle, ...style }}
    />
  );
};
